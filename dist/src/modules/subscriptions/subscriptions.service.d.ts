import { PrismaService } from '../../prisma/prisma.service';
import { PaydunyaService } from '../paydunya/paydunya.service';
import { CheckoutDto } from './dto/checkout.dto';
import { SoftPaySubscriptionDto } from './dto/softpay-subscription.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { StripeService } from './stripe.service';
export declare class SubscriptionsService {
    private readonly prisma;
    private readonly stripeService;
    private readonly paydunyaService;
    private readonly logger;
    constructor(prisma: PrismaService, stripeService: StripeService, paydunyaService: PaydunyaService);
    getPaymentConfig(): {
        paymentsEnabled: boolean;
        provider: string;
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
        hasWallet: boolean;
        hasAnalytics: boolean;
        hasVisitorInsights: boolean;
        hasSocialLinks: boolean;
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
        hasWallet: boolean;
        hasAnalytics: boolean;
        hasVisitorInsights: boolean;
        hasSocialLinks: boolean;
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
            hasWallet: boolean;
            hasAnalytics: boolean;
            hasVisitorInsights: boolean;
            hasSocialLinks: boolean;
            maxAiScans: number;
        };
        currentPeriodEnd: string | null;
    }>;
    createCheckout(userId: string, dto: CheckoutDto): Promise<{
        checkoutUrl: string;
        invoiceToken: string;
        sessionId: string;
        amountFcfa: number;
        description: string;
    }>;
    softPay(userId: string, dto: SoftPaySubscriptionDto): Promise<{
        amountFcfa: number;
        invoiceToken: string;
        description: string;
        softPay: {
            url: string | undefined;
            other_url: {
                om_url?: string;
                maxit_url?: string;
            } | undefined;
            return_url: string | undefined;
            message: string | undefined;
            fees: number | undefined;
            currency: string | undefined;
        };
    }>;
    confirmPaydunyaPayment(userId: string, invoiceToken: string): Promise<{
        paid: boolean;
        error: string;
        subscription?: undefined;
    } | {
        paid: boolean;
        subscription: {
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
                hasWallet: boolean;
                hasAnalytics: boolean;
                hasVisitorInsights: boolean;
                hasSocialLinks: boolean;
                maxAiScans: number;
            };
            currentPeriodEnd: string | null;
        };
        error?: undefined;
    }>;
    handlePaydunyaIpn(body: Record<string, unknown>): Promise<{
        ok: false;
        error: string;
        ignored?: undefined;
        status?: undefined;
        alreadyProcessed?: undefined;
    } | {
        ok: true;
        ignored: true;
        status: string;
        error?: undefined;
        alreadyProcessed?: undefined;
    } | {
        ok: true;
        alreadyProcessed: true;
        error?: undefined;
        ignored?: undefined;
        status?: undefined;
    } | {
        ok: true;
        error?: undefined;
        ignored?: undefined;
        status?: undefined;
        alreadyProcessed?: undefined;
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
            hasWallet: boolean;
            hasAnalytics: boolean;
            hasVisitorInsights: boolean;
            hasSocialLinks: boolean;
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
    private normalizePaydunyaIpnPayload;
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
