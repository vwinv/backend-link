import { PrismaService } from '../../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { StripeService } from './stripe.service';
export declare class SubscriptionsService {
    private readonly prisma;
    private readonly stripeService;
    constructor(prisma: PrismaService, stripeService: StripeService);
    getPaymentConfig(): {
        paymentsEnabled: boolean;
    };
    getOffers(): Promise<{
        id: string;
        title: string;
        slug: string;
        subtitle: string | null;
        audience: import(".prisma/client").$Enums.OfferAudience;
        canCustomize: boolean;
        maxTeamMembers: number;
        hasPortfolio: boolean;
        maxAiScans: number;
        sortOrder: number;
        prices: {
            id: string;
            billingType: import(".prisma/client").$Enums.OfferBillingType;
            priceLabel: string | null;
            priceAmount: number;
            currency: string;
            discountPercent: number | null;
            badgeLabel: string | null;
            isPopular: boolean;
            sortOrder: number;
        }[];
    }[]>;
    getPlans(): Promise<{
        id: string;
        title: string;
        slug: string;
        subtitle: string | null;
        audience: import(".prisma/client").$Enums.OfferAudience;
        canCustomize: boolean;
        maxTeamMembers: number;
        hasPortfolio: boolean;
        maxAiScans: number;
        sortOrder: number;
        prices: {
            id: string;
            billingType: import(".prisma/client").$Enums.OfferBillingType;
            priceLabel: string | null;
            priceAmount: number;
            currency: string;
            discountPercent: number | null;
            badgeLabel: string | null;
            isPopular: boolean;
            sortOrder: number;
        }[];
    }[]>;
    getPlan(slug: string): {
        message: string;
        slug: string;
    };
    getMySubscription(userId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        billingPeriod: import(".prisma/client").$Enums.BillingPeriod;
        planName: string;
        planSlug: string;
        offerTitle: string;
        offerSlug: string;
        billingType: import(".prisma/client").$Enums.OfferBillingType | null;
        entitlements: {
            audience: import(".prisma/client").$Enums.OfferAudience;
            canCustomize: boolean;
            maxTeamMembers: number;
            hasPortfolio: boolean;
            maxAiScans: number;
        };
        currentPeriodEnd: string | null;
    }>;
    createCheckout(userId: string, dto: CheckoutDto): Promise<{
        checkoutUrl: string;
        sessionId: string;
    }>;
    subscribe(userId: string, dto: SubscribeDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        billingPeriod: import(".prisma/client").$Enums.BillingPeriod;
        planName: string;
        planSlug: string;
        offerTitle: string;
        offerSlug: string;
        billingType: import(".prisma/client").$Enums.OfferBillingType | null;
        entitlements: {
            audience: import(".prisma/client").$Enums.OfferAudience;
            canCustomize: boolean;
            maxTeamMembers: number;
            hasPortfolio: boolean;
            maxAiScans: number;
        };
        currentPeriodEnd: string | null;
    }>;
    handleStripeWebhook(payload: Buffer, signature?: string): Promise<{
        received: boolean;
    }>;
    cancel(): {
        message: string;
    };
    private resolveOfferPrice;
    private ensureStripeCustomer;
    private activateSubscription;
    private handleCheckoutSessionCompleted;
    private handleStripeSubscriptionUpdated;
    private handleStripeSubscriptionDeleted;
    private handleInvoicePaymentFailed;
    private mapStripeSubscriptionStatus;
    private stripeTimestampToDate;
    private readStripeSubscriptionPeriodEnd;
    private ensurePremiumPlan;
    private buildPlanFeatures;
    private findActiveSubscription;
    private mapBillingPeriod;
    private computePeriodEnd;
    private toSubscriptionResponse;
    private toEntitlementsResponse;
    private toOfferResponse;
    private toOfferPriceResponse;
}
