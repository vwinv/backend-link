import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BillingPeriod,
  OfferAudience,
  OfferBillingType,
  Prisma,
  SubscriptionStatus,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminSubscriptionsQueryDto } from './dto/admin-subscriptions-query.dto';
import { CreateAdminSubscriptionDto } from './dto/create-admin-subscription.dto';

@Injectable()
export class AdminSubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const last30Days = new Date(now);
    last30Days.setDate(last30Days.getDate() - 29);
    last30Days.setHours(0, 0, 0, 0);

    const [
      total,
      active,
      trial,
      cancelled,
      expired,
      pastDue,
      monthly,
      yearly,
      newLast30Days,
      revenue,
      byOffer,
    ] = await Promise.all([
      this.prisma.subscription.count(),
      this.prisma.subscription.count({
        where: { status: SubscriptionStatus.ACTIVE },
      }),
      this.prisma.subscription.count({
        where: { status: SubscriptionStatus.TRIAL },
      }),
      this.prisma.subscription.count({
        where: { status: SubscriptionStatus.CANCELLED },
      }),
      this.prisma.subscription.count({
        where: { status: SubscriptionStatus.EXPIRED },
      }),
      this.prisma.subscription.count({
        where: { status: SubscriptionStatus.PAST_DUE },
      }),
      this.prisma.subscription.count({
        where: {
          billingPeriod: BillingPeriod.MONTHLY,
          status: {
            in: [
              SubscriptionStatus.ACTIVE,
              SubscriptionStatus.TRIAL,
              SubscriptionStatus.PAST_DUE,
            ],
          },
        },
      }),
      this.prisma.subscription.count({
        where: {
          billingPeriod: BillingPeriod.YEARLY,
          status: {
            in: [
              SubscriptionStatus.ACTIVE,
              SubscriptionStatus.TRIAL,
              SubscriptionStatus.PAST_DUE,
            ],
          },
        },
      }),
      this.prisma.subscription.count({
        where: { createdAt: { gte: last30Days } },
      }),
      this.buildRevenueTotals(),
      this.buildOfferBreakdown(),
    ]);

    return {
      generatedAt: now.toISOString(),
      totals: {
        total,
        active,
        trial,
        cancelled,
        expired,
        pastDue,
        paying: active + pastDue,
        newLast30Days,
      },
      billing: {
        monthly,
        yearly,
      },
      revenue,
      byOffer,
      byStatus: [
        { status: 'ACTIVE', label: 'Actifs', count: active },
        { status: 'TRIAL', label: 'Essai', count: trial },
        { status: 'PAST_DUE', label: 'Impayés', count: pastDue },
        { status: 'CANCELLED', label: 'Annulés', count: cancelled },
        { status: 'EXPIRED', label: 'Expirés', count: expired },
      ],
    };
  }

  async list(query: AdminSubscriptionsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.SubscriptionWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.offerId?.trim()) {
      where.offerId = query.offerId.trim();
    }

    const search = query.search?.trim();
    if (search) {
      where.OR = [
        {
          user: {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        {
          team: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
        {
          offer: {
            title: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const [total, rows] = await Promise.all([
      this.prisma.subscription.count({ where }),
      this.prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          billingPeriod: true,
          currentPeriodEnd: true,
          cancelledAt: true,
          createdAt: true,
          updatedAt: true,
          stripeSubscriptionId: true,
          paydunyaInvoiceToken: true,
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          offer: {
            select: {
              id: true,
              title: true,
              slug: true,
              audience: true,
            },
          },
          offerPrice: {
            select: {
              id: true,
              billingType: true,
              priceAmount: true,
              currency: true,
              priceLabel: true,
            },
          },
          plan: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
    ]);

    return {
      data: rows.map((row) => this.serialize(row)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async listOffers() {
    const offers = await this.prisma.premiumOffer.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        audience: true,
        minSeats: true,
        listedInApp: true,
        prices: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            billingType: true,
            priceAmount: true,
            pricePerSeat: true,
            currency: true,
            priceLabel: true,
          },
        },
      },
    });

    return offers.map((offer) => ({
      ...offer,
      prices: offer.prices.map((price) => ({
        id: price.id,
        billingType: price.billingType,
        amount: Number(price.priceAmount),
        pricePerSeat:
          price.pricePerSeat == null ? null : Number(price.pricePerSeat),
        currency: price.currency,
        label: price.priceLabel,
      })),
    }));
  }

  async create(dto: CreateAdminSubscriptionDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      select: { id: true, isActive: true },
    });
    if (!user) {
      throw new NotFoundException('Client introuvable');
    }
    if (!user.isActive) {
      throw new BadRequestException('Ce compte client est désactivé');
    }

    const offer = await this.prisma.premiumOffer.findUnique({
      where: { id: dto.offerId },
      include: {
        prices: { where: { isActive: true } },
      },
    });
    if (!offer || !offer.isActive) {
      throw new BadRequestException('Offre introuvable ou inactive');
    }

    const price = offer.prices.find((item) => item.id === dto.offerPriceId);
    if (!price) {
      throw new BadRequestException('Tarif introuvable pour cette offre');
    }

    let teamId = dto.teamId?.trim() || null;
    if (offer.audience === OfferAudience.TEAM) {
      if (teamId) {
        const team = await this.prisma.team.findFirst({
          where: { id: teamId, isActive: true },
          select: { id: true },
        });
        if (!team) {
          throw new BadRequestException('Équipe introuvable');
        }
      } else {
        const ownedTeam = await this.prisma.team.findFirst({
          where: { ownerId: user.id, isActive: true },
          select: { id: true },
          orderBy: { createdAt: 'asc' },
        });
        teamId = ownedTeam?.id ?? null;
      }
    } else {
      teamId = null;
    }

    const minSeats = Math.max(1, offer.minSeats ?? 1);
    const purchasedSeats =
      offer.audience === OfferAudience.TEAM
        ? Math.max(minSeats, dto.purchasedSeats ?? minSeats)
        : null;

    const plan = await this.ensurePremiumPlan(offer.audience);
    const billingPeriod = this.mapBillingPeriod(price.billingType);
    const currentPeriodEnd = dto.currentPeriodEnd
      ? new Date(dto.currentPeriodEnd)
      : this.computePeriodEnd(price.billingType);

    if (Number.isNaN(currentPeriodEnd.getTime())) {
      throw new BadRequestException('Date de fin invalide');
    }

    await this.prisma.subscription.updateMany({
      where: {
        userId: user.id,
        status: {
          in: [
            SubscriptionStatus.TRIAL,
            SubscriptionStatus.ACTIVE,
            SubscriptionStatus.PAST_DUE,
          ],
        },
      },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    const created = await this.prisma.subscription.create({
      data: {
        userId: user.id,
        teamId,
        planId: plan.id,
        offerId: offer.id,
        offerPriceId: price.id,
        purchasedSeats,
        status: dto.status ?? SubscriptionStatus.ACTIVE,
        billingPeriod,
        currentPeriodEnd,
      },
      select: {
        id: true,
        status: true,
        billingPeriod: true,
        currentPeriodEnd: true,
        cancelledAt: true,
        createdAt: true,
        updatedAt: true,
        stripeSubscriptionId: true,
        paydunyaInvoiceToken: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        offer: {
          select: {
            id: true,
            title: true,
            slug: true,
            audience: true,
          },
        },
        offerPrice: {
          select: {
            id: true,
            billingType: true,
            priceAmount: true,
            currency: true,
            priceLabel: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return this.serialize(created);
  }

  private serialize(row: {
    id: string;
    status: SubscriptionStatus;
    billingPeriod: BillingPeriod;
    currentPeriodEnd: Date | null;
    cancelledAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    stripeSubscriptionId: string | null;
    paydunyaInvoiceToken: string | null;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    } | null;
    team: { id: string; name: string; slug: string } | null;
    offer: {
      id: string;
      title: string;
      slug: string;
      audience: OfferAudience;
    } | null;
    offerPrice: {
      id: string;
      billingType: OfferBillingType;
      priceAmount: { toString(): string } | number;
      currency: string;
      priceLabel: string | null;
    } | null;
    plan: { id: string; name: string; slug: string } | null;
  }) {
    return {
      id: row.id,
      status: row.status,
      billingPeriod: row.billingPeriod,
      currentPeriodEnd: row.currentPeriodEnd,
      cancelledAt: row.cancelledAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      paymentProvider: row.stripeSubscriptionId
        ? 'stripe'
        : row.paydunyaInvoiceToken
          ? 'paydunya'
          : null,
      user: row.user
        ? {
            id: row.user.id,
            email: row.user.email,
            firstName: row.user.firstName,
            lastName: row.user.lastName,
            avatarUrl: row.user.avatarUrl,
            fullName:
              `${row.user.firstName} ${row.user.lastName}`.trim() ||
              row.user.email,
          }
        : null,
      team: row.team,
      offer: row.offer,
      plan: row.plan,
      price: row.offerPrice
        ? {
            id: row.offerPrice.id,
            billingType: row.offerPrice.billingType,
            amount: Number(row.offerPrice.priceAmount),
            currency: row.offerPrice.currency,
            label: row.offerPrice.priceLabel,
          }
        : null,
    };
  }

  private async ensurePremiumPlan(audience: OfferAudience) {
    const isTeam = audience === OfferAudience.TEAM;
    const slug = isTeam ? 'premium-team' : 'premium';
    const existing = await this.prisma.plan.findUnique({ where: { slug } });
    if (existing) return existing;

    return this.prisma.plan.create({
      data: {
        id: isTeam ? 'plan_premium_team' : 'plan_premium',
        name: isTeam ? 'DropOne Équipe' : 'DropOne Premium',
        slug,
        description: isTeam
          ? 'Espace équipe et cartes professionnelles DropOne'
          : 'Accès complet aux fonctionnalités Premium DropOne',
        priceMonthly: 0,
        priceYearly: 0,
        maxCards: isTeam ? 10 : 2,
        maxTeamMembers: isTeam ? 10 : 0,
        hasPortfolio: true,
        hasCustomDomain: false,
        hasAnalytics: true,
        features: ['pro_designs', 'wallet', 'analytics'],
        isActive: true,
      },
    });
  }

  private mapBillingPeriod(billingType: OfferBillingType): BillingPeriod {
    switch (billingType) {
      case OfferBillingType.YEARLY:
      case OfferBillingType.LIFETIME:
        return BillingPeriod.YEARLY;
      case OfferBillingType.MONTHLY:
      default:
        return BillingPeriod.MONTHLY;
    }
  }

  private computePeriodEnd(billingType: OfferBillingType): Date {
    const end = new Date();
    switch (billingType) {
      case OfferBillingType.YEARLY:
        end.setFullYear(end.getFullYear() + 1);
        return end;
      case OfferBillingType.LIFETIME:
        end.setFullYear(end.getFullYear() + 100);
        return end;
      case OfferBillingType.MONTHLY:
      default:
        end.setMonth(end.getMonth() + 1);
        return end;
    }
  }

  private async buildRevenueTotals() {
    type TotalsRow = {
      total: number | string;
      active: number | string;
      currency: string | null;
    };

    const rows = await this.prisma.$queryRawUnsafe<TotalsRow[]>(
      `SELECT
         COALESCE(SUM(p."priceAmount"), 0) AS total,
         COALESCE(
           SUM(
             CASE
               WHEN s.status IN ('ACTIVE', 'PAST_DUE') THEN p."priceAmount"
               ELSE 0
             END
           ),
           0
         ) AS active,
         MAX(p.currency) AS currency
       FROM subscriptions s
       INNER JOIN premium_offer_prices p ON p.id = s."offerPriceId"
       WHERE s.status <> 'TRIAL'
         AND s."offerPriceId" IS NOT NULL`,
    );

    const totals = rows[0];
    const toAmount = (value: number | string | undefined) =>
      Math.round(Number(value ?? 0));

    return {
      currency: totals?.currency?.trim() || 'FCFA',
      total: toAmount(totals?.total),
      active: toAmount(totals?.active),
    };
  }

  private async buildOfferBreakdown() {
    type OfferRow = {
      id: string;
      title: string;
      slug: string;
      subscriptions_count: number;
      active_count: number;
      revenue: number | string;
    };

    const rows = await this.prisma.$queryRawUnsafe<OfferRow[]>(
      `SELECT
         o.id,
         o.title,
         o.slug,
         COUNT(s.id)::int AS subscriptions_count,
         COUNT(*) FILTER (
           WHERE s.status IN ('ACTIVE', 'TRIAL', 'PAST_DUE')
         )::int AS active_count,
         COALESCE(
           SUM(
             CASE
               WHEN s.status <> 'TRIAL' AND s."offerPriceId" IS NOT NULL
               THEN p."priceAmount"
               ELSE 0
             END
           ),
           0
         ) AS revenue
       FROM premium_offers o
       LEFT JOIN subscriptions s ON s."offerId" = o.id
       LEFT JOIN premium_offer_prices p ON p.id = s."offerPriceId"
       GROUP BY o.id, o.title, o.slug
       ORDER BY subscriptions_count DESC, o.title ASC`,
    );

    return rows.map((row) => ({
      offerId: row.id,
      title: row.title,
      slug: row.slug,
      subscriptionsCount: Number(row.subscriptions_count),
      activeCount: Number(row.active_count),
      revenue: Math.round(Number(row.revenue ?? 0)),
    }));
  }
}
