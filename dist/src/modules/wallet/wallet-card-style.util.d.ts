export type WalletCardPalette = {
    styleKey: string;
    backgroundHex: string;
    accentHex: string;
    primaryTextHex: string;
    secondaryTextHex: string;
    lightTheme: boolean;
    passBackground: string;
    passForeground: string;
    passLabel: string;
};
export declare function resolveWalletCardPalette(theme: unknown): WalletCardPalette;
