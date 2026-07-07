import { ConfigService } from '@nestjs/config';
import { OfferBillingType } from '@prisma/client';
import Stripe from 'stripe';
export type StripeCheckoutParams = {
    customerId: string;
    stripePriceId: string;
    billingType: OfferBillingType;
    userId: string;
    offerSlug: string;
    offerPriceId: string;
    teamId?: string | null;
};
export declare class StripeService {
    private readonly configService;
    private readonly logger;
    private client;
    constructor(configService: ConfigService);
    isEnabled(): boolean;
    getClient(): Stripe;
    createCustomer(input: {
        email: string;
        name: string;
        userId: string;
    }): Promise<Stripe.Customer>;
    createCheckoutSession(params: StripeCheckoutParams): Promise<Stripe.Checkout.Session>;
    constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event;
    logDisabledCheckoutAttempt(userId: string): void;
}
