import { OfferBillingType } from '@prisma/client';
import { CreateAdminOfferDto } from './create-admin-offer.dto';
declare const UpdateAdminOfferDto_base: import("@nestjs/common").Type<Partial<Omit<CreateAdminOfferDto, "prices">>>;
export declare class UpdateAdminOfferDto extends UpdateAdminOfferDto_base {
}
export declare class UpdateAdminOfferPriceDto {
    billingType?: OfferBillingType;
    priceAmount?: number;
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
export {};
