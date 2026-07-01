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

export const DEFAULT_ENTITLEMENTS: UserEntitlements = {
  audience: OfferAudience.PERSONAL,
  canCustomize: false,
  maxTeamMembers: 0,
  hasPortfolio: false,
  maxAiScans: 0,
};
