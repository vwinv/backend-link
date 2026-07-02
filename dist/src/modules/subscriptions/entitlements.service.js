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
        const hasTeamPlan = entitlements.audience === client_1.OfferAudience.TEAM && max > 0;
        return {
            used,
            max,
            canAddMember: hasTeamPlan && used < max,
        };
    }
    async assertCanAddTeamMember(userId, teamId) {
        await this.assertOwner(userId, teamId);
        const seats = await this.getTeamSeatsQuota(userId, teamId);
        if (!seats.canAddMember) {
            if (seats.max <= 0) {
                throw new common_1.ForbiddenException('Un abonnement équipe actif est requis pour ajouter des membres');
            }
            throw new common_1.BadRequestException(`Limite de ${seats.max} sièges atteinte. Passez à une offre supérieure pour en ajouter.`);
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
    async assertOwner(userId, teamId) {
        const team = await this.prisma.team.findFirst({
            where: { id: teamId, ownerId: userId, isActive: true },
        });
        if (!team) {
            throw new common_1.ForbiddenException('Action réservée au propriétaire de l’équipe');
        }
    }
};
exports.EntitlementsService = EntitlementsService;
exports.EntitlementsService = EntitlementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EntitlementsService);
//# sourceMappingURL=entitlements.service.js.map