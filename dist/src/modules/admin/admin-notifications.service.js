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
var AdminNotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminNotificationsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const fcm_push_service_1 = require("../notifications/fcm-push.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const PREMIUM_STATUSES = [
    client_1.SubscriptionStatus.TRIAL,
    client_1.SubscriptionStatus.ACTIVE,
    client_1.SubscriptionStatus.PAST_DUE,
];
let AdminNotificationsService = AdminNotificationsService_1 = class AdminNotificationsService {
    prisma;
    fcmPushService;
    logger = new common_1.Logger(AdminNotificationsService_1.name);
    constructor(prisma, fcmPushService) {
        this.prisma = prisma;
        this.fcmPushService = fcmPushService;
    }
    async getStats() {
        const [campaigns, sent, failed, delivered, unread, tokens] = await Promise.all([
            this.prisma.notificationCampaign.count(),
            this.prisma.notificationCampaign.count({
                where: { status: client_1.NotificationCampaignStatus.SENT },
            }),
            this.prisma.notificationCampaign.count({
                where: { status: client_1.NotificationCampaignStatus.FAILED },
            }),
            this.prisma.userNotification.count(),
            this.prisma.userNotification.count({ where: { isRead: false } }),
            this.prisma.devicePushToken.count(),
        ]);
        return {
            campaigns,
            sent,
            failed,
            delivered,
            unread,
            pushTokens: tokens,
        };
    }
    async list(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status)
            where.status = query.status;
        const search = query.search?.trim();
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { body: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [total, rows] = await Promise.all([
            this.prisma.notificationCampaign.count({ where }),
            this.prisma.notificationCampaign.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            }),
        ]);
        return {
            data: rows.map((row) => this.toCampaignDto(row)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }
    async findOne(id) {
        const campaign = await this.prisma.notificationCampaign.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        if (!campaign) {
            throw new common_1.NotFoundException('Campagne introuvable');
        }
        return this.toCampaignDto(campaign);
    }
    async createAndSend(dto, actorUserId) {
        const title = dto.title.trim();
        const body = dto.body.trim();
        if (!title || !body) {
            throw new common_1.BadRequestException('Titre et message requis');
        }
        if (dto.audience === client_1.NotificationAudience.USER_IDS &&
            (!dto.userIds || dto.userIds.length === 0)) {
            throw new common_1.BadRequestException('Sélectionnez au moins un client pour un envoi ciblé');
        }
        const targetUserIds = await this.resolveAudience(dto.audience, dto.userIds ?? []);
        const campaign = await this.prisma.notificationCampaign.create({
            data: {
                title,
                body,
                audience: dto.audience,
                userIds: dto.audience === client_1.NotificationAudience.USER_IDS
                    ? dto.userIds ?? []
                    : [],
                status: client_1.NotificationCampaignStatus.SENDING,
                targetCount: targetUserIds.length,
                createdById: actorUserId,
            },
        });
        try {
            if (targetUserIds.length === 0) {
                const updated = await this.prisma.notificationCampaign.update({
                    where: { id: campaign.id },
                    data: {
                        status: client_1.NotificationCampaignStatus.SENT,
                        deliveredCount: 0,
                        sentAt: new Date(),
                    },
                    include: {
                        createdBy: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                });
                return this.toCampaignDto(updated);
            }
            await this.prisma.userNotification.createMany({
                data: targetUserIds.map((userId) => ({
                    userId,
                    campaignId: campaign.id,
                    title,
                    body,
                })),
            });
            const pushTokens = await this.prisma.devicePushToken.findMany({
                where: { userId: { in: targetUserIds } },
                select: { token: true },
            });
            const tokens = pushTokens.map((row) => row.token);
            const pushResult = await this.fcmPushService.sendToTokens({
                tokens,
                title,
                body,
                data: {
                    type: 'campaign',
                    campaignId: campaign.id,
                },
            });
            if (pushResult.invalidTokens.length > 0) {
                await this.prisma.devicePushToken.deleteMany({
                    where: { token: { in: pushResult.invalidTokens } },
                });
            }
            if (!pushResult.configured && tokens.length > 0) {
                this.logger.warn(`Campagne ${campaign.id}: inbox livrée, FCM non configuré (${tokens.length} token(s))`);
            }
            else if (pushResult.configured) {
                this.logger.log(`Campagne ${campaign.id}: push ${pushResult.success}/${pushResult.attempted} (échecs: ${pushResult.failure})`);
                if (pushResult.attempted > 0 && pushResult.success === 0) {
                    this.logger.warn(`Campagne ${campaign.id}: aucun push livré. Vérifier Firebase Cloud Messaging API et le token appareil.`);
                }
            }
            const updated = await this.prisma.notificationCampaign.update({
                where: { id: campaign.id },
                data: {
                    status: client_1.NotificationCampaignStatus.SENT,
                    deliveredCount: targetUserIds.length,
                    pushAttempted: pushResult.attempted,
                    sentAt: new Date(),
                    errorMessage: tokens.length === 0
                        ? 'Inbox livrée, aucun token push enregistré'
                        : pushResult.success === 0
                            ? pushResult.lastError ??
                                'Inbox livrée, mais le push FCM a échoué'
                            : null,
                },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            return this.toCampaignDto(updated);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Envoi impossible';
            await this.prisma.notificationCampaign.update({
                where: { id: campaign.id },
                data: {
                    status: client_1.NotificationCampaignStatus.FAILED,
                    errorMessage: message,
                },
            });
            throw error;
        }
    }
    async resolveAudience(audience, userIds) {
        const baseWhere = {
            role: client_1.UserRole.USER,
            adminRoleId: null,
            isActive: true,
        };
        if (audience === client_1.NotificationAudience.USER_IDS) {
            const uniqueIds = [...new Set(userIds.map((id) => id.trim()).filter(Boolean))];
            const users = await this.prisma.user.findMany({
                where: { ...baseWhere, id: { in: uniqueIds } },
                select: { id: true },
            });
            return users.map((u) => u.id);
        }
        if (audience === client_1.NotificationAudience.PREMIUM) {
            const users = await this.prisma.user.findMany({
                where: {
                    ...baseWhere,
                    subscriptions: {
                        some: {
                            status: { in: PREMIUM_STATUSES },
                            offerId: { not: null },
                        },
                    },
                },
                select: { id: true },
            });
            return users.map((u) => u.id);
        }
        if (audience === client_1.NotificationAudience.FREE) {
            const users = await this.prisma.user.findMany({
                where: {
                    ...baseWhere,
                    subscriptions: {
                        none: {
                            status: { in: PREMIUM_STATUSES },
                            offerId: { not: null },
                        },
                    },
                },
                select: { id: true },
            });
            return users.map((u) => u.id);
        }
        const users = await this.prisma.user.findMany({
            where: baseWhere,
            select: { id: true },
        });
        return users.map((u) => u.id);
    }
    toCampaignDto(campaign) {
        const userIds = Array.isArray(campaign.userIds)
            ? campaign.userIds
            : [];
        return {
            id: campaign.id,
            title: campaign.title,
            body: campaign.body,
            audience: campaign.audience,
            userIds,
            status: campaign.status,
            targetCount: campaign.targetCount,
            deliveredCount: campaign.deliveredCount,
            readCount: campaign.readCount,
            pushAttempted: campaign.pushAttempted,
            errorMessage: campaign.errorMessage,
            createdAt: campaign.createdAt,
            sentAt: campaign.sentAt,
            updatedAt: campaign.updatedAt,
            createdBy: campaign.createdBy
                ? {
                    id: campaign.createdBy.id,
                    email: campaign.createdBy.email,
                    name: `${campaign.createdBy.firstName} ${campaign.createdBy.lastName}`.trim(),
                }
                : null,
        };
    }
};
exports.AdminNotificationsService = AdminNotificationsService;
exports.AdminNotificationsService = AdminNotificationsService = AdminNotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        fcm_push_service_1.FcmPushService])
], AdminNotificationsService);
//# sourceMappingURL=admin-notifications.service.js.map