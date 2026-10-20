import type { PublicCardPageParams } from './public-card.types';
declare function escapeHtml(value: string): string;
export declare function buildCardInitials(params: {
    fullName: string;
    fallback?: string;
}): string;
export declare function buildVCard(params: {
    fullName: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    subtitle?: string | null;
    pageUrl: string;
    website?: string | null;
}): string;
export declare function renderPublicCardBody(params: PublicCardPageParams): string;
export declare function buildInlineScript(pageUrl: string): string;
export { escapeHtml };
