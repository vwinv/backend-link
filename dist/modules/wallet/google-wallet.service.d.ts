import { OnModuleInit } from '@nestjs/common';
import { BusinessCard } from '@prisma/client';
import { WalletConfig } from './wallet.config';
type SaveToGoogleWallet = {
    saveUrl: string;
    saveJwt: string;
};
export declare class GoogleWalletService implements OnModuleInit {
    private readonly walletConfig;
    private readonly logger;
    private accessTokenCache;
    constructor(walletConfig: WalletConfig);
    onModuleInit(): void;
    private get classSuffix();
    generateSaveUrl(card: BusinessCard): Promise<SaveToGoogleWallet>;
    getPassId(card: BusinessCard): string;
    private buildGenericObject;
    private buildTextModules;
    private resolveOrigins;
    private clip;
    private safeId;
    private ensureGenericClass;
    private upsertGenericObject;
    private walletRequest;
    private getAccessToken;
    private throwWalletApiError;
}
export {};
