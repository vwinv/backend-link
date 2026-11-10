import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PointsLedgerReason,
  PointsProductType,
  Prisma,
} from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { FREE_OFFER_SLUG } from '../subscriptions/free-offer.constants';
import { ApplyReferralCodeDto } from './dto/apply-referral-code.dto';
import { RedeemPointsDto } from './dto/redeem-points.dto';
import {
  CARD_VISIT_REWARD_TENTHS,
  POINTS_FCFA_PER_POINT,
  REFERRAL_SUBSCRIBE_REWARD_TENTHS,
  fcfaToTenths,
  tenthsToFcfa,
  tenthsToPoints,
} from './points.constants';

@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: string) {
    const [user, account, ledger, referralCount] = await Promise.all([
      this.ensureReferralCode(userId),
      this.ensureAccount(userId),
      this.prisma.pointsLedgerEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
      this.prisma.user.count({ where: { referredByUserId: userId } }),
    ]);

    return {
      referralCode: user.referralCode,
      balancePoints: tenthsToPoints(account.balanceTenths),
      balanceTenths: account.balanceTenths,
      balanceFcfa: tenthsToFcfa(account.balanceTenths),
      fcfaPerPoint: POINTS_FCFA_PER_POINT,
      referralCount,
      visitRewardPoints: tenthsToPoints(CARD_VISIT_REWARD_TENTHS),
      referralSubscribeRewardPoints: tenthsToPoints(
        REFERRAL_SUBSCRIBE_REWARD_TENTHS,
      ),
      ledger: ledger.map((row) => ({
        id: row.id,
        amountPoints: tenthsToPoints(row.amountTenths),
        reason: row.reason,
        productType: row.productType,
        productRef: row.productRef,
        createdAt: row.createdAt.toISOString(),
      })),
    };
  }

  async applyReferralCode(userId: string, dto: ApplyReferralCodeDto) {
    const code = dto.code.trim().toUpperCase();
    const me = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        referredByUserId: true,
        referralCode: true,
        createdAt: true,
      },
    });
    if (!me) throw new NotFoundException('Utilisateur introuvable');
    if (me.referredByUserId) {
      throw new BadRequestException('Un code de parrainage est déjà enregistré');
    }
    // Uniquement juste après la création du compte (fenêtre 24 h).
    const ageMs = Date.now() - me.createdAt.getTime();
    if (ageMs > 24 * 60 * 60 * 1000) {
      throw new BadRequestException(
        'Le code de parrainage ne peut être saisi qu’à la création du compte',
      );
    }
    if (me.referralCode && me.referralCode === code) {
      throw new BadRequestException('Vous ne pouvez pas utiliser votre propre code');
    }

    const sponsor = await this.prisma.user.findFirst({
      where: { referralCode: code, isActive: true },
      select: { id: true, referralCode: true },
    });
    if (!sponsor) {
      throw new NotFoundException('Code de parrainage invalide');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { referredByUserId: sponsor.id },
    });

    return {
      ok: true,
      referralCode: sponsor.referralCode,
      message: 'Code de parrainage enregistré',
    };
  }

  /**
   * Crédit 0,1 pt au propriétaire pour chaque personne distincte qui visite
   * (pas à chaque ouverture de carte). Hors soi-même.
   */
  async creditCardVisit(input: {
    cardOwnerId: string;
    cardViewId: string;
    viewerUserId?: string | null;
    /** Empreinte anonyme (hash IP+UA) quand le visiteur n’a pas de compte. */
    visitorKey?: string | null;
  }) {
    if (
      input.viewerUserId &&
      input.viewerUserId === input.cardOwnerId
    ) {
      return { credited: false };
    }

    const existing = await this.prisma.pointsLedgerEntry.findUnique({
      where: { cardViewId: input.cardViewId },
      select: { id: true },
    });
    if (existing) return { credited: false };

    // Déjà crédité pour cette personne → ignorer les visites suivantes.
    if (input.viewerUserId) {
      const alreadyForUser = await this.prisma.pointsLedgerEntry.findFirst({
        where: {
          userId: input.cardOwnerId,
          reason: PointsLedgerReason.CARD_VISIT,
          relatedUserId: input.viewerUserId,
        },
        select: { id: true },
      });
      if (alreadyForUser) return { credited: false };
    } else if (input.visitorKey) {
      const alreadyForKey = await this.prisma.pointsLedgerEntry.findFirst({
        where: {
          userId: input.cardOwnerId,
          reason: PointsLedgerReason.CARD_VISIT,
          relatedUserId: null,
          meta: {
            path: ['visitorKey'],
            equals: input.visitorKey,
          },
        },
        select: { id: true },
      });
      if (alreadyForKey) return { credited: false };
    } else {
      // Pas d’identité stable → pas de crédit (évite le farm par refresh).
      return { credited: false };
    }

    try {
      await this.credit({
        userId: input.cardOwnerId,
        amountTenths: CARD_VISIT_REWARD_TENTHS,
        reason: PointsLedgerReason.CARD_VISIT,
        relatedUserId: input.viewerUserId ?? undefined,
        cardViewId: input.cardViewId,
        meta: {
          viewerUserId: input.viewerUserId ?? null,
          visitorKey: input.visitorKey ?? null,
        },
      });
      return { credited: true };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return { credited: false };
      }
      throw error;
    }
  }

  /**
   * Quand un filleul souscrit (offre payante), le parrain gagne 1 point (une fois).
   */
  async creditReferralOnSubscribe(input: {
    subscriberUserId: string;
    subscriptionId: string;
    offerSlug: string;
  }) {
    if (input.offerSlug === FREE_OFFER_SLUG) {
      return { credited: false };
    }

    const subscriber = await this.prisma.user.findUnique({
      where: { id: input.subscriberUserId },
      select: { referredByUserId: true },
    });
    const sponsorId = subscriber?.referredByUserId;
    if (!sponsorId) return { credited: false };

    const already = await this.prisma.pointsLedgerEntry.findFirst({
      where: {
        reason: PointsLedgerReason.REFERRAL_SUBSCRIBE,
        relatedUserId: input.subscriberUserId,
      },
      select: { id: true },
    });
    if (already) return { credited: false };

    const bySub = await this.prisma.pointsLedgerEntry.findUnique({
      where: { subscriptionId: input.subscriptionId },
      select: { id: true },
    });
    if (bySub) return { credited: false };

    try {
      await this.credit({
        userId: sponsorId,
        amountTenths: REFERRAL_SUBSCRIBE_REWARD_TENTHS,
        reason: PointsLedgerReason.REFERRAL_SUBSCRIBE,
        relatedUserId: input.subscriberUserId,
        subscriptionId: input.subscriptionId,
        meta: { offerSlug: input.offerSlug },
      });
      return { credited: true, sponsorId };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return { credited: false };
      }
      throw error;
    }
  }

  /**
   * Achète un produit avec des points.
   * Aujourd’hui : SUBSCRIPTION. CARD_THEME prévu pour plus tard.
   */
  async quoteProduct(dto: RedeemPointsDto) {
    if (dto.productType === PointsProductType.CARD_THEME) {
      throw new BadRequestException(
        'Les thèmes payants arriveront bientôt. Les points pourront les acheter.',
      );
    }
    if (dto.productType !== PointsProductType.SUBSCRIPTION) {
      throw new BadRequestException('Produit non supporté');
    }
    if (!dto.billingType) {
      throw new BadRequestException('billingType requis pour un abonnement');
    }

    // Le montant exact est calculé côté SubscriptionsService à l’achat.
    return {
      productType: dto.productType,
      productRef: dto.productRef,
      billingType: dto.billingType,
      fcfaPerPoint: POINTS_FCFA_PER_POINT,
    };
  }

  async debitForPurchase(input: {
    userId: string;
    amountTenths: number;
    productType: PointsProductType;
    productRef: string;
    subscriptionId?: string;
    meta?: Record<string, unknown>;
  }) {
    if (input.amountTenths <= 0) {
      throw new BadRequestException('Montant points invalide');
    }
    await this.ensureAccount(input.userId);

    return this.prisma.$transaction(async (tx) => {
      const account = await tx.userPointsAccount.findUnique({
        where: { userId: input.userId },
      });
      if (!account || account.balanceTenths < input.amountTenths) {
        throw new ForbiddenException('Solde de points insuffisant');
      }

      const updated = await tx.userPointsAccount.update({
        where: { userId: input.userId },
        data: { balanceTenths: { decrement: input.amountTenths } },
      });

      const entry = await tx.pointsLedgerEntry.create({
        data: {
          userId: input.userId,
          amountTenths: -input.amountTenths,
          reason: PointsLedgerReason.PURCHASE,
          productType: input.productType,
          productRef: input.productRef,
          subscriptionId: input.subscriptionId ?? null,
          meta: (input.meta ?? undefined) as Prisma.InputJsonValue | undefined,
        },
      });

      return {
        balanceTenths: updated.balanceTenths,
        balancePoints: tenthsToPoints(updated.balanceTenths),
        entryId: entry.id,
      };
    });
  }

  fcfaToRequiredTenths(amountFcfa: number): number {
    return fcfaToTenths(amountFcfa);
  }

  /** Remboursement / ajustement manuel (ex. échec d’achat). */
  async creditAdjustment(input: {
    userId: string;
    amountTenths: number;
    meta?: Record<string, unknown>;
  }) {
    await this.credit({
      userId: input.userId,
      amountTenths: input.amountTenths,
      reason: PointsLedgerReason.ADJUSTMENT,
      meta: input.meta,
    });
  }

  private async credit(input: {
    userId: string;
    amountTenths: number;
    reason: PointsLedgerReason;
    productType?: PointsProductType;
    productRef?: string;
    relatedUserId?: string;
    cardViewId?: string;
    subscriptionId?: string;
    meta?: Record<string, unknown>;
  }) {
    if (input.amountTenths === 0) return;
    await this.ensureAccount(input.userId);

    await this.prisma.$transaction(async (tx) => {
      await tx.userPointsAccount.update({
        where: { userId: input.userId },
        data: { balanceTenths: { increment: input.amountTenths } },
      });
      await tx.pointsLedgerEntry.create({
        data: {
          userId: input.userId,
          amountTenths: input.amountTenths,
          reason: input.reason,
          productType: input.productType ?? null,
          productRef: input.productRef ?? null,
          relatedUserId: input.relatedUserId ?? null,
          cardViewId: input.cardViewId ?? null,
          subscriptionId: input.subscriptionId ?? null,
          meta: (input.meta ?? undefined) as Prisma.InputJsonValue | undefined,
        },
      });
    });
  }

  private async ensureAccount(userId: string) {
    return this.prisma.userPointsAccount.upsert({
      where: { userId },
      create: { userId, balanceTenths: 0 },
      update: {},
    });
  }

  private async ensureReferralCode(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, referralCode: true, firstName: true },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    if (user.referralCode?.startsWith('DROP-')) return user;

    for (let attempt = 0; attempt < 8; attempt++) {
      const code = this.generateCode();
      try {
        return await this.prisma.user.update({
          where: { id: userId },
          data: { referralCode: code },
          select: { id: true, referralCode: true, firstName: true },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          continue;
        }
        throw error;
      }
    }
    throw new BadRequestException('Impossible de générer un code de parrainage');
  }

  private generateCode(): string {
    const suffix = randomBytes(3).toString('hex').toUpperCase();
    return `DROP-${suffix}`;
  }
}
