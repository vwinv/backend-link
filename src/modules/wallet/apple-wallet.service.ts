import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BusinessCard, CardKind } from '@prisma/client';
import { createHash, X509Certificate } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { ZipFile } from 'yazl';
import { assertSafeRemoteImageUrl } from '../../common/safe-url';
import { WalletConfig } from './wallet.config';
import { resolveWalletCardPalette } from './wallet-card-style.util';
import {
  generateWalletLeftLogoAssets,
  generateWalletThumbnailAssets,
  resolveDropOneIconPath,
} from './wallet-logo.generator';

/** Carte + logo équipe optionnel (fallback pro). */
export type WalletPassCard = BusinessCard & {
  teamLogoUrl?: string | null;
};

@Injectable()
export class AppleWalletService {
  constructor(private readonly walletConfig: WalletConfig) {}

  private buildDummyCard(): WalletPassCard {
    return {
      id: 'selftest-000',
      slug: 'selftest',
      firstName: 'Self',
      lastName: 'Test',
      jobTitle: 'Diagnostic',
      company: 'DropOne',
      email: 'test@dropone.pro',
      phone: '+000000000',
      theme: { style: 'noir', showQrCode: true },
      avatarUrl: null,
      logoUrl: null,
      kind: CardKind.PERSONAL,
    } as unknown as WalletPassCard;
  }

  async selfTestBuffer(): Promise<Buffer> {
    return this.generatePass(this.buildDummyCard());
  }

  async selfTest(): Promise<Record<string, unknown>> {
    const certs = this.inspectCertificates();
    try {
      this.assertCertsMatchConfiguredIds();
      const buffer = await this.selfTestBuffer();
      return {
        ok: true,
        bytes: buffer.length,
        magic: buffer.subarray(0, 4).toString('hex'),
        zipMethod: this.firstZipMethod(buffer),
        passTypeIdentifier: this.walletConfig.applePassTypeId,
        teamIdentifier: this.walletConfig.appleTeamId,
        certs,
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        passTypeIdentifier: this.walletConfig.applePassTypeId,
        teamIdentifier: this.walletConfig.appleTeamId,
        certs,
      };
    }
  }

  private firstZipMethod(buffer: Buffer): string {
    if (
      buffer.length < 10 ||
      buffer.subarray(0, 4).toString() !== 'PK\u0003\u0004'
    ) {
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

  private assertCertsMatchConfiguredIds(): void {
    const signerPem = fs.readFileSync(
      this.walletConfig.appleSignerCertPath,
      'utf8',
    );
    const wwdrPem = fs.readFileSync(this.walletConfig.appleWwdrCertPath, 'utf8');
    const signer = new X509Certificate(signerPem);
    const wwdr = new X509Certificate(wwdrPem);

    if (!/Worldwide Developer Relations/i.test(wwdr.subject)) {
      throw new BadRequestException(
        'APPLE_WWDR_CERT_PATH ne pointe pas vers le certificat WWDR Apple (mauvais fichier).',
      );
    }

    const subject = signer.subject;
    const uidMatch = /UID=([^/\n]+)/.exec(subject);
    const ouMatch = /OU=([^/\n]+)/.exec(subject);
    const certPassTypeId = uidMatch?.[1]?.trim() ?? '';
    const certTeamId = ouMatch?.[1]?.trim() ?? '';

    if (
      certPassTypeId &&
      certPassTypeId !== this.walletConfig.applePassTypeId
    ) {
      throw new BadRequestException(
        `APPLE_PASS_TYPE_ID (${this.walletConfig.applePassTypeId}) ` +
          `ne correspond pas au certificat (${certPassTypeId}).`,
      );
    }

    if (certTeamId && certTeamId !== this.walletConfig.appleTeamId) {
      throw new BadRequestException(
        `APPLE_TEAM_ID (${this.walletConfig.appleTeamId}) ` +
          `ne correspond pas au certificat (${certTeamId}).`,
      );
    }
  }

  async generatePass(card: WalletPassCard): Promise<Buffer> {
    if (!this.walletConfig.isAppleConfigured()) {
      throw new BadRequestException(
        'Apple Wallet n’est pas configuré côté serveur. Consultez WALLET_SETUP.md.',
      );
    }

    try {
      this.assertCertsMatchConfiguredIds();
      const files = await this.buildPassFiles(card);
      return await this.zipStore(files);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue Apple Wallet';
      throw new InternalServerErrorException(
        `Impossible de générer le pass Apple Wallet : ${message}`,
      );
    }
  }

  private isProfessionalCard(card: WalletPassCard): boolean {
    return (
      card.kind === CardKind.PROFESSIONAL || card.kind === CardKind.MEMBER
    );
  }

  private buildSubtitle(card: WalletPassCard): string {
    const job = card.jobTitle?.trim() ?? '';
    const company = card.company?.trim() ?? '';
    if (job && company) return `${job} - ${company}`;
    return job || company;
  }

  private initialsOf(card: WalletPassCard): string {
    const first = card.firstName?.trim()?.[0] ?? '';
    const last = card.lastName?.trim()?.[0] ?? '';
    const initials = `${first}${last}`.toUpperCase();
    if (initials) return initials;
    const company = card.company?.trim()?.[0];
    return company ? company.toUpperCase() : 'XX';
  }

  private resolveAssetUrl(value: string | null | undefined): string | null {
    const trimmed = value?.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      try {
        const url = new URL(trimmed);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          return null;
        }
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
          const publicOrigin = new URL(this.walletConfig.appPublicUrl);
          return `${publicOrigin.origin}${url.pathname}${url.search}`;
        }
      } catch {
        return null;
      }
      return trimmed;
    }
    const assetPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${this.walletConfig.appPublicUrl}${assetPath}`;
  }

  private resolveTeamLogoUrl(card: WalletPassCard): string | null {
    return (
      this.resolveAssetUrl(card.logoUrl) ??
      this.resolveAssetUrl(card.teamLogoUrl)
    );
  }

  private async fetchImageBuffer(url: string): Promise<Buffer | null> {
    try {
      const safeUrl = await assertSafeRemoteImageUrl(url, [
        this.walletConfig.appPublicUrl,
      ]);
      const response = await fetch(safeUrl, {
        redirect: 'error',
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) return null;
      const contentType = response.headers.get('content-type') ?? '';
      if (
        contentType &&
        !contentType.startsWith('image/') &&
        !contentType.includes('octet-stream')
      ) {
        return null;
      }
      if (contentType.toLowerCase().includes('svg')) {
        return null;
      }
      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength === 0 || arrayBuffer.byteLength > 5_000_000) {
        return null;
      }
      return Buffer.from(arrayBuffer);
    } catch {
      return null;
    }
  }

  private async buildPassFiles(
    card: WalletPassCard,
  ): Promise<Record<string, Buffer>> {
    const fullName = `${card.firstName} ${card.lastName}`.trim() || 'DropOne';
    const subtitle = this.buildSubtitle(card);
    const cardUrl = `${this.walletConfig.appPublicUrl}/cards/${card.slug}`;
    const palette = resolveWalletCardPalette(card.theme);
    const professional = this.isProfessionalCard(card);

    // Nom en gras (primary), poste - company en dessous (secondary).
    const generic: Record<string, unknown> = {
      primaryFields: [
        {
          key: 'name',
          value: fullName,
        },
      ],
    };

    const secondaryFields: Array<Record<string, string>> = [];
    if (subtitle) {
      secondaryFields.push({
        key: 'role',
        value: subtitle,
      });
    }
    const companyAddress =
      professional && card.address?.trim() ? card.address.trim() : '';
    if (companyAddress) {
      secondaryFields.push({
        key: 'address',
        label: 'Adresse',
        value: companyAddress,
      });
    }
    if (secondaryFields.length > 0) {
      generic.secondaryFields = secondaryFields;
    }

    const auxiliaryFields: Array<Record<string, string>> = [];
    if (card.email?.trim()) {
      auxiliaryFields.push({
        key: 'email',
        label: 'Email',
        value: card.email.trim(),
      });
    }
    if (card.phone?.trim()) {
      auxiliaryFields.push({
        key: 'phone',
        label: 'Téléphone',
        value: card.phone.trim(),
      });
    }
    if (auxiliaryFields.length > 0) {
      generic.auxiliaryFields = auxiliaryFields;
    }

    const barcode = {
      format: 'PKBarcodeFormatQR',
      message: cardUrl,
      messageEncoding: 'iso-8859-1',
    };

    // Format `generic` : logo à gauche, thumbnail (photo) à droite.
    const passJson: Record<string, unknown> = {
      formatVersion: 1,
      passTypeIdentifier: this.walletConfig.applePassTypeId,
      teamIdentifier: this.walletConfig.appleTeamId,
      organizationName: 'DropOne',
      description: `Carte DropOne - ${fullName}`,
      serialNumber: card.id,
      foregroundColor: palette.passForeground,
      backgroundColor: palette.passBackground,
      labelColor: palette.passLabel,
      generic,
      barcode,
      barcodes: [barcode],
    };

    const avatarUrl = this.resolveAssetUrl(card.avatarUrl);
    const avatarBuffer = avatarUrl
      ? await this.fetchImageBuffer(avatarUrl)
      : null;

    const thumbnailAssets = await generateWalletThumbnailAssets({
      imageBuffer: avatarBuffer,
      initials: this.initialsOf(card),
      accentHex: palette.accentHex,
      textHex: palette.primaryTextHex,
    });

    let leftLogoAssets: Record<string, Buffer> = {};
    if (professional) {
      const teamLogoUrl = this.resolveTeamLogoUrl(card);
      const teamLogoBuffer = teamLogoUrl
        ? await this.fetchImageBuffer(teamLogoUrl)
        : null;
      leftLogoAssets = await generateWalletLeftLogoAssets(teamLogoBuffer);
    }

    if (Object.keys(leftLogoAssets).length === 0) {
      const dropOnePath = resolveDropOneIconPath();
      if (dropOnePath) {
        leftLogoAssets = await generateWalletLeftLogoAssets(
          fs.readFileSync(dropOnePath),
        );
      }
    }

    const files: Record<string, Buffer> = {
      ...this.loadPassAssets({ omitBrandLogos: true }),
      ...leftLogoAssets,
      ...thumbnailAssets,
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
        'cms',
        '-binary',
        '-sign',
        '-signer',
        this.walletConfig.appleSignerCertPath,
        '-inkey',
        this.walletConfig.appleSignerKeyPath,
        '-certfile',
        this.walletConfig.appleWwdrCertPath,
        '-in',
        manifestPath,
        '-out',
        signaturePath,
        '-outform',
        'DER',
        '-md',
        'sha256',
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

  private zipStore(files: Record<string, Buffer>): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const zip = new ZipFile();
      const chunks: Buffer[] = [];

      zip.outputStream.on('data', (chunk: Buffer) => chunks.push(chunk));
      zip.outputStream.on('error', reject);
      zip.outputStream.on('end', () => resolve(Buffer.concat(chunks)));

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
        zip.addBuffer(files[name], name, { compress: false });
      }
      zip.end();
    });
  }

  private loadPassAssets(options?: {
    omitBrandLogos?: boolean;
  }): Record<string, Buffer> {
    const assetsDir = this.walletConfig.walletAssetsDir();

    const requiredAssets = ['icon.png'];
    const optionalAssets = ['icon@2x.png', 'icon@3x.png'];
    if (!options?.omitBrandLogos) {
      optionalAssets.push('logo.png', 'logo@2x.png', 'logo@3x.png');
    }

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
