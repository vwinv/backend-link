import { OfferAudience } from '@prisma/client';
export interface UserEntitlements {
    audience: OfferAudience;
    canCustomize: boolean;
    maxTeamMembers: number;
    hasPortfolio: boolean;
    maxAiScans: number;
}
export interface TeamSeatsQuota {
    used: number;
    max: number;
    canAddMember: boolean;
}
export interface AiScanQuota {
    used: number;
    max: number;
    canScan: boolean;
    isUnlimited: boolean;
}
export declare const DEFAULT_ENTITLEMENTS: UserEntitlements;
