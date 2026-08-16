import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { CheckoutDto } from './dto/checkout.dto';
import { SoftPaySubscriptionDto } from './dto/softpay-subscription.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
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
    getMySubscription(user: {
        userId: string;
    }): Promise<{
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
    getPlan(slug: string): {
        message: string;
        slug: string;
    };
    createCheckout(user: {
        userId: string;
    }, dto: CheckoutDto): Promise<{
        checkoutUrl: string;
        invoiceToken: string;
        sessionId: string;
        amountFcfa: number;
        seats: number | null;
        description: string;
    }>;
    softPay(user: {
        userId: string;
    }, dto: SoftPaySubscriptionDto): Promise<{
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
    confirmPaydunya(user: {
        userId: string;
    }, invoiceToken: string): Promise<{
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
    subscribe(user: {
        userId: string;
    }, dto: SubscribeDto): Promise<{
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
    cancel(): {
        message: string;
    };
    webhook(request: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
}
