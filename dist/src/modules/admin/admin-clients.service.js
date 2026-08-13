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
exports.AdminClientsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const PREMIUM_STATUSES = [
    client_1.SubscriptionStatus.TRIAL,
    client_1.SubscriptionStatus.ACTIVE,
    client_1.SubscriptionStatus.PAST_DUE,
];
let AdminClientsService = class AdminClientsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = {
            role: client_1.UserRole.USER,
            adminRoleId: null,
        };
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        const search = query.search?.trim();
        if (search) {
            where.AND = [
                {
                    OR: [
                        { email: { contains: search, mode: 'insensitive' } },
                        { firstName: { contains: search, mode: 'insensitive' } },
                        { lastName: { contains: search, mode: 'insensitive' } },
                        { phone: { contains: search, mode: 'insensitive' } },
                    ],
                },
            ];
        }
        if (query.isPremium === true) {
            where.subscriptions = {
                some: {
                    status: { in: PREMIUM_STATUSES },
                    offerId: { not: null },
                },
            };
        }
        else if (query.isPremium === false) {
            where.subscriptions = {
                none: {
                    status: { in: PREMIUM_STATUSES },
                    offerId: { not: null },
                },
            };
        }
        const [total, users] = await Promise.all([
            this.prisma.user.count({ where }),
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: this.listSelect(),
            }),
        ]);
        return {
            data: users.map((user) => this.toListItem(user)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }
    async findOne(id) {
        const user = await this.prisma.user.findFirst({
            where: {
                id,
                role: client_1.UserRole.USER,
                adminRoleId: null,
            },
            select: {
                ...this.listSelect(),
                stripeCustomerId: true,
                businessCards: {
                    where: { isActive: true },
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                    select: {
                        id: true,
                        slug: true,
                        kind: true,
                        firstName: true,
                        lastName: true,
                        jobTitle: true,
                        company: true,
                        isPublic: true,
                        isActive: true,
                        createdAt: true,
                    },
                },
                subscriptions: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    select: {
                        id: true,
                        status: true,
                        billingPeriod: true,
                        currentPeriodEnd: true,
                        createdAt: true,
                        offer: {
                            select: { id: true, title: true, slug: true, audience: true },
                        },
                        plan: { select: { id: true, name: true, slug: true } },
                    },
                },
                teamMemberships: {
                    take: 20,
                    select: {
                        role: true,
                        team: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                isActive: true,
                            },
                        },
                    },
                },
                ownedTeams: {
                    take: 20,
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        isActive: true,
                        _count: { select: { members: true } },
                    },
                },
                _count: {
                    select: {
                        businessCards: true,
                        teamMemberships: true,
                        ownedTeams: true,
                        contacts: true,
                        shareEvents: true,
                        cardViews: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Client introuvable');
        }
        const listItem = this.toListItem(user);
        return {
            ...listItem,
            stripeCustomerId: user.stripeCustomerId,
            cards: user.businessCards,
            subscriptions: user.subscriptions.map((sub) => ({
                id: sub.id,
                status: sub.status,
                billingPeriod: sub.billingPeriod,
                currentPeriodEnd: sub.currentPeriodEnd,
                createdAt: sub.createdAt,
                offer: sub.offer,
                plan: sub.plan,
            })),
            teams: user.teamMemberships.map((m) => ({
                role: m.role,
                ...m.team,
            })),
            ownedTeams: user.ownedTeams.map((team) => ({
                id: team.id,
                name: team.name,
                slug: team.slug,
                isActive: team.isActive,
                membersCount: team._count.members,
            })),
            stats: {
                cardsCount: user._count.businessCards,
                teamsCount: user._count.teamMemberships,
                ownedTeamsCount: user._count.ownedTeams,
                contactsCount: user._count.contacts,
                sharesCount: user._count.shareEvents,
                viewsCount: user._count.cardViews,
            },
        };
    }
    async update(id, dto) {
        if (dto.isActive === undefined &&
            dto.firstName === undefined &&
            dto.lastName === undefined &&
            dto.phone === undefined) {
            throw new common_1.BadRequestException('Aucune modification fournie');
        }
        const existing = await this.prisma.user.findFirst({
            where: { id, role: client_1.UserRole.USER, adminRoleId: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Client introuvable');
        }
        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
                ...(dto.firstName !== undefined && {
                    firstName: dto.firstName.trim(),
                }),
                ...(dto.lastName !== undefined && { lastName: dto.lastName.trim() }),
                ...(dto.phone !== undefined && {
                    phone: dto.phone?.trim() || null,
                }),
            },
            select: this.listSelect(),
        });
        return this.toListItem(updated);
    }
    listSelect() {
        return {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatarUrl: true,
            isActive: true,
            authProvider: true,
            createdAt: true,
            updatedAt: true,
            subscriptions: {
                where: {
                    status: { in: PREMIUM_STATUSES },
                    offerId: { not: null },
                },
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: {
                    id: true,
                    status: true,
                    billingPeriod: true,
                    currentPeriodEnd: true,
                    offer: {
                        select: { title: true, slug: true, audience: true },
                    },
                },
            },
            _count: {
                select: {
                    businessCards: true,
                    teamMemberships: true,
                    ownedTeams: true,
                },
            },
        };
    }
    toListItem(user) {
        const activeSub = user.subscriptions[0] ?? null;
        const isPremium = !!activeSub?.offer;
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            isActive: user.isActive,
            authProvider: user.authProvider,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isPremium,
            subscription: activeSub
                ? {
                    id: activeSub.id,
                    status: activeSub.status,
                    billingPeriod: activeSub.billingPeriod,
                    currentPeriodEnd: activeSub.currentPeriodEnd,
                    offerTitle: activeSub.offer?.title ?? null,
                    offerSlug: activeSub.offer?.slug ?? null,
                    audience: activeSub.offer?.audience ?? null,
                }
                : null,
            cardsCount: user._count.businessCards,
            teamsCount: user._count.teamMemberships,
            ownedTeamsCount: user._count.ownedTeams,
        };
    }
};
exports.AdminClientsService = AdminClientsService;
exports.AdminClientsService = AdminClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminClientsService);
//# sourceMappingURL=admin-clients.service.js.map