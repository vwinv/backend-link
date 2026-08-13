export type WalletLogoMode = 'avatar' | 'company';
export type WalletLogoInput = {
    mode: WalletLogoMode;
    imageBuffer?: Buffer | null;
    initials: string;
    accentHex: string;
    textHex: string;
};
export declare function resolveDropOneIconPath(): string | null;
export declare function generateWalletLeftLogoAssets(imageBuffer: Buffer | null): Promise<Record<string, Buffer>>;
export declare function generateWalletThumbnailAssets(input: {
    imageBuffer?: Buffer | null;
    initials: string;
    accentHex: string;
    textHex: string;
}): Promise<Record<string, Buffer>>;
export declare function generateWalletLogoAssets(input: WalletLogoInput): Promise<Record<string, Buffer>>;
