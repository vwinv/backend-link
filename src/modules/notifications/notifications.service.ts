import { Injectable, NotFoundException } from '@nestjs/common';
import { PushPlatform } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

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
}
