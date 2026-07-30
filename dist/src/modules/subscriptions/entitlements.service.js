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
exports.EntitlementsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const entitlements_types_1 = require("./entitlements.types");
let EntitlementsService = class EntitlementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserEntitlements(userId) {
        const subscription = await this.findActiveSubscription(userId);
        if (!subscription?.offer) {
            return entitlements_types_1.DEFAULT_ENTITLEMENTS;
        }
        return this.mapOfferToEntitlements(subscription.offer);
    }
    async getEntitlementsForCard(userId, cardId) {
        const card = await this.prisma.businessCard.findFirst({
            where: { id: cardId, ownerId: userId, isActive: true },
            select: { kind: true, teamId: true },
        });
        if (!card) {
            throw new common_1.NotFoundException('Carte introuvable');
        }
        if (card.kind === client_1.CardKind.MEMBER && card.teamId) {
            const team = await this.prisma.team.findFirst({
                where: { id: card.teamId, isActive: true },
                select: { ownerId: true },
            });
            if (team) {
                return this.getUserEntitlements(team.ownerId);
            }
        }
        return this.getUserEntitlements(userId);
    }
    async assertCanCustomize(userId, cardId) {
        const entitlements = await this.getEntitlementsForCard(userId, cardId);
        if (!entitlements.canCustomize) {
            throw new common_1.ForbiddenException('Les designs professionnels nécessitent une offre Premium');
        }
    }
    async assertCanUseWallet(userId, cardId) {
        const entitlements = await this.getEntitlementsForCard(userId, cardId);
        if (!entitlements.hasWallet) {
            throw new common_1.ForbiddenException('L’ajout au Wallet nécessite une offre Premium');
        }
    }
    async assertHasAnalytics(userId, cardId) {
        const entitlements = await this.getEntitlementsForCard(userId, cardId);
        if (!entitlements.hasAnalytics) {
            throw new common_1.ForbiddenException('Les statistiques de consultation nécessitent une offre Premium');
        }
    }
    async assertHasVisitorInsights(userId, cardId) {
        const entitlements = await this.getEntitlementsForCard(userId, cardId);
        if (!entitlements.hasVisitorInsights) {
            throw new common_1.ForbiddenException('L’historique des visiteurs nécessite Premium Plus');
        }
    }
    async assertCanEditSocialLinks(userId, cardId) {
        const entitlements = await this.getEntitlementsForCard(userId, cardId);
        if (!entitlements.hasSocialLinks) {
            throw new common_1.ForbiddenException('Les réseaux sociaux nécessitent une offre Premium');
        }
    }
    async assertHasPortfolio(userId) {
        const entitlements = await this.getUserEntitlements(userId);
        if (!entitlements.hasPortfolio) {
            throw new common_1.ForbiddenException('Le portfolio nécessite une offre Premium');
        }
    }
    async assertHasTeamAccess(userId) {
        const entitlements = await this.getUserEntitlements(userId);
        if (!this.hasTeamAccess(entitlements)) {
            throw new common_1.ForbiddenException('Un abonnement équipe actif est requis pour créer une équipe');
        }
    }
    async getTeamSeatsQuota(userId, teamId) {
        await this.assertTeamAccess(userId, teamId);
        const team = await this.prisma.team.findFirst({
            where: { id: teamId, isActive: true },
            select: { ownerId: true },
        });
        if (!team) {
            throw new common_1.BadRequestException('Équipe introuvable');
        }
        const entitlements = await this.getUserEntitlements(team.ownerId);
        const memberCount = await this.prisma.teamMember.count({
            where: { teamId },
        });
        const pendingInviteCount = await this.prisma.teamInvite.count({
            where: {
                teamId,
                status: client_1.TeamInviteStatus.PENDING,
            },
        });
        const used = memberCount + pendingInviteCount;
        const max = entitlements.maxTeamMembers;
        const hasTeamPlan = this.hasTeamAccess(entitlements);
        const isUnlimited = max < 0;
        return {
            used,
            max,
            canAddMember: hasTeamPlan && (isUnlimited || used < max),
        };
    }
    async assertCanAddTeamMember(userId, teamId) {
        await this.assertOwnerOrAdmin(userId, teamId);
        const seats = await this.getTeamSeatsQuota(userId, teamId);
        if (!seats.canAddMember) {
            if (seats.max === 0) {
                throw new common_1.ForbiddenException('Un abonnement équipe actif est requis pour ajouter des membres');
            }
            throw new common_1.BadRequestException(seats.max < 0
                ? 'Impossible d’ajouter un membre pour le moment'
                : `Limite de ${seats.max} sièges atteinte. Passez à une offre supérieure pour en ajouter.`);
        }
    }
    async getAiScanQuota(userId) {
        const subscription = await this.findActiveSubscription(userId);
        const entitlements = subscription?.offer
            ? this.mapOfferToEntitlements(subscription.offer)
            : entitlements_types_1.DEFAULT_ENTITLEMENTS;
        const max = entitlements.maxAiScans;
        const isUnlimited = max < 0;
        if (max === 0) {
            return {
                used: 0,
                max,
                canScan: false,
                isUnlimited: false,
            };
        }
        const periodStart = this.getUsagePeriodStart(subscription);
        const used = await this.prisma.aiScanEvent.count({
            where: {
                userId,
                createdAt: { gte: periodStart },
            },
        });
        return {
            used,
            max,
            canScan: isUnlimited || used < max,
            isUnlimited,
        };
    }
    async recordAiScan(userId) {
        const quota = await this.getAiScanQuota(userId);
        if (!quota.canScan) {
            if (quota.max === 0) {
                throw new common_1.ForbiddenException('Le scan IA nécessite un abonnement actif');
            }
            throw new common_1.BadRequestException(quota.isUnlimited
                ? 'Scan IA indisponible pour le moment'
                : `Quota de ${quota.max} scans IA atteint pour cette période`);
        }
        const event = await this.prisma.aiScanEvent.create({
            data: { userId },
        });
        const updatedQuota = await this.getAiScanQuota(userId);
        return {
            scanId: event.id,
            quota: updatedQuota,
        };
    }
    hasTeamAccess(entitlements) {
        return (entitlements.audience === client_1.OfferAudience.TEAM &&
            entitlements.maxTeamMembers !== 0);
    }
    async findActiveSubscription(userId) {
        return this.prisma.subscription.findFirst({
            where: {
                userId,
                status: {
                    in: [
                        client_1.SubscriptionStatus.TRIAL,
                        client_1.SubscriptionStatus.ACTIVE,
                        client_1.SubscriptionStatus.PAST_DUE,
                    ],
                },
            },
            include: {
                offer: true,
                plan: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    mapOfferToEntitlements(offer) {
        return {
            audience: offer.audience,
            canCustomize: offer.canCustomize,
            maxTeamMembers: offer.maxTeamMembers,
            hasPortfolio: offer.hasPortfolio,
            hasWallet: offer.hasWallet ?? false,
            hasAnalytics: offer.hasAnalytics ?? false,
            hasVisitorInsights: offer.hasVisitorInsights ?? false,
            hasSocialLinks: offer.hasSocialLinks ?? false,
            maxAiScans: offer.maxAiScans,
        };
    }
    getUsagePeriodStart(subscription) {
        if (!subscription) {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), 1);
        }
        if (subscription.currentPeriodEnd) {
            const start = new Date(subscription.currentPeriodEnd);
            if (subscription.billingPeriod === client_1.BillingPeriod.YEARLY) {
                start.setFullYear(start.getFullYear() - 1);
            }
            else {
                start.setMonth(start.getMonth() - 1);
            }
            return start;
        }
        return subscription.createdAt;
    }
    async assertTeamAccess(userId, teamId) {
        const team = await this.prisma.team.findFirst({
            where: {
                id: teamId,
                isActive: true,
                OR: [
                    { ownerId: userId },
                    { members: { some: { userId } } },
                ],
            },
        });
        if (!team) {
            throw new common_1.ForbiddenException('Accès à l’équipe refusé');
        }
    }
    async assertOwnerOrAdmin(userId, teamId) {
        const team = await this.prisma.team.findFirst({
            where: { id: teamId, isActive: true },
            select: { id: true, ownerId: true },
        });
        if (!team) {
            throw new common_1.ForbiddenException('Équipe introuvable');
        }
        if (team.ownerId === userId) {
            return;
        }
        const membership = await this.prisma.teamMember.findUnique({
            where: {
                teamId_userId: { teamId, userId },
            },
            select: { role: true },
        });
        if (membership?.role !== client_1.TeamMemberRole.ADMIN &&
            membership?.role !== client_1.TeamMemberRole.OWNER) {
            throw new common_1.ForbiddenException('Action réservée aux administrateurs de l’équipe');
        }
    }
};
exports.EntitlementsService = EntitlementsService;
exports.EntitlementsService = EntitlementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EntitlementsService);
//# sourceMappingURL=entitlements.service.js.map