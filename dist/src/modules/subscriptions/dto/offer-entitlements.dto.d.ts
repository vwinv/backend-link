import { OfferAudience } from '@prisma/client';
export declare class OfferEntitlementsDto {
    audience: OfferAudience;
    canCustomize: boolean;
    maxTeamMembers: number;
    hasPortfolio: boolean;
    maxAiScans: number;
}
