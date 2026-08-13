import type { CardThemeJson } from './pro-design.types';
export declare function parseCardTheme(theme: unknown): CardThemeJson;
export declare function normalizeHexColor(value: string): string;
export declare function normalizeCardThemeForStorage(theme: unknown): CardThemeJson;
export declare function resolveCardThemeForRender(theme: unknown): CardThemeJson;
