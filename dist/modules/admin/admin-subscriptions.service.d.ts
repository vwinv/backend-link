import { OfferAudience } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminSubscriptionsQueryDto } from './dto/admin-subscriptions-query.dto';
import { CreateAdminSubscriptionDto } from './dto/create-admin-subscription.dto';
import { UpdateAdminSubscriptionDto } from './dto/update-admin-subscription.dto';
export declare class AdminSubscriptionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly adminSelect;
    getStats(): Promise<{
        generatedAt: string;
        totals: {
            total: number;
            active: number;
            trial: number;
            cancelled: number;
            expired: number;
            pastDue: number;
            paying: number;
            newLast30Days: number;
        };
        billing: {
            monthly: number;
            yearly: number;
        };
        revenue: {
            currency: string;
            total: number;
            active: number;
        };
        byOffer: {
            offerId: string;
            title: string;
            slug: string;
            subscriptionsCount: number;
            activeCount: number;
            revenue: number;
        }[];
        byStatus: {
            status: string;
            label: string;
            count: number;
        }[];
    }>;
    list(query: AdminSubscriptionsQueryDto): Promise<{
        data: {
            id: string;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            billingPeriod: import("@prisma/client").$Enums.BillingPeriod;
            currentPeriodEnd: Date | null;
            cancelledAt: Date | null;
            purchasedSeats: number | null;
            createdAt: Date;
            updatedAt: Date;
            paymentProvider: string | null;
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                fullName: string;
            } | null;
            team: {
                id: string;
                name: string;
                slug: string;
            } | null;
            offer: {
                id: string;
                title: string;
                slug: string;
                audience: OfferAudience;
            } | null;
            plan: {
                id: string;
                name: string;
                slug: string;
            } | null;
            price: {
                id: string;
                billingType: import("@prisma/client").$Enums.OfferBillingType;
                amount: number;
                currency: string;
                label: string | null;
            } | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    listOffers(): Promise<{
        prices: {
            id: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType;
            amount: number;
            pricePerSeat: number | null;
            currency: string;
            label: string | null;
            isActive: boolean;
        }[];
        id: string;
        title: string;
        slug: string;
        audience: import("@prisma/client").$Enums.OfferAudience;
        minSeats: number;
        listedInApp: boolean;
    }[]>;
    create(dto: CreateAdminSubscriptionDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        billingPeriod: import("@prisma/client").$Enums.BillingPeriod;
        currentPeriodEnd: Date | null;
        cancelledAt: Date | null;
        purchasedSeats: number | null;
        createdAt: Date;
        updatedAt: Date;
        paymentProvider: string | null;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            fullName: string;
        } | null;
        team: {
            id: string;
            name: string;
            slug: string;
        } | null;
        offer: {
            id: string;
            title: string;
            slug: string;
            audience: OfferAudience;
        } | null;
        plan: {
            id: string;
            name: string;
            slug: string;
        } | null;
        price: {
            id: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType;
            amount: number;
            currency: string;
            label: string | null;
        } | null;
    }>;
    findOne(id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        billingPeriod: import("@prisma/client").$Enums.BillingPeriod;
        currentPeriodEnd: Date | null;
        cancelledAt: Date | null;
        purchasedSeats: number | null;
        createdAt: Date;
        updatedAt: Date;
        paymentProvider: string | null;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            fullName: string;
        } | null;
        team: {
            id: string;
            name: string;
            slug: string;
        } | null;
        offer: {
            id: string;
            title: string;
            slug: string;
            audience: OfferAudience;
        } | null;
        plan: {
            id: string;
            name: string;
            slug: string;
        } | null;
        price: {
            id: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType;
            amount: number;
            currency: string;
            label: string | null;
        } | null;
    }>;
    update(id: string, dto: UpdateAdminSubscriptionDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        billingPeriod: import("@prisma/client").$Enums.BillingPeriod;
        currentPeriodEnd: Date | null;
        cancelledAt: Date | null;
        purchasedSeats: number | null;
        createdAt: Date;
        updatedAt: Date;
        paymentProvider: string | null;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            fullName: string;
        } | null;
        team: {
            id: string;
            name: string;
            slug: string;
        } | null;
        offer: {
            id: string;
            title: string;
            slug: string;
            audience: OfferAudience;
        } | null;
        plan: {
            id: string;
            name: string;
            slug: string;
        } | null;
        price: {
            id: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType;
            amount: number;
            currency: string;
            label: string | null;
        } | null;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    private serialize;
    private ensurePremiumPlan;
    private mapBillingPeriod;
    private computePeriodEnd;
    private buildRevenueTotals;
    private buildOfferBreakdown;
}
