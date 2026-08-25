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
    get googleServiceAccountJson(): string;
    get googleOrigins(): string[];
    isAppleConfigured(): boolean;
    isGoogleConfigured(): boolean;
    describe(): Record<string, unknown>;
    loadGoogleServiceAccount(): Record<string, unknown>;
    walletAssetsDir(): string;
    private hasGoogleServiceAccount;
    private fileExists;
    private resolvePath;
}
