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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const fcm_push_service_1 = require("./fcm-push.service");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    prisma;
    fcmPushService;
    logger = new common_1.Logger(NotificationsService_1.name);
    constructor(prisma, fcmPushService) {
        this.prisma = prisma;
        this.fcmPushService = fcmPushService;
    }
    async listMine(userId, page = 1, limit = 30) {
        const skip = (page - 1) * limit;
        const where = { userId };
        const [total, unreadCount, rows] = await Promise.all([
            this.prisma.userNotification.count({ where }),
            this.prisma.userNotification.count({ where: { userId, isRead: false } }),
            this.prisma.userNotification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    body: true,
                    isRead: true,
                    readAt: true,
                    createdAt: true,
                    campaignId: true,
                },
            }),
        ]);
        return {
            data: rows,
            meta: {
                total,
                unreadCount,
                page,
                limit,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }
    async unreadCount(userId) {
        const count = await this.prisma.userNotification.count({
            where: { userId, isRead: false },
        });
        return { count };
    }
    async markRead(userId, id) {
        const notification = await this.prisma.userNotification.findFirst({
            where: { id, userId },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification introuvable');
        }
        if (notification.isRead) {
            return notification;
        }
        const updated = await this.prisma.userNotification.update({
            where: { id },
            data: { isRead: true, readAt: new Date() },
        });
        if (notification.campaignId) {
            await this.prisma.notificationCampaign.update({
                where: { id: notification.campaignId },
                data: { readCount: { increment: 1 } },
            });
        }
        return updated;
    }
    async markAllRead(userId) {
        const unread = await this.prisma.userNotification.findMany({
            where: { userId, isRead: false },
            select: { id: true, campaignId: true },
        });
        if (unread.length === 0) {
            return { updated: 0 };
        }
        await this.prisma.userNotification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true, readAt: new Date() },
        });
        const byCampaign = new Map();
        for (const item of unread) {
            if (!item.campaignId)
                continue;
            byCampaign.set(item.campaignId, (byCampaign.get(item.campaignId) ?? 0) + 1);
        }
        await Promise.all([...byCampaign.entries()].map(([campaignId, count]) => this.prisma.notificationCampaign.update({
            where: { id: campaignId },
            data: { readCount: { increment: count } },
        })));
        return { updated: unread.length };
    }
    async registerPushToken(userId, token, platform) {
        const cleaned = token.trim();
        return this.prisma.devicePushToken.upsert({
            where: { token: cleaned },
            update: { userId, platform },
            create: { userId, token: cleaned, platform },
            select: {
                id: true,
                token: true,
                platform: true,
                updatedAt: true,
            },
        });
    }
    async unregisterPushToken(userId, token) {
        await this.prisma.devicePushToken.deleteMany({
            where: { userId, token: token.trim() },
        });
        return { ok: true };
    }
    async notifyUser(input) {
        const userId = input.userId.trim();
        if (!userId)
            return;
        await this.prisma.userNotification.create({
            data: {
                userId,
                title: input.title,
                body: input.body,
            },
        });
        const pushTokens = await this.prisma.devicePushToken.findMany({
            where: { userId },
            select: { token: true },
        });
        const tokens = pushTokens.map((row) => row.token);
        if (tokens.length === 0)
            return;
        const pushResult = await this.fcmPushService.sendToTokens({
            tokens,
            title: input.title,
            body: input.body,
            data: input.data,
        });
        if (pushResult.invalidTokens.length > 0) {
            await this.prisma.devicePushToken.deleteMany({
                where: { token: { in: pushResult.invalidTokens } },
            });
        }
        if (!pushResult.configured) {
            this.logger.warn(`Inbox livrée pour ${userId}, FCM non configuré (${tokens.length} token(s))`);
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        fcm_push_service_1.FcmPushService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map