import { OfferBillingType } from '@prisma/client';
export declare const SUBSCRIPTION_SOFTPAY_METHODS: readonly ["wave_sn", "orange_money_sn", "free_money_sn"];
export type SubscriptionSoftPayMethod = (typeof SUBSCRIPTION_SOFTPAY_METHODS)[number];
export declare class SoftPaySubscriptionDto {
    offerSlug: string;
    billingType: OfferBillingType;
    invoiceToken: string;
    method: SubscriptionSoftPayMethod;
    prenom: string;
    nom: string;
    telephone: string;
    email?: string;
    teamId?: string;
}
