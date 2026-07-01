import { BillingPeriod, OfferBillingType, SubscriptionStatus } from '@prisma/client';
import { OfferEntitlementsDto } from './offer-entitlements.dto';
export declare class SubscriptionResponseDto {
    id: string;
    status: SubscriptionStatus;
    billingPeriod: BillingPeriod;
    planName: string;
    planSlug: string;
    offerTitle: string;
    offerSlug: string;
    billingType?: OfferBillingType | null;
    entitlements: OfferEntitlementsDto;
    currentPeriodEnd?: string | null;
}
