import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PushPlatform } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FcmPushService } from './fcm-push.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fcmPushService: FcmPushService,
  ) {}

  async listMine(userId: string, page = 1, limit = 30) {
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

  async unreadCount(userId: string) {
    const count = await this.prisma.userNotification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  async markRead(userId: string, id: string) {
    const notification = await this.prisma.userNotification.findFirst({
      where: { id, userId },
    });
    if (!notification) {
      throw new NotFoundException('Notification introuvable');
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

  async markAllRead(userId: string) {
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

    const byCampaign = new Map<string, number>();
    for (const item of unread) {
      if (!item.campaignId) continue;
      byCampaign.set(item.campaignId, (byCampaign.get(item.campaignId) ?? 0) + 1);
    }

    await Promise.all(
      [...byCampaign.entries()].map(([campaignId, count]) =>
        this.prisma.notificationCampaign.update({
          where: { id: campaignId },
          data: { readCount: { increment: count } },
        }),
      ),
    );

    return { updated: unread.length };
  }

  async registerPushToken(
    userId: string,
    token: string,
    platform: PushPlatform,
  ) {
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

  async unregisterPushToken(userId: string, token: string) {
    await this.prisma.devicePushToken.deleteMany({
      where: { userId, token: token.trim() },
    });
    return { ok: true };
  }

  /** Inbox in-app + push FCM (abonnements, etc.). */
  async notifyUser(input: {
    userId: string;
    title: string;
    body: string;
    data?: Record<string, string>;
  }): Promise<void> {
    const userId = input.userId.trim();
    if (!userId) return;

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
    if (tokens.length === 0) return;

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
      this.logger.warn(
        `Inbox livrée pour ${userId}, FCM non configuré (${tokens.length} token(s))`,
      );
    }
  }
}
