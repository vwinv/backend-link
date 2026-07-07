import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BusinessCard } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { WalletConfig } from './wallet.config';

type GoogleServiceAccount = {
  client_email: string;
  private_key: string;
};

@Injectable()
export class GoogleWalletService {
  constructor(private readonly walletConfig: WalletConfig) {}

  generateSaveUrl(card: BusinessCard): string {
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
    const fullName = `${card.firstName} ${card.lastName}`.trim();
    const subtitle = [card.jobTitle, card.company].filter(Boolean).join(' · ');
    const cardUrl = `${this.walletConfig.appPublicUrl}/cards/${card.slug}`;

    const genericObject = {
      id: objectId,
      classId,
      genericType: 'GENERIC_TYPE_UNSPECIFIED',
      hexBackgroundColor: '#0D0D0D',
      cardTitle: {
        defaultValue: {
          language: 'fr',
          value: 'DropOne',
        },
      },
      header: {
        defaultValue: {
          language: 'fr',
          value: fullName,
        },
      },
      ...(subtitle
        ? {
            subheader: {
              defaultValue: {
                language: 'fr',
                value: subtitle,
              },
            },
          }
        : {}),
      barcode: {
        type: 'QR_CODE',
        value: cardUrl,
      },
      textModulesData: [
        ...(card.email
          ? [
              {
                id: 'email',
                header: 'Email',
                body: card.email,
              },
            ]
          : []),
        ...(card.phone
          ? [
              {
                id: 'phone',
                header: 'Téléphone',
                body: card.phone,
              },
            ]
          : []),
      ],
    };

    try {
      const token = jwt.sign(
        {
          iss: account.client_email,
          aud: 'google',
          origins: this.walletConfig.googleOrigins,
          typ: 'savetowallet',
          payload: {
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
}
