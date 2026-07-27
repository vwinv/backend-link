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
    generatePass(card: BusinessCard): Promise<Buffer>;
    private buildPassFiles;
    private signManifest;
    private zipDeflate;
    private loadPassAssets;
}
