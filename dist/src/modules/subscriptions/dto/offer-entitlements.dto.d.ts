import { OfferAudience } from '@prisma/client';
export declare class OfferEntitlementsDto {
    audience: OfferAudience;
    canCustomize: boolean;
    maxTeamMembers: number;
    hasPortfolio: boolean;
    hasWallet: boolean;
    hasAnalytics: boolean;
    hasVisitorInsights: boolean;
    hasSocialLinks: boolean;
    maxAiScans: number;
    maxShares: number;
}
