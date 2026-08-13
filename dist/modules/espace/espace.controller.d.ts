import { AddMemberDto } from '../teams/dto/add-member.dto';
import { AddSeatsDto } from './dto/add-seats.dto';
import { ConfirmSeatsDto } from './dto/confirm-seats.dto';
import { EspaceService } from './espace.service';
export declare class EspaceController {
    private readonly espaceService;
    constructor(espaceService: EspaceService);
    listMine(user: {
        userId: string;
    }): Promise<{
        espacePath: string;
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
        brandColor: string | null;
    }[]>;
    getDashboard(user: {
        userId: string;
    }, slug: string): Promise<{
        team: {
            createdAt: string;
            description: string | null;
            id: string;
            name: string;
            slug: string;
            ownerId: string;
            logoUrl: string | null;
            brandColor: string | null;
        };
        myRole: "ADMIN" | "OWNER";
        seats: import("../subscriptions/entitlements.types").TeamSeatsQuota;
        subscription: {
            id: string;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            billingPeriod: import("@prisma/client").$Enums.BillingPeriod;
            purchasedSeats: number | null;
            currentPeriodEnd: string | null;
            offer: {
                title: string;
                audience: import("@prisma/client").$Enums.OfferAudience;
                slug: string;
            } | null;
            offerPrice: {
                billingType: import("@prisma/client").$Enums.OfferBillingType;
                priceAmount: number;
                pricePerSeat: number | null;
                currency: string;
            } | null;
        } | null;
        totals: {
            views: number;
            shares: number;
            saves: number;
            cards: number;
        };
        pendingInvites: number;
        invoicesCount: number;
        members: {
            memberId: string;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            joinedAt: string;
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            };
            stats: {
                cards: number;
                views: number;
                shares: number;
                saves: number;
            };
        }[];
        espacePath: string;
    }>;
    getMembers(user: {
        userId: string;
    }, slug: string): Promise<{
        team: {
            id: string;
            name: string;
            slug: string;
        };
        seatPurchase: {
            subscriptionId: string;
            offerTitle: string | null;
            offerSlug: string | null;
            billingType: import("@prisma/client").$Enums.OfferBillingType | null;
            currency: string;
            pricePerSeat: number | null;
            minSeats: number;
            purchasedSeats: number;
            maxSeats: number;
            canPurchaseSeats: boolean;
        } | null;
        members: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            updatedAt: Date;
            teamId: string;
            userId: string;
            joinedAt: Date;
        })[];
        pendingInvites: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.TeamInviteStatus;
            inviteeUserId: string | null;
            jobTitle: string | null;
            expiresAt: Date | null;
            respondedAt: Date | null;
            teamId: string;
            invitedById: string;
        }[];
        seats: import("../subscriptions/entitlements.types").TeamSeatsQuota;
    }>;
    checkoutSeats(user: {
        userId: string;
    }, slug: string, dto: AddSeatsDto): Promise<{
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
        lines: import("../subscriptions/invoices.service").InvoiceLine[];
        checkoutUrl: string;
        invoiceToken: string;
    }>;
    confirmSeats(user: {
        userId: string;
    }, slug: string, dto: ConfirmSeatsDto): Promise<{
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
    payInvoice(user: {
        userId: string;
    }, slug: string, invoiceId: string): Promise<{
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
    confirmInvoice(user: {
        userId: string;
    }, slug: string, dto: ConfirmSeatsDto): Promise<{
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
    getMemberAnalytics(user: {
        userId: string;
    }, slug: string, memberId: string, days?: string): Promise<{
        member: {
            memberId: string;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            joinedAt: string;
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            };
        };
        cards: {
            id: string;
            slug: string;
            name: string;
            jobTitle: string | null;
            avatarUrl: string | null;
        }[];
        analytics: {
            views: number;
            shares: number;
            saved: number;
            uniqueVisitors: number;
            periodDays: number;
            periodViews: number;
            previousPeriodViews: number;
            viewsChangePercent: number;
            viewsSeries: {
                date: string;
                label: string;
                count: number;
            }[];
            sources: {
                key: string;
                count: number;
                percent: number;
            }[];
            sparklines: {
                views: number[];
                uniqueVisitors: number[];
                saved: number[];
                shares: number[];
            };
        };
    }>;
    addMember(user: {
        userId: string;
    }, slug: string, dto: AddMemberDto): Promise<{
        team: {
            id: string;
            name: string;
            logoUrl: string | null;
            brandColor: string | null;
        };
    } & {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        jobTitle: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
    }>;
    removeMember(user: {
        userId: string;
    }, slug: string, memberId: string): Promise<{
        id: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        userId: string;
        joinedAt: Date;
    }>;
    cancelInvitation(user: {
        userId: string;
    }, slug: string, inviteId: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        jobTitle: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
    }>;
    getInvoices(user: {
        userId: string;
    }, slug: string): Promise<{
        party: {
            team: {
                id: string;
                name: string;
                slug: string;
                logoUrl: string | null;
            };
            client: {
                name: string;
                email: string;
                phone: string | null;
            } | null;
            issuer: {
                name: string;
                legalName: string;
                email: string;
                website: string;
            };
        };
        upcoming: {
            id: string;
            number: string;
            amount: number;
            currency: string;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            description: string | null;
            offerSlug: string | null;
            billingType: string | null;
            seats: number | null;
            provider: string | null;
            lines: import("@prisma/client/runtime/client").JsonArray;
            dueAt: string | null;
            paidAt: string | null;
            createdAt: string;
            canPay: boolean;
        }[];
        items: {
            id: string;
            number: string;
            amount: number;
            currency: string;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            description: string | null;
            offerSlug: string | null;
            billingType: string | null;
            seats: number | null;
            provider: string | null;
            lines: import("@prisma/client/runtime/client").JsonArray;
            dueAt: string | null;
            paidAt: string | null;
            createdAt: string;
            canPay: boolean;
        }[];
    }>;
}
