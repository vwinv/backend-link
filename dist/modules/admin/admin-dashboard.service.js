"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminDashboardService = class AdminDashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const now = new Date();
        const last7Days = new Date(now);
        last7Days.setDate(last7Days.getDate() - 7);
        const last30Days = new Date(now);
        last30Days.setDate(last30Days.getDate() - 29);
        last30Days.setHours(0, 0, 0, 0);
        const [usersTotal, usersActive, usersAdmins, usersNew7d, usersNew30d, cardsTotal, cardsActive, cardsPublic, cardsPersonal, cardsProfessional, cardsMember, teamsTotal, subsActive, subsTrial, subsCancelled, subsExpired, subsPastDue, cardViewsTotal, cardViews7d, sharesTotal, shares7d, contactsTotal, walletSavesTotal, cardSavesTotal, aiScansTotal, aiScans7d, charts, revenue,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.user.count({ where: { role: client_1.UserRole.ADMIN } }),
            this.prisma.user.count({ where: { createdAt: { gte: last7Days } } }),
            this.prisma.user.count({ where: { createdAt: { gte: last30Days } } }),
            this.prisma.businessCard.count(),
            this.prisma.businessCard.count({ where: { isActive: true } }),
            this.prisma.businessCard.count({
                where: { isActive: true, isPublic: true },
            }),
            this.prisma.businessCard.count({ where: { kind: client_1.CardKind.PERSONAL } }),
            this.prisma.businessCard.count({
                where: { kind: client_1.CardKind.PROFESSIONAL },
            }),
            this.prisma.businessCard.count({ where: { kind: client_1.CardKind.MEMBER } }),
            this.prisma.team.count(),
            this.prisma.subscription.count({
                where: { status: client_1.SubscriptionStatus.ACTIVE },
            }),
            this.prisma.subscription.count({
                where: { status: client_1.SubscriptionStatus.TRIAL },
            }),
            this.prisma.subscription.count({
                where: { status: client_1.SubscriptionStatus.CANCELLED },
            }),
            this.prisma.subscription.count({
                where: { status: client_1.SubscriptionStatus.EXPIRED },
            }),
            this.prisma.subscription.count({
                where: { status: client_1.SubscriptionStatus.PAST_DUE },
            }),
            this.prisma.cardView.count(),
            this.prisma.cardView.count({ where: { viewedAt: { gte: last7Days } } }),
            this.prisma.shareEvent.count(),
            this.prisma.shareEvent.count({
                where: { createdAt: { gte: last7Days } },
            }),
            this.prisma.contact.count(),
            this.prisma.savedCard.count(),
            this.prisma.cardSaveEvent.count(),
            this.prisma.aiScanEvent.count(),
            this.prisma.aiScanEvent.count({
                where: { createdAt: { gte: last7Days } },
            }),
            this.buildChartSeries(last30Days),
            this.buildRevenueStats(),
        ]);
        return {
            generatedAt: now.toISOString(),
            users: {
                total: usersTotal,
                active: usersActive,
                admins: usersAdmins,
                newLast7Days: usersNew7d,
                newLast30Days: usersNew30d,
            },
            cards: {
                total: cardsTotal,
                active: cardsActive,
                public: cardsPublic,
                personal: cardsPersonal,
                professional: cardsProfessional,
                member: cardsMember,
            },
            teams: {
                total: teamsTotal,
            },
            subscriptions: {
                active: subsActive,
                trial: subsTrial,
                cancelled: subsCancelled,
                expired: subsExpired,
                pastDue: subsPastDue,
                paying: subsActive + subsPastDue,
            },
            revenue,
            engagement: {
                cardViews: cardViewsTotal,
                cardViewsLast7Days: cardViews7d,
                shares: sharesTotal,
                sharesLast7Days: shares7d,
                contacts: contactsTotal,
                walletSaves: walletSavesTotal,
                cardSaves: cardSavesTotal,
                aiScans: aiScansTotal,
                aiScansLast7Days: aiScans7d,
            },
            charts: {
                ...charts,
                cardsByKind: {
                    labels: ['Personnelles', 'Professionnelles', 'Membres'],
                    values: [cardsPersonal, cardsProfessional, cardsMember],
                },
                subscriptionsByStatus: {
                    labels: ['Actifs', 'Essai', 'En retard', 'Annulés', 'Expirés'],
                    values: [
                        subsActive,
                        subsTrial,
                        subsPastDue,
                        subsCancelled,
                        subsExpired,
                    ],
                },
                revenueByOffer: {
                    labels: revenue.byOffer.map((item) => item.title),
                    values: revenue.byOffer.map((item) => item.revenue),
                },
            },
        };
    }
    async buildRevenueStats() {
        const [totalsRows, offerRows] = await Promise.all([
            this.prisma.$queryRawUnsafe(`SELECT
           COALESCE(SUM(p."priceAmount"), 0) AS total,
           COALESCE(
             SUM(
               CASE
                 WHEN s.status IN ('ACTIVE', 'PAST_DUE') THEN p."priceAmount"
                 ELSE 0
               END
             ),
             0
           ) AS active,
           MAX(p.currency) AS currency
         FROM subscriptions s
         INNER JOIN premium_offer_prices p ON p.id = s."offerPriceId"
         WHERE s.status <> 'TRIAL'
           AND s."offerPriceId" IS NOT NULL`),
            this.prisma.$queryRawUnsafe(`SELECT
           o.id,
           o.title,
           o.slug,
           COUNT(s.id)::int AS subscriptions_count,
           COALESCE(SUM(p."priceAmount"), 0) AS revenue,
           COALESCE(
             SUM(
               CASE
                 WHEN s.status IN ('ACTIVE', 'PAST_DUE') THEN p."priceAmount"
                 ELSE 0
               END
             ),
             0
           ) AS active_revenue
         FROM subscriptions s
         INNER JOIN premium_offer_prices p ON p.id = s."offerPriceId"
         INNER JOIN premium_offers o ON o.id = s."offerId"
         WHERE s.status <> 'TRIAL'
           AND s."offerPriceId" IS NOT NULL
         GROUP BY o.id, o.title, o.slug
         ORDER BY revenue DESC, subscriptions_count DESC`),
        ]);
        const totals = totalsRows[0];
        const toAmount = (value) => Math.round(Number(value ?? 0));
        const byOffer = offerRows.map((row) => ({
            offerId: row.id,
            title: row.title,
            slug: row.slug,
            subscriptionsCount: Number(row.subscriptions_count),
            revenue: toAmount(row.revenue),
            activeRevenue: toAmount(row.active_revenue),
        }));
        return {
            currency: totals?.currency?.trim() || 'FCFA',
            total: toAmount(totals?.total),
            active: toAmount(totals?.active),
            byOffer,
        };
    }
    async buildChartSeries(since) {
        const [usersByDay, cardsByDay, viewsByDay, sharesByDay] = await Promise.all([
            this.countByDay('"users"', '"createdAt"', since),
            this.countByDay('"business_cards"', '"createdAt"', since),
            this.countByDay('"card_views"', '"viewedAt"', since),
            this.countByDay('"share_events"', '"createdAt"', since),
        ]);
        const labels = this.dayLabels(since);
        return {
            activity30d: {
                labels,
                users: this.fillSeries(labels, usersByDay),
                cards: this.fillSeries(labels, cardsByDay),
                views: this.fillSeries(labels, viewsByDay),
                shares: this.fillSeries(labels, sharesByDay),
            },
        };
    }
    async countByDay(table, column, since) {
        const rows = await this.prisma.$queryRawUnsafe(`SELECT DATE(${column}) AS day, COUNT(*)::int AS count
       FROM ${table}
       WHERE ${column} >= $1
       GROUP BY DATE(${column})
       ORDER BY day ASC`, since);
        const map = new Map();
        for (const row of rows) {
            const key = this.toDayKey(new Date(row.day));
            map.set(key, Number(row.count));
        }
        return map;
    }
    dayLabels(since) {
        const labels = [];
        const cursor = new Date(since);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        while (cursor <= today) {
            labels.push(this.toDayKey(cursor));
            cursor.setDate(cursor.getDate() + 1);
        }
        return labels;
    }
    fillSeries(labels, map) {
        return labels.map((label) => map.get(label) ?? 0);
    }
    toDayKey(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
};
exports.AdminDashboardService = AdminDashboardService;
exports.AdminDashboardService = AdminDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminDashboardService);
//# sourceMappingURL=admin-dashboard.service.js.map