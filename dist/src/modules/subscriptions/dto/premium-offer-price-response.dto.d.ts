import { OfferBillingType } from '@prisma/client';
export declare class PremiumOfferPriceResponseDto {
    id: string;
    billingType: OfferBillingType;
    priceLabel?: string | null;
    priceAmount: number;
    currency: string;
    discountPercent?: number | null;
    badgeLabel?: string | null;
    isPopular: boolean;
    sortOrder: number;
}
