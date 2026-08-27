import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OfferBillingType } from '@prisma/client';
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import {
  Environment,
  SignedDataVerifier,
  type JWSTransactionDecodedPayload,
} from '@apple/app-store-server-library';
import {
  appleProductIdFor,
  appleProductRefFromId,
  loadAppleIapProductMap,
  type AppleIapProductRef,
} from './apple-iap-products';
import { APPLE_ROOT_CA_G3_PEM } from './apple-root-ca-g3';

export type VerifiedAppleTransaction = {
  productId: string;
  bundleId: string;
  originalTransactionId: string;
  transactionId: string;
  expiresAt: Date | null;
  environment: string;
  offerSlug: string;
  billingType: OfferBillingType;
};

@Injectable()
export class AppleIapService implements OnModuleInit {
  private readonly logger = new Logger(AppleIapService.name);
  private productMap = loadAppleIapProductMap();
  private rootCAs: Buffer[] = [];
  private bundleId = 'com.mega.dropone';

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.productMap = loadAppleIapProductMap(
      this.config.get<string>('appleIap.productsJson') ||
        this.config.get<string>('APPLE_IAP_PRODUCTS'),
    );
    this.bundleId =
      this.config.get<string>('appleIap.bundleId')?.trim() ||
      this.config.get<string>('APPLE_IAP_BUNDLE_ID')?.trim() ||
      this.config.get<string>('APPLE_CLIENT_ID')?.trim() ||
      'com.mega.dropone';
    this.rootCAs = this.loadRootCertificates();
    if (this.rootCAs.length === 0) {
      this.logger.warn(
        'Apple IAP : certificat racine manquant (APPLE_IAP_ROOT_CA_PATH). La vérif StoreKit échouera.',
      );
    } else {
      this.logger.log(`Apple IAP prêt (bundle ${this.bundleId})`);
    }
    if (!this.parseAppAppleId()) {
      this.logger.warn(
        'Apple IAP : APPLE_IAP_APP_APPLE_ID non défini — les reçus Production ne pourront pas être vérifiés.',
      );
    }
  }

  productIdFor(
    offerSlug: string,
    billingType: OfferBillingType,
  ): string | null {
    return appleProductIdFor(this.productMap, offerSlug, billingType);
  }

  refFromProductId(productId: string): AppleIapProductRef | null {
    return appleProductRefFromId(this.productMap, productId);
  }

  async verifyTransaction(
    signedTransaction: string,
  ): Promise<VerifiedAppleTransaction> {
    const jws = signedTransaction.trim();
    if (!jws || jws.split('.').length !== 3) {
      throw new BadRequestException('Transaction Apple invalide.');
    }
    if (this.rootCAs.length === 0) {
      throw new BadRequestException(
        'Apple IAP n’est pas configuré côté serveur (certificat racine).',
      );
    }

    const appAppleId = this.parseAppAppleId();
    let lastError: unknown;
    for (const environment of this.environmentsToTry()) {
      try {
        const verifier = new SignedDataVerifier(
          this.rootCAs,
          true,
          environment,
          this.bundleId,
          appAppleId,
        );
        const payload = await verifier.verifyAndDecodeTransaction(jws);
        return this.toVerified(payload);
      } catch (error) {
        lastError = error;
      }
    }

    const message =
      lastError instanceof Error ? lastError.message : 'signature invalide';
    this.logger.warn(`Apple IAP: vérification JWS échouée (${message})`);
    throw new BadRequestException(
      'Achat Apple refusé. Vérifiez le produit App Store Connect et réessayez.',
    );
  }

  private toVerified(
    payload: JWSTransactionDecodedPayload,
  ): VerifiedAppleTransaction {
    if (payload.revocationDate) {
      throw new BadRequestException('Cet achat Apple a été annulé.');
    }
    const productId = payload.productId?.trim() ?? '';
    const bundleId = payload.bundleId?.trim() ?? '';
    const originalTransactionId = payload.originalTransactionId?.trim() ?? '';
    const transactionId = payload.transactionId?.trim() ?? '';
    if (!productId || !originalTransactionId || !transactionId) {
      throw new BadRequestException('Transaction Apple incomplète.');
    }
    if (bundleId && bundleId !== this.bundleId) {
      throw new BadRequestException('Cet achat n’appartient pas à DropOne.');
    }

    const ref = this.refFromProductId(productId);
    if (!ref) {
      throw new BadRequestException(
        `Produit Apple inconnu (${productId}). Vérifiez APPLE_IAP_PRODUCTS.`,
      );
    }

    const expiresAt =
      typeof payload.expiresDate === 'number' && payload.expiresDate > 0
        ? new Date(payload.expiresDate)
        : null;
    if (
      ref.billingType !== OfferBillingType.LIFETIME &&
      expiresAt &&
      expiresAt.getTime() <= Date.now()
    ) {
      throw new BadRequestException('Cet abonnement Apple a déjà expiré.');
    }

    return {
      productId,
      bundleId: bundleId || this.bundleId,
      originalTransactionId,
      transactionId,
      expiresAt,
      environment: String(payload.environment ?? ''),
      offerSlug: ref.offerSlug,
      billingType: ref.billingType,
    };
  }

  private environmentsToTry(): Environment[] {
    const raw = (
      this.config.get<string>('appleIap.environment') ||
      this.config.get<string>('APPLE_IAP_ENVIRONMENT') ||
      ''
    )
      .trim()
      .toLowerCase();
    if (raw === 'production') {
      return this.parseAppAppleId()
        ? [Environment.PRODUCTION]
        : [Environment.SANDBOX];
    }
    if (raw === 'sandbox') return [Environment.SANDBOX, Environment.XCODE];
    if (raw === 'xcode') return [Environment.XCODE];
    const list: Environment[] = [];
    if (this.parseAppAppleId()) list.push(Environment.PRODUCTION);
    list.push(Environment.SANDBOX, Environment.XCODE);
    return list;
  }

  private parseAppAppleId(): number | undefined {
    const raw = (
      this.config.get<string>('appleIap.appAppleId') ||
      this.config.get<string>('APPLE_IAP_APP_APPLE_ID') ||
      ''
    ).trim();
    if (!raw) return undefined;
    const id = Number(raw);
    return Number.isFinite(id) && id > 0 ? id : undefined;
  }

  private loadRootCertificates(): Buffer[] {
    const configured = (
      this.config.get<string>('appleIap.rootCaPath') ||
      this.config.get<string>('APPLE_IAP_ROOT_CA_PATH') ||
      ''
    ).trim();
    const candidates = [
      configured,
      './certs/AppleRootCA-G3.cer',
      './certs/AppleRootCA-G3.pem',
    ].filter((value): value is string => Boolean(value));

    const certs: Buffer[] = [];
    for (const filePath of candidates) {
      const resolved = isAbsolute(filePath)
        ? filePath
        : resolve(process.cwd(), filePath);
      if (!existsSync(resolved)) continue;
      try {
        certs.push(readFileSync(resolved));
        break;
      } catch {
        this.logger.warn(`Impossible de lire ${resolved}`);
      }
    }
    if (certs.length === 0) {
      certs.push(Buffer.from(APPLE_ROOT_CA_G3_PEM, 'utf8'));
    }
    return certs;
  }
}
