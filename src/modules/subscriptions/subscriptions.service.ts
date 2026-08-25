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
  InvoiceStatus,
  OfferAudience,
  OfferBillingType,
  Prisma,
  SubscriptionStatus,
} from '@prisma/client';
import { randomBytes } from 'crypto';
import type Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { paydunyaIpnCallbackUrl } from '../paydunya/paydunya-callback.util';
import { PaydunyaService } from '../paydunya/paydunya.service';
import type { PaydunyaSoftPayResponse } from '../paydunya/paydunya-softpay.types';
import { CheckoutDto } from './dto/checkout.dto';
import { SoftPaySubscriptionDto } from './dto/softpay-subscription.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { StripeService } from './stripe.service';
import { InvoicesService } from './invoices.service';
import type { InvoiceLine } from './invoices.service';
import { validSubscriptionWhere } from './subscription-validity';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

type ActivateSubscriptionInput = {
  userId: string;
  offerSlug: string;
  billingType: OfferBillingType;
  teamId?: string | null;
  offerPriceId?: string | null;
  purchasedSeats?: number | null;
  stripeSubscriptionId?: string | null;
  stripeCheckoutSessionId?: string | null;
  paydunyaInvoiceToken?: string | null;
  currentPeriodEnd?: Date | null;
  invoiceAmount?: number | null;
  invoiceCurrency?: string | null;
  invoiceProvider?: string | null;
};

type OfferForPricing = {
  audience: OfferAudience;
  maxTeamMembers: number;
  minSeats?: number;
  title: string;
  slug: string;
};

type PriceForPricing = {
  id: string;
  billingType: OfferBillingType;
  priceAmount: { toNumber?: () => number } | number;
  pricePerSeat?: { toNumber?: () => number } | number | null;
  priceLabel?: string | null;
};

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly paydunyaService: PaydunyaService,
    private readonly invoicesService: InvoicesService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  isInAppPaymentsHidden(): boolean {
    return this.config.get<boolean>('hideInAppPayments') === true;
  }

  getPaymentConfig() {
    const hideInAppPayments = this.isInAppPaymentsHidden();
    return {
      paymentsEnabled:
        !hideInAppPayments && this.paydunyaService.isConfigured(),
      hideInAppPayments,
      provider: hideInAppPayments
        ? 'signup_request'
        : this.paydunyaService.isConfigured()
          ? 'paydunya'
          : 'none',
    };
  }

  async getOffers() {
    const offers = await this.prisma.premiumOffer.findMany({
      where: { isActive: true, listedInApp: true },
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
    this.assertInAppCheckoutAllowed();
    if (!this.paydunyaService.isConfigured()) {
      throw new BadRequestException(
        'Le paiement PayDunya est désactivé. Utilisez /subscriptions/subscribe pour les tests.',
      );
    }

    const { offer, price, billingMultiplier, effectiveBillingType } =
      await this.resolveOfferPrice(dto.offerSlug, dto.billingType);

    if (dto.teamId && offer.audience !== OfferAudience.TEAM) {
      throw new BadRequestException(
        'Cette offre ne couvre pas un espace équipe',
      );
    }

    const { amount, seats } = this.resolveCheckoutPricing(
      offer,
      price,
      dto.seats,
      billingMultiplier,
    );
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

    const seatsLabel = seats != null ? ` - ${seats} utilisateur${seats > 1 ? 's' : ''}` : '';
    const billingLabel =
      price.priceLabel ??
      (effectiveBillingType === OfferBillingType.YEARLY ? 'YEARLY' : dto.billingType);
    const inv = await this.paydunyaService.createCheckoutInvoice({
      totalAmountFcfa: amount,
      description: `${offer.title} - ${billingLabel}${seatsLabel}`,
      storeName,
      callbackUrl,
      returnUrl: process.env.PAYDUNYA_RETURN_URL?.trim() || undefined,
      cancelUrl: process.env.PAYDUNYA_CANCEL_URL?.trim() || undefined,
      customData: {
        kind: 'subscription',
        userId,
        offerSlug: offer.slug,
        offerPriceId: price.id,
        billingType: effectiveBillingType,
        teamId: dto.teamId ?? '',
        seats: seats != null ? String(seats) : '',
      },
    });

    await this.prisma.paymentInvoice.create({
      data: {
        number: this.generateInvoiceNumber(),
        userId,
        teamId: dto.teamId?.trim() || null,
        amount,
        currency: 'FCFA',
        status: InvoiceStatus.PENDING,
        description: `${offer.title} - ${billingLabel}${seatsLabel}`,
        offerSlug: offer.slug,
        billingType: effectiveBillingType,
        seats: seats ?? null,
        provider: 'paydunya',
        providerInvoiceId: inv.invoiceToken,
        lines: [
          {
            kind: 'offer',
            label: `Offre : ${offer.title}`,
            amount,
            seats: seats ?? null,
          },
        ] as unknown as Prisma.InputJsonValue,
      },
    });

    return {
      checkoutUrl: inv.checkoutUrl,
      invoiceToken: inv.invoiceToken,
      sessionId: inv.invoiceToken,
      amountFcfa: amount,
      seats,
      description: offer.title,
    };
  }

  async softPay(userId: string, dto: SoftPaySubscriptionDto) {
    this.assertInAppCheckoutAllowed();
    if (!this.paydunyaService.isConfigured()) {
      throw new ServiceUnavailableException(
        'Paiement PayDunya non configuré sur le serveur',
      );
    }

    const { offer, price, billingMultiplier } = await this.resolveOfferPrice(
      dto.offerSlug,
      dto.billingType,
    );

    const { amount } = this.resolveCheckoutPricing(
      offer,
      price,
      dto.seats,
      billingMultiplier,
    );
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
        om_url: soft.other_url?.om_url,
        maxit_url: soft.other_url?.maxit_url,
        qr_image_base64: soft.qrImageBase64,
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

    const existingPaid = await this.prisma.paymentInvoice.findUnique({
      where: { providerInvoiceId: token },
    });
    if (existingPaid?.status === InvoiceStatus.PAID) {
      if (existingPaid.subscriptionId) {
        const paidSub = await this.prisma.subscription.findFirst({
          where: { id: existingPaid.subscriptionId, userId },
          include: { plan: true, offer: true, offerPrice: true },
        });
        if (paidSub) {
          return {
            paid: true,
            subscription: this.toSubscriptionResponse(paidSub),
          };
        }
      }
      return { paid: true, kind: 'already_paid' as const };
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
      this.logger.warn(
        `PayDunya confirm: hash IPN invalide (on continue, l’API confirm est authentifiée) token=${token.slice(0, 8)}…`,
      );
    }
    if (confirmed.status !== 'completed') {
      return { paid: false, error: `status_${confirmed.status}` };
    }

    const pending = await this.prisma.paymentInvoice.findUnique({
      where: { providerInvoiceId: confirmed.invoiceToken },
    });
    const custom: Record<string, unknown> = {
      ...(pending
        ? {
          kind: 'subscription',
          userId: pending.userId,
          offerSlug: pending.offerSlug ?? '',
          billingType: pending.billingType ?? '',
          teamId: pending.teamId ?? '',
          seats: pending.seats != null ? String(pending.seats) : '',
        }
        : {}),
      ...confirmed.customData,
    };
    const kind = String(custom['kind'] ?? '').toLowerCase();

    if (kind === 'seat_upgrade') {
      const subscriptionId = String(custom['subscriptionId'] ?? '').trim();
      const additionalSeats = this.parseSeats(custom['additionalSeats']);
      if (!subscriptionId || !additionalSeats) {
        return { paid: false, error: 'invalid_seat_upgrade_data' };
      }
      const result = await this.applySeatUpgradePayment({
        userId,
        invoiceToken: confirmed.invoiceToken,
        subscriptionId,
        additionalSeats,
        paidAmount: Math.round(confirmed.totalAmount),
      });
      return { paid: true, kind: 'seat_upgrade' as const, ...result };
    }

    if (kind === 'invoice_pay') {
      const paymentInvoiceId = String(custom['paymentInvoiceId'] ?? '').trim();
      if (!paymentInvoiceId) {
        return { paid: false, error: 'invalid_invoice_pay_data' };
      }
      const result = await this.applyPendingInvoicePayment({
        userId,
        invoiceToken: confirmed.invoiceToken,
        paymentInvoiceId,
        paidAmount: Math.round(confirmed.totalAmount),
      });
      return { paid: true, kind: 'invoice_pay' as const, ...result };
    }

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

    const { offer, price, billingMultiplier, effectiveBillingType } =
      await this.resolveOfferPrice(offerSlug, billingType);
    const seats = this.parseSeats(custom['seats']);
    const { amount: expected, seats: purchasedSeats } =
      this.resolveCheckoutPricing(
        offer,
        price,
        seats ?? undefined,
        billingMultiplier,
      );
    const paid = Math.round(confirmed.totalAmount);
    if (Math.abs(paid - expected) > 1) {
      this.logger.warn(
        `PayDunya confirm: écart montant payé=${paid} attendu=${expected}`,
      );
      return { paid: false, error: 'amount_mismatch' };
    }

    try {
      const subscription = await this.activateSubscription({
        userId,
        offerSlug: offer.slug,
        billingType: effectiveBillingType,
        teamId: String(custom['teamId'] ?? '').trim() || null,
        offerPriceId: price.id,
        purchasedSeats,
        paydunyaInvoiceToken: confirmed.invoiceToken,
        currentPeriodEnd: this.computePeriodEnd(effectiveBillingType),
        invoiceAmount: paid,
        invoiceCurrency: 'FCFA',
        invoiceProvider: 'paydunya',
      });

      return {
        paid: true,
        subscription: this.toSubscriptionResponse(subscription),
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const existingAfterRace = await this.prisma.subscription.findFirst({
          where: { paydunyaInvoiceToken: confirmed.invoiceToken, userId },
          include: { plan: true, offer: true, offerPrice: true },
        });
        if (existingAfterRace) {
          return {
            paid: true,
            subscription: this.toSubscriptionResponse(existingAfterRace),
          };
        }
      }
      throw error;
    }
  }

  async createSeatUpgradeCheckout(
    userId: string,
    input: {
      teamId: string;
      additionalSeats: number;
      returnUrl?: string;
    },
  ) {
    const additionalSeats = Math.floor(input.additionalSeats);
    if (!Number.isFinite(additionalSeats) || additionalSeats < 1) {
      throw new BadRequestException('Ajoutez au moins 1 siège');
    }

    const subscription = await this.prisma.subscription.findFirst({
      where: validSubscriptionWhere({
        OR: [{ teamId: input.teamId }, { userId }],
      }),
      include: { offer: true, offerPrice: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription?.offer || !subscription.offerPrice) {
      throw new BadRequestException('Aucun abonnement équipe actif');
    }
    if (subscription.offer.audience !== OfferAudience.TEAM) {
      throw new BadRequestException('Cette offre ne permet pas d’ajouter des sièges');
    }

    const perSeat = this.toNumber(subscription.offerPrice.pricePerSeat);
    if (!Number.isFinite(perSeat) || perSeat <= 0) {
      throw new BadRequestException('Tarif au siège indisponible pour cette offre');
    }

    const minSeats = Math.max(1, subscription.offer.minSeats || 1);
    const currentSeats = Math.max(
      minSeats,
      subscription.purchasedSeats ?? minSeats,
    );
    const max = subscription.offer.maxTeamMembers;
    const hardMax = max < 0 ? 500 : max;
    const newTotal = currentSeats + additionalSeats;
    if (newTotal > hardMax) {
      throw new BadRequestException(
        max < 0
          ? `Maximum ${hardMax} utilisateurs`
          : `Cette offre est limitée à ${hardMax} utilisateurs`,
      );
    }

    const amount = Math.round(perSeat * additionalSeats);
    const currency = subscription.offerPrice.currency || 'FCFA';
    const lines: InvoiceLine[] = [
      {
        kind: 'seat_upgrade',
        label: `${additionalSeats} siège${additionalSeats > 1 ? 's' : ''} en plus`,
        amount,
        seats: additionalSeats,
      },
    ];

    if (!this.paydunyaService.isConfigured()) {
      // Mode test : applique immédiatement sans paiement.
      const result = await this.applySeatUpgradePayment({
        userId,
        invoiceToken: `test-seats-${Date.now()}`,
        subscriptionId: subscription.id,
        additionalSeats,
        paidAmount: amount,
        lines,
        skipAmountCheck: true,
      });
      return {
        paidImmediately: true as const,
        amountFcfa: amount,
        additionalSeats,
        newSeatsTotal: result.purchasedSeats,
        checkoutUrl: null,
        invoiceToken: null,
      };
    }

    const callbackUrl = paydunyaIpnCallbackUrl(this.logger);
    const storeName = process.env.PAYDUNYA_STORE_NAME?.trim() || 'Drop One';
    const inv = await this.paydunyaService.createCheckoutInvoice({
      totalAmountFcfa: amount,
      description: `${additionalSeats} siège${additionalSeats > 1 ? 's' : ''} en plus - ${subscription.offer.title}`,
      storeName,
      callbackUrl,
      returnUrl:
        input.returnUrl?.trim() ||
        process.env.PAYDUNYA_RETURN_URL?.trim() ||
        undefined,
      cancelUrl: process.env.PAYDUNYA_CANCEL_URL?.trim() || undefined,
      customData: {
        kind: 'seat_upgrade',
        userId,
        teamId: input.teamId,
        subscriptionId: subscription.id,
        additionalSeats: String(additionalSeats),
        currentSeats: String(currentSeats),
        offerSlug: subscription.offer.slug,
        billingType: subscription.offerPrice.billingType,
      },
    });

    return {
      paidImmediately: false as const,
      amountFcfa: amount,
      additionalSeats,
      newSeatsTotal: newTotal,
      pricePerSeat: perSeat,
      currency,
      lines,
      checkoutUrl: inv.checkoutUrl,
      invoiceToken: inv.invoiceToken,
    };
  }

  async confirmSeatUpgrade(userId: string, invoiceToken: string) {
    return this.confirmPaydunyaPayment(userId, invoiceToken);
  }

  private async applySeatUpgradePayment(input: {
    userId: string;
    invoiceToken: string;
    subscriptionId: string;
    additionalSeats: number;
    paidAmount: number;
    lines?: InvoiceLine[];
    skipAmountCheck?: boolean;
  }) {
    const already = await this.prisma.paymentInvoice.findUnique({
      where: { providerInvoiceId: input.invoiceToken },
    });
    if (already) {
      const sub = await this.prisma.subscription.findUnique({
        where: { id: input.subscriptionId },
      });
      return {
        alreadyProcessed: true as const,
        purchasedSeats: sub?.purchasedSeats ?? null,
        invoiceId: already.id,
      };
    }

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        id: input.subscriptionId,
        OR: [{ userId: input.userId }, { team: { ownerId: input.userId } }],
      },
      include: { offer: true, offerPrice: true },
    });

    if (!subscription?.offer || !subscription.offerPrice) {
      throw new BadRequestException('Abonnement introuvable pour cet ajout de sièges');
    }

    const perSeat = this.toNumber(subscription.offerPrice.pricePerSeat);
    const expected = Math.round(perSeat * input.additionalSeats);
    if (
      !input.skipAmountCheck &&
      Number.isFinite(expected) &&
      Math.abs(input.paidAmount - expected) > 1
    ) {
      throw new BadRequestException('Montant de paiement incorrect pour les sièges');
    }

    const minSeats = Math.max(1, subscription.offer.minSeats || 1);
    const currentSeats = Math.max(
      minSeats,
      subscription.purchasedSeats ?? minSeats,
    );
    const newTotal = currentSeats + input.additionalSeats;

    const lines: InvoiceLine[] = input.lines ?? [
      {
        kind: 'seat_upgrade',
        label: `${input.additionalSeats} siège${input.additionalSeats > 1 ? 's' : ''} en plus`,
        amount: input.paidAmount,
        seats: input.additionalSeats,
      },
    ];
    const currency = subscription.offerPrice.currency || 'FCFA';
    const description = lines
      .map(
        (line) =>
          `${line.label} : ${line.amount.toLocaleString('fr-FR')} ${currency}`,
      )
      .join(', ');

    const updated = await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { purchasedSeats: newTotal },
    });

    const invoice = await this.prisma.paymentInvoice.create({
      data: {
        number: this.generateInvoiceNumber(),
        userId: input.userId,
        teamId: subscription.teamId,
        subscriptionId: subscription.id,
        amount: input.paidAmount,
        currency,
        status: InvoiceStatus.PAID,
        description,
        offerSlug: subscription.offer.slug,
        billingType: subscription.offerPrice.billingType,
        seats: input.additionalSeats,
        lines: lines as unknown as Prisma.InputJsonValue,
        provider: 'paydunya',
        providerInvoiceId: input.invoiceToken,
        paidAt: new Date(),
      },
    });

    await this.invoicesService.refreshPendingRenewal(subscription.id);

    this.logger.log(
      `Sièges ajoutés subscription=${subscription.id} +${input.additionalSeats} → ${newTotal}`,
    );

    return {
      alreadyProcessed: false as const,
      purchasedSeats: updated.purchasedSeats,
      invoiceId: invoice.id,
    };
  }

  async createPendingInvoiceCheckout(
    userId: string,
    input: {
      paymentInvoiceId: string;
      teamId: string;
      returnUrl?: string;
    },
  ) {
    const invoice = await this.prisma.paymentInvoice.findFirst({
      where: {
        id: input.paymentInvoiceId,
        status: InvoiceStatus.PENDING,
        OR: [{ teamId: input.teamId }, { userId }],
      },
    });

    if (!invoice) {
      throw new BadRequestException('Facture à payer introuvable');
    }

    const amount = Math.round(Number(invoice.amount));
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Montant de facture invalide');
    }

    if (!this.paydunyaService.isConfigured()) {
      const result = await this.applyPendingInvoicePayment({
        userId,
        invoiceToken: `test-invoice-${Date.now()}`,
        paymentInvoiceId: invoice.id,
        paidAmount: amount,
        skipAmountCheck: true,
      });
      return {
        paidImmediately: true as const,
        amountFcfa: amount,
        checkoutUrl: null,
        invoiceToken: null,
        paymentInvoiceId: result.paymentInvoiceId,
        alreadyProcessed: result.alreadyProcessed,
      };
    }

    const callbackUrl = paydunyaIpnCallbackUrl(this.logger);
    const storeName = process.env.PAYDUNYA_STORE_NAME?.trim() || 'Drop One';
    const inv = await this.paydunyaService.createCheckoutInvoice({
      totalAmountFcfa: amount,
      description: invoice.description || `Facture ${invoice.number}`,
      storeName,
      callbackUrl,
      returnUrl:
        input.returnUrl?.trim() ||
        process.env.PAYDUNYA_RETURN_URL?.trim() ||
        undefined,
      cancelUrl: process.env.PAYDUNYA_CANCEL_URL?.trim() || undefined,
      customData: {
        kind: 'invoice_pay',
        userId,
        teamId: input.teamId,
        paymentInvoiceId: invoice.id,
        subscriptionId: invoice.subscriptionId ?? '',
        offerSlug: invoice.offerSlug ?? '',
        billingType: invoice.billingType ?? '',
        seats: invoice.seats != null ? String(invoice.seats) : '',
      },
    });

    return {
      paidImmediately: false as const,
      amountFcfa: amount,
      checkoutUrl: inv.checkoutUrl,
      invoiceToken: inv.invoiceToken,
      paymentInvoiceId: invoice.id,
    };
  }

  async confirmPendingInvoicePayment(userId: string, invoiceToken: string) {
    return this.confirmPaydunyaPayment(userId, invoiceToken);
  }

  private async applyPendingInvoicePayment(input: {
    userId: string;
    invoiceToken: string;
    paymentInvoiceId: string;
    paidAmount: number;
    skipAmountCheck?: boolean;
  }) {
    const byToken = await this.prisma.paymentInvoice.findFirst({
      where: {
        OR: [
          { id: input.paymentInvoiceId, status: InvoiceStatus.PAID },
          { providerInvoiceId: input.invoiceToken, status: InvoiceStatus.PAID },
        ],
      },
    });
    if (byToken) {
      return {
        alreadyProcessed: true as const,
        paymentInvoiceId: byToken.id,
      };
    }

    const invoice = await this.prisma.paymentInvoice.findUnique({
      where: { id: input.paymentInvoiceId },
    });

    if (!invoice) {
      throw new BadRequestException('Facture introuvable');
    }

    if (invoice.status !== InvoiceStatus.PENDING) {
      throw new BadRequestException('Cette facture n’est pas payable');
    }

    const expected = Math.round(Number(invoice.amount));
    if (
      !input.skipAmountCheck &&
      Math.abs(input.paidAmount - expected) > 1
    ) {
      throw new BadRequestException('Montant de paiement incorrect');
    }

    const paid = await this.prisma.paymentInvoice.update({
      where: { id: invoice.id },
      data: {
        status: InvoiceStatus.PAID,
        paidAt: new Date(),
        provider: invoice.provider ?? 'paydunya',
      },
    });

    if (invoice.subscriptionId) {
      const subscription = await this.prisma.subscription.findUnique({
        where: { id: invoice.subscriptionId },
        include: { offerPrice: true },
      });
      if (subscription?.offerPrice) {
        const billingType = subscription.offerPrice.billingType;
        const from = subscription.currentPeriodEnd ?? new Date();
        const nextEnd = this.extendPeriodFrom(from, billingType);
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: SubscriptionStatus.ACTIVE,
            currentPeriodEnd: nextEnd,
            cancelledAt: null,
          },
        });
      }
    }

    this.logger.log(
      `Facture payée ${invoice.number} userId=${input.userId} amount=${input.paidAmount}`,
    );

    return {
      alreadyProcessed: false as const,
      paymentInvoiceId: paid.id,
    };
  }

  private extendPeriodFrom(from: Date, billingType: OfferBillingType): Date {
    const end = new Date(from);
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

  async handlePaydunyaIpn(body: Record<string, unknown>) {
    const parsed = this.normalizePaydunyaIpnPayload(body);
    const invoiceToken =
      parsed?.invoiceToken || this.extractPaydunyaInvoiceToken(body);

    if (!invoiceToken) {
      this.logger.warn('IPN PayDunya: payload sans token facture');
      return { ok: false as const, error: 'invalid_payload' };
    }

    if (parsed?.hash && !this.paydunyaService.verifyIpnHash(parsed.hash)) {
      this.logger.warn('IPN PayDunya: hash refusé');
      throw new ForbiddenException('Notification PayDunya non authentifiée');
    }

    const pending = await this.prisma.paymentInvoice.findUnique({
      where: { providerInvoiceId: invoiceToken },
    });
    const userId = parsed?.userId || pending?.userId;
    if (!userId) {
      this.logger.warn(
        `IPN PayDunya: userId introuvable token=${invoiceToken.slice(0, 8)}…`,
      );
      return { ok: false as const, error: 'missing_user' };
    }

    const result = await this.confirmPaydunyaPayment(userId, invoiceToken);
    if (result.paid) {
      this.logger.log(
        `IPN PayDunya abonnement activé userId=${userId} token=${invoiceToken.slice(0, 8)}…`,
      );
      return { ok: true as const, ...result };
    }

    this.logger.warn(
      `IPN PayDunya: paiement non activé userId=${userId} error=${'error' in result ? result.error : 'unknown'}`,
    );
    return { ok: false as const, ...result };
  }

  async subscribe(userId: string, dto: SubscribeDto) {
    const { offer, price, billingMultiplier, effectiveBillingType } =
      await this.resolveOfferPrice(dto.offerSlug, dto.billingType);

    if (dto.teamId && offer.audience !== OfferAudience.TEAM) {
      throw new BadRequestException(
        'Cette offre ne couvre pas un espace équipe',
      );
    }

    const { amount, seats } = this.resolveCheckoutPricing(
      offer,
      price,
      dto.seats,
      billingMultiplier,
    );
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
      billingType: effectiveBillingType,
      teamId: dto.teamId ?? null,
      offerPriceId: price.id,
      purchasedSeats: seats,
    });

    return this.toSubscriptionResponse(subscription);
  }

  async createSignupRequest(userId: string, dto: SubscribeDto) {
    const { offer, price, billingMultiplier, effectiveBillingType } =
      await this.resolveOfferPrice(dto.offerSlug, dto.billingType);

    if (dto.teamId && offer.audience !== OfferAudience.TEAM) {
      throw new BadRequestException(
        'Cette offre ne couvre pas un espace équipe',
      );
    }

    const { seats } = this.resolveCheckoutPricing(
      offer,
      price,
      dto.seats,
      billingMultiplier,
    );

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const request = await this.prisma.subscriptionSignupRequest.create({
      data: {
        userId,
        offerSlug: offer.slug,
        offerTitle: offer.title,
        billingType: effectiveBillingType,
        seats: seats ?? null,
        teamId: dto.teamId?.trim() || null,
      },
    });

    const notifyTo =
      this.config.get<string>('subscriptionRequestsNotifyEmail')?.trim() ||
      'contact@mega-sn.com';
    try {
      await this.mailService.sendSubscriptionSignupNotice({
        to: notifyTo,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        offerTitle: offer.title,
        billingType: effectiveBillingType,
        seats: seats ?? null,
      });
    } catch (error) {
      this.logger.warn(
        `E-mail demande d’inscription non envoyé : ${
          error instanceof Error ? error.message : 'erreur inconnue'
        }`,
      );
    }

    return {
      id: request.id,
      firstName: user.firstName,
      offerTitle: offer.title,
      billingType: effectiveBillingType,
    };
  }

  private assertInAppCheckoutAllowed() {
    if (this.isInAppPaymentsHidden()) {
      throw new BadRequestException(
        'Le paiement in-app est désactivé. Enregistrez une demande d’inscription.',
      );
    }
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
          where: { isActive: true },
        },
      },
    });

    if (!offer) {
      throw new NotFoundException('Offre Premium introuvable');
    }

    let price =
      offer.prices.find((item) => item.billingType === billingType) ?? null;
    let billingMultiplier = 1;
    const effectiveBillingType = billingType;

    // Annuel = mensuel × 12 si aucun tarif YEARLY n’est configuré.
    if (!price && billingType === OfferBillingType.YEARLY) {
      price =
        offer.prices.find(
          (item) => item.billingType === OfferBillingType.MONTHLY,
        ) ?? null;
      if (price) {
        billingMultiplier = 12;
      }
    }

    if (!price) {
      throw new BadRequestException(
        'Ce mode de paiement n’est pas disponible pour cette offre',
      );
    }

    return { offer, price, billingMultiplier, effectiveBillingType };
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
    kind: string;
    userId: string;
    offerSlug: string;
    billingType: OfferBillingType;
    teamId: string | null;
    seats: number | null;
    additionalSeats: number | null;
    subscriptionId: string | null;
    paymentInvoiceId: string | null;
  } | null {
    let root: Record<string, unknown> = body;
    const dataRaw = body?.data ?? body['payload'] ?? body;

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
    const seats = this.parseSeats(c.seats);
    const additionalSeats = this.parseSeats(c.additionalSeats);
    const subscriptionId = c.subscriptionId?.toString()?.trim() || null;
    const paymentInvoiceId = c.paymentInvoiceId?.toString()?.trim() || null;

    if (
      (kind !== 'subscription' &&
        kind !== 'seat_upgrade' &&
        kind !== 'invoice_pay') ||
      !hash ||
      !Number.isFinite(totalAmount) ||
      !invoiceToken ||
      !userId
    ) {
      return null;
    }

    if (kind === 'subscription' && (!offerSlug || !billingType)) {
      return null;
    }

    if (
      kind === 'seat_upgrade' &&
      (!subscriptionId || !additionalSeats || additionalSeats < 1)
    ) {
      return null;
    }

    if (kind === 'invoice_pay' && !paymentInvoiceId) {
      return null;
    }

    return {
      hash,
      status,
      totalAmount,
      invoiceToken,
      kind,
      userId,
      offerSlug,
      billingType,
      teamId,
      seats,
      additionalSeats,
      subscriptionId,
      paymentInvoiceId,
    };
  }

  private extractPaydunyaInvoiceToken(
    body: Record<string, unknown>,
  ): string | null {
    const fromInvoice = (value: unknown): string => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return '';
      }
      const token = (value as Record<string, unknown>).token;
      return token == null ? '' : String(token).trim();
    };

    const direct =
      String(body['token'] ?? body['invoice_token'] ?? '').trim() ||
      fromInvoice(body['invoice']);
    if (direct) return direct;

    const dataRaw = body['data'];
    if (typeof dataRaw === 'string') {
      try {
        const parsed = JSON.parse(dataRaw) as unknown;
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return this.extractPaydunyaInvoiceToken(
            parsed as Record<string, unknown>,
          );
        }
      } catch {
        return null;
      }
    }
    if (dataRaw && typeof dataRaw === 'object' && !Array.isArray(dataRaw)) {
      return this.extractPaydunyaInvoiceToken(
        dataRaw as Record<string, unknown>,
      );
    }
    return null;
  }

  private parseSeats(raw: unknown): number | null {
    if (raw == null || raw === '') return null;
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 1) return null;
    return Math.floor(value);
  }

  private toNumber(value: { toNumber?: () => number } | number | null | undefined): number {
    if (value == null) return NaN;
    if (typeof value === 'number') return value;
    if (typeof value.toNumber === 'function') return value.toNumber();
    return Number(value);
  }

  private isPerSeatPrice(price: PriceForPricing): boolean {
    const perSeat = this.toNumber(price.pricePerSeat);
    return Number.isFinite(perSeat) && perSeat > 0;
  }

  private resolveSeats(offer: OfferForPricing, requested?: number): number {
    const min = Math.max(1, offer.minSeats ?? 1);
    const hardMax =
      offer.maxTeamMembers < 0 ? 500 : Math.max(min, offer.maxTeamMembers);
    const fallback =
      offer.maxTeamMembers > 0 ? offer.maxTeamMembers : Math.max(min, 5);
    const seats = requested ?? fallback;

    if (seats < min) {
      throw new BadRequestException(
        `Minimum ${min} utilisateur${min > 1 ? 's' : ''} pour cette offre`,
      );
    }
    if (seats > hardMax) {
      throw new BadRequestException(
        offer.maxTeamMembers < 0
          ? `Maximum ${hardMax} utilisateurs par commande`
          : `Cette offre est limitée à ${hardMax} utilisateurs`,
      );
    }

    return seats;
  }

  private resolveCheckoutPricing(
    offer: OfferForPricing,
    price: PriceForPricing,
    requestedSeats?: number,
    billingMultiplier = 1,
  ): { amount: number; seats: number | null } {
    const factor =
      Number.isFinite(billingMultiplier) && billingMultiplier > 0
        ? billingMultiplier
        : 1;

    if (
      offer.audience === OfferAudience.TEAM &&
      this.isPerSeatPrice(price)
    ) {
      const seats = this.resolveSeats(offer, requestedSeats);
      const baseSeats = Math.max(1, offer.minSeats ?? 1);
      const baseAmount = this.toNumber(price.priceAmount);
      const perSeat = this.toNumber(price.pricePerSeat);
      const extraSeats = Math.max(0, seats - baseSeats);
      const amount = Math.round(
        ((Number.isFinite(baseAmount) ? baseAmount : 0) +
          perSeat * extraSeats) *
        factor,
      );
      return { amount, seats };
    }

    return {
      amount: Math.round(this.toNumber(price.priceAmount) * factor),
      seats: null,
    };
  }

  private async activateSubscription(input: ActivateSubscriptionInput) {
    const { offer, price, effectiveBillingType } = await this.resolveOfferPrice(
      input.offerSlug,
      input.billingType,
    );

    if (input.offerPriceId && input.offerPriceId !== price.id) {
      throw new BadRequestException('Tarif d’offre invalide');
    }

    const plan = await this.ensurePremiumPlan(offer);
    const billingPeriod = this.mapBillingPeriod(effectiveBillingType);
    const currentPeriodEnd =
      input.currentPeriodEnd ?? this.computePeriodEnd(effectiveBillingType);

    let teamId = input.teamId ?? null;
    if (!teamId && offer.audience === OfferAudience.TEAM) {
      const ownedTeam = await this.prisma.team.findFirst({
        where: { ownerId: input.userId, isActive: true },
        select: { id: true },
        orderBy: { createdAt: 'asc' },
      });
      teamId = ownedTeam?.id ?? null;
    }

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

    const subscription = await this.prisma.subscription.create({
      data: {
        userId: input.userId,
        teamId,
        planId: plan.id,
        offerId: offer.id,
        offerPriceId: price.id,
        purchasedSeats: input.purchasedSeats ?? null,
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

    const amount = input.invoiceAmount ?? null;
    if (amount != null && amount > 0) {
      const providerInvoiceId =
        input.paydunyaInvoiceToken ??
        input.stripeCheckoutSessionId ??
        null;

      const breakdown = this.invoicesService.buildRenewalBreakdown({
        purchasedSeats: input.purchasedSeats ?? null,
        offer: {
          title: offer.title,
          slug: offer.slug,
          audience: offer.audience,
          maxTeamMembers: offer.maxTeamMembers,
          minSeats: offer.minSeats ?? 1,
        },
        offerPrice: {
          billingType: price.billingType,
          priceAmount: price.priceAmount,
          pricePerSeat: price.pricePerSeat ?? null,
          currency: price.currency ?? 'FCFA',
        },
      });
      const lines = breakdown?.lines ?? [
        {
          kind: 'offer' as const,
          label: `Offre : ${offer.title}`,
          amount,
          seats: input.purchasedSeats ?? null,
        },
      ];
      const description =
        breakdown?.description ?? `Abonnement ${offer.title}`;

      if (providerInvoiceId) {
        const existingInvoice = await this.prisma.paymentInvoice.findUnique({
          where: { providerInvoiceId },
        });
        if (existingInvoice) {
          if (existingInvoice.status !== InvoiceStatus.PAID) {
            await this.prisma.paymentInvoice.update({
              where: { id: existingInvoice.id },
              data: {
                status: InvoiceStatus.PAID,
                subscriptionId: subscription.id,
                teamId,
                amount,
                currency: input.invoiceCurrency ?? price.currency ?? 'FCFA',
                description,
                offerSlug: offer.slug,
                billingType: price.billingType,
                seats: input.purchasedSeats ?? null,
                lines: lines as unknown as Prisma.InputJsonValue,
                provider: input.invoiceProvider ?? existingInvoice.provider,
                paidAt: new Date(),
              },
            });
          }
        } else {
          await this.prisma.paymentInvoice.create({
            data: {
              number: this.generateInvoiceNumber(),
              userId: input.userId,
              teamId,
              subscriptionId: subscription.id,
              amount,
              currency: input.invoiceCurrency ?? price.currency ?? 'FCFA',
              status: InvoiceStatus.PAID,
              description,
              offerSlug: offer.slug,
              billingType: price.billingType,
              seats: input.purchasedSeats ?? null,
              lines: lines as unknown as Prisma.InputJsonValue,
              provider: input.invoiceProvider ?? null,
              providerInvoiceId,
              paidAt: new Date(),
            },
          });
        }
      } else {
        await this.prisma.paymentInvoice.create({
          data: {
            number: this.generateInvoiceNumber(),
            userId: input.userId,
            teamId,
            subscriptionId: subscription.id,
            amount,
            currency: input.invoiceCurrency ?? price.currency ?? 'FCFA',
            status: InvoiceStatus.PAID,
            description,
            offerSlug: offer.slug,
            billingType: price.billingType,
            seats: input.purchasedSeats ?? null,
            lines: lines as unknown as Prisma.InputJsonValue,
            provider: input.invoiceProvider ?? null,
            paidAt: new Date(),
          },
        });
      }

      await this.invoicesService.settlePendingInvoices({
        userId: input.userId,
        teamId,
        paidAmount: amount,
      });
    }

    return subscription;
  }

  private generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const suffix = randomBytes(3).toString('hex').toUpperCase();
    return `INV-${year}-${suffix}`;
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
      where: validSubscriptionWhere({ userId }),
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
    purchasedSeats?: number | null;
    plan: { name: string; slug: string };
    offer?: {
      title: string;
      slug: string;
      audience: OfferAudience;
      canCustomize: boolean;
      maxTeamMembers: number;
      minSeats?: number;
      hasPortfolio: boolean;
      hasWallet: boolean;
      hasAnalytics: boolean;
      hasVisitorInsights: boolean;
      hasSocialLinks: boolean;
      maxAiScans: number;
      maxShares?: number;
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
      entitlements: this.toEntitlementsResponse(
        offer,
        subscription.purchasedSeats,
      ),
      purchasedSeats: subscription.purchasedSeats ?? null,
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
      maxShares?: number;
    } | null,
    purchasedSeats?: number | null,
  ) {
    const maxTeamMembers =
      purchasedSeats != null && purchasedSeats > 0
        ? purchasedSeats
        : (offer?.maxTeamMembers ?? 0);

    return {
      audience: offer?.audience ?? OfferAudience.PERSONAL,
      canCustomize: offer?.canCustomize ?? false,
      maxTeamMembers,
      hasPortfolio: offer?.hasPortfolio ?? false,
      hasWallet: offer?.hasWallet ?? false,
      hasAnalytics: offer?.hasAnalytics ?? false,
      hasVisitorInsights: offer?.hasVisitorInsights ?? false,
      hasSocialLinks: offer?.hasSocialLinks ?? false,
      maxAiScans: offer?.maxAiScans ?? 0,
      maxShares: offer?.maxShares ?? 0,
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
    minSeats: number;
    hasPortfolio: boolean;
    hasWallet: boolean;
    hasAnalytics: boolean;
    hasVisitorInsights: boolean;
    hasSocialLinks: boolean;
    maxAiScans: number;
    maxShares: number;
    sortOrder: number;
    prices: Array<{
      id: string;
      billingType: OfferBillingType;
      priceLabel: string | null;
      priceAmount: { toNumber?: () => number } | number;
      pricePerSeat?: { toNumber?: () => number } | number | null;
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
      minSeats: offer.minSeats,
      hasPortfolio: offer.hasPortfolio,
      hasWallet: offer.hasWallet,
      hasAnalytics: offer.hasAnalytics,
      hasVisitorInsights: offer.hasVisitorInsights,
      hasSocialLinks: offer.hasSocialLinks,
      maxAiScans: offer.maxAiScans,
      maxShares: offer.maxShares,
      sortOrder: offer.sortOrder,
      prices: offer.prices.map((price) => this.toOfferPriceResponse(price)),
    };
  }

  private toOfferPriceResponse(price: {
    id: string;
    billingType: OfferBillingType;
    priceLabel: string | null;
    priceAmount: { toNumber?: () => number } | number;
    pricePerSeat?: { toNumber?: () => number } | number | null;
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
    const pricePerSeatRaw = price.pricePerSeat;
    const pricePerSeat =
      pricePerSeatRaw == null
        ? null
        : typeof pricePerSeatRaw === 'number'
          ? pricePerSeatRaw
          : Number(pricePerSeatRaw);

    return {
      id: price.id,
      billingType: price.billingType,
      priceLabel: price.priceLabel,
      priceAmount,
      pricePerSeat:
        pricePerSeat != null && Number.isFinite(pricePerSeat)
          ? pricePerSeat
          : null,
      currency: price.currency,
      discountPercent: price.discountPercent,
      badgeLabel: price.badgeLabel,
      isPopular: price.isPopular,
      sortOrder: price.sortOrder,
    };
  }
}
