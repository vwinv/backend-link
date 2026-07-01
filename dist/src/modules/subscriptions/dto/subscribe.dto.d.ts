import { OfferBillingType } from '@prisma/client';
export declare class SubscribeDto {
    offerSlug: string;
    billingType: OfferBillingType;
    teamId?: string;
}
