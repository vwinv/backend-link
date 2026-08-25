import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class WalletConfig {
  constructor(private readonly config: ConfigService) {}

  get appPublicUrl(): string {
    return (this.config.get<string>('wallet.appPublicUrl') ?? 'https://api.dropone.pro').replace(
      /\/$/,
      '',
    );
  }

  get appleTeamId(): string {
    return this.config.get<string>('wallet.apple.teamId') ?? '';
  }

  get applePassTypeId(): string {
    return this.config.get<string>('wallet.apple.passTypeId') ?? '';
  }

  get appleSignerCertPath(): string {
    return this.config.get<string>('wallet.apple.signerCertPath') ?? '';
  }

  get appleSignerKeyPath(): string {
    return this.config.get<string>('wallet.apple.signerKeyPath') ?? '';
  }

  get appleSignerKeyPassphrase(): string | undefined {
    const value = this.config.get<string>('wallet.apple.signerKeyPassphrase');
    return value?.trim() ? value : undefined;
  }

  get appleWwdrCertPath(): string {
    return this.config.get<string>('wallet.apple.wwdrCertPath') ?? '';
  }

  get googleIssuerId(): string {
    return this.config.get<string>('wallet.google.issuerId') ?? '';
  }

  get googleClassSuffix(): string {
    return this.config.get<string>('wallet.google.classSuffix') ?? 'dropone_card_v2';
  }

  get googleServiceAccountPath(): string {
    return this.config.get<string>('wallet.google.serviceAccountPath') ?? '';
  }

  get googleServiceAccountJson(): string {
    return this.config.get<string>('wallet.google.serviceAccountJson') ?? '';
  }

  get googleOrigins(): string[] {
    return this.config.get<string[]>('wallet.google.origins') ?? [];
  }

  isAppleConfigured(): boolean {
    return Boolean(
      this.appleTeamId &&
        this.applePassTypeId &&
        this.appleSignerCertPath &&
        this.appleSignerKeyPath &&
        this.appleWwdrCertPath &&
        this.fileExists(this.appleSignerCertPath) &&
        this.fileExists(this.appleSignerKeyPath) &&
        this.fileExists(this.appleWwdrCertPath),
    );
  }

  isGoogleConfigured(): boolean {
    return Boolean(
      this.googleIssuerId.trim() && this.hasGoogleServiceAccount(),
    );
  }

  describe(): Record<string, unknown> {
    return {
      apple: {
        configured: this.isAppleConfigured(),
        teamIdSet: Boolean(this.appleTeamId),
        passTypeIdSet: Boolean(this.applePassTypeId),
        signerCertPath: this.appleSignerCertPath || null,
        signerCertExists: this.fileExists(this.appleSignerCertPath),
        signerKeyPath: this.appleSignerKeyPath || null,
        signerKeyExists: this.fileExists(this.appleSignerKeyPath),
        wwdrCertPath: this.appleWwdrCertPath || null,
        wwdrCertExists: this.fileExists(this.appleWwdrCertPath),
      },
      google: {
        configured: this.isGoogleConfigured(),
        issuerIdSet: Boolean(this.googleIssuerId.trim()),
        serviceAccountJsonSet: Boolean(this.googleServiceAccountJson.trim()),
        serviceAccountPath: this.googleServiceAccountPath || null,
        serviceAccountExists: this.fileExists(this.googleServiceAccountPath),
      },
    };
  }

  loadGoogleServiceAccount(): Record<string, unknown> {
    const inline = this.googleServiceAccountJson.trim();
    if (inline) {
      return JSON.parse(inline) as Record<string, unknown>;
    }

    const resolved = this.resolvePath(this.googleServiceAccountPath);
    if (!resolved) {
      throw new Error('Compte de service Google Wallet introuvable');
    }
    const raw = fs.readFileSync(resolved, 'utf8');
    return JSON.parse(raw) as Record<string, unknown>;
  }

  walletAssetsDir(): string {
    return path.join(process.cwd(), 'wallet-assets');
  }

  private hasGoogleServiceAccount(): boolean {
    if (this.googleServiceAccountJson.trim()) return true;
    return this.fileExists(this.googleServiceAccountPath);
  }

  private fileExists(filePath: string): boolean {
    return Boolean(this.resolvePath(filePath));
  }

  private resolvePath(filePath: string): string | null {
    if (!filePath?.trim()) return null;
    const candidates = path.isAbsolute(filePath)
      ? [filePath]
      : [
          path.resolve(process.cwd(), filePath),
          path.resolve(process.cwd(), 'backend-link', filePath),
        ];
    for (const candidate of candidates) {
      try {
        if (fs.existsSync(candidate)) return candidate;
      } catch {
        // ignore
      }
    }
    return null;
  }
}
