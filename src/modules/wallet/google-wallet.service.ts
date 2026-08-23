import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
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

@Injectable()
export class GoogleWalletService {
  private readonly logger = new Logger(GoogleWalletService.name);
  private readonly ensuredClassIds = new Set<string>();

  constructor(private readonly walletConfig: WalletConfig) {}

  async generateSaveUrl(card: BusinessCard): Promise<string> {
    if (!this.walletConfig.isGoogleConfigured()) {
      throw new BadRequestException(
        'Google Wallet n’est pas configuré côté serveur. Consultez WALLET_SETUP.md.',
      );
    }

    const account = this.walletConfig.loadGoogleServiceAccount() as GoogleServiceAccount;
    if (!account.client_email || !account.private_key) {
      throw new BadRequestException(
        'Le compte de service Google Wallet est invalide.',
      );
    }

    const issuerId = this.walletConfig.googleIssuerId;
    const classId = `${issuerId}.${this.walletConfig.googleClassSuffix}`;
    const objectId = `${issuerId}.card_${card.id}`;
    const fullName = this.clip(`${card.firstName} ${card.lastName}`.trim(), 32);
    const subtitle = this.clip(
      [card.jobTitle, card.company].filter(Boolean).join(' · '),
      32,
    );
    const cardUrl = `${this.walletConfig.appPublicUrl}/cards/${card.slug}`;
    const textModulesData = this.buildTextModules(card);
    const genericClass = { id: classId };
    const classReady = await this.ensureGenericClass(account, genericClass);

    const genericObject: Record<string, unknown> = {
      id: objectId,
      classId,
      state: 'ACTIVE',
      genericType: 'GENERIC_TYPE_UNSPECIFIED',
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
        alternateText: 'Carte DropOne',
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
    };

    if (subtitle) {
      genericObject.subheader = {
        defaultValue: { language: 'fr', value: subtitle },
      };
    }
    if (textModulesData.length > 0) {
      genericObject.textModulesData = textModulesData;
    }

    try {
      const now = Math.floor(Date.now() / 1000);
      const token = jwt.sign(
        {
          iss: account.client_email,
          aud: 'google',
          typ: 'savetowallet',
          iat: now,
          exp: now + 60 * 60,
          origins: this.resolveOrigins(),
          payload: {
            ...(classReady ? {} : { genericClasses: [genericClass] }),
            genericObjects: [genericObject],
          },
        },
        account.private_key,
        { algorithm: 'RS256' },
      );

      return `https://pay.google.com/gp/v/save/${token}`;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue Google Wallet';
      throw new InternalServerErrorException(
        `Impossible de générer le lien Google Wallet : ${message}`,
      );
    }
  }

  getPassId(card: BusinessCard): string {
    return `${this.walletConfig.googleIssuerId}.card_${card.id}`;
  }

  private buildTextModules(card: BusinessCard): TextModule[] {
    const modules: TextModule[] = [];
    if (card.email?.trim()) {
      modules.push({ id: 'email', header: 'Email', body: card.email.trim() });
    }
    if (card.phone?.trim()) {
      modules.push({
        id: 'phone',
        header: 'Téléphone',
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
    const origins = new Set(this.walletConfig.googleOrigins);
    for (const value of [this.walletConfig.appPublicUrl, 'https://dropone.pro']) {
      try {
        origins.add(new URL(value).origin);
      } catch {
        // Ignore invalid URLs.
      }
    }
    return [...origins];
  }

  private clip(value: string, max: number): string {
    const trimmed = value.trim();
    if (trimmed.length <= max) return trimmed;
    return `${trimmed.slice(0, max - 1).trimEnd()}…`;
  }

  private async ensureGenericClass(
    account: GoogleServiceAccount,
    genericClass: { id: string },
  ): Promise<boolean> {
    if (this.ensuredClassIds.has(genericClass.id)) return true;

    try {
      const client = new JWT({
        email: account.client_email,
        key: account.private_key,
        scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
      });
      const { token } = await client.getAccessToken();
      if (!token) {
        throw new Error('Jeton Google Wallet introuvable');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      const endpoint = `https://walletobjects.googleapis.com/walletobjects/v1/genericClass/${genericClass.id}`;
      const existing = await fetch(endpoint, { headers });

      if (existing.status === 404) {
        const created = await fetch(
          'https://walletobjects.googleapis.com/walletobjects/v1/genericClass',
          {
            method: 'POST',
            headers,
            body: JSON.stringify(genericClass),
          },
        );
        if (!created.ok) {
          const body = await created.text();
          throw new Error(`création classe ${created.status}: ${body}`);
        }
        this.ensuredClassIds.add(genericClass.id);
        return true;
      }

      if (!existing.ok) {
        const body = await existing.text();
        throw new Error(`lecture classe ${existing.status}: ${body}`);
      }

      const updated = await fetch(endpoint, {
        method: 'PUT',
        headers,
        body: JSON.stringify(genericClass),
      });
      if (!updated.ok) {
        const body = await updated.text();
        this.logger.warn(
          `Impossible de nettoyer la classe Google Wallet (${updated.status}): ${body}`,
        );
      }

      this.ensuredClassIds.add(genericClass.id);
      return true;
    } catch (error) {
      this.logger.warn(
        `Classe Google Wallet non préparée (${error instanceof Error ? error.message : 'erreur inconnue'}). Le JWT inclura la classe.`,
      );
      return false;
    }
  }
}
