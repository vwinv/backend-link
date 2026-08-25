import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { BusinessCard, CardKind } from '@prisma/client';
import { JWT } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';
import { WalletConfig } from './wallet.config';

type GoogleServiceAccount = {
  client_email: string;
  private_key: string;
};

type TextModule = {
  id: string;
  header: string;
  body: string;
};

type SaveToGoogleWallet = {
  saveUrl: string;
  saveJwt: string;
};

@Injectable()
export class GoogleWalletService implements OnModuleInit {
  private readonly logger = new Logger(GoogleWalletService.name);
  private accessTokenCache: { token: string; expiresAt: number } | null = null;

  constructor(private readonly walletConfig: WalletConfig) {}

  onModuleInit() {
    if (this.walletConfig.isGoogleConfigured()) {
      this.logger.log('Google Wallet configuré');
      return;
    }
    const status = this.walletConfig.describe().google as {
      issuerIdSet?: boolean;
      serviceAccountJsonSet?: boolean;
      serviceAccountExists?: boolean;
    };
    this.logger.warn(
      `Google Wallet non configuré (issuerId=${status.issuerIdSet ? 'ok' : 'manquant'}, compte de service=${
        status.serviceAccountJsonSet || status.serviceAccountExists ? 'ok' : 'manquant'
      })`,
    );
  }

  /**
   * Ancienne classe `link_business_card` : modèle JWT cassé + PUT `{id}` trop
   * agressif. On force une classe neuve sauf suffixe custom explicite.
   */
  private get classSuffix(): string {
    const suffix = this.walletConfig.googleClassSuffix?.trim();
    if (!suffix || suffix === 'link_business_card') {
      return 'dropone_card_v2';
    }
    return suffix;
  }

  async generateSaveUrl(card: BusinessCard): Promise<SaveToGoogleWallet> {
    if (!this.walletConfig.isGoogleConfigured()) {
      const google = this.walletConfig.describe().google as {
        issuerIdSet?: boolean;
        serviceAccountJsonSet?: boolean;
        serviceAccountExists?: boolean;
      };
      const missing: string[] = [];
      if (!google.issuerIdSet) missing.push('GOOGLE_WALLET_ISSUER_ID');
      if (!google.serviceAccountJsonSet && !google.serviceAccountExists) {
        missing.push(
          'GOOGLE_WALLET_SERVICE_ACCOUNT_PATH ou GOOGLE_WALLET_SERVICE_ACCOUNT_JSON',
        );
      }
      throw new BadRequestException(
        `Google Wallet n’est pas configuré côté serveur (${missing.join(', ')}). Consultez WALLET_SETUP.md.`,
      );
    }

    const account = this.walletConfig.loadGoogleServiceAccount() as GoogleServiceAccount;
    if (!account.client_email || !account.private_key) {
      throw new BadRequestException(
        'Le compte de service Google Wallet est invalide.',
      );
    }

    const issuerId = this.walletConfig.googleIssuerId.trim();
    if (!/^\d+$/.test(issuerId)) {
      throw new BadRequestException(
        'GOOGLE_WALLET_ISSUER_ID est invalide (attendu : identifiant numérique de la Wallet Console).',
      );
    }

    const classId = `${issuerId}.${this.classSuffix}`;
    const objectId = `${issuerId}.card_${this.safeId(card.id)}`;
    const genericObject = this.buildGenericObject(card, classId, objectId);

    await this.ensureGenericClass(account, classId);
    const objectReady = await this.upsertGenericObject(
      account,
      objectId,
      genericObject,
    );

    try {
      const token = jwt.sign(
        {
          iss: account.client_email,
          aud: 'google',
          typ: 'savetowallet',
          iat: Math.floor(Date.now() / 1000),
          origins: this.resolveOrigins(),
          payload: objectReady
            ? { genericObjects: [{ id: objectId, classId }] }
            : {
                genericClasses: [{ id: classId }],
                genericObjects: [genericObject],
              },
        },
        account.private_key,
        { algorithm: 'RS256' },
      );

      return {
        saveJwt: token,
        saveUrl: `https://pay.google.com/gp/v/save/${token}`,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue Google Wallet';
      throw new InternalServerErrorException(
        `Impossible de générer le lien Google Wallet : ${message}`,
      );
    }
  }

  getPassId(card: BusinessCard): string {
    return `${this.walletConfig.googleIssuerId.trim()}.card_${this.safeId(card.id)}`;
  }

  private buildGenericObject(
    card: BusinessCard,
    classId: string,
    objectId: string,
  ): Record<string, unknown> {
    const fullName = this.clip(`${card.firstName} ${card.lastName}`.trim(), 32);
    const subtitle = this.clip(
      [card.jobTitle, card.company].filter(Boolean).join(' - '),
      32,
    );
    const cardUrl = `${this.walletConfig.appPublicUrl}/cards/${card.slug}`;
    const textModulesData = this.buildTextModules(card, fullName);

    const genericObject: Record<string, unknown> = {
      id: objectId,
      classId,
      state: 'ACTIVE',
      hexBackgroundColor: '#0D0D0D',
      cardTitle: {
        defaultValue: { language: 'fr', value: 'DropOne' },
      },
      header: {
        defaultValue: { language: 'fr', value: fullName || 'DropOne' },
      },
      barcode: {
        type: 'QR_CODE',
        value: cardUrl,
      },
      linksModuleData: {
        uris: [
          {
            uri: cardUrl,
            description: 'Voir la carte',
            id: 'card',
          },
        ],
      },
      textModulesData,
    };

    if (subtitle) {
      genericObject.subheader = {
        defaultValue: { language: 'fr', value: subtitle },
      };
    }

    return genericObject;
  }

  private buildTextModules(card: BusinessCard, fullName: string): TextModule[] {
    const modules: TextModule[] = [
      {
        id: 'name',
        header: 'Nom',
        body: fullName || 'DropOne',
      },
    ];
    if (card.email?.trim()) {
      modules.push({ id: 'email', header: 'Email', body: card.email.trim() });
    }
    if (card.phone?.trim()) {
      modules.push({
        id: 'phone',
        header: 'Telephone',
        body: card.phone.trim(),
      });
    }
    if (card.kind !== CardKind.PERSONAL && card.address?.trim()) {
      modules.push({
        id: 'address',
        header: 'Adresse',
        body: card.address.trim(),
      });
    }
    return modules;
  }

  private resolveOrigins(): string[] {
    const origins = new Set<string>();
    for (const value of [
      ...this.walletConfig.googleOrigins,
      this.walletConfig.appPublicUrl,
      'https://dropone.pro',
      'https://api.dropone.pro',
    ]) {
      try {
        const url = new URL(value.includes('://') ? value : `https://${value}`);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          origins.add(url.origin);
        }
      } catch {
        // Ignore invalid URLs.
      }
    }
    return [...origins];
  }

  private clip(value: string, max: number): string {
    const trimmed = value.trim();
    if (trimmed.length <= max) return trimmed;
    return `${trimmed.slice(0, max - 1).trimEnd()}...`;
  }

  private safeId(value: string): string {
    return value.replace(/[^A-Za-z0-9._-]/g, '_');
  }

  private async ensureGenericClass(
    account: GoogleServiceAccount,
    classId: string,
  ): Promise<void> {
    const existing = await this.walletRequest(
      account,
      'GET',
      `/genericClass/${classId}`,
    );

    if (existing.status === 200) return;

    if (existing.status !== 404) {
      this.throwWalletApiError('lecture de la classe', existing);
    }

    const created = await this.walletRequest(
      account,
      'POST',
      '/genericClass',
      { id: classId },
    );
    if (created.status !== 200 && created.status !== 201) {
      this.throwWalletApiError('création de la classe', created);
    }
  }

  private async upsertGenericObject(
    account: GoogleServiceAccount,
    objectId: string,
    genericObject: Record<string, unknown>,
  ): Promise<boolean> {
    try {
      const existing = await this.walletRequest(
        account,
        'GET',
        `/genericObject/${objectId}`,
      );

      if (existing.status === 200) {
        const updated = await this.walletRequest(
          account,
          'PUT',
          `/genericObject/${objectId}`,
          genericObject,
        );
        if (updated.status !== 200) {
          this.logger.warn(
            `Mise à jour objet Google Wallet ${updated.status}: ${updated.body.slice(0, 300)}`,
          );
        }
        return updated.status === 200;
      }

      if (existing.status !== 404) {
        this.throwWalletApiError('lecture de l’objet', existing);
      }

      const created = await this.walletRequest(
        account,
        'POST',
        '/genericObject',
        genericObject,
      );
      if (created.status !== 200 && created.status !== 201) {
        this.throwWalletApiError('création de l’objet', created);
      }
      return true;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      this.logger.warn(
        `Objet Google Wallet non préparé (${error instanceof Error ? error.message : 'erreur inconnue'}). JWT complet en secours.`,
      );
      return false;
    }
  }

  private async walletRequest(
    account: GoogleServiceAccount,
    method: 'GET' | 'POST' | 'PUT',
    path: string,
    body?: Record<string, unknown>,
  ): Promise<{ status: number; body: string }> {
    const token = await this.getAccessToken(account);
    const response = await fetch(
      `https://walletobjects.googleapis.com/walletobjects/v1${path}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      },
    );
    return {
      status: response.status,
      body: await response.text(),
    };
  }

  private async getAccessToken(account: GoogleServiceAccount): Promise<string> {
    if (
      this.accessTokenCache &&
      this.accessTokenCache.expiresAt > Date.now() + 60_000
    ) {
      return this.accessTokenCache.token;
    }

    const client = new JWT({
      email: account.client_email,
      key: account.private_key,
      scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
    });
    const { token } = await client.getAccessToken();
    if (!token) {
      throw new BadRequestException(
        'Impossible d’obtenir un jeton Google Wallet. Vérifiez le compte de service.',
      );
    }
    this.accessTokenCache = {
      token,
      expiresAt: Date.now() + 50 * 60 * 1000,
    };
    return token;
  }

  private throwWalletApiError(
    action: string,
    result: { status: number; body: string },
  ): never {
    const snippet = result.body.replace(/\s+/g, ' ').slice(0, 280);
    this.logger.error(`Google Wallet ${action} ${result.status}: ${snippet}`);

    if (result.status === 403) {
      throw new BadRequestException(
        'Le compte de service n’a pas accès à Google Wallet. Dans la Wallet Console, ajoutez l’email du compte de service (Utilisateurs) avec le rôle Développeur ou Admin, puis réessayez.',
      );
    }
    if (result.status === 401) {
      throw new BadRequestException(
        'Authentification Google Wallet refusée. Vérifiez le JSON du compte de service sur le serveur.',
      );
    }
    throw new BadRequestException(
      `Google Wallet a refusé ${action} (HTTP ${result.status}). ${snippet || 'Sans détail.'}`,
    );
  }
}
