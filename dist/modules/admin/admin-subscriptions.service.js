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
    adminSelect = {
        id: true,
        status: true,
        billingPeriod: true,
        currentPeriodEnd: true,
        cancelledAt: true,
        purchasedSeats: true,
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
    };
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
                select: this.adminSelect,
            }),
        ]);
        return {
            data: rows.map((row) => this.serialize(row)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }
    async listOffers() {
        const offers = await this.prisma.premiumOffer.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
            select: {
                id: true,
                title: true,
                slug: true,
                audience: true,
                minSeats: true,
                listedInApp: true,
                prices: {
                    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
                    select: {
                        id: true,
                        billingType: true,
                        priceAmount: true,
                        pricePerSeat: true,
                        currency: true,
                        priceLabel: true,
                        isActive: true,
                    },
                },
            },
        });
        return offers.map((offer) => ({
            ...offer,
            prices: offer.prices.map((price) => ({
                id: price.id,
                billingType: price.billingType,
                amount: Number(price.priceAmount),
                pricePerSeat: price.pricePerSeat == null ? null : Number(price.pricePerSeat),
                currency: price.currency,
                label: price.priceLabel,
                isActive: price.isActive,
            })),
        }));
    }
    async create(dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
            select: { id: true, isActive: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('Client introuvable');
        }
        if (!user.isActive) {
            throw new common_1.BadRequestException('Ce compte client est désactivé');
        }
        const offer = await this.prisma.premiumOffer.findUnique({
            where: { id: dto.offerId },
            include: {
                prices: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
            },
        });
        if (!offer || !offer.isActive) {
            throw new common_1.BadRequestException('Offre introuvable ou inactive');
        }
        const price = (dto.offerPriceId
            ? offer.prices.find((item) => item.id === dto.offerPriceId)
            : offer.prices.find((item) => item.isActive) ?? offer.prices[0]) ??
            null;
        if (dto.offerPriceId && !price) {
            throw new common_1.BadRequestException('Tarif introuvable pour cette offre');
        }
        if (!price && offer.prices.length > 0) {
            throw new common_1.BadRequestException('Choisissez un tarif pour cette offre');
        }
        let teamId = dto.teamId?.trim() || null;
        if (offer.audience === client_1.OfferAudience.TEAM) {
            if (teamId) {
                const team = await this.prisma.team.findFirst({
                    where: { id: teamId, isActive: true },
                    select: { id: true },
                });
                if (!team) {
                    throw new common_1.BadRequestException('Équipe introuvable');
                }
            }
            else {
                const ownedTeam = await this.prisma.team.findFirst({
                    where: { ownerId: user.id, isActive: true },
                    select: { id: true },
                    orderBy: { createdAt: 'asc' },
                });
                teamId = ownedTeam?.id ?? null;
            }
        }
        else {
            teamId = null;
        }
        const minSeats = Math.max(1, offer.minSeats ?? 1);
        const purchasedSeats = offer.audience === client_1.OfferAudience.TEAM
            ? Math.max(minSeats, dto.purchasedSeats ?? minSeats)
            : null;
        const plan = await this.ensurePremiumPlan(offer.audience);
        const billingType = price?.billingType ?? client_1.OfferBillingType.MONTHLY;
        const billingPeriod = this.mapBillingPeriod(billingType);
        const currentPeriodEnd = dto.currentPeriodEnd
            ? new Date(dto.currentPeriodEnd)
            : this.computePeriodEnd(billingType);
        if (Number.isNaN(currentPeriodEnd.getTime())) {
            throw new common_1.BadRequestException('Date de fin invalide');
        }
        await this.prisma.subscription.updateMany({
            where: {
                userId: user.id,
                status: {
                    in: [
                        client_1.SubscriptionStatus.TRIAL,
                        client_1.SubscriptionStatus.ACTIVE,
                        client_1.SubscriptionStatus.PAST_DUE,
                    ],
                },
            },
            data: {
                status: client_1.SubscriptionStatus.CANCELLED,
                cancelledAt: new Date(),
            },
        });
        const created = await this.prisma.subscription.create({
            data: {
                userId: user.id,
                teamId,
                planId: plan.id,
                offerId: offer.id,
                offerPriceId: price?.id ?? null,
                purchasedSeats,
                status: dto.status ?? client_1.SubscriptionStatus.ACTIVE,
                billingPeriod,
                currentPeriodEnd,
            },
            select: this.adminSelect,
        });
        return this.serialize(created);
    }
    async findOne(id) {
        const row = await this.prisma.subscription.findUnique({
            where: { id },
            select: this.adminSelect,
        });
        if (!row) {
            throw new common_1.NotFoundException('Abonnement introuvable');
        }
        return this.serialize(row);
    }
    async update(id, dto) {
        const existing = await this.prisma.subscription.findUnique({
            where: { id },
            select: {
                id: true,
                userId: true,
                teamId: true,
                offerId: true,
                offerPriceId: true,
                status: true,
                billingPeriod: true,
                purchasedSeats: true,
                currentPeriodEnd: true,
                cancelledAt: true,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Abonnement introuvable');
        }
        if (!existing.userId) {
            throw new common_1.BadRequestException('Cet abonnement n’est lié à aucun client');
        }
        const offerId = dto.offerId?.trim() || existing.offerId;
        if (!offerId) {
            throw new common_1.BadRequestException('Offre requise');
        }
        const offer = await this.prisma.premiumOffer.findUnique({
            where: { id: offerId },
            include: {
                prices: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
            },
        });
        if (!offer) {
            throw new common_1.BadRequestException('Offre introuvable');
        }
        if (!offer.isActive &&
            dto.offerId &&
            dto.offerId !== existing.offerId) {
            throw new common_1.BadRequestException('Cette offre est inactive');
        }
        const requestedPriceId = dto.offerPriceId?.trim() || existing.offerPriceId;
        const price = offer.prices.find((item) => item.id === requestedPriceId) ??
            offer.prices.find((item) => item.isActive) ??
            offer.prices[0] ??
            null;
        if (dto.offerPriceId && !price) {
            throw new common_1.BadRequestException('Tarif introuvable pour cette offre');
        }
        let teamId = dto.teamId !== undefined ? dto.teamId.trim() || null : existing.teamId;
        if (offer.audience === client_1.OfferAudience.TEAM) {
            if (teamId) {
                const team = await this.prisma.team.findFirst({
                    where: { id: teamId, isActive: true },
                    select: { id: true },
                });
                if (!team) {
                    throw new common_1.BadRequestException('Équipe introuvable');
                }
            }
            else {
                const ownedTeam = await this.prisma.team.findFirst({
                    where: { ownerId: existing.userId, isActive: true },
                    select: { id: true },
                    orderBy: { createdAt: 'asc' },
                });
                teamId = ownedTeam?.id ?? null;
            }
        }
        else {
            teamId = null;
        }
        const minSeats = Math.max(1, offer.minSeats ?? 1);
        const purchasedSeats = offer.audience === client_1.OfferAudience.TEAM
            ? Math.max(minSeats, dto.purchasedSeats ?? existing.purchasedSeats ?? minSeats)
            : null;
        const plan = await this.ensurePremiumPlan(offer.audience);
        const billingPeriod = price
            ? this.mapBillingPeriod(price.billingType)
            : existing.billingPeriod;
        const currentPeriodEnd = dto.currentPeriodEnd !== undefined
            ? new Date(dto.currentPeriodEnd)
            : existing.currentPeriodEnd;
        if (currentPeriodEnd && Number.isNaN(currentPeriodEnd.getTime())) {
            throw new common_1.BadRequestException('Date de fin invalide');
        }
        const nextStatus = dto.status ?? existing.status;
        const becomingActive = [
            client_1.SubscriptionStatus.ACTIVE,
            client_1.SubscriptionStatus.TRIAL,
            client_1.SubscriptionStatus.PAST_DUE,
        ].includes(nextStatus);
        const cancelledAt = becomingActive
            ? null
            : nextStatus === client_1.SubscriptionStatus.CANCELLED ||
                nextStatus === client_1.SubscriptionStatus.EXPIRED
                ? existing.cancelledAt ?? new Date()
                : existing.cancelledAt;
        if (becomingActive) {
            await this.prisma.subscription.updateMany({
                where: {
                    userId: existing.userId,
                    id: { not: existing.id },
                    status: {
                        in: [
                            client_1.SubscriptionStatus.TRIAL,
                            client_1.SubscriptionStatus.ACTIVE,
                            client_1.SubscriptionStatus.PAST_DUE,
                        ],
                    },
                },
                data: {
                    status: client_1.SubscriptionStatus.CANCELLED,
                    cancelledAt: new Date(),
                },
            });
        }
        const updated = await this.prisma.subscription.update({
            where: { id: existing.id },
            data: {
                offerId: offer.id,
                offerPriceId: price?.id ?? null,
                planId: plan.id,
                teamId,
                purchasedSeats,
                status: nextStatus,
                billingPeriod,
                currentPeriodEnd,
                cancelledAt,
            },
            select: this.adminSelect,
        });
        return this.serialize(updated);
    }
    async remove(id) {
        const existing = await this.prisma.subscription.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Abonnement introuvable');
        }
        await this.prisma.subscription.delete({ where: { id } });
        return { deleted: true, id };
    }
    serialize(row) {
        return {
            id: row.id,
            status: row.status,
            billingPeriod: row.billingPeriod,
            currentPeriodEnd: row.currentPeriodEnd,
            cancelledAt: row.cancelledAt,
            purchasedSeats: row.purchasedSeats,
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
        };
    }
    async ensurePremiumPlan(audience) {
        const isTeam = audience === client_1.OfferAudience.TEAM;
        const slug = isTeam ? 'premium-team' : 'premium';
        const existing = await this.prisma.plan.findUnique({ where: { slug } });
        if (existing)
            return existing;
        return this.prisma.plan.create({
            data: {
                id: isTeam ? 'plan_premium_team' : 'plan_premium',
                name: isTeam ? 'DropOne Équipe' : 'DropOne Premium',
                slug,
                description: isTeam
                    ? 'Espace équipe et cartes professionnelles DropOne'
                    : 'Accès complet aux fonctionnalités Premium DropOne',
                priceMonthly: 0,
                priceYearly: 0,
                maxCards: isTeam ? 10 : 2,
                maxTeamMembers: isTeam ? 10 : 0,
                hasPortfolio: true,
                hasCustomDomain: false,
                hasAnalytics: true,
                features: ['pro_designs', 'wallet', 'analytics'],
                isActive: true,
            },
        });
    }
    mapBillingPeriod(billingType) {
        switch (billingType) {
            case client_1.OfferBillingType.YEARLY:
            case client_1.OfferBillingType.LIFETIME:
                return client_1.BillingPeriod.YEARLY;
            case client_1.OfferBillingType.MONTHLY:
            default:
                return client_1.BillingPeriod.MONTHLY;
        }
    }
    computePeriodEnd(billingType) {
        const end = new Date();
        switch (billingType) {
            case client_1.OfferBillingType.YEARLY:
                end.setFullYear(end.getFullYear() + 1);
                return end;
            case client_1.OfferBillingType.LIFETIME:
                end.setFullYear(end.getFullYear() + 100);
                return end;
            case client_1.OfferBillingType.MONTHLY:
            default:
                end.setMonth(end.getMonth() + 1);
                return end;
        }
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