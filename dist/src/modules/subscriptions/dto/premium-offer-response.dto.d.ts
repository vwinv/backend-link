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
    hasPortfolio: boolean;
    maxAiScans: number;
    sortOrder: number;
    prices: PremiumOfferPriceResponseDto[];
}
