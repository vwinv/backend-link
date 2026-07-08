import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BusinessCard } from '@prisma/client';
import { X509Certificate } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { PKPass } from 'passkit-generator';
import { WalletConfig } from './wallet.config';

@Injectable()
export class AppleWalletService {
  constructor(private readonly walletConfig: WalletConfig) {}

  private buildDummyCard(): BusinessCard {
    return {
      id: 'selftest-000',
      slug: 'selftest',
      firstName: 'Self',
      lastName: 'Test',
      jobTitle: 'Diagnostic',
      company: 'DropOne',
      email: 'test@dropone.pro',
      phone: '+000000000',
    } as unknown as BusinessCard;
  }

  async selfTestBuffer(): Promise<Buffer> {
    return this.generatePass(this.buildDummyCard());
  }

  async selfTest(): Promise<Record<string, unknown>> {
    const certs = this.inspectCertificates();
    try {
      const buffer = await this.selfTestBuffer();
      return {
        ok: true,
        bytes: buffer.length,
        magic: buffer.subarray(0, 4).toString('hex'),
        certs,
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        certs,
      };
    }
  }

  private inspectCertificates(): Record<string, unknown> {
    const readSubject = (
      filePath: string,
    ): { subject?: string; issuer?: string; isCA?: boolean; error?: string } => {
      try {
        const pem = fs.readFileSync(filePath, 'utf8');
        const cert = new X509Certificate(pem);
        return {
          subject: cert.subject.replace(/\n/g, ' | '),
          issuer: cert.issuer.replace(/\n/g, ' | '),
          isCA: cert.ca,
        };
      } catch (error) {
        return { error: error instanceof Error ? error.message : String(error) };
      }
    };

    return {
      signerCert: readSubject(this.walletConfig.appleSignerCertPath),
      wwdrCert: readSubject(this.walletConfig.appleWwdrCertPath),
    };
  }

  async generatePass(card: BusinessCard): Promise<Buffer> {
    if (!this.walletConfig.isAppleConfigured()) {
      throw new BadRequestException(
        'Apple Wallet n’est pas configuré côté serveur. Consultez WALLET_SETUP.md.',
      );
    }

    const buffers = this.loadPassAssets();
    const passphrase = this.walletConfig.appleSignerKeyPassphrase;
    const certificates = {
      wwdr: fs.readFileSync(this.walletConfig.appleWwdrCertPath),
      signerCert: fs.readFileSync(this.walletConfig.appleSignerCertPath),
      signerKey: fs.readFileSync(this.walletConfig.appleSignerKeyPath),
      ...(passphrase ? { signerKeyPassphrase: passphrase } : {}),
    };

    const fullName = `${card.firstName} ${card.lastName}`.trim();
    const subtitle = [card.jobTitle, card.company].filter(Boolean).join(' · ');
    const cardUrl = `${this.walletConfig.appPublicUrl}/cards/${card.slug}`;

    try {
      const pass = new PKPass(
        buffers,
        certificates,
        {
          formatVersion: 1,
          passTypeIdentifier: this.walletConfig.applePassTypeId,
          teamIdentifier: this.walletConfig.appleTeamId,
          organizationName: 'DropOne',
          description: `Carte DropOne — ${fullName}`,
          serialNumber: card.id,
          logoText: 'DropOne',
          foregroundColor: 'rgb(255, 255, 255)',
          backgroundColor: 'rgb(13, 13, 13)',
          labelColor: 'rgb(154, 160, 172)',
        },
      );

      pass.type = 'generic';
      pass.primaryFields.push({
        key: 'name',
        label: 'Nom',
        value: fullName,
      });

      if (subtitle) {
        pass.secondaryFields.push({
          key: 'role',
          label: 'Poste',
          value: subtitle,
        });
      }

      if (card.email) {
        pass.auxiliaryFields.push({
          key: 'email',
          label: 'Email',
          value: card.email,
        });
      }

      if (card.phone) {
        pass.auxiliaryFields.push({
          key: 'phone',
          label: 'Téléphone',
          value: card.phone,
        });
      }

      pass.setBarcodes({
        format: 'PKBarcodeFormatQR',
        message: cardUrl,
        messageEncoding: 'iso-8859-1',
      });

      return pass.getAsBuffer();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue Apple Wallet';
      throw new InternalServerErrorException(
        `Impossible de générer le pass Apple Wallet : ${message}`,
      );
    }
  }

  private loadPassAssets(): Record<string, Buffer> {
    const assetsDir = this.walletConfig.walletAssetsDir();
    const iconPath = path.join(assetsDir, 'icon.png');
    const logoPath = path.join(assetsDir, 'logo.png');

    if (!fs.existsSync(iconPath) || !fs.existsSync(logoPath)) {
      throw new BadRequestException(
        'Images wallet manquantes dans backend-link/wallet-assets (icon.png, logo.png).',
      );
    }

    return {
      'icon.png': fs.readFileSync(iconPath),
      'logo.png': fs.readFileSync(logoPath),
    };
  }
}
