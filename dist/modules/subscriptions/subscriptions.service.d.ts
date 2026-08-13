import { PrismaService } from '../../prisma/prisma.service';
import { PaydunyaService } from '../paydunya/paydunya.service';
import { CheckoutDto } from './dto/checkout.dto';
import { SoftPaySubscriptionDto } from './dto/softpay-subscription.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { StripeService } from './stripe.service';
import { InvoicesService } from './invoices.service';
import type { InvoiceLine } from './invoices.service';
export declare class SubscriptionsService {
    private readonly prisma;
    private readonly stripeService;
    private readonly paydunyaService;
    private readonly invoicesService;
    private readonly logger;
    constructor(prisma: PrismaService, stripeService: StripeService, paydunyaService: PaydunyaService, invoicesService: InvoicesService);
    getPaymentConfig(): {
        paymentsEnabled: boolean;
        provider: string;
    };
    getOffers(): Promise<{
        id: string;
        title: string;
        slug: string;
        subtitle: string | null;
        audience: import("@prisma/client").$Enums.OfferAudience;
        canCustomize: boolean;
        maxTeamMembers: number;
        minSeats: number;
        hasPortfolio: boolean;
        hasWallet: boolean;
        hasAnalytics: boolean;
        hasVisitorInsights: boolean;
        hasSocialLinks: boolean;
        maxAiScans: number;
        maxShares: number;
        sortOrder: number;
        prices: {
            id: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType;
            priceLabel: string | null;
            priceAmount: number;
            pricePerSeat: number | null;
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
        audience: import("@prisma/client").$Enums.OfferAudience;
        canCustomize: boolean;
        maxTeamMembers: number;
        minSeats: number;
        hasPortfolio: boolean;
        hasWallet: boolean;
        hasAnalytics: boolean;
        hasVisitorInsights: boolean;
        hasSocialLinks: boolean;
        maxAiScans: number;
        maxShares: number;
        sortOrder: number;
        prices: {
            id: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType;
            priceLabel: string | null;
            priceAmount: number;
            pricePerSeat: number | null;
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
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        billingPeriod: import("@prisma/client").$Enums.BillingPeriod;
        planName: string;
        planSlug: string;
        offerTitle: string;
        offerSlug: string;
        billingType: import("@prisma/client").$Enums.OfferBillingType | null;
        entitlements: {
            audience: import("@prisma/client").$Enums.OfferAudience;
            canCustomize: boolean;
            maxTeamMembers: number;
            hasPortfolio: boolean;
            hasWallet: boolean;
            hasAnalytics: boolean;
            hasVisitorInsights: boolean;
            hasSocialLinks: boolean;
            maxAiScans: number;
            maxShares: number;
        };
        purchasedSeats: number | null;
        currentPeriodEnd: string | null;
    }>;
    createCheckout(userId: string, dto: CheckoutDto): Promise<{
        checkoutUrl: string;
        invoiceToken: string;
        sessionId: string;
        amountFcfa: number;
        seats: number | null;
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
        kind?: undefined;
        subscription?: undefined;
    } | {
        paid: boolean;
        kind: "already_paid";
        error?: undefined;
        subscription?: undefined;
    } | {
        paid: boolean;
        subscription: {
            id: string;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            billingPeriod: import("@prisma/client").$Enums.BillingPeriod;
            planName: string;
            planSlug: string;
            offerTitle: string;
            offerSlug: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType | null;
            entitlements: {
                audience: import("@prisma/client").$Enums.OfferAudience;
                canCustomize: boolean;
                maxTeamMembers: number;
                hasPortfolio: boolean;
                hasWallet: boolean;
                hasAnalytics: boolean;
                hasVisitorInsights: boolean;
                hasSocialLinks: boolean;
                maxAiScans: number;
                maxShares: number;
            };
            purchasedSeats: number | null;
            currentPeriodEnd: string | null;
        };
        error?: undefined;
        kind?: undefined;
    } | {
        alreadyProcessed: true;
        purchasedSeats: number | null;
        invoiceId: string;
        paid: boolean;
        kind: "seat_upgrade";
        error?: undefined;
        subscription?: undefined;
    } | {
        alreadyProcessed: false;
        purchasedSeats: number | null;
        invoiceId: string;
        paid: boolean;
        kind: "seat_upgrade";
        error?: undefined;
        subscription?: undefined;
    } | {
        alreadyProcessed: true;
        paymentInvoiceId: string;
        paid: boolean;
        kind: "invoice_pay";
        error?: undefined;
        subscription?: undefined;
    } | {
        alreadyProcessed: false;
        paymentInvoiceId: string;
        paid: boolean;
        kind: "invoice_pay";
        error?: undefined;
        subscription?: undefined;
    }>;
    createSeatUpgradeCheckout(userId: string, input: {
        teamId: string;
        additionalSeats: number;
        returnUrl?: string;
    }): Promise<{
        paidImmediately: true;
        amountFcfa: number;
        additionalSeats: number;
        newSeatsTotal: number | null;
        checkoutUrl: null;
        invoiceToken: null;
        pricePerSeat?: undefined;
        currency?: undefined;
        lines?: undefined;
    } | {
        paidImmediately: false;
        amountFcfa: number;
        additionalSeats: number;
        newSeatsTotal: number;
        pricePerSeat: number;
        currency: string;
        lines: InvoiceLine[];
        checkoutUrl: string;
        invoiceToken: string;
    }>;
    confirmSeatUpgrade(userId: string, invoiceToken: string): Promise<{
        paid: boolean;
        error: string;
        kind?: undefined;
        subscription?: undefined;
    } | {
        paid: boolean;
        kind: "already_paid";
        error?: undefined;
        subscription?: undefined;
    } | {
        paid: boolean;
        subscription: {
            id: string;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            billingPeriod: import("@prisma/client").$Enums.BillingPeriod;
            planName: string;
            planSlug: string;
            offerTitle: string;
            offerSlug: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType | null;
            entitlements: {
                audience: import("@prisma/client").$Enums.OfferAudience;
                canCustomize: boolean;
                maxTeamMembers: number;
                hasPortfolio: boolean;
                hasWallet: boolean;
                hasAnalytics: boolean;
                hasVisitorInsights: boolean;
                hasSocialLinks: boolean;
                maxAiScans: number;
                maxShares: number;
            };
            purchasedSeats: number | null;
            currentPeriodEnd: string | null;
        };
        error?: undefined;
        kind?: undefined;
    } | {
        alreadyProcessed: true;
        purchasedSeats: number | null;
        invoiceId: string;
        paid: boolean;
        kind: "seat_upgrade";
        error?: undefined;
        subscription?: undefined;
    } | {
        alreadyProcessed: false;
        purchasedSeats: number | null;
        invoiceId: string;
        paid: boolean;
        kind: "seat_upgrade";
        error?: undefined;
        subscription?: undefined;
    } | {
        alreadyProcessed: true;
        paymentInvoiceId: string;
        paid: boolean;
        kind: "invoice_pay";
        error?: undefined;
        subscription?: undefined;
    } | {
        alreadyProcessed: false;
        paymentInvoiceId: string;
        paid: boolean;
        kind: "invoice_pay";
        error?: undefined;
        subscription?: undefined;
    }>;
    private applySeatUpgradePayment;
    createPendingInvoiceCheckout(userId: string, input: {
        paymentInvoiceId: string;
        teamId: string;
        returnUrl?: string;
    }): Promise<{
        paidImmediately: true;
        amountFcfa: number;
        checkoutUrl: null;
        invoiceToken: null;
        paymentInvoiceId: string;
        alreadyProcessed: boolean;
    } | {
        paidImmediately: false;
        amountFcfa: number;
        checkoutUrl: string;
        invoiceToken: string;
        paymentInvoiceId: string;
        alreadyProcessed?: undefined;
    }>;
    confirmPendingInvoicePayment(userId: string, invoiceToken: string): Promise<{
        paid: boolean;
        error: string;
        kind?: undefined;
        subscription?: undefined;
    } | {
        paid: boolean;
        kind: "already_paid";
        error?: undefined;
        subscription?: undefined;
    } | {
        paid: boolean;
        subscription: {
            id: string;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            billingPeriod: import("@prisma/client").$Enums.BillingPeriod;
            planName: string;
            planSlug: string;
            offerTitle: string;
            offerSlug: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType | null;
            entitlements: {
                audience: import("@prisma/client").$Enums.OfferAudience;
                canCustomize: boolean;
                maxTeamMembers: number;
                hasPortfolio: boolean;
                hasWallet: boolean;
                hasAnalytics: boolean;
                hasVisitorInsights: boolean;
                hasSocialLinks: boolean;
                maxAiScans: number;
                maxShares: number;
            };
            purchasedSeats: number | null;
            currentPeriodEnd: string | null;
        };
        error?: undefined;
        kind?: undefined;
    } | {
        alreadyProcessed: true;
        purchasedSeats: number | null;
        invoiceId: string;
        paid: boolean;
        kind: "seat_upgrade";
        error?: undefined;
        subscription?: undefined;
    } | {
        alreadyProcessed: false;
        purchasedSeats: number | null;
        invoiceId: string;
        paid: boolean;
        kind: "seat_upgrade";
        error?: undefined;
        subscription?: undefined;
    } | {
        alreadyProcessed: true;
        paymentInvoiceId: string;
        paid: boolean;
        kind: "invoice_pay";
        error?: undefined;
        subscription?: undefined;
    } | {
        alreadyProcessed: false;
        paymentInvoiceId: string;
        paid: boolean;
        kind: "invoice_pay";
        error?: undefined;
        subscription?: undefined;
    }>;
    private applyPendingInvoicePayment;
    private extendPeriodFrom;
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
        alreadyProcessed: true;
        purchasedSeats: number | null;
        invoiceId: string;
        ok: true;
        seatUpgrade: true;
        error?: undefined;
        ignored?: undefined;
        status?: undefined;
    } | {
        alreadyProcessed: false;
        purchasedSeats: number | null;
        invoiceId: string;
        ok: true;
        seatUpgrade: true;
        error?: undefined;
        ignored?: undefined;
        status?: undefined;
    } | {
        alreadyProcessed: true;
        paymentInvoiceId: string;
        ok: true;
        invoicePay: true;
        error?: undefined;
        ignored?: undefined;
        status?: undefined;
    } | {
        alreadyProcessed: false;
        paymentInvoiceId: string;
        ok: true;
        invoicePay: true;
        error?: undefined;
        ignored?: undefined;
        status?: undefined;
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
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        billingPeriod: import("@prisma/client").$Enums.BillingPeriod;
        planName: string;
        planSlug: string;
        offerTitle: string;
        offerSlug: string;
        billingType: import("@prisma/client").$Enums.OfferBillingType | null;
        entitlements: {
            audience: import("@prisma/client").$Enums.OfferAudience;
            canCustomize: boolean;
            maxTeamMembers: number;
            hasPortfolio: boolean;
            hasWallet: boolean;
            hasAnalytics: boolean;
            hasVisitorInsights: boolean;
            hasSocialLinks: boolean;
            maxAiScans: number;
            maxShares: number;
        };
        purchasedSeats: number | null;
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
    private parseSeats;
    private toNumber;
    private isPerSeatPrice;
    private resolveSeats;
    private resolveCheckoutPricing;
    private activateSubscription;
    private generateInvoiceNumber;
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
