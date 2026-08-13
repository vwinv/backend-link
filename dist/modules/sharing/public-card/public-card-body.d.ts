import type { PublicCardPageParams } from './public-card.types';
declare function escapeHtml(value: string): string;
export declare function buildCardInitials(params: {
    fullName: string;
    fallback?: string;
}): string;
export declare function renderPublicCardBody(params: PublicCardPageParams): string;
export declare function buildInlineScript(pageUrl: string): string;
export { escapeHtml };
