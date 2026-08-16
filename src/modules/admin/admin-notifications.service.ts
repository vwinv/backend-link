import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  NotificationAudience,
  NotificationCampaignStatus,
  Prisma,
  UserRole,
} from '@prisma/client';
import { FcmPushService } from '../notifications/fcm-push.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminNotificationsQueryDto } from './dto/admin-notifications-query.dto';
import { CreateNotificationCampaignDto } from './dto/create-notification-campaign.dto';
import { validSubscriptionWhere } from '../subscriptions/subscription-validity';

@Injectable()
export class AdminNotificationsService {
  private readonly logger = new Logger(AdminNotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fcmPushService: FcmPushService,
  ) {}

  async getStats() {
    const [campaigns, sent, failed, delivered, unread, tokens] =
      await Promise.all([
        this.prisma.notificationCampaign.count(),
        this.prisma.notificationCampaign.count({
          where: { status: NotificationCampaignStatus.SENT },
        }),
        this.prisma.notificationCampaign.count({
          where: { status: NotificationCampaignStatus.FAILED },
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

  async list(query: AdminNotificationsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationCampaignWhereInput = {};
    if (query.status) where.status = query.status;

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

  async findOne(id: string) {
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
      throw new NotFoundException('Campagne introuvable');
    }
    return this.toCampaignDto(campaign);
  }

  async createAndSend(
    dto: CreateNotificationCampaignDto,
    actorUserId: string,
  ) {
    const title = dto.title.trim();
    const body = dto.body.trim();
    if (!title || !body) {
      throw new BadRequestException('Titre et message requis');
    }

    if (
      dto.audience === NotificationAudience.USER_IDS &&
      (!dto.userIds || dto.userIds.length === 0)
    ) {
      throw new BadRequestException(
        'Sélectionnez au moins un client pour un envoi ciblé',
      );
    }

    const targetUserIds = await this.resolveAudience(
      dto.audience,
      dto.userIds ?? [],
    );

    const campaign = await this.prisma.notificationCampaign.create({
      data: {
        title,
        body,
        audience: dto.audience,
        userIds: dto.audience === NotificationAudience.USER_IDS
          ? dto.userIds ?? []
          : [],
        status: NotificationCampaignStatus.SENDING,
        targetCount: targetUserIds.length,
        createdById: actorUserId,
      },
    });

    try {
      if (targetUserIds.length === 0) {
        const updated = await this.prisma.notificationCampaign.update({
          where: { id: campaign.id },
          data: {
            status: NotificationCampaignStatus.SENT,
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
        this.logger.warn(
          `Campagne ${campaign.id}: inbox livrée, FCM non configuré (${tokens.length} token(s))`,
        );
      } else if (pushResult.configured) {
        this.logger.log(
          `Campagne ${campaign.id}: push ${pushResult.success}/${pushResult.attempted} (échecs: ${pushResult.failure})`,
        );
        if (pushResult.attempted > 0 && pushResult.success === 0) {
          this.logger.warn(
            `Campagne ${campaign.id}: aucun push livré. Vérifier Firebase Cloud Messaging API et le token appareil.`,
          );
        }
      }

      const updated = await this.prisma.notificationCampaign.update({
        where: { id: campaign.id },
        data: {
          status: NotificationCampaignStatus.SENT,
          deliveredCount: targetUserIds.length,
          pushAttempted: pushResult.attempted,
          sentAt: new Date(),
          errorMessage:
            tokens.length === 0
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Envoi impossible';
      await this.prisma.notificationCampaign.update({
        where: { id: campaign.id },
        data: {
          status: NotificationCampaignStatus.FAILED,
          errorMessage: message,
        },
      });
      throw error;
    }
  }

  private async resolveAudience(
    audience: NotificationAudience,
    userIds: string[],
  ): Promise<string[]> {
    const baseWhere: Prisma.UserWhereInput = {
      role: UserRole.USER,
      adminRoleId: null,
      isActive: true,
    };

    if (audience === NotificationAudience.USER_IDS) {
      const uniqueIds = [...new Set(userIds.map((id) => id.trim()).filter(Boolean))];
      const users = await this.prisma.user.findMany({
        where: { ...baseWhere, id: { in: uniqueIds } },
        select: { id: true },
      });
      return users.map((u) => u.id);
    }

    if (audience === NotificationAudience.PREMIUM) {
      const users = await this.prisma.user.findMany({
        where: {
          ...baseWhere,
          subscriptions: {
            some: validSubscriptionWhere({ offerId: { not: null } }),
          },
        },
        select: { id: true },
      });
      return users.map((u) => u.id);
    }

    if (audience === NotificationAudience.FREE) {
      const users = await this.prisma.user.findMany({
        where: {
          ...baseWhere,
          subscriptions: {
            none: validSubscriptionWhere({ offerId: { not: null } }),
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

  private toCampaignDto(campaign: {
    id: string;
    title: string;
    body: string;
    audience: NotificationAudience;
    userIds: Prisma.JsonValue;
    status: NotificationCampaignStatus;
    targetCount: number;
    deliveredCount: number;
    readCount: number;
    pushAttempted: number;
    errorMessage: string | null;
    createdById: string | null;
    createdAt: Date;
    sentAt: Date | null;
    updatedAt: Date;
    createdBy?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    } | null;
  }) {
    const userIds = Array.isArray(campaign.userIds)
      ? (campaign.userIds as string[])
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
}
