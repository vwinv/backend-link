import { EntitlementsService } from '../subscriptions/entitlements.service';
import { InvoicesService } from '../subscriptions/invoices.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { TeamsService } from '../teams/teams.service';
import { AddMemberDto } from '../teams/dto/add-member.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export declare class EspaceService {
    private readonly prisma;
    private readonly teamsService;
    private readonly entitlementsService;
    private readonly invoicesService;
    private readonly subscriptionsService;
    private readonly configService;
    constructor(prisma: PrismaService, teamsService: TeamsService, entitlementsService: EntitlementsService, invoicesService: InvoicesService, subscriptionsService: SubscriptionsService, configService: ConfigService);
    private resolveManagedTeam;
    getDashboard(userId: string, slug: string): Promise<{
        team: {
            createdAt: string;
            id: string;
            name: string;
            description: string | null;
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
    getMembers(userId: string, slug: string): Promise<{
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
            userId: string;
            teamId: string;
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
            expiresAt: Date | null;
            status: import("@prisma/client").$Enums.TeamInviteStatus;
            inviteeUserId: string | null;
            jobTitle: string | null;
            respondedAt: Date | null;
            teamId: string;
            invitedById: string;
        }[];
        seats: import("../subscriptions/entitlements.types").TeamSeatsQuota;
    }>;
    checkoutAdditionalSeats(userId: string, slug: string, additionalSeats: number): Promise<{
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
    confirmAdditionalSeats(userId: string, slug: string, invoiceToken: string): Promise<{
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
    payInvoice(userId: string, slug: string, invoiceId: string): Promise<{
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
    confirmInvoicePayment(userId: string, slug: string, invoiceToken: string): Promise<{
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
    addMember(userId: string, slug: string, dto: AddMemberDto): Promise<{
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
        expiresAt: Date | null;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        jobTitle: string | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
    }>;
    cancelInvitation(userId: string, slug: string, inviteId: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        jobTitle: string | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
    }>;
    removeMember(userId: string, slug: string, memberId: string): Promise<{
        id: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        userId: string;
        teamId: string;
        joinedAt: Date;
    }>;
    getMemberAnalytics(userId: string, slug: string, memberId: string, days?: number): Promise<{
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
    private aggregateCardsAnalytics;
    private toDayKey;
    private toWeekdayLabel;
    private toShortDateLabel;
    private normalizeAnalyticsSource;
    getInvoices(userId: string, slug: string): Promise<{
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
    listMyEspaces(userId: string): Promise<{
        espacePath: string;
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
        brandColor: string | null;
    }[]>;
}
