export type PublicPortfolioPageInput = {
    fullName: string;
    initials: string;
    jobTitle?: string | null;
    company?: string | null;
    avatarUrl?: string | null;
    pageUrl: string;
};
export declare function buildPublicPortfolioHtml(input: PublicPortfolioPageInput): string;
export declare function buildPublicPortfolioNotFoundHtml(): string;
