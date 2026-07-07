import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OfferBillingType } from '@prisma/client';
import Stripe from 'stripe';

export type StripeCheckoutParams = {
  customerId: string;
  stripePriceId: string;
  billingType: OfferBillingType;
  userId: string;
  offerSlug: string;
  offerPriceId: string;
  teamId?: string | null;
};

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private client: Stripe | null = null;

  constructor(private readonly configService: ConfigService) {}

  isEnabled(): boolean {
    const stripe = this.configService.get<{
      enabled?: boolean;
      secretKey?: string;
    }>('stripe');

    return Boolean(stripe?.enabled && stripe.secretKey?.trim());
  }

  getClient(): Stripe {
    if (this.client) {
      return this.client;
    }

    const secretKey = this.configService.get<string>('stripe.secretKey', '');
    this.client = new Stripe(secretKey, {
      apiVersion: '2026-06-24.dahlia',
    });

    return this.client;
  }

  async createCustomer(input: {
    email: string;
    name: string;
    userId: string;
  }): Promise<Stripe.Customer> {
    return this.getClient().customers.create({
      email: input.email,
      name: input.name,
      metadata: { userId: input.userId },
    });
  }

  async createCheckoutSession(
    params: StripeCheckoutParams,
  ): Promise<Stripe.Checkout.Session> {
    const isLifetime = params.billingType === OfferBillingType.LIFETIME;
    const successUrl = this.configService.get<string>('stripe.successUrl', '');
    const cancelUrl = this.configService.get<string>('stripe.cancelUrl', '');

    return this.getClient().checkout.sessions.create({
      mode: isLifetime ? 'payment' : 'subscription',
      customer: params.customerId,
      line_items: [
        {
          price: params.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: params.userId,
        offerSlug: params.offerSlug,
        billingType: params.billingType,
        offerPriceId: params.offerPriceId,
        teamId: params.teamId ?? '',
      },
      ...(isLifetime
        ? {}
        : {
            subscription_data: {
              metadata: {
                userId: params.userId,
                offerSlug: params.offerSlug,
                billingType: params.billingType,
                offerPriceId: params.offerPriceId,
                teamId: params.teamId ?? '',
              },
            },
          }),
    });
  }

  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.configService.get<string>(
      'stripe.webhookSecret',
      '',
    );

    return this.getClient().webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }

  logDisabledCheckoutAttempt(userId: string) {
    this.logger.warn(
      `[dev] Paiement Stripe désactivé — abonnement instantané pour ${userId}`,
    );
  }
}
