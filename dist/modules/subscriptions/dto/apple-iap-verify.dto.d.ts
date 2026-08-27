import { OfferBillingType } from '@prisma/client';
export declare class AppleIapVerifyDto {
    signedTransaction: string;
    offerSlug?: string;
    billingType?: OfferBillingType;
    teamId?: string;
    seats?: number;
}
