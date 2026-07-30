import { BusinessCard } from '@prisma/client';
import { WalletConfig } from './wallet.config';
export declare class AppleWalletService {
    private readonly walletConfig;
    constructor(walletConfig: WalletConfig);
    private buildDummyCard;
    selfTestBuffer(): Promise<Buffer>;
    selfTest(): Promise<Record<string, unknown>>;
    private firstZipMethod;
    private inspectCertificates;
    private assertCertsMatchConfiguredIds;
    generatePass(card: BusinessCard): Promise<Buffer>;
    private initialsOf;
    private resolveAssetUrl;
    private fetchImageBuffer;
    private buildPassFiles;
    private signManifest;
    private zipStore;
    private loadPassAssets;
}
