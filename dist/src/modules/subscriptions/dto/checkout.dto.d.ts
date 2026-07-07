import { OfferBillingType } from '@prisma/client';
export declare class CheckoutDto {
    offerSlug: string;
    billingType: OfferBillingType;
    teamId?: string;
}
