import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  InvoiceStatus,
  OfferAudience,
  OfferBillingType,
  Prisma,
  SubscriptionStatus,
} from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { LIVE_SUBSCRIPTION_STATUSES } from './subscription-validity';

/** Génère la facture de renouvellement à J-10 de l’échéance. */
const UPCOMING_INVOICE_WINDOW_DAYS = 10;

export type InvoiceLine = {
  label: string;
  amount: number;
  seats?: number | null;
  kind: 'offer' | 'extra_seats' | 'seat_upgrade';
};

@Injectable()
export class InvoicesService implements OnModuleInit {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const expired = await this.expireOverdueSubscriptions();
    if (expired > 0) {
      this.logger.log(`Abonnements expirés au démarrage : ${expired}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async generateDueUpcomingInvoicesCron() {
    const created = await this.generateDueUpcomingInvoices();
    if (created > 0) {
      this.logger.log(`Factures à venir générées : ${created}`);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async expireOverdueSubscriptionsCron() {
    const expired = await this.expireOverdueSubscriptions();
    if (expired > 0) {
      this.logger.log(`Abonnements marqués expirés : ${expired}`);
    }
  }

  async expireOverdueSubscriptions(): Promise<number> {
    const result = await this.prisma.subscription.updateMany({
      where: {
        status: { in: LIVE_SUBSCRIPTION_STATUSES },
        currentPeriodEnd: { lte: new Date() },
      },
      data: { status: SubscriptionStatus.EXPIRED },
    });
    return result.count;
  }

  async generateDueUpcomingInvoices(): Promise<number> {
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        status: {
          in: [
            SubscriptionStatus.ACTIVE,
            SubscriptionStatus.TRIAL,
            SubscriptionStatus.PAST_DUE,
          ],
        },
        currentPeriodEnd: { not: null },
        userId: { not: null },
        offer: { audience: OfferAudience.TEAM },
      },
      include: {
        offer: true,
        offerPrice: true,
      },
    });

    let created = 0;
    for (const subscription of subscriptions) {
      const invoice = await this.maybeCreateUpcomingInvoice(subscription);
      if (invoice) created += 1;
    }
    return created;
  }

  async ensureUpcomingForOwner(ownerId: string, teamId?: string | null) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        status: {
          in: [
            SubscriptionStatus.ACTIVE,
            SubscriptionStatus.TRIAL,
            SubscriptionStatus.PAST_DUE,
          ],
        },
        currentPeriodEnd: { not: null },
        offer: { audience: OfferAudience.TEAM },
        OR: [
          ...(teamId ? [{ teamId }] : []),
          { userId: ownerId },
        ],
      },
      include: {
        offer: true,
        offerPrice: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) return null;
    return this.maybeCreateUpcomingInvoice(subscription);
  }

  /** Met à jour la facture de renouvellement PENDING après un changement de sièges. */
  async refreshPendingRenewal(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { offer: true, offerPrice: true },
    });
    if (!subscription?.offer || !subscription.offerPrice) return;

    const pending = await this.prisma.paymentInvoice.findMany({
      where: {
        subscriptionId,
        status: InvoiceStatus.PENDING,
        providerInvoiceId: { startsWith: `renewal:${subscriptionId}:` },
      },
    });

    for (const invoice of pending) {
      const built = this.buildRenewalBreakdown({
        purchasedSeats: subscription.purchasedSeats,
        offer: subscription.offer,
        offerPrice: subscription.offerPrice,
      });
      if (!built) continue;
      await this.prisma.paymentInvoice.update({
        where: { id: invoice.id },
        data: {
          amount: built.amount,
          seats: built.seats,
          description: built.description,
          lines: built.lines as unknown as Prisma.InputJsonValue,
        },
      });
    }
  }

  buildRenewalBreakdown(input: {
    purchasedSeats: number | null;
    offer: {
      title: string;
      slug: string;
      audience: OfferAudience;
      maxTeamMembers: number;
      minSeats: number;
    };
    offerPrice: {
      billingType: OfferBillingType;
      priceAmount: { toNumber?: () => number } | number;
      pricePerSeat: { toNumber?: () => number } | number | null;
      currency: string;
    };
  }): {
    amount: number;
    seats: number;
    lines: InvoiceLine[];
    description: string;
  } | null {
    const perSeat = this.toNumber(input.offerPrice.pricePerSeat);
    const currency = input.offerPrice.currency || 'FCFA';

    if (
      input.offer.audience === OfferAudience.TEAM &&
      Number.isFinite(perSeat) &&
      perSeat > 0
    ) {
      const baseSeats = Math.max(1, input.offer.minSeats || 1);
      let seats = input.purchasedSeats ?? baseSeats;
      if (seats < baseSeats) seats = baseSeats;
      const max = input.offer.maxTeamMembers;
      if (max > 0 && seats > max) seats = max;

      const extraSeats = Math.max(0, seats - baseSeats);
      const baseAmount = Math.round(this.toNumber(input.offerPrice.priceAmount));
      const extraAmount = Math.round(perSeat * extraSeats);

      const lines: InvoiceLine[] = [
        {
          kind: 'offer',
          label: `Offre : ${input.offer.title} (${baseSeats} siège${baseSeats > 1 ? 's' : ''} inclus)`,
          amount: baseAmount,
          seats: baseSeats,
        },
      ];
      if (extraSeats > 0) {
        lines.push({
          kind: 'extra_seats',
          label: `${extraSeats} utilisateur${extraSeats > 1 ? 's' : ''} supplémentaire${extraSeats > 1 ? 's' : ''}`,
          amount: extraAmount,
          seats: extraSeats,
        });
      }

      const amount = baseAmount + extraAmount;
      const description = lines
        .map((line) => `${line.label} : ${line.amount.toLocaleString('fr-FR')} ${currency}`)
        .join(', ');

      return { amount, seats, lines, description };
    }

    const amount = Math.round(this.toNumber(input.offerPrice.priceAmount));
    if (!Number.isFinite(amount) || amount <= 0) return null;
    const seats = input.purchasedSeats ?? 1;
    const lines: InvoiceLine[] = [
      {
        kind: 'offer',
        label: `Offre : ${input.offer.title}`,
        amount,
        seats,
      },
    ];
    return {
      amount,
      seats,
      lines,
      description: `${lines[0]!.label} : ${amount.toLocaleString('fr-FR')} ${currency}`,
    };
  }

  private async maybeCreateUpcomingInvoice(
    subscription: {
      id: string;
      userId: string | null;
      teamId: string | null;
      purchasedSeats: number | null;
      currentPeriodEnd: Date | null;
      offer: {
        title: string;
        slug: string;
        audience: OfferAudience;
        maxTeamMembers: number;
        minSeats: number;
      } | null;
      offerPrice: {
        billingType: OfferBillingType;
        priceAmount: { toNumber?: () => number } | number;
        pricePerSeat: { toNumber?: () => number } | number | null;
        currency: string;
      } | null;
    },
  ) {
    if (!subscription.userId || !subscription.currentPeriodEnd) {
      return null;
    }
    if (!subscription.offer || !subscription.offerPrice) {
      return null;
    }
    if (subscription.offerPrice.billingType === OfferBillingType.LIFETIME) {
      return null;
    }

    const dueAt = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    const daysUntil =
      (dueAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);

    if (daysUntil > UPCOMING_INVOICE_WINDOW_DAYS) {
      return null;
    }

    const dueKey = dueAt.toISOString().slice(0, 10);
    const providerInvoiceId = `renewal:${subscription.id}:${dueKey}`;

    const existing = await this.prisma.paymentInvoice.findUnique({
      where: { providerInvoiceId },
    });
    if (existing) {
      // Recalcule au cas où les sièges ont changé.
      const built = this.buildRenewalBreakdown({
        purchasedSeats: subscription.purchasedSeats,
        offer: subscription.offer,
        offerPrice: subscription.offerPrice,
      });
      if (
        built &&
        (Number(existing.amount) !== built.amount ||
          existing.seats !== built.seats)
      ) {
        return this.prisma.paymentInvoice.update({
          where: { id: existing.id },
          data: {
            amount: built.amount,
            seats: built.seats,
            description: built.description,
            lines: built.lines as unknown as Prisma.InputJsonValue,
          },
        });
      }
      return existing;
    }

    const built = this.buildRenewalBreakdown({
      purchasedSeats: subscription.purchasedSeats,
      offer: subscription.offer,
      offerPrice: subscription.offerPrice,
    });
    if (!built || built.amount <= 0) {
      return null;
    }

    const billingLabel =
      subscription.offerPrice.billingType === OfferBillingType.YEARLY
        ? 'annuel'
        : 'mensuel';

    return this.prisma.paymentInvoice.create({
      data: {
        number: this.generateInvoiceNumber(),
        userId: subscription.userId,
        teamId: subscription.teamId,
        subscriptionId: subscription.id,
        amount: built.amount,
        currency: subscription.offerPrice.currency || 'FCFA',
        status: InvoiceStatus.PENDING,
        description: `Renouvellement ${billingLabel} - ${built.description}`,
        offerSlug: subscription.offer.slug,
        billingType: subscription.offerPrice.billingType,
        seats: built.seats,
        lines: built.lines as unknown as Prisma.InputJsonValue,
        provider: 'dropone',
        providerInvoiceId,
        dueAt,
      },
    });
  }

  toNumber(
    value: { toNumber?: () => number } | number | null | undefined,
  ): number {
    if (value == null) return NaN;
    if (typeof value === 'number') return value;
    if (typeof value.toNumber === 'function') return value.toNumber();
    return Number(value);
  }

  generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const suffix = randomBytes(3).toString('hex').toUpperCase();
    return `INV-${year}-${suffix}`;
  }

  async settlePendingInvoices(input: {
    userId: string;
    teamId?: string | null;
    paidAmount?: number | null;
    paidProviderInvoiceId?: string | null;
  }) {
    const pending = await this.prisma.paymentInvoice.findMany({
      where: {
        userId: input.userId,
        status: InvoiceStatus.PENDING,
        ...(input.teamId
          ? { OR: [{ teamId: input.teamId }, { teamId: null }] }
          : {}),
      },
      orderBy: { dueAt: 'asc' },
      take: 5,
    });

    for (const invoice of pending) {
      await this.prisma.paymentInvoice.update({
        where: { id: invoice.id },
        data: {
          status: InvoiceStatus.PAID,
          paidAt: new Date(),
          ...(input.paidAmount != null ? { amount: input.paidAmount } : {}),
        },
      });
    }
  }
}
