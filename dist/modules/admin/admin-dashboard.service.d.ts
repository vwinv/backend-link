import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminDashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        generatedAt: string;
        users: {
            total: number;
            active: number;
            admins: number;
            newLast7Days: number;
            newLast30Days: number;
        };
        cards: {
            total: number;
            active: number;
            public: number;
            personal: number;
            professional: number;
            member: number;
        };
        teams: {
            total: number;
        };
        subscriptions: {
            active: number;
            trial: number;
            cancelled: number;
            expired: number;
            pastDue: number;
            paying: number;
        };
        revenue: {
            currency: string;
            total: number;
            active: number;
            byOffer: {
                offerId: string;
                title: string;
                slug: string;
                subscriptionsCount: number;
                revenue: number;
                activeRevenue: number;
            }[];
        };
        engagement: {
            cardViews: number;
            cardViewsLast7Days: number;
            shares: number;
            sharesLast7Days: number;
            contacts: number;
            walletSaves: number;
            cardSaves: number;
            aiScans: number;
            aiScansLast7Days: number;
        };
        charts: {
            cardsByKind: {
                labels: string[];
                values: number[];
            };
            subscriptionsByStatus: {
                labels: string[];
                values: number[];
            };
            revenueByOffer: {
                labels: string[];
                values: number[];
            };
            activity30d: {
                labels: string[];
                users: number[];
                cards: number[];
                views: number[];
                shares: number[];
            };
        };
    }>;
    private buildRevenueStats;
    private buildChartSeries;
    private countByDay;
    private dayLabels;
    private fillSeries;
    private toDayKey;
}
