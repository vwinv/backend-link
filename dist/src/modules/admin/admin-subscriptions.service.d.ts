import { PrismaService } from '../../prisma/prisma.service';
import { AdminSubscriptionsQueryDto } from './dto/admin-subscriptions-query.dto';
export declare class AdminSubscriptionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
                audience: import("@prisma/client").$Enums.OfferAudience;
                slug: string;
            } | null;
            plan: {
                id: string;
                name: string;
                slug: string;
            };
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
        id: string;
        title: string;
        audience: import("@prisma/client").$Enums.OfferAudience;
        slug: string;
    }[]>;
    private buildRevenueTotals;
    private buildOfferBreakdown;
}
