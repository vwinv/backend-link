export type WalletLogoMode = 'avatar' | 'company';
export type WalletLogoInput = {
    mode: WalletLogoMode;
    imageBuffer?: Buffer | null;
    initials: string;
    accentHex: string;
    textHex: string;
};
export declare function generateWalletLogoAssets(input: WalletLogoInput): Promise<Record<string, Buffer>>;
