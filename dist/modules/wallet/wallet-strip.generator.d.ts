import { WalletCardPalette } from './wallet-card-style.util';
export type WalletStripInput = {
    fullName: string;
    subtitle: string;
    email: string;
    phone: string;
    initials: string;
    showQr: boolean;
    palette: WalletCardPalette;
    avatarBuffer?: Buffer | null;
};
export declare function generateWalletStripAssets(input: WalletStripInput): Promise<Record<string, Buffer>>;
