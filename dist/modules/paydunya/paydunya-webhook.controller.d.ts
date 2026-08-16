import { SubscriptionsService } from '../subscriptions/subscriptions.service';
export declare class PaydunyaWebhookController {
    private readonly subscriptionsService;
    private readonly logger;
    constructor(subscriptionsService: SubscriptionsService);
    handle(body: Record<string, unknown>): Promise<{
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
}
