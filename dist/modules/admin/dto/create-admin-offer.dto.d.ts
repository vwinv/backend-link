import { OfferAudience, OfferBillingType } from '@prisma/client';
export declare class CreateAdminOfferPriceDto {
    billingType: OfferBillingType;
    priceAmount: number;
    pricePerSeat?: number | null;
    priceLabel?: string | null;
    currency?: string;
    discountPercent?: number | null;
    badgeLabel?: string | null;
    isPopular?: boolean;
    sortOrder?: number;
    isActive?: boolean;
    stripePriceId?: string | null;
}
export declare class CreateAdminOfferDto {
    title: string;
    slug: string;
    subtitle?: string | null;
    audience: OfferAudience;
    canCustomize?: boolean;
    maxTeamMembers?: number;
    minSeats?: number;
    hasPortfolio?: boolean;
    hasWallet?: boolean;
    hasAnalytics?: boolean;
    hasVisitorInsights?: boolean;
    hasSocialLinks?: boolean;
    maxAiScans?: number;
    maxShares?: number;
    sortOrder?: number;
    isActive?: boolean;
    listedInApp?: boolean;
    prices?: CreateAdminOfferPriceDto[];
}
