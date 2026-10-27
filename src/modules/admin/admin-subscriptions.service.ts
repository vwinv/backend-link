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
import { UpdateAdminSubscriptionDto } from './dto/update-admin-subscription.dto';
import { effectiveTeamSeats, paidExtraSeats } from '../subscriptions/team-seats';

@Injectable()
export class AdminSubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly adminSelect = {
    id: true,
    status: true,
    billingPeriod: true,
    currentPeriodEnd: true,
    cancelledAt: true,
    purchasedSeats: true,
    totalAmount: true,
    countsInRevenue: true,
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
        maxTeamMembers: true,
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
  } as const;

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
        select: this.adminSelect,
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
        maxTeamMembers: true,
        listedInApp: true,
        prices: {
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
          select: {
            id: true,
            billingType: true,
            priceAmount: true,
            pricePerSeat: true,
            currency: true,
            priceLabel: true,
            isActive: true,
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
        isActive: price.isActive,
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
        prices: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
      },
    });
    if (!offer || !offer.isActive) {
      throw new BadRequestException('Offre introuvable ou inactive');
    }

    const price =
      (dto.offerPriceId
        ? offer.prices.find((item) => item.id === dto.offerPriceId)
        : offer.prices.find((item) => item.isActive) ?? offer.prices[0]) ??
      null;
    if (dto.offerPriceId && !price) {
      throw new BadRequestException('Tarif introuvable pour cette offre');
    }
    if (!price && offer.prices.length > 0) {
      throw new BadRequestException('Choisissez un tarif pour cette offre');
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

    const purchasedSeats = this.resolvePurchasedSeats(
      offer,
      dto.purchasedSeats,
    );

    const plan = await this.ensurePremiumPlan(offer.audience);
    const billingType = price?.billingType ?? OfferBillingType.MONTHLY;
    const billingPeriod = this.mapBillingPeriod(billingType);
    const currentPeriodEnd = dto.currentPeriodEnd
      ? new Date(dto.currentPeriodEnd)
      : this.computePeriodEnd(billingType);

    if (Number.isNaN(currentPeriodEnd.getTime())) {
      throw new BadRequestException('Date de fin invalide');
    }

    const periodStart = new Date();
    this.assertPeriodCovers(billingType, periodStart, currentPeriodEnd);
    const totalAmount = price
      ? this.computeTotalAmount(
          offer,
          price,
          purchasedSeats,
          periodStart,
          currentPeriodEnd,
        )
      : null;

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
        offerPriceId: price?.id ?? null,
        purchasedSeats,
        status: dto.status ?? SubscriptionStatus.ACTIVE,
        billingPeriod,
        currentPeriodEnd,
        totalAmount,
        countsInRevenue: dto.countsInRevenue ?? true,
      },
      select: this.adminSelect,
    });

    return this.serialize(created);
  }

  async findOne(id: string) {
    const row = await this.prisma.subscription.findUnique({
      where: { id },
      select: this.adminSelect,
    });
    if (!row) {
      throw new NotFoundException('Abonnement introuvable');
    }
    return this.serialize(row);
  }

  async update(id: string, dto: UpdateAdminSubscriptionDto) {
    const existing = await this.prisma.subscription.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        teamId: true,
        offerId: true,
        offerPriceId: true,
        status: true,
        billingPeriod: true,
        purchasedSeats: true,
        totalAmount: true,
        currentPeriodEnd: true,
        cancelledAt: true,
        createdAt: true,
      },
    });
    if (!existing) {
      throw new NotFoundException('Abonnement introuvable');
    }
    if (!existing.userId) {
      throw new BadRequestException('Cet abonnement n’est lié à aucun client');
    }

    const offerId = dto.offerId?.trim() || existing.offerId;
    if (!offerId) {
      throw new BadRequestException('Offre requise');
    }

    const offer = await this.prisma.premiumOffer.findUnique({
      where: { id: offerId },
      include: {
        prices: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
      },
    });
    if (!offer) {
      throw new BadRequestException('Offre introuvable');
    }
    if (
      !offer.isActive &&
      dto.offerId &&
      dto.offerId !== existing.offerId
    ) {
      throw new BadRequestException('Cette offre est inactive');
    }

    const requestedPriceId = dto.offerPriceId?.trim() || existing.offerPriceId;
    const price =
      offer.prices.find((item) => item.id === requestedPriceId) ??
      offer.prices.find((item) => item.isActive) ??
      offer.prices[0] ??
      null;
    if (dto.offerPriceId && !price) {
      throw new BadRequestException('Tarif introuvable pour cette offre');
    }

    let teamId = dto.teamId !== undefined ? dto.teamId.trim() || null : existing.teamId;
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
          where: { ownerId: existing.userId, isActive: true },
          select: { id: true },
          orderBy: { createdAt: 'asc' },
        });
        teamId = ownedTeam?.id ?? null;
      }
    } else {
      teamId = null;
    }

    const purchasedSeats = this.resolvePurchasedSeats(
      offer,
      dto.purchasedSeats ?? existing.purchasedSeats,
    );

    const plan = await this.ensurePremiumPlan(offer.audience);
    const billingPeriod = price
      ? this.mapBillingPeriod(price.billingType)
      : existing.billingPeriod;
    const currentPeriodEnd =
      dto.currentPeriodEnd !== undefined
        ? new Date(dto.currentPeriodEnd)
        : existing.currentPeriodEnd;
    if (currentPeriodEnd && Number.isNaN(currentPeriodEnd.getTime())) {
      throw new BadRequestException('Date de fin invalide');
    }
    const pricedBillingType = price?.billingType ?? OfferBillingType.MONTHLY;
    if (currentPeriodEnd) {
      this.assertPeriodCovers(
        pricedBillingType,
        existing.createdAt,
        currentPeriodEnd,
      );
    }
    const totalAmount =
      existing.totalAmount != null && price && currentPeriodEnd
        ? this.computeTotalAmount(
            offer,
            price,
            purchasedSeats,
            existing.createdAt,
            currentPeriodEnd,
          )
        : existing.totalAmount;

    const nextStatus = dto.status ?? existing.status;
    const becomingActive = (
      [
        SubscriptionStatus.ACTIVE,
        SubscriptionStatus.TRIAL,
        SubscriptionStatus.PAST_DUE,
      ] as SubscriptionStatus[]
    ).includes(nextStatus);
    const cancelledAt = becomingActive
      ? null
      : nextStatus === SubscriptionStatus.CANCELLED ||
          nextStatus === SubscriptionStatus.EXPIRED
        ? existing.cancelledAt ?? new Date()
        : existing.cancelledAt;

    if (becomingActive) {
      await this.prisma.subscription.updateMany({
        where: {
          userId: existing.userId,
          id: { not: existing.id },
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
    }

    const updated = await this.prisma.subscription.update({
      where: { id: existing.id },
      data: {
        offerId: offer.id,
        offerPriceId: price?.id ?? null,
        planId: plan.id,
        teamId,
        purchasedSeats,
        status: nextStatus,
        billingPeriod,
        currentPeriodEnd,
        totalAmount,
        ...(dto.countsInRevenue !== undefined && {
          countsInRevenue: dto.countsInRevenue,
        }),
        cancelledAt,
      },
      select: this.adminSelect,
    });

    return this.serialize(updated);
  }

  async remove(id: string) {
    const existing = await this.prisma.subscription.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Abonnement introuvable');
    }

    await this.prisma.subscription.delete({ where: { id } });
    return { deleted: true, id };
  }

  private serialize(row: {
    id: string;
    status: SubscriptionStatus;
    billingPeriod: BillingPeriod;
    currentPeriodEnd: Date | null;
    cancelledAt: Date | null;
    purchasedSeats: number | null;
    totalAmount: { toString(): string } | number | null;
    countsInRevenue: boolean;
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
      maxTeamMembers: number;
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
      purchasedSeats: this.displayedPurchasedSeats(row),
      totalAmount:
        row.totalAmount == null ? null : Math.round(Number(row.totalAmount)),
      countsInRevenue: row.countsInRevenue,
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

  private displayedPurchasedSeats(row: {
    purchasedSeats: number | null;
    offer: { audience: OfferAudience; maxTeamMembers: number } | null;
  }): number | null {
    const offer = row.offer;
    if (!offer || offer.audience !== OfferAudience.TEAM) {
      return row.purchasedSeats;
    }
    const seats = effectiveTeamSeats(offer.maxTeamMembers, row.purchasedSeats);
    return seats < 0 ? row.purchasedSeats : seats;
  }

  private resolvePurchasedSeats(
    offer: { audience: OfferAudience; maxTeamMembers: number; minSeats: number },
    requested?: number | null,
  ): number | null {
    if (offer.audience !== OfferAudience.TEAM) return null;
    if (offer.maxTeamMembers < 0) {
      return requested != null && requested > 0 ? requested : null;
    }
    const included = Math.max(offer.maxTeamMembers, 0);
    const floor = Math.max(included, Math.max(1, offer.minSeats || 1));
    const seats = requested != null && requested > 0 ? requested : floor;
    return Math.max(floor, seats);
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

  private calendarDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /** Mois entamés entre deux dates. Le jour anniversaire compte pour un mois plein. */
  private monthsCovered(start: Date, end: Date): number {
    const startDay = this.calendarDay(start);
    const endDay = this.calendarDay(end);
    if (endDay.getTime() <= startDay.getTime()) return 0;
    let months =
      (endDay.getFullYear() - startDay.getFullYear()) * 12 +
      (endDay.getMonth() - startDay.getMonth());
    if (endDay.getDate() > startDay.getDate()) months += 1;
    return Math.max(months, 1);
  }

  private assertPeriodCovers(
    billingType: OfferBillingType,
    start: Date,
    end: Date,
  ) {
    if (billingType === OfferBillingType.LIFETIME) return;
    const endDay = this.calendarDay(end);
    const min = this.calendarDay(start);
    if (billingType === OfferBillingType.YEARLY) {
      min.setFullYear(min.getFullYear() + 1);
      if (endDay < min) {
        throw new BadRequestException('Un tarif annuel dure au moins 1 an');
      }
      return;
    }
    min.setMonth(min.getMonth() + 1);
    if (endDay < min) {
      throw new BadRequestException('Un tarif mensuel dure au moins 1 mois');
    }
  }

  private billingUnits(
    billingType: OfferBillingType,
    start: Date,
    end: Date,
  ): number {
    if (billingType === OfferBillingType.LIFETIME) return 1;
    const months = this.monthsCovered(start, end);
    if (billingType === OfferBillingType.YEARLY) {
      return Math.max(1, Math.ceil(months / 12));
    }
    return Math.max(1, months);
  }

  private computeTotalAmount(
    offer: { audience: OfferAudience; maxTeamMembers: number },
    price: {
      billingType: OfferBillingType;
      priceAmount: { toString(): string } | number;
      pricePerSeat?: { toString(): string } | number | null;
    },
    purchasedSeats: number | null,
    start: Date,
    end: Date,
  ): number {
    const base = Number(price.priceAmount);
    const perSeat =
      price.pricePerSeat == null ? NaN : Number(price.pricePerSeat);
    let periodAmount = Number.isFinite(base) ? base : 0;
    if (
      offer.audience === OfferAudience.TEAM &&
      offer.maxTeamMembers > 0 &&
      Number.isFinite(perSeat) &&
      perSeat > 0
    ) {
      periodAmount += perSeat * paidExtraSeats(offer.maxTeamMembers, purchasedSeats);
    }
    const units = this.billingUnits(price.billingType, start, end);
    return Math.round(periodAmount * units);
  }

  private async buildRevenueTotals() {
    type TotalsRow = {
      total: number | string;
      active: number | string;
      currency: string | null;
    };

    const rows = await this.prisma.$queryRawUnsafe<TotalsRow[]>(
      `SELECT
         COALESCE(SUM(COALESCE(s."totalAmount", p."priceAmount")), 0) AS total,
         COALESCE(
           SUM(
             CASE
               WHEN s.status IN ('ACTIVE', 'PAST_DUE')
               THEN COALESCE(s."totalAmount", p."priceAmount")
               ELSE 0
             END
           ),
           0
         ) AS active,
         MAX(p.currency) AS currency
       FROM subscriptions s
       INNER JOIN premium_offer_prices p ON p.id = s."offerPriceId"
       WHERE s.status <> 'TRIAL'
         AND s."offerPriceId" IS NOT NULL
         AND s."countsInRevenue" = true`,
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
               WHEN s.status <> 'TRIAL'
                 AND s."offerPriceId" IS NOT NULL
                 AND s."countsInRevenue" = true
               THEN COALESCE(s."totalAmount", p."priceAmount")
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
