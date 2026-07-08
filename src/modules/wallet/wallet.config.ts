import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class WalletConfig {
  constructor(private readonly config: ConfigService) {}

  get appPublicUrl(): string {
    return (this.config.get<string>('wallet.appPublicUrl') ?? 'https://dropone.pro').replace(
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
    return this.config.get<string>('wallet.google.classSuffix') ?? 'link_business_card';
  }

  get googleServiceAccountPath(): string {
    return this.config.get<string>('wallet.google.serviceAccountPath') ?? '';
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
      this.googleIssuerId &&
        this.googleServiceAccountPath &&
        this.fileExists(this.googleServiceAccountPath),
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
        issuerIdSet: Boolean(this.googleIssuerId),
        serviceAccountPath: this.googleServiceAccountPath || null,
        serviceAccountExists: this.fileExists(this.googleServiceAccountPath),
      },
    };
  }

  loadGoogleServiceAccount(): Record<string, unknown> {
    const raw = fs.readFileSync(this.googleServiceAccountPath, 'utf8');
    return JSON.parse(raw) as Record<string, unknown>;
  }

  walletAssetsDir(): string {
    return path.join(process.cwd(), 'wallet-assets');
  }

  private fileExists(filePath: string): boolean {
    if (!filePath) return false;
    try {
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }
}
