import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  BillingPeriod,
  OfferAudience,
  OfferBillingType,
  SubscriptionStatus,
} from '@prisma/client';
import type Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { paydunyaIpnCallbackUrl } from '../paydunya/paydunya-callback.util';
import { PaydunyaService } from '../paydunya/paydunya.service';
import type { PaydunyaSoftPayResponse } from '../paydunya/paydunya-softpay.types';
import { CheckoutDto } from './dto/checkout.dto';
import { SoftPaySubscriptionDto } from './dto/softpay-subscription.dto';
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
  paydunyaInvoiceToken?: string | null;
  currentPeriodEnd?: Date | null;
};

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly paydunyaService: PaydunyaService,
  ) {}

  getPaymentConfig() {
    return {
      paymentsEnabled: this.paydunyaService.isConfigured(),
      provider: this.paydunyaService.isConfigured() ? 'paydunya' : 'none',
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
    if (!this.paydunyaService.isConfigured()) {
      throw new BadRequestException(
        'Le paiement PayDunya est désactivé. Utilisez /subscriptions/subscribe pour les tests.',
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

    const amount = Math.round(Number(price.priceAmount));
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException(
        'Cette offre est gratuite. Utilisez /subscriptions/subscribe.',
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const callbackUrl = paydunyaIpnCallbackUrl(this.logger);
    const storeName =
      process.env.PAYDUNYA_STORE_NAME?.trim() || 'Drop One';

    const inv = await this.paydunyaService.createCheckoutInvoice({
      totalAmountFcfa: amount,
      description: `${offer.title} — ${price.priceLabel ?? dto.billingType}`,
      storeName,
      callbackUrl,
      returnUrl: process.env.PAYDUNYA_RETURN_URL?.trim() || undefined,
      cancelUrl: process.env.PAYDUNYA_CANCEL_URL?.trim() || undefined,
      customData: {
        kind: 'subscription',
        userId,
        offerSlug: offer.slug,
        offerPriceId: price.id,
        billingType: price.billingType,
        teamId: dto.teamId ?? '',
      },
    });

    return {
      checkoutUrl: inv.checkoutUrl,
      invoiceToken: inv.invoiceToken,
      sessionId: inv.invoiceToken,
      amountFcfa: amount,
      description: offer.title,
    };
  }

  async softPay(userId: string, dto: SoftPaySubscriptionDto) {
    if (!this.paydunyaService.isConfigured()) {
      throw new ServiceUnavailableException(
        'Paiement PayDunya non configuré sur le serveur',
      );
    }

    const { offer, price } = await this.resolveOfferPrice(
      dto.offerSlug,
      dto.billingType,
    );

    const amount = Math.round(Number(price.priceAmount));
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Montant invalide pour SoftPay');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true, lastName: true },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const invoiceToken = dto.invoiceToken.trim();
    const email = (dto.email?.trim() || user.email || 'contact@dropone.pro').slice(
      0,
      200,
    );
    const phone = dto.telephone.replace(/\s+/g, '');
    const fullName =
      `${dto.prenom} ${dto.nom}`.trim() ||
      `${user.firstName} ${user.lastName}`.trim();

    let soft: PaydunyaSoftPayResponse;
    switch (dto.method) {
      case 'orange_money_sn':
        soft = await this.paydunyaService.softPayOrangeMoneySenegal({
          customer_name: fullName,
          customer_email: email,
          phone_number: phone,
          invoice_token: invoiceToken,
        });
        break;
      case 'free_money_sn':
        soft = await this.paydunyaService.softPayFreeMoneySenegal({
          customer_name: fullName,
          customer_email: email,
          phone_number: phone,
          payment_token: invoiceToken,
        });
        break;
      case 'wave_sn':
        soft = await this.paydunyaService.softPayWaveSenegal({
          wave_senegal_fullName: fullName,
          wave_senegal_email: email,
          wave_senegal_phone: phone,
          wave_senegal_payment_token: invoiceToken,
        });
        break;
      default:
        throw new BadRequestException('Moyen de paiement inconnu');
    }

    if (!soft.success) {
      throw new BadRequestException(
        typeof soft.message === 'string' && soft.message.trim()
          ? soft.message
          : 'Paiement mobile refusé par PayDunya',
      );
    }

    return {
      amountFcfa: amount,
      invoiceToken,
      description: offer.title,
      softPay: {
        url: soft.url,
        other_url: soft.other_url,
        return_url: soft.return_url,
        message: soft.message,
        fees: soft.fees,
        currency: soft.currency,
      },
    };
  }

  async confirmPaydunyaPayment(userId: string, invoiceToken: string) {
    const token = invoiceToken?.trim();
    if (!token) {
      return { paid: false, error: 'missing_token' };
    }

    const existing = await this.prisma.subscription.findFirst({
      where: { paydunyaInvoiceToken: token, userId },
      include: { plan: true, offer: true, offerPrice: true },
    });
    if (existing) {
      return {
        paid: true,
        subscription: this.toSubscriptionResponse(existing),
      };
    }

    const confirmed = await this.paydunyaService.confirmCheckoutInvoice(token);
    if (!confirmed) {
      return { paid: false, error: 'confirm_failed' };
    }
    if (!this.paydunyaService.verifyIpnHash(confirmed.hash)) {
      return { paid: false, error: 'invalid_hash' };
    }
    if (confirmed.status !== 'completed') {
      return { paid: false, error: `status_${confirmed.status}` };
    }

    const custom = confirmed.customData;
    const kind = String(custom['kind'] ?? '').toLowerCase();
    if (kind !== 'subscription') {
      return { paid: false, error: 'not_subscription_invoice' };
    }

    const customUserId = String(custom['userId'] ?? '').trim();
    if (!customUserId || customUserId !== userId) {
      return { paid: false, error: 'user_mismatch' };
    }

    const offerSlug = String(custom['offerSlug'] ?? '').trim();
    const billingType = String(
      custom['billingType'] ?? '',
    ).trim() as OfferBillingType;
    if (!offerSlug || !billingType) {
      return { paid: false, error: 'invalid_custom_data' };
    }

    const { offer, price } = await this.resolveOfferPrice(offerSlug, billingType);
    const expected = Math.round(Number(price.priceAmount));
    const paid = Math.round(confirmed.totalAmount);
    if (Math.abs(paid - expected) > 1) {
      return { paid: false, error: 'amount_mismatch' };
    }

    const subscription = await this.activateSubscription({
      userId,
      offerSlug: offer.slug,
      billingType: price.billingType,
      teamId: String(custom['teamId'] ?? '').trim() || null,
      offerPriceId: price.id,
      paydunyaInvoiceToken: confirmed.invoiceToken,
      currentPeriodEnd: this.computePeriodEnd(price.billingType),
    });

    return {
      paid: true,
      subscription: this.toSubscriptionResponse(subscription),
    };
  }

  async handlePaydunyaIpn(body: Record<string, unknown>) {
    const parsed = this.normalizePaydunyaIpnPayload(body);
    if (!parsed) {
      this.logger.warn('IPN PayDunya: payload non reconnu');
      return { ok: false as const, error: 'invalid_payload' };
    }

    if (!this.paydunyaService.verifyIpnHash(parsed.hash)) {
      this.logger.warn('IPN PayDunya: hash refusé');
      throw new ForbiddenException('Notification PayDunya non authentifiée');
    }

    if (parsed.status.toLowerCase() !== 'completed') {
      return {
        ok: true as const,
        ignored: true as const,
        status: parsed.status,
      };
    }

    const existing = await this.prisma.subscription.findFirst({
      where: { paydunyaInvoiceToken: parsed.invoiceToken },
    });
    if (existing) {
      return { ok: true as const, alreadyProcessed: true as const };
    }

    const { offer, price } = await this.resolveOfferPrice(
      parsed.offerSlug,
      parsed.billingType,
    );
    const expected = Math.round(Number(price.priceAmount));
    const paid = Math.round(parsed.totalAmount);
    if (Math.abs(paid - expected) > 1) {
      this.logger.warn(
        `IPN PayDunya: écart montant payé=${paid} attendu=${expected}`,
      );
      return { ok: false as const, error: 'amount_mismatch' };
    }

    await this.activateSubscription({
      userId: parsed.userId,
      offerSlug: offer.slug,
      billingType: price.billingType,
      teamId: parsed.teamId,
      offerPriceId: price.id,
      paydunyaInvoiceToken: parsed.invoiceToken,
      currentPeriodEnd: this.computePeriodEnd(price.billingType),
    });

    this.logger.log(
      `IPN PayDunya abonnement activé userId=${parsed.userId} offer=${offer.slug}`,
    );
    return { ok: true as const };
  }

  async subscribe(userId: string, dto: SubscribeDto) {
    const { offer, price } = await this.resolveOfferPrice(
      dto.offerSlug,
      dto.billingType,
    );

    if (dto.teamId && offer.audience !== OfferAudience.TEAM) {
      throw new BadRequestException(
        'Cette offre ne couvre pas un espace équipe',
      );
    }

    const amount = Math.round(Number(price.priceAmount));
    const isFree = !Number.isFinite(amount) || amount <= 0;

    if (this.paydunyaService.isConfigured() && !isFree) {
      throw new BadRequestException(
        'Un paiement PayDunya SoftPay est requis pour souscrire à cette offre',
      );
    }

    if (!isFree) {
      this.stripeService.logDisabledCheckoutAttempt(userId);
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

  private normalizePaydunyaIpnPayload(body: Record<string, unknown>): {
    hash: string;
    status: string;
    totalAmount: number;
    invoiceToken: string;
    userId: string;
    offerSlug: string;
    billingType: OfferBillingType;
    teamId: string | null;
  } | null {
    let root: Record<string, unknown> = body;
    const dataRaw = body?.data ?? body;

    if (typeof dataRaw === 'string') {
      try {
        const parsed = JSON.parse(dataRaw) as unknown;
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          root = parsed as Record<string, unknown>;
        }
      } catch {
        return null;
      }
    } else if (dataRaw && typeof dataRaw === 'object' && !Array.isArray(dataRaw)) {
      root = dataRaw as Record<string, unknown>;
    } else {
      return null;
    }

    const hash = root.hash?.toString()?.trim() ?? '';
    const status = root.status?.toString()?.trim() ?? '';
    const inv = root.invoice;
    let totalAmount = NaN;
    let invoiceToken = '';
    if (inv && typeof inv === 'object' && !Array.isArray(inv)) {
      const invObj = inv as Record<string, unknown>;
      totalAmount = Number(invObj.total_amount);
      invoiceToken = invObj.token?.toString()?.trim() ?? '';
    }

    const custom = root.custom_data;
    if (!custom || typeof custom !== 'object' || Array.isArray(custom)) {
      return null;
    }
    const c = custom as Record<string, unknown>;
    const kind = c.kind?.toString()?.trim().toLowerCase() ?? '';
    const userId = c.userId?.toString()?.trim() ?? '';
    const offerSlug = c.offerSlug?.toString()?.trim() ?? '';
    const billingType = c.billingType?.toString()?.trim() as OfferBillingType;
    const teamId = c.teamId?.toString()?.trim() || null;

    if (
      kind !== 'subscription' ||
      !hash ||
      !Number.isFinite(totalAmount) ||
      !invoiceToken ||
      !userId ||
      !offerSlug ||
      !billingType
    ) {
      return null;
    }

    return {
      hash,
      status,
      totalAmount,
      invoiceToken,
      userId,
      offerSlug,
      billingType,
      teamId,
    };
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
        paydunyaInvoiceToken: input.paydunyaInvoiceToken ?? null,
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
    hasWallet?: boolean;
    hasAnalytics?: boolean;
    hasVisitorInsights?: boolean;
    hasSocialLinks?: boolean;
    maxAiScans: number;
  }) {
    const isTeam = offer?.audience === OfferAudience.TEAM;

    return this.prisma.plan.upsert({
      where: { slug: isTeam ? 'premium-team' : 'premium' },
      update: {
        ...(offer && {
          maxTeamMembers: offer.maxTeamMembers < 0 ? 9999 : offer.maxTeamMembers,
          hasPortfolio: offer.hasPortfolio,
          hasAnalytics: offer.hasAnalytics ?? true,
          features: this.buildPlanFeatures(offer),
        }),
      },
      create: {
        id: isTeam ? 'plan_premium_team' : 'plan_premium',
        name: isTeam ? 'DropOne Équipe' : 'DropOne Premium',
        slug: isTeam ? 'premium-team' : 'premium',
        description: isTeam
          ? 'Espace équipe et cartes professionnelles DropOne'
          : 'Accès complet aux fonctionnalités Premium DropOne',
        priceMonthly: 0,
        priceYearly: 0,
        maxCards: isTeam ? 10 : 2,
        maxTeamMembers:
          offer?.maxTeamMembers != null && offer.maxTeamMembers < 0
            ? 9999
            : (offer?.maxTeamMembers ?? (isTeam ? 10 : 0)),
        hasPortfolio: offer?.hasPortfolio ?? true,
        hasCustomDomain: false,
        hasAnalytics: offer?.hasAnalytics ?? true,
        features: this.buildPlanFeatures(
          offer ?? {
            audience: isTeam ? OfferAudience.TEAM : OfferAudience.PERSONAL,
            canCustomize: true,
            maxTeamMembers: isTeam ? 10 : 0,
            hasPortfolio: true,
            hasWallet: true,
            hasAnalytics: true,
            hasVisitorInsights: true,
            hasSocialLinks: true,
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
    hasWallet?: boolean;
    hasAnalytics?: boolean;
    hasVisitorInsights?: boolean;
    hasSocialLinks?: boolean;
    maxAiScans: number;
  }) {
    const features = ['pro_designs'];

    if (offer.canCustomize) {
      features.push('custom_colors');
    }
    if (offer.hasPortfolio) {
      features.push('portfolio');
    }
    if (offer.hasWallet) {
      features.push('wallet');
    }
    if (offer.hasAnalytics) {
      features.push('analytics');
    }
    if (offer.hasVisitorInsights) {
      features.push('visitor_insights');
    }
    if (offer.hasSocialLinks) {
      features.push('social_links');
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
      hasWallet: boolean;
      hasAnalytics: boolean;
      hasVisitorInsights: boolean;
      hasSocialLinks: boolean;
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
      hasWallet?: boolean;
      hasAnalytics?: boolean;
      hasVisitorInsights?: boolean;
      hasSocialLinks?: boolean;
      maxAiScans: number;
    } | null,
  ) {
    return {
      audience: offer?.audience ?? OfferAudience.PERSONAL,
      canCustomize: offer?.canCustomize ?? false,
      maxTeamMembers: offer?.maxTeamMembers ?? 0,
      hasPortfolio: offer?.hasPortfolio ?? false,
      hasWallet: offer?.hasWallet ?? false,
      hasAnalytics: offer?.hasAnalytics ?? false,
      hasVisitorInsights: offer?.hasVisitorInsights ?? false,
      hasSocialLinks: offer?.hasSocialLinks ?? false,
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
    hasWallet: boolean;
    hasAnalytics: boolean;
    hasVisitorInsights: boolean;
    hasSocialLinks: boolean;
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
      hasWallet: offer.hasWallet,
      hasAnalytics: offer.hasAnalytics,
      hasVisitorInsights: offer.hasVisitorInsights,
      hasSocialLinks: offer.hasSocialLinks,
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
