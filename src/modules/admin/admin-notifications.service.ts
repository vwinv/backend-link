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
import {
  normalizeAppLocale,
  pickLocalizedText,
} from '../notifications/notification-i18n';
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
    const titleEn = dto.titleEn?.trim() || null;
    const bodyEn = dto.bodyEn?.trim() || null;
    if (!title || !body) {
      throw new BadRequestException('Titre et message requis');
    }
    if ((titleEn && !bodyEn) || (!titleEn && bodyEn)) {
      throw new BadRequestException(
        'Pour l’anglais, renseignez le titre et le message ensemble',
      );
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
        titleEn,
        bodyEn,
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

      const targetUsers = await this.prisma.user.findMany({
        where: { id: { in: targetUserIds } },
        select: { id: true, preferredLocale: true },
      });
      const localeByUserId = new Map(
        targetUsers.map(
          (user) =>
            [user.id, normalizeAppLocale(user.preferredLocale)] as const,
        ),
      );

      await this.prisma.userNotification.createMany({
        data: targetUserIds.map((userId) => {
          const locale = localeByUserId.get(userId) ?? 'fr';
          return {
            userId,
            campaignId: campaign.id,
            title: pickLocalizedText({ locale, fr: title, en: titleEn }),
            body: pickLocalizedText({ locale, fr: body, en: bodyEn }),
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
      const unreadByUserId = new Map(
        unreadRows.map((row) => [row.userId, row._count._all] as const),
      );
      const tokensByUserId = new Map<string, string[]>();
      for (const row of pushTokens) {
        const list = tokensByUserId.get(row.userId) ?? [];
        list.push(row.token);
        tokensByUserId.set(row.userId, list);
      }

      let attempted = 0;
      let success = 0;
      let failure = 0;
      let configured = false;
      let lastError: string | null = null;
      const invalidTokens: string[] = [];

      for (const userId of targetUserIds) {
        const tokens = tokensByUserId.get(userId);
        if (!tokens || tokens.length === 0) continue;
        const locale = localeByUserId.get(userId) ?? 'fr';
        const pushResult = await this.fcmPushService.sendToTokens({
          tokens,
          title: pickLocalizedText({ locale, fr: title, en: titleEn }),
          body: pickLocalizedText({ locale, fr: body, en: bodyEn }),
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
        if (pushResult.lastError) lastError = pushResult.lastError;
        invalidTokens.push(...pushResult.invalidTokens);
      }

      if (invalidTokens.length > 0) {
        await this.prisma.devicePushToken.deleteMany({
          where: { token: { in: invalidTokens } },
        });
      }

      if (!configured && pushTokens.length > 0) {
        this.logger.warn(
          `Campagne ${campaign.id}: inbox livrée, FCM non configuré (${pushTokens.length} token(s))`,
        );
      } else if (configured) {
        this.logger.log(
          `Campagne ${campaign.id}: push ${success}/${attempted} (échecs: ${failure})`,
        );
        if (attempted > 0 && success === 0) {
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
          pushAttempted: attempted,
          sentAt: new Date(),
          errorMessage:
            pushTokens.length === 0
              ? 'Inbox livrée, aucun token push enregistré'
              : success === 0
                ? lastError ??
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
    titleEn?: string | null;
    bodyEn?: string | null;
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
