import { BusinessCard } from '@prisma/client';
import { WalletConfig } from './wallet.config';
export type WalletPassCard = BusinessCard & {
    teamLogoUrl?: string | null;
};
export declare class AppleWalletService {
    private readonly walletConfig;
    constructor(walletConfig: WalletConfig);
    private buildDummyCard;
    selfTestBuffer(): Promise<Buffer>;
    selfTest(): Promise<Record<string, unknown>>;
    private firstZipMethod;
    private inspectCertificates;
    private assertCertsMatchConfiguredIds;
    generatePass(card: WalletPassCard): Promise<Buffer>;
    private isProfessionalCard;
    private buildSubtitle;
    private initialsOf;
    private resolveAssetUrl;
    private resolveTeamLogoUrl;
    private fetchImageBuffer;
    private buildPassFiles;
    private signManifest;
    private zipStore;
    private loadPassAssets;
}
