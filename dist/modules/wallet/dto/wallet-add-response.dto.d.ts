import { WalletType } from '@prisma/client';
export declare class WalletAddResponseDto {
    walletType: WalletType;
    savedCardId: string;
    passBase64?: string;
    saveUrl?: string;
}
