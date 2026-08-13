"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InvoicesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const UPCOMING_INVOICE_WINDOW_DAYS = 10;
let InvoicesService = InvoicesService_1 = class InvoicesService {
    prisma;
    logger = new common_1.Logger(InvoicesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateDueUpcomingInvoicesCron() {
        const created = await this.generateDueUpcomingInvoices();
        if (created > 0) {
            this.logger.log(`Factures à venir générées : ${created}`);
        }
    }
    async generateDueUpcomingInvoices() {
        const subscriptions = await this.prisma.subscription.findMany({
            where: {
                status: {
                    in: [
                        client_1.SubscriptionStatus.ACTIVE,
                        client_1.SubscriptionStatus.TRIAL,
                        client_1.SubscriptionStatus.PAST_DUE,
                    ],
                },
                currentPeriodEnd: { not: null },
                userId: { not: null },
                offer: { audience: client_1.OfferAudience.TEAM },
            },
            include: {
                offer: true,
                offerPrice: true,
            },
        });
        let created = 0;
        for (const subscription of subscriptions) {
            const invoice = await this.maybeCreateUpcomingInvoice(subscription);
            if (invoice)
                created += 1;
        }
        return created;
    }
    async ensureUpcomingForOwner(ownerId, teamId) {
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                status: {
                    in: [
                        client_1.SubscriptionStatus.ACTIVE,
                        client_1.SubscriptionStatus.TRIAL,
                        client_1.SubscriptionStatus.PAST_DUE,
                    ],
                },
                currentPeriodEnd: { not: null },
                offer: { audience: client_1.OfferAudience.TEAM },
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
        if (!subscription)
            return null;
        return this.maybeCreateUpcomingInvoice(subscription);
    }
    async refreshPendingRenewal(subscriptionId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
            include: { offer: true, offerPrice: true },
        });
        if (!subscription?.offer || !subscription.offerPrice)
            return;
        const pending = await this.prisma.paymentInvoice.findMany({
            where: {
                subscriptionId,
                status: client_1.InvoiceStatus.PENDING,
                providerInvoiceId: { startsWith: `renewal:${subscriptionId}:` },
            },
        });
        for (const invoice of pending) {
            const built = this.buildRenewalBreakdown({
                purchasedSeats: subscription.purchasedSeats,
                offer: subscription.offer,
                offerPrice: subscription.offerPrice,
            });
            if (!built)
                continue;
            await this.prisma.paymentInvoice.update({
                where: { id: invoice.id },
                data: {
                    amount: built.amount,
                    seats: built.seats,
                    description: built.description,
                    lines: built.lines,
                },
            });
        }
    }
    buildRenewalBreakdown(input) {
        const perSeat = this.toNumber(input.offerPrice.pricePerSeat);
        const currency = input.offerPrice.currency || 'FCFA';
        if (input.offer.audience === client_1.OfferAudience.TEAM &&
            Number.isFinite(perSeat) &&
            perSeat > 0) {
            const baseSeats = Math.max(1, input.offer.minSeats || 1);
            let seats = input.purchasedSeats ?? baseSeats;
            if (seats < baseSeats)
                seats = baseSeats;
            const max = input.offer.maxTeamMembers;
            if (max > 0 && seats > max)
                seats = max;
            const extraSeats = Math.max(0, seats - baseSeats);
            const baseAmount = Math.round(this.toNumber(input.offerPrice.priceAmount));
            const extraAmount = Math.round(perSeat * extraSeats);
            const lines = [
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
        if (!Number.isFinite(amount) || amount <= 0)
            return null;
        const seats = input.purchasedSeats ?? 1;
        const lines = [
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
            description: `${lines[0].label} : ${amount.toLocaleString('fr-FR')} ${currency}`,
        };
    }
    async maybeCreateUpcomingInvoice(subscription) {
        if (!subscription.userId || !subscription.currentPeriodEnd) {
            return null;
        }
        if (!subscription.offer || !subscription.offerPrice) {
            return null;
        }
        if (subscription.offerPrice.billingType === client_1.OfferBillingType.LIFETIME) {
            return null;
        }
        const dueAt = new Date(subscription.currentPeriodEnd);
        const now = new Date();
        const daysUntil = (dueAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);
        if (daysUntil > UPCOMING_INVOICE_WINDOW_DAYS) {
            return null;
        }
        const dueKey = dueAt.toISOString().slice(0, 10);
        const providerInvoiceId = `renewal:${subscription.id}:${dueKey}`;
        const existing = await this.prisma.paymentInvoice.findUnique({
            where: { providerInvoiceId },
        });
        if (existing) {
            const built = this.buildRenewalBreakdown({
                purchasedSeats: subscription.purchasedSeats,
                offer: subscription.offer,
                offerPrice: subscription.offerPrice,
            });
            if (built &&
                (Number(existing.amount) !== built.amount ||
                    existing.seats !== built.seats)) {
                return this.prisma.paymentInvoice.update({
                    where: { id: existing.id },
                    data: {
                        amount: built.amount,
                        seats: built.seats,
                        description: built.description,
                        lines: built.lines,
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
        const billingLabel = subscription.offerPrice.billingType === client_1.OfferBillingType.YEARLY
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
                status: client_1.InvoiceStatus.PENDING,
                description: `Renouvellement ${billingLabel} — ${built.description}`,
                offerSlug: subscription.offer.slug,
                billingType: subscription.offerPrice.billingType,
                seats: built.seats,
                lines: built.lines,
                provider: 'dropone',
                providerInvoiceId,
                dueAt,
            },
        });
    }
    toNumber(value) {
        if (value == null)
            return NaN;
        if (typeof value === 'number')
            return value;
        if (typeof value.toNumber === 'function')
            return value.toNumber();
        return Number(value);
    }
    generateInvoiceNumber() {
        const year = new Date().getFullYear();
        const suffix = (0, crypto_1.randomBytes)(3).toString('hex').toUpperCase();
        return `INV-${year}-${suffix}`;
    }
    async settlePendingInvoices(input) {
        const pending = await this.prisma.paymentInvoice.findMany({
            where: {
                userId: input.userId,
                status: client_1.InvoiceStatus.PENDING,
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
                    status: client_1.InvoiceStatus.PAID,
                    paidAt: new Date(),
                    ...(input.paidAmount != null ? { amount: input.paidAmount } : {}),
                },
            });
        }
    }
};
exports.InvoicesService = InvoicesService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvoicesService.prototype, "generateDueUpcomingInvoicesCron", null);
exports.InvoicesService = InvoicesService = InvoicesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map