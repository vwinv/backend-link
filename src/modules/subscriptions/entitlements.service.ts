import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BillingPeriod,
  CardKind,
  OfferAudience,
  SubscriptionStatus,
  TeamInviteStatus,
  TeamMemberRole,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AiScanQuota,
  DEFAULT_ENTITLEMENTS,
  ShareQuota,
  TeamSeatsQuota,
  UserEntitlements,
} from './entitlements.types';
import { FREE_OFFER_SLUG } from './free-offer.constants';

@Injectable()
export class EntitlementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private get freeMaxSharesFallback(): number {
    return this.configService.get<number>('freeMaxShares', 10);
  }

  async getUserEntitlements(userId: string): Promise<UserEntitlements> {
    const subscription = await this.findActiveSubscription(userId);
    if (!subscription?.offer) {
      return this.getFreeEntitlements();
    }

    return this.mapOfferToEntitlements(
      subscription.offer,
      subscription.purchasedSeats,
    );
  }

  private async getFreeEntitlements(): Promise<UserEntitlements> {
    const freeOffer = await this.prisma.premiumOffer.findFirst({
      where: { slug: FREE_OFFER_SLUG, isActive: true },
    });

    if (freeOffer) {
      return this.mapOfferToEntitlements(freeOffer);
    }

    return {
      ...DEFAULT_ENTITLEMENTS,
      maxShares: this.freeMaxSharesFallback,
    };
  }

  /**
   * Droits effectifs pour une carte :
   * - carte membre → offre du propriétaire de l'équipe
   * - sinon → offre personnelle de l'utilisateur
   */
  async getEntitlementsForCard(
    userId: string,
    cardId: string,
  ): Promise<UserEntitlements> {
    const card = await this.prisma.businessCard.findFirst({
      where: { id: cardId, ownerId: userId, isActive: true },
      select: { kind: true, teamId: true },
    });

    if (!card) {
      throw new NotFoundException('Carte introuvable');
    }

    if (card.kind === CardKind.MEMBER && card.teamId) {
      const team = await this.prisma.team.findFirst({
        where: { id: card.teamId, isActive: true },
        select: { ownerId: true },
      });
      if (team) {
        return this.getUserEntitlements(team.ownerId);
      }
    }

    return this.getUserEntitlements(userId);
  }

  async assertCanCustomize(userId: string, cardId: string): Promise<void> {
    const entitlements = await this.getEntitlementsForCard(userId, cardId);
    if (!entitlements.canCustomize) {
      throw new ForbiddenException(
        'Les designs professionnels nécessitent une offre Premium',
      );
    }
  }

  async assertCanUseWallet(userId: string, cardId: string): Promise<void> {
    const entitlements = await this.getEntitlementsForCard(userId, cardId);
    if (!entitlements.hasWallet) {
      throw new ForbiddenException(
        'L’ajout au Wallet nécessite une offre Premium',
      );
    }
  }

  async assertHasAnalytics(userId: string, cardId: string): Promise<void> {
    const entitlements = await this.getEntitlementsForCard(userId, cardId);
    if (!entitlements.hasAnalytics) {
      throw new ForbiddenException(
        'Les statistiques de consultation nécessitent une offre Premium',
      );
    }
  }

  async assertHasVisitorInsights(
    userId: string,
    cardId: string,
  ): Promise<void> {
    const entitlements = await this.getEntitlementsForCard(userId, cardId);
    if (!entitlements.hasVisitorInsights) {
      throw new ForbiddenException(
        'L’historique des visiteurs nécessite Premium Plus',
      );
    }
  }

  async assertCanEditSocialLinks(
    userId: string,
    cardId: string,
  ): Promise<void> {
    const entitlements = await this.getEntitlementsForCard(userId, cardId);
    if (!entitlements.hasSocialLinks) {
      throw new ForbiddenException(
        'Les réseaux sociaux nécessitent une offre Premium',
      );
    }
  }

  async assertHasPortfolio(userId: string): Promise<void> {
    const entitlements = await this.getUserEntitlements(userId);
    if (!entitlements.hasPortfolio) {
      throw new ForbiddenException(
        'Le portfolio nécessite une offre Premium',
      );
    }
  }

  async assertHasTeamAccess(userId: string): Promise<void> {
    const entitlements = await this.getUserEntitlements(userId);
    if (!this.hasTeamAccess(entitlements)) {
      throw new ForbiddenException(
        'Un abonnement équipe actif est requis pour créer une équipe',
      );
    }
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
    const hasTeamPlan = this.hasTeamAccess(entitlements);
    const isUnlimited = max < 0;

    return {
      used,
      max,
      canAddMember: hasTeamPlan && (isUnlimited || used < max),
    };
  }

  async assertCanAddTeamMember(userId: string, teamId: string): Promise<void> {
    await this.assertOwnerOrAdmin(userId, teamId);

    const seats = await this.getTeamSeatsQuota(userId, teamId);
    if (!seats.canAddMember) {
      if (seats.max === 0) {
        throw new ForbiddenException(
          'Un abonnement équipe actif est requis pour ajouter des membres',
        );
      }

      throw new BadRequestException(
        seats.max < 0
          ? 'Impossible d’ajouter un membre pour le moment'
          : `Limite de ${seats.max} sièges atteinte. Passez à une offre supérieure pour en ajouter.`,
      );
    }
  }

  async getAiScanQuota(userId: string): Promise<AiScanQuota> {
    const subscription = await this.findActiveSubscription(userId);
    const entitlements = subscription?.offer
      ? this.mapOfferToEntitlements(
          subscription.offer,
          subscription.purchasedSeats,
        )
      : await this.getFreeEntitlements();

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

  async getShareQuota(userId: string): Promise<ShareQuota> {
    const entitlements = await this.getUserEntitlements(userId);
    const max = entitlements.maxShares;
    const isUnlimited = max < 0;

    if (max === 0) {
      return {
        used: 0,
        max,
        canShare: false,
        isUnlimited: false,
      };
    }

    const used = await this.prisma.shareEvent.count({
      where: { userId },
    });

    return {
      used,
      max,
      canShare: isUnlimited || used < max,
      isUnlimited,
    };
  }

  async assertCanShare(userId: string): Promise<ShareQuota> {
    const quota = await this.getShareQuota(userId);

    if (!quota.canShare) {
      throw new ForbiddenException(
        quota.max <= 0
          ? 'Le partage nécessite une offre Premium'
          : `Quota de ${quota.max} partages atteint. Passez à Premium pour continuer.`,
      );
    }

    return quota;
  }

  private hasTeamAccess(entitlements: UserEntitlements): boolean {
    return (
      entitlements.audience === OfferAudience.TEAM &&
      entitlements.maxTeamMembers !== 0
    );
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

  private mapOfferToEntitlements(
    offer: {
      audience: OfferAudience;
      canCustomize: boolean;
      maxTeamMembers: number;
      hasPortfolio: boolean;
      hasWallet?: boolean;
      hasAnalytics?: boolean;
      hasVisitorInsights?: boolean;
      hasSocialLinks?: boolean;
      maxAiScans: number;
      maxShares?: number;
    },
    purchasedSeats?: number | null,
  ): UserEntitlements {
    const maxTeamMembers =
      purchasedSeats != null && purchasedSeats > 0
        ? purchasedSeats
        : offer.maxTeamMembers;

    return {
      audience: offer.audience,
      canCustomize: offer.canCustomize,
      maxTeamMembers,
      hasPortfolio: offer.hasPortfolio,
      hasWallet: offer.hasWallet ?? false,
      hasAnalytics: offer.hasAnalytics ?? false,
      hasVisitorInsights: offer.hasVisitorInsights ?? false,
      hasSocialLinks: offer.hasSocialLinks ?? false,
      maxAiScans: offer.maxAiScans,
      maxShares: offer.maxShares ?? -1,
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

  private async assertOwnerOrAdmin(userId: string, teamId: string) {
    const team = await this.prisma.team.findFirst({
      where: { id: teamId, isActive: true },
      select: { id: true, ownerId: true },
    });

    if (!team) {
      throw new ForbiddenException('Équipe introuvable');
    }

    if (team.ownerId === userId) {
      return;
    }

    const membership = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: { teamId, userId },
      },
      select: { role: true },
    });

    if (
      membership?.role !== TeamMemberRole.ADMIN &&
      membership?.role !== TeamMemberRole.OWNER
    ) {
      throw new ForbiddenException(
        'Action réservée aux administrateurs de l’équipe',
      );
    }
  }
}
