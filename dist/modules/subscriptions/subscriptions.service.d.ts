import { PrismaService } from '../../prisma/prisma.service';
import { PaydunyaService } from '../paydunya/paydunya.service';
import { CheckoutDto } from './dto/checkout.dto';
import { SoftPaySubscriptionDto } from './dto/softpay-subscription.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { StripeService } from './stripe.service';
import { InvoicesService } from './invoices.service';
import type { InvoiceLine } from './invoices.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AppleIapService } from './apple-iap.service';
import { AppleIapVerifyDto } from './dto/apple-iap-verify.dto';
export declare class SubscriptionsService {
    private readonly prisma;
    private readonly stripeService;
    private readonly paydunyaService;
    private readonly invoicesService;
    private readonly mailService;
    private readonly config;
    private readonly appleIapService;
    private readonly logger;
    constructor(prisma: PrismaService, stripeService: StripeService, paydunyaService: PaydunyaService, invoicesService: InvoicesService, mailService: MailService, config: ConfigService, appleIapService: AppleIapService);
    isInAppPaymentsHidden(): boolean;
    getPaymentConfig(): {
        paymentsEnabled: boolean;
        hideInAppPayments: boolean;
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
            appleProductId: string | null;
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
            appleProductId: string | null;
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
            om_url: string | undefined;
            maxit_url: string | undefined;
            qr_image_base64: string | undefined;
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
        kind?: undefined;
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
        paid: boolean;
        kind: "already_paid";
        error?: undefined;
        subscription?: undefined;
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
        subscription?: undefined;
        kind?: undefined;
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
        paid: boolean;
        kind: "already_paid";
        error?: undefined;
        subscription?: undefined;
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
        subscription?: undefined;
        kind?: undefined;
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
        paid: boolean;
        kind: "already_paid";
        error?: undefined;
        subscription?: undefined;
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
    } | {
        paid: boolean;
        error: string;
        subscription?: undefined;
        kind?: undefined;
        ok: true;
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
        ok: true;
    } | {
        paid: boolean;
        kind: "already_paid";
        error?: undefined;
        subscription?: undefined;
        ok: true;
    } | {
        alreadyProcessed: true;
        purchasedSeats: number | null;
        invoiceId: string;
        paid: boolean;
        kind: "seat_upgrade";
        error?: undefined;
        subscription?: undefined;
        ok: true;
    } | {
        alreadyProcessed: false;
        purchasedSeats: number | null;
        invoiceId: string;
        paid: boolean;
        kind: "seat_upgrade";
        error?: undefined;
        subscription?: undefined;
        ok: true;
    } | {
        alreadyProcessed: true;
        paymentInvoiceId: string;
        paid: boolean;
        kind: "invoice_pay";
        error?: undefined;
        subscription?: undefined;
        ok: true;
    } | {
        alreadyProcessed: false;
        paymentInvoiceId: string;
        paid: boolean;
        kind: "invoice_pay";
        error?: undefined;
        subscription?: undefined;
        ok: true;
    } | {
        paid: boolean;
        error: string;
        subscription?: undefined;
        kind?: undefined;
        ok: false;
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
        ok: false;
    } | {
        paid: boolean;
        kind: "already_paid";
        error?: undefined;
        subscription?: undefined;
        ok: false;
    } | {
        alreadyProcessed: true;
        purchasedSeats: number | null;
        invoiceId: string;
        paid: boolean;
        kind: "seat_upgrade";
        error?: undefined;
        subscription?: undefined;
        ok: false;
    } | {
        alreadyProcessed: false;
        purchasedSeats: number | null;
        invoiceId: string;
        paid: boolean;
        kind: "seat_upgrade";
        error?: undefined;
        subscription?: undefined;
        ok: false;
    } | {
        alreadyProcessed: true;
        paymentInvoiceId: string;
        paid: boolean;
        kind: "invoice_pay";
        error?: undefined;
        subscription?: undefined;
        ok: false;
    } | {
        alreadyProcessed: false;
        paymentInvoiceId: string;
        paid: boolean;
        kind: "invoice_pay";
        error?: undefined;
        subscription?: undefined;
        ok: false;
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
    createSignupRequest(userId: string, dto: SubscribeDto): Promise<{
        id: string;
        firstName: string;
        offerTitle: string;
        billingType: import("@prisma/client").$Enums.OfferBillingType;
    }>;
    confirmAppleIap(userId: string, dto: AppleIapVerifyDto): Promise<{
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
    private extractPaydunyaInvoiceToken;
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
