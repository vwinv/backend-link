import { BusinessCard } from '@prisma/client';
import { WalletConfig } from './wallet.config';
export declare class GoogleWalletService {
    private readonly walletConfig;
    constructor(walletConfig: WalletConfig);
    generateSaveUrl(card: BusinessCard): string;
    getPassId(card: BusinessCard): string;
}
