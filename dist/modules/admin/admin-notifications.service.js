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
const notification_i18n_1 = require("../notifications/notification-i18n");
const prisma_service_1 = require("../../prisma/prisma.service");
const subscription_validity_1 = require("../subscriptions/subscription-validity");
let AdminNotificationsService = AdminNotificationsService_1 = class AdminNotificationsService {
    prisma;
    fcmPushService;
    logger = new common_1.Logger(AdminNotificationsService_1.name);
    processingDue = false;
    constructor(prisma, fcmPushService) {
        this.prisma = prisma;
        this.fcmPushService = fcmPushService;
    }
    async getStats() {
        const [campaigns, sent, failed, scheduled, delivered, unread, tokens] = await Promise.all([
            this.prisma.notificationCampaign.count(),
            this.prisma.notificationCampaign.count({
                where: { status: client_1.NotificationCampaignStatus.SENT },
            }),
            this.prisma.notificationCampaign.count({
                where: { status: client_1.NotificationCampaignStatus.FAILED },
            }),
            this.prisma.notificationCampaign.count({
                where: { status: client_1.NotificationCampaignStatus.SCHEDULED },
            }),
            this.prisma.userNotification.count(),
            this.prisma.userNotification.count({ where: { isRead: false } }),
            this.prisma.devicePushToken.count(),
        ]);
        return {
            campaigns,
            sent,
            failed,
            scheduled,
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
                orderBy: [{ scheduledAt: 'desc' }, { createdAt: 'desc' }],
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
        const prepared = this.prepareCampaignInput(dto);
        if (prepared.scheduledAt) {
            return this.createScheduled(prepared, actorUserId);
        }
        const campaign = await this.prisma.notificationCampaign.create({
            data: {
                title: prepared.title,
                body: prepared.body,
                titleEn: prepared.titleEn,
                bodyEn: prepared.bodyEn,
                audience: prepared.audience,
                userIds: prepared.audience === client_1.NotificationAudience.USER_IDS
                    ? prepared.userIds
                    : [],
                status: client_1.NotificationCampaignStatus.SENDING,
                targetCount: 0,
                createdById: actorUserId,
                recurrence: client_1.NotificationRecurrence.ONCE,
            },
        });
        return this.deliverCampaign(campaign.id);
    }
    async cancelScheduled(id) {
        const campaign = await this.prisma.notificationCampaign.findUnique({
            where: { id },
        });
        if (!campaign) {
            throw new common_1.NotFoundException('Campagne introuvable');
        }
        if (campaign.status !== client_1.NotificationCampaignStatus.SCHEDULED) {
            throw new common_1.BadRequestException('Seules les campagnes programmées peuvent être annulées');
        }
        const updated = await this.prisma.notificationCampaign.update({
            where: { id },
            data: {
                status: client_1.NotificationCampaignStatus.CANCELLED,
                errorMessage: 'Annulée par un administrateur',
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
    async processDueScheduledCampaigns(now = new Date()) {
        if (this.processingDue) {
            return { processed: 0, sent: 0, failed: 0 };
        }
        this.processingDue = true;
        let processed = 0;
        let sent = 0;
        let failed = 0;
        try {
            const due = await this.prisma.notificationCampaign.findMany({
                where: {
                    status: client_1.NotificationCampaignStatus.SCHEDULED,
                    scheduledAt: { lte: now },
                },
                orderBy: { scheduledAt: 'asc' },
                take: 20,
                select: { id: true },
            });
            for (const row of due) {
                processed += 1;
                try {
                    await this.deliverCampaign(row.id);
                    sent += 1;
                }
                catch (error) {
                    failed += 1;
                    const message = error instanceof Error ? error.message : String(error);
                    this.logger.warn(`Campagne programmée ${row.id} en échec: ${message}`);
                }
            }
            return { processed, sent, failed };
        }
        finally {
            this.processingDue = false;
        }
    }
    async createScheduled(prepared, actorUserId) {
        const targetUserIds = await this.resolveAudience(prepared.audience, prepared.userIds);
        const campaign = await this.prisma.notificationCampaign.create({
            data: {
                title: prepared.title,
                body: prepared.body,
                titleEn: prepared.titleEn,
                bodyEn: prepared.bodyEn,
                audience: prepared.audience,
                userIds: prepared.audience === client_1.NotificationAudience.USER_IDS
                    ? prepared.userIds
                    : [],
                status: client_1.NotificationCampaignStatus.SCHEDULED,
                targetCount: targetUserIds.length,
                createdById: actorUserId,
                scheduledAt: prepared.scheduledAt,
                recurrence: prepared.recurrence,
                recurrenceEndsAt: prepared.recurrenceEndsAt,
                maxOccurrences: prepared.maxOccurrences,
                occurrenceCount: 0,
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
        return this.toCampaignDto(campaign);
    }
    async deliverCampaign(campaignId) {
        const campaign = await this.prisma.notificationCampaign.findUnique({
            where: { id: campaignId },
        });
        if (!campaign) {
            throw new common_1.NotFoundException('Campagne introuvable');
        }
        if (campaign.status !== client_1.NotificationCampaignStatus.SENDING &&
            campaign.status !== client_1.NotificationCampaignStatus.SCHEDULED) {
            throw new common_1.BadRequestException('Cette campagne ne peut pas être envoyée dans son état actuel');
        }
        await this.prisma.notificationCampaign.update({
            where: { id: campaignId },
            data: { status: client_1.NotificationCampaignStatus.SENDING, errorMessage: null },
        });
        const title = campaign.title;
        const body = campaign.body;
        const titleEn = campaign.titleEn;
        const bodyEn = campaign.bodyEn;
        const userIds = Array.isArray(campaign.userIds)
            ? campaign.userIds
            : [];
        try {
            const targetUserIds = await this.resolveAudience(campaign.audience, userIds);
            if (targetUserIds.length === 0) {
                return this.finalizeAfterDelivery(campaign, {
                    deliveredCount: 0,
                    pushAttempted: 0,
                    errorMessage: null,
                });
            }
            const targetUsers = await this.prisma.user.findMany({
                where: { id: { in: targetUserIds } },
                select: { id: true, preferredLocale: true },
            });
            const localeByUserId = new Map(targetUsers.map((user) => [user.id, (0, notification_i18n_1.normalizeAppLocale)(user.preferredLocale)]));
            await this.prisma.userNotification.createMany({
                data: targetUserIds.map((userId) => {
                    const locale = localeByUserId.get(userId) ?? 'fr';
                    return {
                        userId,
                        campaignId: campaign.id,
                        title: (0, notification_i18n_1.pickLocalizedText)({ locale, fr: title, en: titleEn }),
                        body: (0, notification_i18n_1.pickLocalizedText)({ locale, fr: body, en: bodyEn }),
                    };
                }),
            });
            const [pushTokens, unreadRows] = await Promise.all([
                this.prisma.devicePushToken.findMany({
                    where: { userId: { in: targetUserIds } },
                    select: { token: true, userId: true },
                }),
                this.prisma.userNotification.groupBy({
                    by: ['userId'],
                    where: { userId: { in: targetUserIds }, isRead: false },
                    _count: { _all: true },
                }),
            ]);
            const unreadByUserId = new Map(unreadRows.map((row) => [row.userId, row._count._all]));
            const tokensByUserId = new Map();
            for (const row of pushTokens) {
                const list = tokensByUserId.get(row.userId) ?? [];
                list.push(row.token);
                tokensByUserId.set(row.userId, list);
            }
            let attempted = 0;
            let success = 0;
            let failure = 0;
            let configured = false;
            let lastError = null;
            const invalidTokens = [];
            for (const userId of targetUserIds) {
                const tokens = tokensByUserId.get(userId);
                if (!tokens || tokens.length === 0)
                    continue;
                const locale = localeByUserId.get(userId) ?? 'fr';
                const pushResult = await this.fcmPushService.sendToTokens({
                    tokens,
                    title: (0, notification_i18n_1.pickLocalizedText)({ locale, fr: title, en: titleEn }),
                    body: (0, notification_i18n_1.pickLocalizedText)({ locale, fr: body, en: bodyEn }),
                    data: {
                        type: 'campaign',
                        campaignId: campaign.id,
                    },
                    badge: unreadByUserId.get(userId) ?? 1,
                });
                configured = configured || pushResult.configured;
                attempted += pushResult.attempted;
                success += pushResult.success;
                failure += pushResult.failure;
                if (pushResult.lastError)
                    lastError = pushResult.lastError;
                invalidTokens.push(...pushResult.invalidTokens);
            }
            if (invalidTokens.length > 0) {
                await this.prisma.devicePushToken.deleteMany({
                    where: { token: { in: invalidTokens } },
                });
            }
            if (!configured && pushTokens.length > 0) {
                this.logger.warn(`Campagne ${campaign.id}: inbox livrée, FCM non configuré (${pushTokens.length} token(s))`);
            }
            else if (configured) {
                this.logger.log(`Campagne ${campaign.id}: push ${success}/${attempted} (échecs: ${failure})`);
            }
            return this.finalizeAfterDelivery(campaign, {
                deliveredCount: targetUserIds.length,
                pushAttempted: attempted,
                errorMessage: pushTokens.length === 0
                    ? 'Inbox livrée, aucun token push enregistré'
                    : success === 0
                        ? lastError ?? 'Inbox livrée, mais le push FCM a échoué'
                        : null,
            });
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
    async finalizeAfterDelivery(campaign, result) {
        const occurrenceCount = campaign.occurrenceCount + 1;
        const nextScheduledAt = this.computeNextScheduledAt(campaign.scheduledAt ?? new Date(), campaign.recurrence);
        const continueRecurrence = this.shouldContinueRecurrence({
            recurrence: campaign.recurrence,
            occurrenceCount,
            maxOccurrences: campaign.maxOccurrences,
            recurrenceEndsAt: campaign.recurrenceEndsAt,
            nextScheduledAt,
        });
        const updated = await this.prisma.notificationCampaign.update({
            where: { id: campaign.id },
            data: {
                status: continueRecurrence
                    ? client_1.NotificationCampaignStatus.SCHEDULED
                    : client_1.NotificationCampaignStatus.SENT,
                targetCount: Math.max(campaign.targetCount, result.deliveredCount),
                deliveredCount: { increment: result.deliveredCount },
                pushAttempted: { increment: result.pushAttempted },
                sentAt: new Date(),
                occurrenceCount,
                scheduledAt: continueRecurrence ? nextScheduledAt : campaign.scheduledAt,
                errorMessage: result.errorMessage,
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
    shouldContinueRecurrence(input) {
        if (input.recurrence === client_1.NotificationRecurrence.ONCE)
            return false;
        if (!input.nextScheduledAt)
            return false;
        if (input.maxOccurrences != null &&
            input.occurrenceCount >= input.maxOccurrences) {
            return false;
        }
        if (input.recurrenceEndsAt &&
            input.nextScheduledAt.getTime() > input.recurrenceEndsAt.getTime()) {
            return false;
        }
        return true;
    }
    computeNextScheduledAt(from, recurrence) {
        if (recurrence === client_1.NotificationRecurrence.ONCE)
            return null;
        const next = new Date(from.getTime());
        if (recurrence === client_1.NotificationRecurrence.DAILY) {
            next.setUTCDate(next.getUTCDate() + 1);
            return next;
        }
        if (recurrence === client_1.NotificationRecurrence.WEEKLY) {
            next.setUTCDate(next.getUTCDate() + 7);
            return next;
        }
        next.setUTCMonth(next.getUTCMonth() + 1);
        return next;
    }
    prepareCampaignInput(dto) {
        const title = dto.title.trim();
        const body = dto.body.trim();
        const titleEn = dto.titleEn?.trim() || null;
        const bodyEn = dto.bodyEn?.trim() || null;
        if (!title || !body) {
            throw new common_1.BadRequestException('Titre et message requis');
        }
        if ((titleEn && !bodyEn) || (!titleEn && bodyEn)) {
            throw new common_1.BadRequestException('Pour l’anglais, renseignez le titre et le message ensemble');
        }
        if (dto.audience === client_1.NotificationAudience.USER_IDS &&
            (!dto.userIds || dto.userIds.length === 0)) {
            throw new common_1.BadRequestException('Sélectionnez au moins un client pour un envoi ciblé');
        }
        let scheduledAt = null;
        if (dto.scheduledAt?.trim()) {
            scheduledAt = new Date(dto.scheduledAt);
            if (Number.isNaN(scheduledAt.getTime())) {
                throw new common_1.BadRequestException('Date/heure de programmation invalide');
            }
            if (scheduledAt.getTime() < Date.now() - 60_000) {
                throw new common_1.BadRequestException('La date/heure programmée doit être dans le futur');
            }
        }
        const recurrence = dto.recurrence ?? client_1.NotificationRecurrence.ONCE;
        if (!scheduledAt && recurrence !== client_1.NotificationRecurrence.ONCE) {
            throw new common_1.BadRequestException('Une récurrence nécessite une date/heure de programmation');
        }
        let recurrenceEndsAt = null;
        if (dto.recurrenceEndsAt?.trim()) {
            recurrenceEndsAt = new Date(dto.recurrenceEndsAt);
            if (Number.isNaN(recurrenceEndsAt.getTime())) {
                throw new common_1.BadRequestException('Date de fin de récurrence invalide');
            }
            if (scheduledAt && recurrenceEndsAt.getTime() <= scheduledAt.getTime()) {
                throw new common_1.BadRequestException('La fin de récurrence doit être après la première date d’envoi');
            }
        }
        return {
            title,
            body,
            titleEn,
            bodyEn,
            audience: dto.audience,
            userIds: dto.userIds ?? [],
            scheduledAt,
            recurrence,
            recurrenceEndsAt,
            maxOccurrences: dto.maxOccurrences ?? null,
        };
    }
    async resolveAudience(audience, userIds) {
        const baseWhere = {
            role: client_1.UserRole.USER,
            adminRoleId: null,
            isActive: true,
        };
        if (audience === client_1.NotificationAudience.USER_IDS) {
            const uniqueIds = [
                ...new Set(userIds.map((id) => id.trim()).filter(Boolean)),
            ];
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
                        some: (0, subscription_validity_1.validSubscriptionWhere)({ offerId: { not: null } }),
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
                        none: (0, subscription_validity_1.validSubscriptionWhere)({ offerId: { not: null } }),
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
            titleEn: campaign.titleEn ?? null,
            bodyEn: campaign.bodyEn ?? null,
            audience: campaign.audience,
            userIds,
            status: campaign.status,
            targetCount: campaign.targetCount,
            deliveredCount: campaign.deliveredCount,
            readCount: campaign.readCount,
            pushAttempted: campaign.pushAttempted,
            errorMessage: campaign.errorMessage,
            scheduledAt: campaign.scheduledAt ?? null,
            recurrence: campaign.recurrence ?? client_1.NotificationRecurrence.ONCE,
            recurrenceEndsAt: campaign.recurrenceEndsAt ?? null,
            maxOccurrences: campaign.maxOccurrences ?? null,
            occurrenceCount: campaign.occurrenceCount ?? 0,
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