import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BillingPeriod,
  OfferAudience,
  OfferBillingType,
  SubscriptionStatus,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscribeDto } from './dto/subscribe.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOffers() {
    const offers = await this.prisma.premiumOffer.findMany({
      where: { isActive: true },
      include: {
        prices: {
          where: { isActive: true },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return offers.map((offer) => this.toOfferResponse(offer));
  }

  getPlans() {
    return this.getOffers();
  }

  getPlan(slug: string) {
    return { message: 'getPlan', slug };
  }

  async getMySubscription(userId: string) {
    const subscription = await this.findActiveSubscription(userId);
    if (!subscription) {
      throw new NotFoundException('Aucun abonnement actif');
    }

    return this.toSubscriptionResponse(subscription);
  }

  async subscribe(userId: string, dto: SubscribeDto) {
    const offer = await this.prisma.premiumOffer.findFirst({
      where: { slug: dto.offerSlug, isActive: true },
      include: {
        prices: {
          where: {
            billingType: dto.billingType,
            isActive: true,
          },
        },
      },
    });

    if (!offer) {
      throw new NotFoundException('Offre Premium introuvable');
    }

    const price = offer.prices[0];
    if (!price) {
      throw new BadRequestException(
        'Ce mode de paiement n’est pas disponible pour cette offre',
      );
    }

    if (dto.teamId && offer.audience !== OfferAudience.TEAM) {
      throw new BadRequestException(
        'Cette offre ne couvre pas un espace équipe',
      );
    }

    const plan = await this.ensurePremiumPlan(offer);
    const billingPeriod = this.mapBillingPeriod(price.billingType);
    const currentPeriodEnd = this.computePeriodEnd(price.billingType);

    await this.prisma.subscription.updateMany({
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
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        teamId: dto.teamId ?? null,
        planId: plan.id,
        offerId: offer.id,
        offerPriceId: price.id,
        status: SubscriptionStatus.ACTIVE,
        billingPeriod,
        currentPeriodEnd,
      },
      include: {
        plan: true,
        offer: true,
        offerPrice: true,
      },
    });

    return this.toSubscriptionResponse(subscription);
  }

  cancel() {
    return { message: 'cancel subscription' };
  }

  handleWebhook() {
    return { message: 'payment webhook' };
  }

  private async ensurePremiumPlan(offer?: {
    audience: OfferAudience;
    canCustomize: boolean;
    maxTeamMembers: number;
    hasPortfolio: boolean;
    maxAiScans: number;
  }) {
    const isTeam = offer?.audience === OfferAudience.TEAM;

    return this.prisma.plan.upsert({
      where: { slug: isTeam ? 'premium-team' : 'premium' },
      update: {
        ...(offer && {
          maxTeamMembers: offer.maxTeamMembers,
          hasPortfolio: offer.hasPortfolio,
          features: this.buildPlanFeatures(offer),
        }),
      },
      create: {
        id: isTeam ? 'plan_premium_team' : 'plan_premium',
        name: isTeam ? 'Link Premium Équipe' : 'Link Premium',
        slug: isTeam ? 'premium-team' : 'premium',
        description: isTeam
          ? 'Espace équipe et cartes professionnelles Link'
          : 'Accès complet aux fonctionnalités Premium Link',
        priceMonthly: 0,
        priceYearly: 0,
        maxCards: isTeam ? 10 : 2,
        maxTeamMembers: offer?.maxTeamMembers ?? (isTeam ? 5 : 0),
        hasPortfolio: offer?.hasPortfolio ?? true,
        hasCustomDomain: false,
        hasAnalytics: true,
        features: this.buildPlanFeatures(
          offer ?? {
            audience: isTeam ? OfferAudience.TEAM : OfferAudience.PERSONAL,
            canCustomize: true,
            maxTeamMembers: isTeam ? 5 : 0,
            hasPortfolio: true,
            maxAiScans: -1,
          },
        ),
        isActive: true,
      },
    });
  }

  private buildPlanFeatures(offer: {
    audience: OfferAudience;
    canCustomize: boolean;
    maxTeamMembers: number;
    hasPortfolio: boolean;
    maxAiScans: number;
  }) {
    const features = ['pro_designs'];

    if (offer.canCustomize) {
      features.push('custom_colors');
    }
    if (offer.hasPortfolio) {
      features.push('portfolio');
    }
    if (offer.audience === OfferAudience.TEAM) {
      features.push('team');
    }
    if (offer.maxAiScans < 0) {
      features.push('unlimited_scan');
    } else if (offer.maxAiScans > 0) {
      features.push(`scan_quota:${offer.maxAiScans}`);
    }

    return features;
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
      include: { plan: true, offer: true, offerPrice: true },
      orderBy: { createdAt: 'desc' },
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

  private toSubscriptionResponse(subscription: {
    id: string;
    status: SubscriptionStatus;
    billingPeriod: BillingPeriod;
    currentPeriodEnd: Date | null;
    plan: { name: string; slug: string };
    offer?: {
      title: string;
      slug: string;
      audience: OfferAudience;
      canCustomize: boolean;
      maxTeamMembers: number;
      hasPortfolio: boolean;
      maxAiScans: number;
    } | null;
    offerPrice?: { billingType: OfferBillingType } | null;
  }) {
    const offer = subscription.offer ?? null;

    return {
      id: subscription.id,
      status: subscription.status,
      billingPeriod: subscription.billingPeriod,
      planName: subscription.plan.name,
      planSlug: subscription.plan.slug,
      offerTitle: offer?.title ?? subscription.plan.name,
      offerSlug: offer?.slug ?? subscription.plan.slug,
      billingType: subscription.offerPrice?.billingType ?? null,
      entitlements: this.toEntitlementsResponse(offer),
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
    };
  }

  private toEntitlementsResponse(
    offer?: {
      audience: OfferAudience;
      canCustomize: boolean;
      maxTeamMembers: number;
      hasPortfolio: boolean;
      maxAiScans: number;
    } | null,
  ) {
    return {
      audience: offer?.audience ?? OfferAudience.PERSONAL,
      canCustomize: offer?.canCustomize ?? false,
      maxTeamMembers: offer?.maxTeamMembers ?? 0,
      hasPortfolio: offer?.hasPortfolio ?? false,
      maxAiScans: offer?.maxAiScans ?? 0,
    };
  }

  private toOfferResponse(offer: {
    id: string;
    title: string;
    slug: string;
    subtitle: string | null;
    audience: OfferAudience;
    canCustomize: boolean;
    maxTeamMembers: number;
    hasPortfolio: boolean;
    maxAiScans: number;
    sortOrder: number;
    prices: Array<{
      id: string;
      billingType: OfferBillingType;
      priceLabel: string | null;
      priceAmount: { toNumber?: () => number } | number;
      currency: string;
      discountPercent: number | null;
      badgeLabel: string | null;
      isPopular: boolean;
      sortOrder: number;
    }>;
  }) {
    return {
      id: offer.id,
      title: offer.title,
      slug: offer.slug,
      subtitle: offer.subtitle,
      audience: offer.audience,
      canCustomize: offer.canCustomize,
      maxTeamMembers: offer.maxTeamMembers,
      hasPortfolio: offer.hasPortfolio,
      maxAiScans: offer.maxAiScans,
      sortOrder: offer.sortOrder,
      prices: offer.prices.map((price) => this.toOfferPriceResponse(price)),
    };
  }

  private toOfferPriceResponse(price: {
    id: string;
    billingType: OfferBillingType;
    priceLabel: string | null;
    priceAmount: { toNumber?: () => number } | number;
    currency: string;
    discountPercent: number | null;
    badgeLabel: string | null;
    isPopular: boolean;
    sortOrder: number;
  }) {
    const priceAmount =
      typeof price.priceAmount === 'number'
        ? price.priceAmount
        : Number(price.priceAmount);

    return {
      id: price.id,
      billingType: price.billingType,
      priceLabel: price.priceLabel,
      priceAmount,
      currency: price.currency,
      discountPercent: price.discountPercent,
      badgeLabel: price.badgeLabel,
      isPopular: price.isPopular,
      sortOrder: price.sortOrder,
    };
  }
}
