import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  NotificationAudience,
  NotificationCampaignStatus,
  NotificationRecurrence,
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
  private processingDue = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly fcmPushService: FcmPushService,
  ) {}

  async getStats() {
    const [campaigns, sent, failed, scheduled, delivered, unread, tokens] =
      await Promise.all([
        this.prisma.notificationCampaign.count(),
        this.prisma.notificationCampaign.count({
          where: { status: NotificationCampaignStatus.SENT },
        }),
        this.prisma.notificationCampaign.count({
          where: { status: NotificationCampaignStatus.FAILED },
        }),
        this.prisma.notificationCampaign.count({
          where: { status: NotificationCampaignStatus.SCHEDULED },
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
        userIds:
          prepared.audience === NotificationAudience.USER_IDS
            ? prepared.userIds
            : [],
        status: NotificationCampaignStatus.SENDING,
        targetCount: 0,
        createdById: actorUserId,
        recurrence: NotificationRecurrence.ONCE,
      },
    });

    return this.deliverCampaign(campaign.id);
  }

  async cancelScheduled(id: string) {
    const campaign = await this.prisma.notificationCampaign.findUnique({
      where: { id },
    });
    if (!campaign) {
      throw new NotFoundException('Campagne introuvable');
    }
    if (campaign.status !== NotificationCampaignStatus.SCHEDULED) {
      throw new BadRequestException(
        'Seules les campagnes programmées peuvent être annulées',
      );
    }

    const updated = await this.prisma.notificationCampaign.update({
      where: { id },
      data: {
        status: NotificationCampaignStatus.CANCELLED,
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

  async processDueScheduledCampaigns(now = new Date()): Promise<{
    processed: number;
    sent: number;
    failed: number;
  }> {
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
          status: NotificationCampaignStatus.SCHEDULED,
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
        } catch (error) {
          failed += 1;
          const message =
            error instanceof Error ? error.message : String(error);
          this.logger.warn(
            `Campagne programmée ${row.id} en échec: ${message}`,
          );
        }
      }
      return { processed, sent, failed };
    } finally {
      this.processingDue = false;
    }
  }

  private async createScheduled(
    prepared: PreparedCampaignInput,
    actorUserId: string,
  ) {
    const targetUserIds = await this.resolveAudience(
      prepared.audience,
      prepared.userIds,
    );

    const campaign = await this.prisma.notificationCampaign.create({
      data: {
        title: prepared.title,
        body: prepared.body,
        titleEn: prepared.titleEn,
        bodyEn: prepared.bodyEn,
        audience: prepared.audience,
        userIds:
          prepared.audience === NotificationAudience.USER_IDS
            ? prepared.userIds
            : [],
        status: NotificationCampaignStatus.SCHEDULED,
        targetCount: targetUserIds.length,
        createdById: actorUserId,
        scheduledAt: prepared.scheduledAt!,
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

  /** Envoi effectif (immédiat ou cron). Gère aussi la récurrence. */
  async deliverCampaign(campaignId: string) {
    const campaign = await this.prisma.notificationCampaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) {
      throw new NotFoundException('Campagne introuvable');
    }
    if (
      campaign.status !== NotificationCampaignStatus.SENDING &&
      campaign.status !== NotificationCampaignStatus.SCHEDULED
    ) {
      throw new BadRequestException(
        'Cette campagne ne peut pas être envoyée dans son état actuel',
      );
    }

    await this.prisma.notificationCampaign.update({
      where: { id: campaignId },
      data: { status: NotificationCampaignStatus.SENDING, errorMessage: null },
    });

    const title = campaign.title;
    const body = campaign.body;
    const titleEn = campaign.titleEn;
    const bodyEn = campaign.bodyEn;
    const userIds = Array.isArray(campaign.userIds)
      ? (campaign.userIds as string[])
      : [];

    try {
      const targetUserIds = await this.resolveAudience(
        campaign.audience,
        userIds,
      );

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
      }

      return this.finalizeAfterDelivery(campaign, {
        deliveredCount: targetUserIds.length,
        pushAttempted: attempted,
        errorMessage:
          pushTokens.length === 0
            ? 'Inbox livrée, aucun token push enregistré'
            : success === 0
              ? lastError ?? 'Inbox livrée, mais le push FCM a échoué'
              : null,
      });
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

  private async finalizeAfterDelivery(
    campaign: {
      id: string;
      recurrence: NotificationRecurrence;
      scheduledAt: Date | null;
      recurrenceEndsAt: Date | null;
      maxOccurrences: number | null;
      occurrenceCount: number;
      targetCount: number;
    },
    result: {
      deliveredCount: number;
      pushAttempted: number;
      errorMessage: string | null;
    },
  ) {
    const occurrenceCount = campaign.occurrenceCount + 1;
    const nextScheduledAt = this.computeNextScheduledAt(
      campaign.scheduledAt ?? new Date(),
      campaign.recurrence,
    );
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
          ? NotificationCampaignStatus.SCHEDULED
          : NotificationCampaignStatus.SENT,
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

  private shouldContinueRecurrence(input: {
    recurrence: NotificationRecurrence;
    occurrenceCount: number;
    maxOccurrences: number | null;
    recurrenceEndsAt: Date | null;
    nextScheduledAt: Date | null;
  }): boolean {
    if (input.recurrence === NotificationRecurrence.ONCE) return false;
    if (!input.nextScheduledAt) return false;
    if (
      input.maxOccurrences != null &&
      input.occurrenceCount >= input.maxOccurrences
    ) {
      return false;
    }
    if (
      input.recurrenceEndsAt &&
      input.nextScheduledAt.getTime() > input.recurrenceEndsAt.getTime()
    ) {
      return false;
    }
    return true;
  }

  private computeNextScheduledAt(
    from: Date,
    recurrence: NotificationRecurrence,
  ): Date | null {
    if (recurrence === NotificationRecurrence.ONCE) return null;
    const next = new Date(from.getTime());
    if (recurrence === NotificationRecurrence.DAILY) {
      next.setUTCDate(next.getUTCDate() + 1);
      return next;
    }
    if (recurrence === NotificationRecurrence.WEEKLY) {
      next.setUTCDate(next.getUTCDate() + 7);
      return next;
    }
    // MONTHLY
    next.setUTCMonth(next.getUTCMonth() + 1);
    return next;
  }

  private prepareCampaignInput(
    dto: CreateNotificationCampaignDto,
  ): PreparedCampaignInput {
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

    let scheduledAt: Date | null = null;
    if (dto.scheduledAt?.trim()) {
      scheduledAt = new Date(dto.scheduledAt);
      if (Number.isNaN(scheduledAt.getTime())) {
        throw new BadRequestException('Date/heure de programmation invalide');
      }
      if (scheduledAt.getTime() < Date.now() - 60_000) {
        throw new BadRequestException(
          'La date/heure programmée doit être dans le futur',
        );
      }
    }

    const recurrence = dto.recurrence ?? NotificationRecurrence.ONCE;
    if (!scheduledAt && recurrence !== NotificationRecurrence.ONCE) {
      throw new BadRequestException(
        'Une récurrence nécessite une date/heure de programmation',
      );
    }

    let recurrenceEndsAt: Date | null = null;
    if (dto.recurrenceEndsAt?.trim()) {
      recurrenceEndsAt = new Date(dto.recurrenceEndsAt);
      if (Number.isNaN(recurrenceEndsAt.getTime())) {
        throw new BadRequestException('Date de fin de récurrence invalide');
      }
      if (scheduledAt && recurrenceEndsAt.getTime() <= scheduledAt.getTime()) {
        throw new BadRequestException(
          'La fin de récurrence doit être après la première date d’envoi',
        );
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
      const uniqueIds = [
        ...new Set(userIds.map((id) => id.trim()).filter(Boolean)),
      ];
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
    scheduledAt?: Date | null;
    recurrence?: NotificationRecurrence;
    recurrenceEndsAt?: Date | null;
    maxOccurrences?: number | null;
    occurrenceCount?: number;
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
      scheduledAt: campaign.scheduledAt ?? null,
      recurrence: campaign.recurrence ?? NotificationRecurrence.ONCE,
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
}

type PreparedCampaignInput = {
  title: string;
  body: string;
  titleEn: string | null;
  bodyEn: string | null;
  audience: NotificationAudience;
  userIds: string[];
  scheduledAt: Date | null;
  recurrence: NotificationRecurrence;
  recurrenceEndsAt: Date | null;
  maxOccurrences: number | null;
};
