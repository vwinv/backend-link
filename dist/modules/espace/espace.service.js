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
exports.EspaceService = void 0;
const entitlements_service_1 = require("../subscriptions/entitlements.service");
const invoices_service_1 = require("../subscriptions/invoices.service");
const subscriptions_service_1 = require("../subscriptions/subscriptions.service");
const teams_service_1 = require("../teams/teams.service");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const subscription_validity_1 = require("../subscriptions/subscription-validity");
let EspaceService = class EspaceService {
    prisma;
    teamsService;
    entitlementsService;
    invoicesService;
    subscriptionsService;
    configService;
    constructor(prisma, teamsService, entitlementsService, invoicesService, subscriptionsService, configService) {
        this.prisma = prisma;
        this.teamsService = teamsService;
        this.entitlementsService = entitlementsService;
        this.invoicesService = invoicesService;
        this.subscriptionsService = subscriptionsService;
        this.configService = configService;
    }
    async resolveManagedTeam(userId, slug) {
        const team = await this.prisma.team.findFirst({
            where: { slug, isActive: true },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                logoUrl: true,
                brandColor: true,
                ownerId: true,
                createdAt: true,
            },
        });
        if (!team) {
            throw new common_1.NotFoundException('Espace équipe introuvable');
        }
        const membership = await this.prisma.teamMember.findUnique({
            where: {
                teamId_userId: { teamId: team.id, userId },
            },
            select: { role: true },
        });
        const isOwner = team.ownerId === userId;
        const role = isOwner
            ? client_1.TeamMemberRole.OWNER
            : membership?.role ?? null;
        if (role !== client_1.TeamMemberRole.OWNER &&
            role !== client_1.TeamMemberRole.ADMIN) {
            throw new common_1.ForbiddenException('Accès réservé au propriétaire ou administrateur de l’équipe');
        }
        return { team, role };
    }
    async getDashboard(userId, slug) {
        const { team, role } = await this.resolveManagedTeam(userId, slug);
        const seats = await this.entitlementsService.getTeamSeatsQuota(team.ownerId, team.id);
        const subscription = await this.prisma.subscription.findFirst({
            where: (0, subscription_validity_1.validSubscriptionWhere)({
                OR: [{ teamId: team.id }, { userId: team.ownerId }],
            }),
            include: {
                offer: { select: { title: true, slug: true, audience: true } },
                offerPrice: {
                    select: {
                        billingType: true,
                        priceAmount: true,
                        pricePerSeat: true,
                        currency: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const members = await this.prisma.teamMember.findMany({
            where: { teamId: team.id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { joinedAt: 'asc' },
        });
        const memberStats = await Promise.all(members.map(async (member) => {
            const cards = await this.prisma.businessCard.findMany({
                where: {
                    teamId: team.id,
                    ownerId: member.userId,
                    isActive: true,
                },
                select: { id: true },
            });
            const cardIds = cards.map((c) => c.id);
            const [views, shares, saves] = cardIds.length
                ? await Promise.all([
                    this.prisma.cardView.count({
                        where: { cardId: { in: cardIds } },
                    }),
                    this.prisma.shareEvent.count({
                        where: { cardId: { in: cardIds } },
                    }),
                    this.prisma.cardSaveEvent.count({
                        where: { cardId: { in: cardIds } },
                    }),
                ])
                : [0, 0, 0];
            return {
                memberId: member.id,
                role: member.role,
                joinedAt: member.joinedAt.toISOString(),
                user: member.user,
                stats: {
                    cards: cardIds.length,
                    views,
                    shares,
                    saves,
                },
            };
        }));
        const totals = memberStats.reduce((acc, row) => {
            acc.views += row.stats.views;
            acc.shares += row.stats.shares;
            acc.saves += row.stats.saves;
            acc.cards += row.stats.cards;
            return acc;
        }, { views: 0, shares: 0, saves: 0, cards: 0 });
        const pendingInvites = await this.prisma.teamInvite.count({
            where: { teamId: team.id, status: 'PENDING' },
        });
        const invoicesCount = await this.prisma.paymentInvoice.count({
            where: {
                OR: [{ teamId: team.id }, { userId: team.ownerId, teamId: null }],
            },
        });
        return {
            team: {
                ...team,
                createdAt: team.createdAt.toISOString(),
            },
            myRole: role,
            seats,
            subscription: subscription
                ? {
                    id: subscription.id,
                    status: subscription.status,
                    billingPeriod: subscription.billingPeriod,
                    purchasedSeats: subscription.purchasedSeats,
                    currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
                    offer: subscription.offer,
                    offerPrice: subscription.offerPrice
                        ? {
                            billingType: subscription.offerPrice.billingType,
                            priceAmount: Number(subscription.offerPrice.priceAmount),
                            pricePerSeat: subscription.offerPrice.pricePerSeat
                                ? Number(subscription.offerPrice.pricePerSeat)
                                : null,
                            currency: subscription.offerPrice.currency,
                        }
                        : null,
                }
                : null,
            totals,
            pendingInvites,
            invoicesCount,
            members: memberStats,
            espacePath: `/espace_${team.slug}`,
        };
    }
    async getMembers(userId, slug) {
        const { team } = await this.resolveManagedTeam(userId, slug);
        const membersPayload = await this.teamsService.getMembers(userId, team.id);
        const subscription = await this.prisma.subscription.findFirst({
            where: (0, subscription_validity_1.validSubscriptionWhere)({
                OR: [{ teamId: team.id }, { userId: team.ownerId }],
            }),
            include: {
                offer: {
                    select: {
                        title: true,
                        slug: true,
                        minSeats: true,
                        maxTeamMembers: true,
                    },
                },
                offerPrice: {
                    select: {
                        billingType: true,
                        pricePerSeat: true,
                        priceAmount: true,
                        currency: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const pricePerSeat = subscription?.offerPrice?.pricePerSeat
            ? Number(subscription.offerPrice.pricePerSeat)
            : null;
        const minSeats = subscription?.offer?.minSeats ?? 1;
        const purchasedSeats = subscription?.purchasedSeats ??
            (membersPayload.seats.max > 0
                ? membersPayload.seats.max
                : membersPayload.seats.used);
        return {
            ...membersPayload,
            team: {
                id: team.id,
                name: team.name,
                slug: team.slug,
            },
            seatPurchase: subscription
                ? {
                    subscriptionId: subscription.id,
                    offerTitle: subscription.offer?.title ?? null,
                    offerSlug: subscription.offer?.slug ?? null,
                    billingType: subscription.offerPrice?.billingType ?? null,
                    currency: subscription.offerPrice?.currency ?? 'FCFA',
                    pricePerSeat,
                    minSeats,
                    purchasedSeats,
                    maxSeats: subscription.offer?.maxTeamMembers ?? -1,
                    canPurchaseSeats: Boolean(pricePerSeat && pricePerSeat > 0),
                }
                : null,
        };
    }
    async checkoutAdditionalSeats(userId, slug, additionalSeats) {
        const { team } = await this.resolveManagedTeam(userId, slug);
        const landing = (this.configService.get('landingPublicUrl') ??
            'http://localhost:3001').replace(/\/$/, '');
        const returnUrl = `${landing}/espace_${team.slug}/membres?seatUpgrade=1`;
        return this.subscriptionsService.createSeatUpgradeCheckout(userId, {
            teamId: team.id,
            additionalSeats,
            returnUrl,
        });
    }
    async confirmAdditionalSeats(userId, slug, invoiceToken) {
        await this.resolveManagedTeam(userId, slug);
        return this.subscriptionsService.confirmSeatUpgrade(userId, invoiceToken);
    }
    async payInvoice(userId, slug, invoiceId) {
        const { team } = await this.resolveManagedTeam(userId, slug);
        const landing = (this.configService.get('landingPublicUrl') ??
            'http://localhost:3001').replace(/\/$/, '');
        const returnUrl = `${landing}/espace_${team.slug}/factures?invoicePay=1`;
        return this.subscriptionsService.createPendingInvoiceCheckout(userId, {
            paymentInvoiceId: invoiceId,
            teamId: team.id,
            returnUrl,
        });
    }
    async confirmInvoicePayment(userId, slug, invoiceToken) {
        await this.resolveManagedTeam(userId, slug);
        return this.subscriptionsService.confirmPendingInvoicePayment(userId, invoiceToken);
    }
    async addMember(userId, slug, dto) {
        const { team } = await this.resolveManagedTeam(userId, slug);
        return this.teamsService.addMember(userId, team.id, dto);
    }
    async cancelInvitation(userId, slug, inviteId) {
        const { team } = await this.resolveManagedTeam(userId, slug);
        return this.teamsService.cancelInvitation(userId, team.id, inviteId);
    }
    async removeMember(userId, slug, memberId) {
        const { team } = await this.resolveManagedTeam(userId, slug);
        return this.teamsService.removeMember(userId, team.id, memberId);
    }
    async getMemberAnalytics(userId, slug, memberId, days = 30) {
        const { team } = await this.resolveManagedTeam(userId, slug);
        const member = await this.prisma.teamMember.findFirst({
            where: { id: memberId, teamId: team.id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        if (!member) {
            throw new common_1.NotFoundException('Membre introuvable');
        }
        const cards = await this.prisma.businessCard.findMany({
            where: {
                teamId: team.id,
                ownerId: member.userId,
                isActive: true,
            },
            select: {
                id: true,
                slug: true,
                firstName: true,
                lastName: true,
                jobTitle: true,
                avatarUrl: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        const cardIds = cards.map((card) => card.id);
        const analytics = await this.aggregateCardsAnalytics(cardIds, days);
        return {
            member: {
                memberId: member.id,
                role: member.role,
                joinedAt: member.joinedAt.toISOString(),
                user: member.user,
            },
            cards: cards.map((card) => ({
                id: card.id,
                slug: card.slug,
                name: `${card.firstName} ${card.lastName}`.trim(),
                jobTitle: card.jobTitle,
                avatarUrl: card.avatarUrl,
            })),
            analytics,
        };
    }
    async aggregateCardsAnalytics(cardIds, daysInput) {
        const periodDays = Math.min(Math.max(daysInput || 30, 1), 90);
        const periodEndExclusive = new Date();
        periodEndExclusive.setHours(0, 0, 0, 0);
        periodEndExclusive.setDate(periodEndExclusive.getDate() + 1);
        const periodStart = new Date(periodEndExclusive);
        periodStart.setDate(periodStart.getDate() - periodDays);
        const previousStart = new Date(periodStart);
        previousStart.setDate(previousStart.getDate() - periodDays);
        if (cardIds.length === 0) {
            const emptySeries = Array.from({ length: periodDays }, (_, index) => {
                const day = new Date(periodStart);
                day.setDate(periodStart.getDate() + index);
                return {
                    date: this.toDayKey(day),
                    label: periodDays <= 7
                        ? this.toWeekdayLabel(day)
                        : this.toShortDateLabel(day),
                    count: 0,
                };
            });
            return {
                views: 0,
                shares: 0,
                saved: 0,
                uniqueVisitors: 0,
                periodDays,
                periodViews: 0,
                previousPeriodViews: 0,
                viewsChangePercent: 0,
                viewsSeries: emptySeries,
                sources: [{ key: 'link', count: 0, percent: 0 }],
                sparklines: {
                    views: emptySeries.map(() => 0),
                    uniqueVisitors: emptySeries.map(() => 0),
                    saved: emptySeries.map(() => 0),
                    shares: emptySeries.map(() => 0),
                },
            };
        }
        const countedShareMethods = [
            client_1.ShareMethod.LINK,
            client_1.ShareMethod.EMAIL,
            client_1.ShareMethod.WHATSAPP,
            client_1.ShareMethod.AIRDROP,
        ];
        const [views, shares, contactsSaved, publicSaves, uniqueGroups, guestViews, periodViews, previousPeriodViews, viewsInPeriod, sourcesRaw,] = await Promise.all([
            this.prisma.cardView.count({ where: { cardId: { in: cardIds } } }),
            this.prisma.shareEvent.count({
                where: {
                    cardId: { in: cardIds },
                    method: { in: countedShareMethods },
                },
            }),
            this.prisma.contact.count({
                where: {
                    linkedCardId: { in: cardIds },
                    source: client_1.ContactSource.EXCHANGE,
                },
            }),
            this.prisma.cardSaveEvent.count({
                where: { cardId: { in: cardIds } },
            }),
            this.prisma.cardView.groupBy({
                by: ['viewerUserId'],
                where: {
                    cardId: { in: cardIds },
                    viewerUserId: { not: null },
                },
            }),
            this.prisma.cardView.count({
                where: { cardId: { in: cardIds }, viewerUserId: null },
            }),
            this.prisma.cardView.count({
                where: {
                    cardId: { in: cardIds },
                    viewedAt: { gte: periodStart, lt: periodEndExclusive },
                },
            }),
            this.prisma.cardView.count({
                where: {
                    cardId: { in: cardIds },
                    viewedAt: { gte: previousStart, lt: periodStart },
                },
            }),
            this.prisma.cardView.findMany({
                where: {
                    cardId: { in: cardIds },
                    viewedAt: { gte: periodStart, lt: periodEndExclusive },
                },
                select: { viewedAt: true },
                orderBy: { viewedAt: 'asc' },
            }),
            this.prisma.cardView.groupBy({
                by: ['source'],
                where: { cardId: { in: cardIds } },
                _count: { _all: true },
            }),
        ]);
        const uniqueVisitors = uniqueGroups.length + guestViews;
        const saved = contactsSaved + publicSaves;
        let viewsChangePercent = 0;
        if (previousPeriodViews > 0) {
            viewsChangePercent = Math.round(((periodViews - previousPeriodViews) / previousPeriodViews) * 100);
        }
        else if (periodViews > 0) {
            viewsChangePercent = 100;
        }
        const dayKeys = Array.from({ length: periodDays }, (_, index) => {
            const day = new Date(periodStart);
            day.setDate(periodStart.getDate() + index);
            return day;
        });
        const countsByDay = new Map();
        for (const day of dayKeys) {
            countsByDay.set(this.toDayKey(day), 0);
        }
        for (const view of viewsInPeriod) {
            const key = this.toDayKey(view.viewedAt);
            countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
        }
        const viewsSeries = dayKeys.map((day) => {
            const key = this.toDayKey(day);
            return {
                date: key,
                label: periodDays <= 7
                    ? this.toWeekdayLabel(day)
                    : this.toShortDateLabel(day),
                count: countsByDay.get(key) ?? 0,
            };
        });
        const sourceTotals = new Map();
        let sourcesCounted = 0;
        for (const row of sourcesRaw) {
            const key = this.normalizeAnalyticsSource(row.source);
            const count = row._count._all;
            sourceTotals.set(key, (sourceTotals.get(key) ?? 0) + count);
            sourcesCounted += count;
        }
        if (sourcesCounted === 0 && views > 0) {
            sourceTotals.set('link', views);
            sourcesCounted = views;
        }
        const sourceOrder = ['qr', 'share', 'link', 'nfc', 'app', 'other'];
        const sources = sourceOrder
            .map((key) => {
            const count = sourceTotals.get(key) ?? 0;
            return {
                key,
                count,
                percent: sourcesCounted > 0
                    ? Math.round((count / sourcesCounted) * 100)
                    : 0,
            };
        })
            .filter((item) => item.count > 0 || item.key === 'link');
        const sparkline = viewsSeries.map((point) => point.count);
        return {
            views,
            shares,
            saved,
            uniqueVisitors,
            periodDays,
            periodViews,
            previousPeriodViews,
            viewsChangePercent,
            viewsSeries,
            sources,
            sparklines: {
                views: sparkline,
                uniqueVisitors: sparkline.map((v) => Math.max(0, Math.round(v * 0.4))),
                saved: sparkline.map((v) => Math.max(0, Math.round(v * 0.2))),
                shares: sparkline.map((v) => Math.max(0, Math.round(v * 0.15))),
            },
        };
    }
    toDayKey(date) {
        const local = new Date(date);
        const year = local.getFullYear();
        const month = `${local.getMonth() + 1}`.padStart(2, '0');
        const day = `${local.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    toWeekdayLabel(date) {
        const labels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        return labels[date.getDay()] ?? '';
    }
    toShortDateLabel(date) {
        const day = `${date.getDate()}`.padStart(2, '0');
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        return `${day}/${month}`;
    }
    normalizeAnalyticsSource(source) {
        const value = source?.trim().toLowerCase();
        if (!value)
            return 'link';
        if (['qr', 'nfc', 'share', 'link', 'app'].includes(value))
            return value;
        return 'other';
    }
    async getInvoices(userId, slug) {
        const { team } = await this.resolveManagedTeam(userId, slug);
        await this.invoicesService.ensureUpcomingForOwner(team.ownerId, team.id);
        const teamOffers = await this.prisma.premiumOffer.findMany({
            where: { audience: client_1.OfferAudience.TEAM },
            select: { slug: true },
        });
        const teamOfferSlugs = teamOffers.map((offer) => offer.slug);
        const invoices = await this.prisma.paymentInvoice.findMany({
            where: {
                OR: [
                    { teamId: team.id },
                    ...(teamOfferSlugs.length
                        ? [
                            {
                                userId: team.ownerId,
                                teamId: null,
                                offerSlug: { in: teamOfferSlugs },
                            },
                        ]
                        : []),
                ],
            },
            orderBy: [{ dueAt: 'asc' }, { createdAt: 'desc' }],
            take: 100,
        });
        const owner = await this.prisma.user.findUnique({
            where: { id: team.ownerId },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
            },
        });
        const mapped = invoices.map((invoice) => ({
            id: invoice.id,
            number: invoice.number,
            amount: Number(invoice.amount),
            currency: invoice.currency,
            status: invoice.status,
            description: invoice.description,
            offerSlug: invoice.offerSlug,
            billingType: invoice.billingType,
            seats: invoice.seats,
            provider: invoice.provider,
            lines: Array.isArray(invoice.lines) ? invoice.lines : [],
            dueAt: invoice.dueAt?.toISOString() ?? null,
            paidAt: invoice.paidAt?.toISOString() ?? null,
            createdAt: invoice.createdAt.toISOString(),
            canPay: invoice.status === 'PENDING',
        }));
        return {
            party: {
                team: {
                    id: team.id,
                    name: team.name,
                    slug: team.slug,
                    logoUrl: team.logoUrl,
                },
                client: owner
                    ? {
                        name: `${owner.firstName} ${owner.lastName}`.trim() || owner.email,
                        email: owner.email,
                        phone: owner.phone,
                    }
                    : null,
                issuer: {
                    name: 'DropOne',
                    legalName: 'Drop One',
                    email: 'billing@dropone.pro',
                    website: 'https://dropone.pro',
                },
            },
            upcoming: mapped.filter((invoice) => invoice.status === 'PENDING'),
            items: mapped.filter((invoice) => invoice.status !== 'PENDING'),
        };
    }
    async listMyEspaces(userId) {
        const teams = await this.prisma.team.findMany({
            where: {
                isActive: true,
                OR: [
                    { ownerId: userId },
                    {
                        members: {
                            some: {
                                userId,
                                role: { in: [client_1.TeamMemberRole.OWNER, client_1.TeamMemberRole.ADMIN] },
                            },
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                brandColor: true,
            },
            orderBy: { name: 'asc' },
        });
        return teams.map((team) => ({
            ...team,
            espacePath: `/espace_${team.slug}`,
        }));
    }
};
exports.EspaceService = EspaceService;
exports.EspaceService = EspaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        teams_service_1.TeamsService,
        entitlements_service_1.EntitlementsService,
        invoices_service_1.InvoicesService,
        subscriptions_service_1.SubscriptionsService,
        config_1.ConfigService])
], EspaceService);
//# sourceMappingURL=espace.service.js.map