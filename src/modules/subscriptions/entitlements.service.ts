import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  BillingPeriod,
  OfferAudience,
  SubscriptionStatus,
  TeamInviteStatus,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AiScanQuota,
  DEFAULT_ENTITLEMENTS,
  TeamSeatsQuota,
  UserEntitlements,
} from './entitlements.types';

@Injectable()
export class EntitlementsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserEntitlements(userId: string): Promise<UserEntitlements> {
    const subscription = await this.findActiveSubscription(userId);
    if (!subscription?.offer) {
      return DEFAULT_ENTITLEMENTS;
    }

    return this.mapOfferToEntitlements(subscription.offer);
  }

  async getTeamSeatsQuota(
    userId: string,
    teamId: string,
  ): Promise<TeamSeatsQuota> {
    await this.assertTeamAccess(userId, teamId);

    const team = await this.prisma.team.findFirst({
      where: { id: teamId, isActive: true },
      select: { ownerId: true },
    });

    if (!team) {
      throw new BadRequestException('Équipe introuvable');
    }

    const entitlements = await this.getUserEntitlements(team.ownerId);
    const memberCount = await this.prisma.teamMember.count({
      where: { teamId },
    });
    const pendingInviteCount = await this.prisma.teamInvite.count({
      where: {
        teamId,
        status: TeamInviteStatus.PENDING,
      },
    });
    const used = memberCount + pendingInviteCount;

    const max = entitlements.maxTeamMembers;
    const hasTeamPlan =
      entitlements.audience === OfferAudience.TEAM && max > 0;

    return {
      used,
      max,
      canAddMember: hasTeamPlan && used < max,
    };
  }

  async assertCanAddTeamMember(userId: string, teamId: string): Promise<void> {
    await this.assertOwner(userId, teamId);

    const seats = await this.getTeamSeatsQuota(userId, teamId);
    if (!seats.canAddMember) {
      if (seats.max <= 0) {
        throw new ForbiddenException(
          'Un abonnement équipe actif est requis pour ajouter des membres',
        );
      }

      throw new BadRequestException(
        `Limite de ${seats.max} sièges atteinte. Passez à une offre supérieure pour en ajouter.`,
      );
    }
  }

  async getAiScanQuota(userId: string): Promise<AiScanQuota> {
    const subscription = await this.findActiveSubscription(userId);
    const entitlements = subscription?.offer
      ? this.mapOfferToEntitlements(subscription.offer)
      : DEFAULT_ENTITLEMENTS;

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

  async recordAiScan(userId: string) {
    const quota = await this.getAiScanQuota(userId);

    if (!quota.canScan) {
      if (quota.max === 0) {
        throw new ForbiddenException(
          'Le scan IA nécessite un abonnement actif',
        );
      }

      throw new BadRequestException(
        quota.isUnlimited
          ? 'Scan IA indisponible pour le moment'
          : `Quota de ${quota.max} scans IA atteint pour cette période`,
      );
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

  private async findActiveSubscription(userId: string) {
    return this.prisma.subscription.findFirst({
      where: {
        userId,
        status: {
          in: [
            SubscriptionStatus.TRIAL,
            SubscriptionStatus.ACTIVE,
            SubscriptionStatus.PAST_DUE,
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

  private mapOfferToEntitlements(offer: {
    audience: OfferAudience;
    canCustomize: boolean;
    maxTeamMembers: number;
    hasPortfolio: boolean;
    maxAiScans: number;
  }): UserEntitlements {
    return {
      audience: offer.audience,
      canCustomize: offer.canCustomize,
      maxTeamMembers: offer.maxTeamMembers,
      hasPortfolio: offer.hasPortfolio,
      maxAiScans: offer.maxAiScans,
    };
  }

  private getUsagePeriodStart(
    subscription: {
      billingPeriod: BillingPeriod;
      currentPeriodEnd: Date | null;
      createdAt: Date;
    } | null,
  ): Date {
    if (!subscription) {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (subscription.currentPeriodEnd) {
      const start = new Date(subscription.currentPeriodEnd);
      if (subscription.billingPeriod === BillingPeriod.YEARLY) {
        start.setFullYear(start.getFullYear() - 1);
      } else {
        start.setMonth(start.getMonth() - 1);
      }
      return start;
    }

    return subscription.createdAt;
  }

  private async assertTeamAccess(userId: string, teamId: string) {
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
      throw new ForbiddenException('Accès à l’équipe refusé');
    }
  }

  private async assertOwner(userId: string, teamId: string) {
    const team = await this.prisma.team.findFirst({
      where: { id: teamId, ownerId: userId, isActive: true },
    });

    if (!team) {
      throw new ForbiddenException(
        'Action réservée au propriétaire de l’équipe',
      );
    }
  }
}
