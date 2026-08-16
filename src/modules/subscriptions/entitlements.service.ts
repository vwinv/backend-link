import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CardKind,
  OfferAudience,
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
import { validSubscriptionWhere } from './subscription-validity';

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
   * - carte perso → offre perso (ou équipe, si l’utilisateur en a une)
   * - carte pro → uniquement une offre équipe valide du propriétaire
   * - carte membre → offre équipe du propriétaire de l’équipe
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
        return this.requireTeamOffer(team.ownerId);
      }
      return this.getFreeEntitlements();
    }

    if (card.kind === CardKind.PROFESSIONAL) {
      return this.requireTeamOffer(userId);
    }

    return this.getUserEntitlements(userId);
  }

  /** Offre équipe active, sinon plan gratuit (pas d’héritage d’une offre perso). */
  private async requireTeamOffer(userId: string): Promise<UserEntitlements> {
    const entitlements = await this.getUserEntitlements(userId);
    if (this.hasTeamAccess(entitlements)) {
      return entitlements;
    }
    return this.getFreeEntitlements();
  }

  async assertCanCustomize(userId: string, cardId: string): Promise<void> {
    const entitlements = await this.getEntitlementsForCard(userId, cardId);
    if (!entitlements.canCustomize) {
      throw new ForbiddenException(
        'Les designs professionnels nécessitent une offre Premium adaptée à cette carte',
      );
    }
  }

  async assertCanUseWallet(userId: string, cardId: string): Promise<void> {
    const entitlements = await this.getEntitlementsForCard(userId, cardId);
    if (!entitlements.hasWallet) {
      throw new ForbiddenException(
        'L’ajout au Wallet nécessite une offre Premium adaptée à cette carte',
      );
    }
  }

  async assertHasAnalytics(userId: string, cardId: string): Promise<void> {
    const entitlements = await this.getEntitlementsForCard(userId, cardId);
    if (!entitlements.hasAnalytics) {
      throw new ForbiddenException(
        'Les statistiques de cette carte nécessitent une offre Premium adaptée',
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
        'L’historique des visiteurs de cette carte nécessite une offre Premium adaptée',
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
        'Un abonnement équipe actif est requis',
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

    const periodStart = this.getCurrentMonthStart();
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
          : `Quota de ${quota.max} scans IA atteint pour ce mois`,
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

  async assertCanShareCard(userId: string, cardId: string): Promise<ShareQuota> {
    const quota = await this.assertCanShare(userId);
    const unlocked = await this.isOfferCardUnlocked(userId, cardId);
    if (!unlocked) {
      throw new ForbiddenException(
        'Renouvelez votre abonnement pour partager cette carte',
      );
    }
    return quota;
  }

  hasTeamAccess(entitlements: UserEntitlements): boolean {
    return (
      entitlements.audience === OfferAudience.TEAM &&
      entitlements.maxTeamMembers !== 0
    );
  }

  /**
   * Carte pro / membre : l’offre équipe du propriétaire doit être valide.
   * Carte perso : toujours « déverrouillée » (les features Premium sont
   * gated ailleurs). Sans offre perso valide, on retombe sur le plan gratuit.
   */
  async isTeamCardCoveredByValidOffer(card: {
    kind: CardKind;
    teamId: string | null;
  }): Promise<boolean> {
    if (
      card.kind !== CardKind.PROFESSIONAL &&
      card.kind !== CardKind.MEMBER
    ) {
      return true;
    }

    if (!card.teamId) {
      return false;
    }

    const team = await this.prisma.team.findFirst({
      where: { id: card.teamId, isActive: true },
      select: { ownerId: true },
    });
    if (!team) {
      return false;
    }

    const entitlements = await this.getUserEntitlements(team.ownerId);
    return this.hasTeamAccess(entitlements);
  }

  async isOfferCardUnlocked(userId: string, cardId: string): Promise<boolean> {
    const card = await this.prisma.businessCard.findFirst({
      where: { id: cardId, ownerId: userId, isActive: true },
      select: { kind: true, teamId: true },
    });
    if (!card) {
      throw new NotFoundException('Carte introuvable');
    }
    return this.isTeamCardCoveredByValidOffer(card);
  }

  private async findActiveSubscription(userId: string) {
    return this.prisma.subscription.findFirst({
      where: validSubscriptionWhere({ userId }),
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

  /** Quota scans IA : mois calendaire, même si l’abonnement est annuel. */
  private getCurrentMonthStart(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
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
