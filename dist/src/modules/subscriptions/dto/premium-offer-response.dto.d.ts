import { OfferAudience } from '@prisma/client';
import { PremiumOfferPriceResponseDto } from './premium-offer-price-response.dto';
export declare class PremiumOfferResponseDto {
    id: string;
    title: string;
    slug: string;
    subtitle?: string | null;
    audience: OfferAudience;
    canCustomize: boolean;
    maxTeamMembers: number;
    minSeats: number;
    hasPortfolio: boolean;
    hasWallet: boolean;
    hasAnalytics: boolean;
    hasVisitorInsights: boolean;
    hasSocialLinks: boolean;
    maxAiScans: number;
    maxShares: number;
    sortOrder: number;
    prices: PremiumOfferPriceResponseDto[];
}
