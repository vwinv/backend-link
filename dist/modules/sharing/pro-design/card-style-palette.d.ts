import type { ProDesignLayout } from './pro-design.types';
type CardStylePalette = {
    background: string;
    accent: string;
    gradientEnd?: string;
    layout: ProDesignLayout;
};
export declare function getCardStylePalette(style?: string | null): CardStylePalette | null;
export {};
