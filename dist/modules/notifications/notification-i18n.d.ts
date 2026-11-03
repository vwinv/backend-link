export type AppLocale = 'fr' | 'en';
export declare function normalizeAppLocale(value?: string | null): AppLocale;
export declare function pickLocalizedText(input: {
    locale?: string | null;
    fr: string;
    en?: string | null;
}): string;
export declare function subscriptionExpiredCopy(locale: AppLocale | string | null | undefined, offerTitle: string): {
    title: string;
    body: string;
};
