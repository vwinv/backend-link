import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BusinessCard } from '@prisma/client';
import { createHash, X509Certificate } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { ZipFile } from 'yazl';
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
        zipMethod: this.firstZipMethod(buffer),
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

  private firstZipMethod(buffer: Buffer): string {
    if (buffer.length < 10 || buffer.subarray(0, 4).toString() !== 'PK\u0003\u0004') {
      return 'unknown';
    }
    const method = buffer.readUInt16LE(8);
    if (method === 0) return 'store';
    if (method === 8) return 'deflate';
    return String(method);
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

    try {
      const files = this.buildPassFiles(card);
      return await this.zipDeflate(files);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue Apple Wallet';
      throw new InternalServerErrorException(
        `Impossible de générer le pass Apple Wallet : ${message}`,
      );
    }
  }

  private buildPassFiles(card: BusinessCard): Record<string, Buffer> {
    const fullName = `${card.firstName} ${card.lastName}`.trim() || 'DropOne';
    const subtitle = [card.jobTitle, card.company].filter(Boolean).join(' · ');
    const cardUrl = `${this.walletConfig.appPublicUrl}/cards/${card.slug}`;

    const generic: Record<string, unknown> = {
      primaryFields: [
        {
          key: 'name',
          label: 'Nom',
          value: fullName,
        },
      ],
    };

    if (subtitle) {
      generic.secondaryFields = [
        {
          key: 'role',
          label: 'Poste',
          value: subtitle,
        },
      ];
    }

    const auxiliaryFields: Array<Record<string, string>> = [];
    if (card.email) {
      auxiliaryFields.push({
        key: 'email',
        label: 'Email',
        value: card.email,
      });
    }
    if (card.phone) {
      auxiliaryFields.push({
        key: 'phone',
        label: 'Téléphone',
        value: card.phone,
      });
    }
    if (auxiliaryFields.length > 0) {
      generic.auxiliaryFields = auxiliaryFields;
    }

    const passJson = {
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
      generic,
      barcodes: [
        {
          format: 'PKBarcodeFormatQR',
          message: cardUrl,
          messageEncoding: 'iso-8859-1',
        },
      ],
    };

    const files: Record<string, Buffer> = {
      ...this.loadPassAssets(),
      'pass.json': Buffer.from(JSON.stringify(passJson), 'utf8'),
    };

    const manifest: Record<string, string> = {};
    for (const [name, content] of Object.entries(files)) {
      manifest[name] = createHash('sha1').update(content).digest('hex');
    }
    files['manifest.json'] = Buffer.from(JSON.stringify(manifest), 'utf8');
    files.signature = this.signManifest(files['manifest.json']);

    return files;
  }

  private signManifest(manifest: Buffer): Buffer {
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dropone-pkpass-'));
    const manifestPath = path.join(workDir, 'manifest.json');
    const signaturePath = path.join(workDir, 'signature');

    try {
      fs.writeFileSync(manifestPath, manifest);
      const args = [
        'smime',
        '-binary',
        '-sign',
        '-certfile',
        this.walletConfig.appleWwdrCertPath,
        '-signer',
        this.walletConfig.appleSignerCertPath,
        '-inkey',
        this.walletConfig.appleSignerKeyPath,
        '-in',
        manifestPath,
        '-out',
        signaturePath,
        '-outform',
        'DER',
      ];

      const passphrase = this.walletConfig.appleSignerKeyPassphrase;
      if (passphrase) {
        args.push('-passin', `pass:${passphrase}`);
      }

      execFileSync('openssl', args, { stdio: ['ignore', 'pipe', 'pipe'] });
      return fs.readFileSync(signaturePath);
    } finally {
      fs.rmSync(workDir, { recursive: true, force: true });
    }
  }

  private zipDeflate(files: Record<string, Buffer>): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const zip = new ZipFile();
      const chunks: Buffer[] = [];

      zip.outputStream.on('data', (chunk: Buffer) => chunks.push(chunk));
      zip.outputStream.on('error', reject);
      zip.outputStream.on('end', () => resolve(Buffer.concat(chunks)));

      // Ordre stable recommandé : assets, pass.json, manifest, signature
      const ordered = Object.keys(files).sort((a, b) => {
        const rank = (name: string) => {
          if (name === 'pass.json') return 1;
          if (name === 'manifest.json') return 2;
          if (name === 'signature') return 3;
          return 0;
        };
        return rank(a) - rank(b) || a.localeCompare(b);
      });

      for (const name of ordered) {
        zip.addBuffer(files[name], name, { compress: true });
      }
      zip.end();
    });
  }

  private loadPassAssets(): Record<string, Buffer> {
    const assetsDir = this.walletConfig.walletAssetsDir();

    const requiredAssets = ['icon.png'];
    const optionalAssets = [
      'icon@2x.png',
      'icon@3x.png',
      'logo.png',
      'logo@2x.png',
      'logo@3x.png',
    ];

    const missing = requiredAssets.filter(
      (name) => !fs.existsSync(path.join(assetsDir, name)),
    );
    if (missing.length > 0) {
      throw new BadRequestException(
        `Images wallet manquantes dans backend-link/wallet-assets (${missing.join(', ')}).`,
      );
    }

    const buffers: Record<string, Buffer> = {};
    for (const name of [...requiredAssets, ...optionalAssets]) {
      const filePath = path.join(assetsDir, name);
      if (fs.existsSync(filePath)) {
        buffers[name] = fs.readFileSync(filePath);
      }
    }
    return buffers;
  }
}
