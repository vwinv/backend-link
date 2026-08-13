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
exports.AdminSubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminSubscriptionsService = class AdminSubscriptionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const now = new Date();
        const last30Days = new Date(now);
        last30Days.setDate(last30Days.getDate() - 29);
        last30Days.setHours(0, 0, 0, 0);
        const [total, active, trial, cancelled, expired, pastDue, monthly, yearly, newLast30Days, revenue, byOffer,] = await Promise.all([
            this.prisma.subscription.count(),
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
            this.prisma.subscription.count({
                where: {
                    billingPeriod: client_1.BillingPeriod.MONTHLY,
                    status: {
                        in: [
                            client_1.SubscriptionStatus.ACTIVE,
                            client_1.SubscriptionStatus.TRIAL,
                            client_1.SubscriptionStatus.PAST_DUE,
                        ],
                    },
                },
            }),
            this.prisma.subscription.count({
                where: {
                    billingPeriod: client_1.BillingPeriod.YEARLY,
                    status: {
                        in: [
                            client_1.SubscriptionStatus.ACTIVE,
                            client_1.SubscriptionStatus.TRIAL,
                            client_1.SubscriptionStatus.PAST_DUE,
                        ],
                    },
                },
            }),
            this.prisma.subscription.count({
                where: { createdAt: { gte: last30Days } },
            }),
            this.buildRevenueTotals(),
            this.buildOfferBreakdown(),
        ]);
        return {
            generatedAt: now.toISOString(),
            totals: {
                total,
                active,
                trial,
                cancelled,
                expired,
                pastDue,
                paying: active + pastDue,
                newLast30Days,
            },
            billing: {
                monthly,
                yearly,
            },
            revenue,
            byOffer,
            byStatus: [
                { status: 'ACTIVE', label: 'Actifs', count: active },
                { status: 'TRIAL', label: 'Essai', count: trial },
                { status: 'PAST_DUE', label: 'Impayés', count: pastDue },
                { status: 'CANCELLED', label: 'Annulés', count: cancelled },
                { status: 'EXPIRED', label: 'Expirés', count: expired },
            ],
        };
    }
    async list(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status) {
            where.status = query.status;
        }
        if (query.offerId?.trim()) {
            where.offerId = query.offerId.trim();
        }
        const search = query.search?.trim();
        if (search) {
            where.OR = [
                {
                    user: {
                        OR: [
                            { email: { contains: search, mode: 'insensitive' } },
                            { firstName: { contains: search, mode: 'insensitive' } },
                            { lastName: { contains: search, mode: 'insensitive' } },
                        ],
                    },
                },
                {
                    team: {
                        name: { contains: search, mode: 'insensitive' },
                    },
                },
                {
                    offer: {
                        title: { contains: search, mode: 'insensitive' },
                    },
                },
            ];
        }
        const [total, rows] = await Promise.all([
            this.prisma.subscription.count({ where }),
            this.prisma.subscription.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    status: true,
                    billingPeriod: true,
                    currentPeriodEnd: true,
                    cancelledAt: true,
                    createdAt: true,
                    updatedAt: true,
                    stripeSubscriptionId: true,
                    paydunyaInvoiceToken: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            avatarUrl: true,
                        },
                    },
                    team: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                    offer: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            audience: true,
                        },
                    },
                    offerPrice: {
                        select: {
                            id: true,
                            billingType: true,
                            priceAmount: true,
                            currency: true,
                            priceLabel: true,
                        },
                    },
                    plan: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            }),
        ]);
        return {
            data: rows.map((row) => ({
                id: row.id,
                status: row.status,
                billingPeriod: row.billingPeriod,
                currentPeriodEnd: row.currentPeriodEnd,
                cancelledAt: row.cancelledAt,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
                paymentProvider: row.stripeSubscriptionId
                    ? 'stripe'
                    : row.paydunyaInvoiceToken
                        ? 'paydunya'
                        : null,
                user: row.user
                    ? {
                        id: row.user.id,
                        email: row.user.email,
                        firstName: row.user.firstName,
                        lastName: row.user.lastName,
                        avatarUrl: row.user.avatarUrl,
                        fullName: `${row.user.firstName} ${row.user.lastName}`.trim() ||
                            row.user.email,
                    }
                    : null,
                team: row.team,
                offer: row.offer,
                plan: row.plan,
                price: row.offerPrice
                    ? {
                        id: row.offerPrice.id,
                        billingType: row.offerPrice.billingType,
                        amount: Number(row.offerPrice.priceAmount),
                        currency: row.offerPrice.currency,
                        label: row.offerPrice.priceLabel,
                    }
                    : null,
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }
    async listOffers() {
        return this.prisma.premiumOffer.findMany({
            where: { isActive: true, listedInApp: true },
            orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
            select: {
                id: true,
                title: true,
                slug: true,
                audience: true,
            },
        });
    }
    async buildRevenueTotals() {
        const rows = await this.prisma.$queryRawUnsafe(`SELECT
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
         AND s."offerPriceId" IS NOT NULL`);
        const totals = rows[0];
        const toAmount = (value) => Math.round(Number(value ?? 0));
        return {
            currency: totals?.currency?.trim() || 'FCFA',
            total: toAmount(totals?.total),
            active: toAmount(totals?.active),
        };
    }
    async buildOfferBreakdown() {
        const rows = await this.prisma.$queryRawUnsafe(`SELECT
         o.id,
         o.title,
         o.slug,
         COUNT(s.id)::int AS subscriptions_count,
         COUNT(*) FILTER (
           WHERE s.status IN ('ACTIVE', 'TRIAL', 'PAST_DUE')
         )::int AS active_count,
         COALESCE(
           SUM(
             CASE
               WHEN s.status <> 'TRIAL' AND s."offerPriceId" IS NOT NULL
               THEN p."priceAmount"
               ELSE 0
             END
           ),
           0
         ) AS revenue
       FROM premium_offers o
       LEFT JOIN subscriptions s ON s."offerId" = o.id
       LEFT JOIN premium_offer_prices p ON p.id = s."offerPriceId"
       GROUP BY o.id, o.title, o.slug
       ORDER BY subscriptions_count DESC, o.title ASC`);
        return rows.map((row) => ({
            offerId: row.id,
            title: row.title,
            slug: row.slug,
            subscriptionsCount: Number(row.subscriptions_count),
            activeCount: Number(row.active_count),
            revenue: Math.round(Number(row.revenue ?? 0)),
        }));
    }
};
exports.AdminSubscriptionsService = AdminSubscriptionsService;
exports.AdminSubscriptionsService = AdminSubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminSubscriptionsService);
//# sourceMappingURL=admin-subscriptions.service.js.map