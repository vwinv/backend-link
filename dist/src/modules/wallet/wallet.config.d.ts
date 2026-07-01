import { ConfigService } from '@nestjs/config';
export declare class WalletConfig {
    private readonly config;
    constructor(config: ConfigService);
    get appPublicUrl(): string;
    get appleTeamId(): string;
    get applePassTypeId(): string;
    get appleSignerCertPath(): string;
    get appleSignerKeyPath(): string;
    get appleSignerKeyPassphrase(): string | undefined;
    get appleWwdrCertPath(): string;
    get googleIssuerId(): string;
    get googleClassSuffix(): string;
    get googleServiceAccountPath(): string;
    get googleOrigins(): string[];
    isAppleConfigured(): boolean;
    isGoogleConfigured(): boolean;
    loadGoogleServiceAccount(): Record<string, unknown>;
    walletAssetsDir(): string;
    private fileExists;
}
