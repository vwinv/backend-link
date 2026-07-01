import { BusinessCard } from '@prisma/client';
import { WalletConfig } from './wallet.config';
export declare class AppleWalletService {
    private readonly walletConfig;
    constructor(walletConfig: WalletConfig);
    generatePass(card: BusinessCard): Promise<Buffer>;
    private loadPassAssets;
}
