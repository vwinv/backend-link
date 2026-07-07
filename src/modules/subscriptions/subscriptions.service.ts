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
import type Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { StripeService } from './stripe.service';

type ActivateSubscriptionInput = {
  userId: string;
  offerSlug: string;
  billingType: OfferBillingType;
  teamId?: string | null;
  offerPriceId?: string | null;
  stripeSubscriptionId?: string | null;
  stripeCheckoutSessionId?: string | null;
  currentPeriodEnd?: Date | null;
};

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  getPaymentConfig() {
    return {
      paymentsEnabled: this.stripeService.isEnabled(),
    };
  }

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

  async createCheckout(userId: string, dto: CheckoutDto) {
    if (!this.stripeService.isEnabled()) {
      throw new BadRequestException(
        'Le paiement Stripe est désactivé. Utilisez /subscriptions/subscribe pour les tests.',
      );
    }

    const { offer, price } = await this.resolveOfferPrice(
      dto.offerSlug,
      dto.billingType,
    );

    if (dto.teamId && offer.audience !== OfferAudience.TEAM) {
      throw new BadRequestException(
        'Cette offre ne couvre pas un espace équipe',
      );
    }

    if (!price.stripePriceId?.trim()) {
      throw new BadRequestException(
        'Cette offre n’est pas encore configurée pour le paiement en ligne',
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const customerId = await this.ensureStripeCustomer(user);

    const session = await this.stripeService.createCheckoutSession({
      customerId,
      stripePriceId: price.stripePriceId,
      billingType: price.billingType,
      userId,
      offerSlug: offer.slug,
      offerPriceId: price.id,
      teamId: dto.teamId ?? null,
    });

    if (!session.url) {
      throw new BadRequestException('Impossible de créer la session de paiement');
    }

    return {
      checkoutUrl: session.url,
      sessionId: session.id,
    };
  }

  async subscribe(userId: string, dto: SubscribeDto) {
    if (this.stripeService.isEnabled()) {
      throw new BadRequestException(
        'Un paiement en ligne est requis pour souscrire à cette offre',
      );
    }

    this.stripeService.logDisabledCheckoutAttempt(userId);

    const { offer, price } = await this.resolveOfferPrice(
      dto.offerSlug,
      dto.billingType,
    );

    if (dto.teamId && offer.audience !== OfferAudience.TEAM) {
      throw new BadRequestException(
        'Cette offre ne couvre pas un espace équipe',
      );
    }

    const subscription = await this.activateSubscription({
      userId,
      offerSlug: offer.slug,
      billingType: price.billingType,
      teamId: dto.teamId ?? null,
      offerPriceId: price.id,
    });

    return this.toSubscriptionResponse(subscription);
  }

  async handleStripeWebhook(payload: Buffer, signature?: string) {
    if (!this.stripeService.isEnabled()) {
      throw new BadRequestException('Stripe est désactivé');
    }

    if (!signature) {
      throw new BadRequestException('Signature Stripe manquante');
    }

    const event = this.stripeService.constructWebhookEvent(payload, signature);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case 'customer.subscription.updated':
        await this.handleStripeSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;
      case 'customer.subscription.deleted':
        await this.handleStripeSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(
          event.data.object as Stripe.Invoice,
        );
        break;
      default:
        break;
    }

    return { received: true };
  }

  cancel() {
    return { message: 'cancel subscription' };
  }

  private async resolveOfferPrice(offerSlug: string, billingType: OfferBillingType) {
    const offer = await this.prisma.premiumOffer.findFirst({
      where: { slug: offerSlug, isActive: true },
      include: {
        prices: {
          where: {
            billingType,
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

    return { offer, price };
  }

  private async ensureStripeCustomer(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    stripeCustomerId: string | null;
  }) {
    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    const customer = await this.stripeService.createCustomer({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      userId: user.id,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });

    return customer.id;
  }

  private async activateSubscription(input: ActivateSubscriptionInput) {
    const { offer, price } = await this.resolveOfferPrice(
      input.offerSlug,
      input.billingType,
    );

    if (input.offerPriceId && input.offerPriceId !== price.id) {
      throw new BadRequestException('Tarif d’offre invalide');
    }

    const plan = await this.ensurePremiumPlan(offer);
    const billingPeriod = this.mapBillingPeriod(price.billingType);
    const currentPeriodEnd =
      input.currentPeriodEnd ?? this.computePeriodEnd(price.billingType);

    await this.prisma.subscription.updateMany({
      where: {
        userId: input.userId,
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

    return this.prisma.subscription.create({
      data: {
        userId: input.userId,
        teamId: input.teamId ?? null,
        planId: plan.id,
        offerId: offer.id,
        offerPriceId: price.id,
        status: SubscriptionStatus.ACTIVE,
        billingPeriod,
        currentPeriodEnd,
        stripeSubscriptionId: input.stripeSubscriptionId ?? null,
        stripeCheckoutSessionId: input.stripeCheckoutSessionId ?? null,
      },
      include: {
        plan: true,
        offer: true,
        offerPrice: true,
      },
    });
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    const metadata = session.metadata ?? {};
    const userId = metadata.userId;
    const offerSlug = metadata.offerSlug;
    const billingType = metadata.billingType as OfferBillingType | undefined;

    if (!userId || !offerSlug || !billingType) {
      return;
    }

    const existing = await this.prisma.subscription.findFirst({
      where: { stripeCheckoutSessionId: session.id },
    });
    if (existing) {
      return;
    }

    const stripeSubscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id ?? null;

    let currentPeriodEnd: Date | null = null;
    if (stripeSubscriptionId) {
      const stripeSubscription =
        await this.stripeService.getClient().subscriptions.retrieve(
          stripeSubscriptionId,
        );
      currentPeriodEnd = this.stripeTimestampToDate(
        this.readStripeSubscriptionPeriodEnd(stripeSubscription),
      );
    } else {
      currentPeriodEnd = this.computePeriodEnd(billingType);
    }

    await this.activateSubscription({
      userId,
      offerSlug,
      billingType,
      teamId: metadata.teamId || null,
      offerPriceId: metadata.offerPriceId ?? null,
      stripeSubscriptionId,
      stripeCheckoutSessionId: session.id,
      currentPeriodEnd,
    });
  }

  private async handleStripeSubscriptionUpdated(
    subscription: Stripe.Subscription,
  ) {
    const existing = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });
    if (!existing) {
      return;
    }

    const status = this.mapStripeSubscriptionStatus(subscription.status);
    const currentPeriodEnd = this.stripeTimestampToDate(
      this.readStripeSubscriptionPeriodEnd(subscription),
    );

    await this.prisma.subscription.update({
      where: { id: existing.id },
      data: {
        status,
        currentPeriodEnd,
        cancelledAt:
          status === SubscriptionStatus.CANCELLED ? new Date() : null,
      },
    });
  }

  private async handleStripeSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ) {
    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const subscriptionRef =
      invoice.parent?.subscription_details?.subscription;
    const stripeSubscriptionId =
      typeof subscriptionRef === 'string'
        ? subscriptionRef
        : subscriptionRef?.id;

    if (!stripeSubscriptionId) {
      return;
    }

    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId },
      data: { status: SubscriptionStatus.PAST_DUE },
    });
  }

  private mapStripeSubscriptionStatus(
    status: Stripe.Subscription.Status,
  ): SubscriptionStatus {
    switch (status) {
      case 'active':
      case 'trialing':
        return SubscriptionStatus.ACTIVE;
      case 'past_due':
      case 'unpaid':
        return SubscriptionStatus.PAST_DUE;
      case 'canceled':
      case 'incomplete_expired':
        return SubscriptionStatus.CANCELLED;
      case 'incomplete':
      case 'paused':
      default:
        return SubscriptionStatus.TRIAL;
    }
  }

  private stripeTimestampToDate(value?: number | null): Date | null {
    if (!value) {
      return null;
    }

    return new Date(value * 1000);
  }

  private readStripeSubscriptionPeriodEnd(
    subscription: Stripe.Subscription,
  ): number | null {
    return subscription.items.data[0]?.current_period_end ?? null;
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
        name: isTeam ? 'DropOne Premium Équipe' : 'DropOne Premium',
        slug: isTeam ? 'premium-team' : 'premium',
        description: isTeam
          ? 'Espace équipe et cartes professionnelles DropOne'
          : 'Accès complet aux fonctionnalités Premium DropOne',
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
