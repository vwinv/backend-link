import { OfferAudience } from '@prisma/client';

export interface UserEntitlements {
  audience: OfferAudience;
  canCustomize: boolean;
  maxTeamMembers: number;
  hasPortfolio: boolean;
  hasWallet: boolean;
  hasAnalytics: boolean;
  hasVisitorInsights: boolean;
  hasSocialLinks: boolean;
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
  hasWallet: false,
  hasAnalytics: false,
  hasVisitorInsights: false,
  hasSocialLinks: false,
  maxAiScans: 0,
};
