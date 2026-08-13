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
var SubscriptionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const paydunya_callback_util_1 = require("../paydunya/paydunya-callback.util");
const paydunya_service_1 = require("../paydunya/paydunya.service");
const stripe_service_1 = require("./stripe.service");
const invoices_service_1 = require("./invoices.service");
let SubscriptionsService = SubscriptionsService_1 = class SubscriptionsService {
    prisma;
    stripeService;
    paydunyaService;
    invoicesService;
    logger = new common_1.Logger(SubscriptionsService_1.name);
    constructor(prisma, stripeService, paydunyaService, invoicesService) {
        this.prisma = prisma;
        this.stripeService = stripeService;
        this.paydunyaService = paydunyaService;
        this.invoicesService = invoicesService;
    }
    getPaymentConfig() {
        return {
            paymentsEnabled: this.paydunyaService.isConfigured(),
            provider: this.paydunyaService.isConfigured() ? 'paydunya' : 'none',
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
    getPlan(slug) {
        return { message: 'getPlan', slug };
    }
    async getMySubscription(userId) {
        const subscription = await this.findActiveSubscription(userId);
        if (!subscription) {
            throw new common_1.NotFoundException('Aucun abonnement actif');
        }
        return this.toSubscriptionResponse(subscription);
    }
    async createCheckout(userId, dto) {
        if (!this.paydunyaService.isConfigured()) {
            throw new common_1.BadRequestException('Le paiement PayDunya est désactivé. Utilisez /subscriptions/subscribe pour les tests.');
        }
        const { offer, price, billingMultiplier, effectiveBillingType } = await this.resolveOfferPrice(dto.offerSlug, dto.billingType);
        if (dto.teamId && offer.audience !== client_1.OfferAudience.TEAM) {
            throw new common_1.BadRequestException('Cette offre ne couvre pas un espace équipe');
        }
        const { amount, seats } = this.resolveCheckoutPricing(offer, price, dto.seats, billingMultiplier);
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new common_1.BadRequestException('Cette offre est gratuite. Utilisez /subscriptions/subscribe.');
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        const callbackUrl = (0, paydunya_callback_util_1.paydunyaIpnCallbackUrl)(this.logger);
        const storeName = process.env.PAYDUNYA_STORE_NAME?.trim() || 'Drop One';
        const seatsLabel = seats != null ? ` · ${seats} utilisateur${seats > 1 ? 's' : ''}` : '';
        const billingLabel = price.priceLabel ??
            (effectiveBillingType === client_1.OfferBillingType.YEARLY ? 'YEARLY' : dto.billingType);
        const inv = await this.paydunyaService.createCheckoutInvoice({
            totalAmountFcfa: amount,
            description: `${offer.title} — ${billingLabel}${seatsLabel}`,
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
        return {
            checkoutUrl: inv.checkoutUrl,
            invoiceToken: inv.invoiceToken,
            sessionId: inv.invoiceToken,
            amountFcfa: amount,
            seats,
            description: offer.title,
        };
    }
    async softPay(userId, dto) {
        if (!this.paydunyaService.isConfigured()) {
            throw new common_1.ServiceUnavailableException('Paiement PayDunya non configuré sur le serveur');
        }
        const { offer, price, billingMultiplier } = await this.resolveOfferPrice(dto.offerSlug, dto.billingType);
        const { amount } = this.resolveCheckoutPricing(offer, price, dto.seats, billingMultiplier);
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new common_1.BadRequestException('Montant invalide pour SoftPay');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, firstName: true, lastName: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        const invoiceToken = dto.invoiceToken.trim();
        const email = (dto.email?.trim() || user.email || 'contact@dropone.pro').slice(0, 200);
        const phone = dto.telephone.replace(/\s+/g, '');
        const fullName = `${dto.prenom} ${dto.nom}`.trim() ||
            `${user.firstName} ${user.lastName}`.trim();
        let soft;
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
                throw new common_1.BadRequestException('Moyen de paiement inconnu');
        }
        if (!soft.success) {
            throw new common_1.BadRequestException(typeof soft.message === 'string' && soft.message.trim()
                ? soft.message
                : 'Paiement mobile refusé par PayDunya');
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
    async confirmPaydunyaPayment(userId, invoiceToken) {
        const token = invoiceToken?.trim();
        if (!token) {
            return { paid: false, error: 'missing_token' };
        }
        const existingPaid = await this.prisma.paymentInvoice.findUnique({
            where: { providerInvoiceId: token },
        });
        if (existingPaid?.status === client_1.InvoiceStatus.PAID) {
            return { paid: true, kind: 'already_paid' };
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
            return { paid: true, kind: 'seat_upgrade', ...result };
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
            return { paid: true, kind: 'invoice_pay', ...result };
        }
        if (kind !== 'subscription') {
            return { paid: false, error: 'not_subscription_invoice' };
        }
        const customUserId = String(custom['userId'] ?? '').trim();
        if (!customUserId || customUserId !== userId) {
            return { paid: false, error: 'user_mismatch' };
        }
        const offerSlug = String(custom['offerSlug'] ?? '').trim();
        const billingType = String(custom['billingType'] ?? '').trim();
        if (!offerSlug || !billingType) {
            return { paid: false, error: 'invalid_custom_data' };
        }
        const { offer, price, billingMultiplier, effectiveBillingType } = await this.resolveOfferPrice(offerSlug, billingType);
        const seats = this.parseSeats(custom['seats']);
        const { amount: expected, seats: purchasedSeats } = this.resolveCheckoutPricing(offer, price, seats ?? undefined, billingMultiplier);
        const paid = Math.round(confirmed.totalAmount);
        if (Math.abs(paid - expected) > 1) {
            return { paid: false, error: 'amount_mismatch' };
        }
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
    }
    async createSeatUpgradeCheckout(userId, input) {
        const additionalSeats = Math.floor(input.additionalSeats);
        if (!Number.isFinite(additionalSeats) || additionalSeats < 1) {
            throw new common_1.BadRequestException('Ajoutez au moins 1 siège');
        }
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                OR: [{ teamId: input.teamId }, { userId }],
                status: {
                    in: [
                        client_1.SubscriptionStatus.ACTIVE,
                        client_1.SubscriptionStatus.TRIAL,
                        client_1.SubscriptionStatus.PAST_DUE,
                    ],
                },
            },
            include: { offer: true, offerPrice: true },
            orderBy: { createdAt: 'desc' },
        });
        if (!subscription?.offer || !subscription.offerPrice) {
            throw new common_1.BadRequestException('Aucun abonnement équipe actif');
        }
        if (subscription.offer.audience !== client_1.OfferAudience.TEAM) {
            throw new common_1.BadRequestException('Cette offre ne permet pas d’ajouter des sièges');
        }
        const perSeat = this.toNumber(subscription.offerPrice.pricePerSeat);
        if (!Number.isFinite(perSeat) || perSeat <= 0) {
            throw new common_1.BadRequestException('Tarif au siège indisponible pour cette offre');
        }
        const minSeats = Math.max(1, subscription.offer.minSeats || 1);
        const currentSeats = Math.max(minSeats, subscription.purchasedSeats ?? minSeats);
        const max = subscription.offer.maxTeamMembers;
        const hardMax = max < 0 ? 500 : max;
        const newTotal = currentSeats + additionalSeats;
        if (newTotal > hardMax) {
            throw new common_1.BadRequestException(max < 0
                ? `Maximum ${hardMax} utilisateurs`
                : `Cette offre est limitée à ${hardMax} utilisateurs`);
        }
        const amount = Math.round(perSeat * additionalSeats);
        const currency = subscription.offerPrice.currency || 'FCFA';
        const lines = [
            {
                kind: 'seat_upgrade',
                label: `${additionalSeats} siège${additionalSeats > 1 ? 's' : ''} en plus`,
                amount,
                seats: additionalSeats,
            },
        ];
        if (!this.paydunyaService.isConfigured()) {
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
                paidImmediately: true,
                amountFcfa: amount,
                additionalSeats,
                newSeatsTotal: result.purchasedSeats,
                checkoutUrl: null,
                invoiceToken: null,
            };
        }
        const callbackUrl = (0, paydunya_callback_util_1.paydunyaIpnCallbackUrl)(this.logger);
        const storeName = process.env.PAYDUNYA_STORE_NAME?.trim() || 'Drop One';
        const inv = await this.paydunyaService.createCheckoutInvoice({
            totalAmountFcfa: amount,
            description: `${additionalSeats} siège${additionalSeats > 1 ? 's' : ''} en plus — ${subscription.offer.title}`,
            storeName,
            callbackUrl,
            returnUrl: input.returnUrl?.trim() ||
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
            paidImmediately: false,
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
    async confirmSeatUpgrade(userId, invoiceToken) {
        return this.confirmPaydunyaPayment(userId, invoiceToken);
    }
    async applySeatUpgradePayment(input) {
        const already = await this.prisma.paymentInvoice.findUnique({
            where: { providerInvoiceId: input.invoiceToken },
        });
        if (already) {
            const sub = await this.prisma.subscription.findUnique({
                where: { id: input.subscriptionId },
            });
            return {
                alreadyProcessed: true,
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
            throw new common_1.BadRequestException('Abonnement introuvable pour cet ajout de sièges');
        }
        const perSeat = this.toNumber(subscription.offerPrice.pricePerSeat);
        const expected = Math.round(perSeat * input.additionalSeats);
        if (!input.skipAmountCheck &&
            Number.isFinite(expected) &&
            Math.abs(input.paidAmount - expected) > 1) {
            throw new common_1.BadRequestException('Montant de paiement incorrect pour les sièges');
        }
        const minSeats = Math.max(1, subscription.offer.minSeats || 1);
        const currentSeats = Math.max(minSeats, subscription.purchasedSeats ?? minSeats);
        const newTotal = currentSeats + input.additionalSeats;
        const lines = input.lines ?? [
            {
                kind: 'seat_upgrade',
                label: `${input.additionalSeats} siège${input.additionalSeats > 1 ? 's' : ''} en plus`,
                amount: input.paidAmount,
                seats: input.additionalSeats,
            },
        ];
        const currency = subscription.offerPrice.currency || 'FCFA';
        const description = lines
            .map((line) => `${line.label} : ${line.amount.toLocaleString('fr-FR')} ${currency}`)
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
                status: client_1.InvoiceStatus.PAID,
                description,
                offerSlug: subscription.offer.slug,
                billingType: subscription.offerPrice.billingType,
                seats: input.additionalSeats,
                lines: lines,
                provider: 'paydunya',
                providerInvoiceId: input.invoiceToken,
                paidAt: new Date(),
            },
        });
        await this.invoicesService.refreshPendingRenewal(subscription.id);
        this.logger.log(`Sièges ajoutés subscription=${subscription.id} +${input.additionalSeats} → ${newTotal}`);
        return {
            alreadyProcessed: false,
            purchasedSeats: updated.purchasedSeats,
            invoiceId: invoice.id,
        };
    }
    async createPendingInvoiceCheckout(userId, input) {
        const invoice = await this.prisma.paymentInvoice.findFirst({
            where: {
                id: input.paymentInvoiceId,
                status: client_1.InvoiceStatus.PENDING,
                OR: [{ teamId: input.teamId }, { userId }],
            },
        });
        if (!invoice) {
            throw new common_1.BadRequestException('Facture à payer introuvable');
        }
        const amount = Math.round(Number(invoice.amount));
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new common_1.BadRequestException('Montant de facture invalide');
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
                paidImmediately: true,
                amountFcfa: amount,
                checkoutUrl: null,
                invoiceToken: null,
                paymentInvoiceId: result.paymentInvoiceId,
                alreadyProcessed: result.alreadyProcessed,
            };
        }
        const callbackUrl = (0, paydunya_callback_util_1.paydunyaIpnCallbackUrl)(this.logger);
        const storeName = process.env.PAYDUNYA_STORE_NAME?.trim() || 'Drop One';
        const inv = await this.paydunyaService.createCheckoutInvoice({
            totalAmountFcfa: amount,
            description: invoice.description || `Facture ${invoice.number}`,
            storeName,
            callbackUrl,
            returnUrl: input.returnUrl?.trim() ||
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
            paidImmediately: false,
            amountFcfa: amount,
            checkoutUrl: inv.checkoutUrl,
            invoiceToken: inv.invoiceToken,
            paymentInvoiceId: invoice.id,
        };
    }
    async confirmPendingInvoicePayment(userId, invoiceToken) {
        return this.confirmPaydunyaPayment(userId, invoiceToken);
    }
    async applyPendingInvoicePayment(input) {
        const byToken = await this.prisma.paymentInvoice.findFirst({
            where: {
                OR: [
                    { id: input.paymentInvoiceId, status: client_1.InvoiceStatus.PAID },
                    { providerInvoiceId: input.invoiceToken, status: client_1.InvoiceStatus.PAID },
                ],
            },
        });
        if (byToken) {
            return {
                alreadyProcessed: true,
                paymentInvoiceId: byToken.id,
            };
        }
        const invoice = await this.prisma.paymentInvoice.findUnique({
            where: { id: input.paymentInvoiceId },
        });
        if (!invoice) {
            throw new common_1.BadRequestException('Facture introuvable');
        }
        if (invoice.status !== client_1.InvoiceStatus.PENDING) {
            throw new common_1.BadRequestException('Cette facture n’est pas payable');
        }
        const expected = Math.round(Number(invoice.amount));
        if (!input.skipAmountCheck &&
            Math.abs(input.paidAmount - expected) > 1) {
            throw new common_1.BadRequestException('Montant de paiement incorrect');
        }
        const paid = await this.prisma.paymentInvoice.update({
            where: { id: invoice.id },
            data: {
                status: client_1.InvoiceStatus.PAID,
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
                        status: client_1.SubscriptionStatus.ACTIVE,
                        currentPeriodEnd: nextEnd,
                        cancelledAt: null,
                    },
                });
            }
        }
        this.logger.log(`Facture payée ${invoice.number} userId=${input.userId} amount=${input.paidAmount}`);
        return {
            alreadyProcessed: false,
            paymentInvoiceId: paid.id,
        };
    }
    extendPeriodFrom(from, billingType) {
        const end = new Date(from);
        switch (billingType) {
            case client_1.OfferBillingType.YEARLY:
                end.setFullYear(end.getFullYear() + 1);
                return end;
            case client_1.OfferBillingType.LIFETIME:
                end.setFullYear(end.getFullYear() + 100);
                return end;
            case client_1.OfferBillingType.MONTHLY:
            default:
                end.setMonth(end.getMonth() + 1);
                return end;
        }
    }
    async handlePaydunyaIpn(body) {
        const parsed = this.normalizePaydunyaIpnPayload(body);
        if (!parsed) {
            this.logger.warn('IPN PayDunya: payload non reconnu');
            return { ok: false, error: 'invalid_payload' };
        }
        if (!this.paydunyaService.verifyIpnHash(parsed.hash)) {
            this.logger.warn('IPN PayDunya: hash refusé');
            throw new common_1.ForbiddenException('Notification PayDunya non authentifiée');
        }
        if (parsed.status.toLowerCase() !== 'completed') {
            return {
                ok: true,
                ignored: true,
                status: parsed.status,
            };
        }
        if (parsed.kind === 'seat_upgrade') {
            const result = await this.applySeatUpgradePayment({
                userId: parsed.userId,
                invoiceToken: parsed.invoiceToken,
                subscriptionId: parsed.subscriptionId,
                additionalSeats: parsed.additionalSeats,
                paidAmount: Math.round(parsed.totalAmount),
            });
            return { ok: true, seatUpgrade: true, ...result };
        }
        if (parsed.kind === 'invoice_pay') {
            const result = await this.applyPendingInvoicePayment({
                userId: parsed.userId,
                invoiceToken: parsed.invoiceToken,
                paymentInvoiceId: parsed.paymentInvoiceId,
                paidAmount: Math.round(parsed.totalAmount),
            });
            return { ok: true, invoicePay: true, ...result };
        }
        const existing = await this.prisma.subscription.findFirst({
            where: { paydunyaInvoiceToken: parsed.invoiceToken },
        });
        if (existing) {
            return { ok: true, alreadyProcessed: true };
        }
        const { offer, price, billingMultiplier, effectiveBillingType } = await this.resolveOfferPrice(parsed.offerSlug, parsed.billingType);
        const { amount: expected, seats: purchasedSeats } = this.resolveCheckoutPricing(offer, price, parsed.seats ?? undefined, billingMultiplier);
        const paid = Math.round(parsed.totalAmount);
        if (Math.abs(paid - expected) > 1) {
            this.logger.warn(`IPN PayDunya: écart montant payé=${paid} attendu=${expected}`);
            return { ok: false, error: 'amount_mismatch' };
        }
        await this.activateSubscription({
            userId: parsed.userId,
            offerSlug: offer.slug,
            billingType: effectiveBillingType,
            teamId: parsed.teamId,
            offerPriceId: price.id,
            purchasedSeats,
            paydunyaInvoiceToken: parsed.invoiceToken,
            currentPeriodEnd: this.computePeriodEnd(effectiveBillingType),
            invoiceAmount: paid,
            invoiceCurrency: 'FCFA',
            invoiceProvider: 'paydunya',
        });
        this.logger.log(`IPN PayDunya abonnement activé userId=${parsed.userId} offer=${offer.slug}`);
        return { ok: true };
    }
    async subscribe(userId, dto) {
        const { offer, price, billingMultiplier, effectiveBillingType } = await this.resolveOfferPrice(dto.offerSlug, dto.billingType);
        if (dto.teamId && offer.audience !== client_1.OfferAudience.TEAM) {
            throw new common_1.BadRequestException('Cette offre ne couvre pas un espace équipe');
        }
        const { amount, seats } = this.resolveCheckoutPricing(offer, price, dto.seats, billingMultiplier);
        const isFree = !Number.isFinite(amount) || amount <= 0;
        if (this.paydunyaService.isConfigured() && !isFree) {
            throw new common_1.BadRequestException('Un paiement PayDunya SoftPay est requis pour souscrire à cette offre');
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
    async handleStripeWebhook(payload, signature) {
        if (!this.stripeService.isEnabled()) {
            throw new common_1.BadRequestException('Stripe est désactivé');
        }
        if (!signature) {
            throw new common_1.BadRequestException('Signature Stripe manquante');
        }
        const event = this.stripeService.constructWebhookEvent(payload, signature);
        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutSessionCompleted(event.data.object);
                break;
            case 'customer.subscription.updated':
                await this.handleStripeSubscriptionUpdated(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await this.handleStripeSubscriptionDeleted(event.data.object);
                break;
            case 'invoice.payment_failed':
                await this.handleInvoicePaymentFailed(event.data.object);
                break;
            default:
                break;
        }
        return { received: true };
    }
    cancel() {
        return { message: 'cancel subscription' };
    }
    async resolveOfferPrice(offerSlug, billingType) {
        const offer = await this.prisma.premiumOffer.findFirst({
            where: { slug: offerSlug, isActive: true },
            include: {
                prices: {
                    where: { isActive: true },
                },
            },
        });
        if (!offer) {
            throw new common_1.NotFoundException('Offre Premium introuvable');
        }
        let price = offer.prices.find((item) => item.billingType === billingType) ?? null;
        let billingMultiplier = 1;
        const effectiveBillingType = billingType;
        if (!price && billingType === client_1.OfferBillingType.YEARLY) {
            price =
                offer.prices.find((item) => item.billingType === client_1.OfferBillingType.MONTHLY) ?? null;
            if (price) {
                billingMultiplier = 12;
            }
        }
        if (!price) {
            throw new common_1.BadRequestException('Ce mode de paiement n’est pas disponible pour cette offre');
        }
        return { offer, price, billingMultiplier, effectiveBillingType };
    }
    async ensureStripeCustomer(user) {
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
    normalizePaydunyaIpnPayload(body) {
        let root = body;
        const dataRaw = body?.data ?? body;
        if (typeof dataRaw === 'string') {
            try {
                const parsed = JSON.parse(dataRaw);
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                    root = parsed;
                }
            }
            catch {
                return null;
            }
        }
        else if (dataRaw && typeof dataRaw === 'object' && !Array.isArray(dataRaw)) {
            root = dataRaw;
        }
        else {
            return null;
        }
        const hash = root.hash?.toString()?.trim() ?? '';
        const status = root.status?.toString()?.trim() ?? '';
        const inv = root.invoice;
        let totalAmount = NaN;
        let invoiceToken = '';
        if (inv && typeof inv === 'object' && !Array.isArray(inv)) {
            const invObj = inv;
            totalAmount = Number(invObj.total_amount);
            invoiceToken = invObj.token?.toString()?.trim() ?? '';
        }
        const custom = root.custom_data;
        if (!custom || typeof custom !== 'object' || Array.isArray(custom)) {
            return null;
        }
        const c = custom;
        const kind = c.kind?.toString()?.trim().toLowerCase() ?? '';
        const userId = c.userId?.toString()?.trim() ?? '';
        const offerSlug = c.offerSlug?.toString()?.trim() ?? '';
        const billingType = c.billingType?.toString()?.trim();
        const teamId = c.teamId?.toString()?.trim() || null;
        const seats = this.parseSeats(c.seats);
        const additionalSeats = this.parseSeats(c.additionalSeats);
        const subscriptionId = c.subscriptionId?.toString()?.trim() || null;
        const paymentInvoiceId = c.paymentInvoiceId?.toString()?.trim() || null;
        if ((kind !== 'subscription' &&
            kind !== 'seat_upgrade' &&
            kind !== 'invoice_pay') ||
            !hash ||
            !Number.isFinite(totalAmount) ||
            !invoiceToken ||
            !userId) {
            return null;
        }
        if (kind === 'subscription' && (!offerSlug || !billingType)) {
            return null;
        }
        if (kind === 'seat_upgrade' &&
            (!subscriptionId || !additionalSeats || additionalSeats < 1)) {
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
    parseSeats(raw) {
        if (raw == null || raw === '')
            return null;
        const value = Number(raw);
        if (!Number.isFinite(value) || value < 1)
            return null;
        return Math.floor(value);
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
    isPerSeatPrice(price) {
        const perSeat = this.toNumber(price.pricePerSeat);
        return Number.isFinite(perSeat) && perSeat > 0;
    }
    resolveSeats(offer, requested) {
        const min = Math.max(1, offer.minSeats ?? 1);
        const hardMax = offer.maxTeamMembers < 0 ? 500 : Math.max(min, offer.maxTeamMembers);
        const fallback = offer.maxTeamMembers > 0 ? offer.maxTeamMembers : Math.max(min, 5);
        const seats = requested ?? fallback;
        if (seats < min) {
            throw new common_1.BadRequestException(`Minimum ${min} utilisateur${min > 1 ? 's' : ''} pour cette offre`);
        }
        if (seats > hardMax) {
            throw new common_1.BadRequestException(offer.maxTeamMembers < 0
                ? `Maximum ${hardMax} utilisateurs par commande`
                : `Cette offre est limitée à ${hardMax} utilisateurs`);
        }
        return seats;
    }
    resolveCheckoutPricing(offer, price, requestedSeats, billingMultiplier = 1) {
        const factor = Number.isFinite(billingMultiplier) && billingMultiplier > 0
            ? billingMultiplier
            : 1;
        if (offer.audience === client_1.OfferAudience.TEAM &&
            this.isPerSeatPrice(price)) {
            const seats = this.resolveSeats(offer, requestedSeats);
            const baseSeats = Math.max(1, offer.minSeats ?? 1);
            const baseAmount = this.toNumber(price.priceAmount);
            const perSeat = this.toNumber(price.pricePerSeat);
            const extraSeats = Math.max(0, seats - baseSeats);
            const amount = Math.round(((Number.isFinite(baseAmount) ? baseAmount : 0) +
                perSeat * extraSeats) *
                factor);
            return { amount, seats };
        }
        return {
            amount: Math.round(this.toNumber(price.priceAmount) * factor),
            seats: null,
        };
    }
    async activateSubscription(input) {
        const { offer, price, effectiveBillingType } = await this.resolveOfferPrice(input.offerSlug, input.billingType);
        if (input.offerPriceId && input.offerPriceId !== price.id) {
            throw new common_1.BadRequestException('Tarif d’offre invalide');
        }
        const plan = await this.ensurePremiumPlan(offer);
        const billingPeriod = this.mapBillingPeriod(effectiveBillingType);
        const currentPeriodEnd = input.currentPeriodEnd ?? this.computePeriodEnd(effectiveBillingType);
        let teamId = input.teamId ?? null;
        if (!teamId && offer.audience === client_1.OfferAudience.TEAM) {
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
                        client_1.SubscriptionStatus.TRIAL,
                        client_1.SubscriptionStatus.ACTIVE,
                        client_1.SubscriptionStatus.PAST_DUE,
                    ],
                },
            },
            data: {
                status: client_1.SubscriptionStatus.CANCELLED,
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
                status: client_1.SubscriptionStatus.ACTIVE,
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
            const providerInvoiceId = input.paydunyaInvoiceToken ??
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
                    kind: 'offer',
                    label: `Offre : ${offer.title}`,
                    amount,
                    seats: input.purchasedSeats ?? null,
                },
            ];
            const description = breakdown?.description ?? `Abonnement ${offer.title}`;
            if (providerInvoiceId) {
                const existingInvoice = await this.prisma.paymentInvoice.findUnique({
                    where: { providerInvoiceId },
                });
                if (!existingInvoice) {
                    await this.prisma.paymentInvoice.create({
                        data: {
                            number: this.generateInvoiceNumber(),
                            userId: input.userId,
                            teamId,
                            subscriptionId: subscription.id,
                            amount,
                            currency: input.invoiceCurrency ?? price.currency ?? 'FCFA',
                            status: client_1.InvoiceStatus.PAID,
                            description,
                            offerSlug: offer.slug,
                            billingType: price.billingType,
                            seats: input.purchasedSeats ?? null,
                            lines: lines,
                            provider: input.invoiceProvider ?? null,
                            providerInvoiceId,
                            paidAt: new Date(),
                        },
                    });
                }
            }
            else {
                await this.prisma.paymentInvoice.create({
                    data: {
                        number: this.generateInvoiceNumber(),
                        userId: input.userId,
                        teamId,
                        subscriptionId: subscription.id,
                        amount,
                        currency: input.invoiceCurrency ?? price.currency ?? 'FCFA',
                        status: client_1.InvoiceStatus.PAID,
                        description,
                        offerSlug: offer.slug,
                        billingType: price.billingType,
                        seats: input.purchasedSeats ?? null,
                        lines: lines,
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
    generateInvoiceNumber() {
        const year = new Date().getFullYear();
        const suffix = (0, crypto_1.randomBytes)(3).toString('hex').toUpperCase();
        return `INV-${year}-${suffix}`;
    }
    async handleCheckoutSessionCompleted(session) {
        const metadata = session.metadata ?? {};
        const userId = metadata.userId;
        const offerSlug = metadata.offerSlug;
        const billingType = metadata.billingType;
        if (!userId || !offerSlug || !billingType) {
            return;
        }
        const existing = await this.prisma.subscription.findFirst({
            where: { stripeCheckoutSessionId: session.id },
        });
        if (existing) {
            return;
        }
        const stripeSubscriptionId = typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id ?? null;
        let currentPeriodEnd = null;
        if (stripeSubscriptionId) {
            const stripeSubscription = await this.stripeService.getClient().subscriptions.retrieve(stripeSubscriptionId);
            currentPeriodEnd = this.stripeTimestampToDate(this.readStripeSubscriptionPeriodEnd(stripeSubscription));
        }
        else {
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
    async handleStripeSubscriptionUpdated(subscription) {
        const existing = await this.prisma.subscription.findFirst({
            where: { stripeSubscriptionId: subscription.id },
        });
        if (!existing) {
            return;
        }
        const status = this.mapStripeSubscriptionStatus(subscription.status);
        const currentPeriodEnd = this.stripeTimestampToDate(this.readStripeSubscriptionPeriodEnd(subscription));
        await this.prisma.subscription.update({
            where: { id: existing.id },
            data: {
                status,
                currentPeriodEnd,
                cancelledAt: status === client_1.SubscriptionStatus.CANCELLED ? new Date() : null,
            },
        });
    }
    async handleStripeSubscriptionDeleted(subscription) {
        await this.prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
                status: client_1.SubscriptionStatus.CANCELLED,
                cancelledAt: new Date(),
            },
        });
    }
    async handleInvoicePaymentFailed(invoice) {
        const subscriptionRef = invoice.parent?.subscription_details?.subscription;
        const stripeSubscriptionId = typeof subscriptionRef === 'string'
            ? subscriptionRef
            : subscriptionRef?.id;
        if (!stripeSubscriptionId) {
            return;
        }
        await this.prisma.subscription.updateMany({
            where: { stripeSubscriptionId },
            data: { status: client_1.SubscriptionStatus.PAST_DUE },
        });
    }
    mapStripeSubscriptionStatus(status) {
        switch (status) {
            case 'active':
            case 'trialing':
                return client_1.SubscriptionStatus.ACTIVE;
            case 'past_due':
            case 'unpaid':
                return client_1.SubscriptionStatus.PAST_DUE;
            case 'canceled':
            case 'incomplete_expired':
                return client_1.SubscriptionStatus.CANCELLED;
            case 'incomplete':
            case 'paused':
            default:
                return client_1.SubscriptionStatus.TRIAL;
        }
    }
    stripeTimestampToDate(value) {
        if (!value) {
            return null;
        }
        return new Date(value * 1000);
    }
    readStripeSubscriptionPeriodEnd(subscription) {
        return subscription.items.data[0]?.current_period_end ?? null;
    }
    async ensurePremiumPlan(offer) {
        const isTeam = offer?.audience === client_1.OfferAudience.TEAM;
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
                maxTeamMembers: offer?.maxTeamMembers != null && offer.maxTeamMembers < 0
                    ? 9999
                    : (offer?.maxTeamMembers ?? (isTeam ? 10 : 0)),
                hasPortfolio: offer?.hasPortfolio ?? true,
                hasCustomDomain: false,
                hasAnalytics: offer?.hasAnalytics ?? true,
                features: this.buildPlanFeatures(offer ?? {
                    audience: isTeam ? client_1.OfferAudience.TEAM : client_1.OfferAudience.PERSONAL,
                    canCustomize: true,
                    maxTeamMembers: isTeam ? 10 : 0,
                    hasPortfolio: true,
                    hasWallet: true,
                    hasAnalytics: true,
                    hasVisitorInsights: true,
                    hasSocialLinks: true,
                    maxAiScans: -1,
                }),
                isActive: true,
            },
        });
    }
    buildPlanFeatures(offer) {
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
        if (offer.audience === client_1.OfferAudience.TEAM) {
            features.push('team');
        }
        if (offer.maxAiScans < 0) {
            features.push('unlimited_scan');
        }
        else if (offer.maxAiScans > 0) {
            features.push(`scan_quota:${offer.maxAiScans}`);
        }
        return features;
    }
    async findActiveSubscription(userId) {
        return this.prisma.subscription.findFirst({
            where: {
                userId,
                status: {
                    in: [
                        client_1.SubscriptionStatus.TRIAL,
                        client_1.SubscriptionStatus.ACTIVE,
                        client_1.SubscriptionStatus.PAST_DUE,
                    ],
                },
            },
            include: { plan: true, offer: true, offerPrice: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    mapBillingPeriod(billingType) {
        switch (billingType) {
            case client_1.OfferBillingType.YEARLY:
            case client_1.OfferBillingType.LIFETIME:
                return client_1.BillingPeriod.YEARLY;
            case client_1.OfferBillingType.MONTHLY:
            default:
                return client_1.BillingPeriod.MONTHLY;
        }
    }
    computePeriodEnd(billingType) {
        const end = new Date();
        switch (billingType) {
            case client_1.OfferBillingType.YEARLY:
                end.setFullYear(end.getFullYear() + 1);
                return end;
            case client_1.OfferBillingType.LIFETIME:
                end.setFullYear(end.getFullYear() + 100);
                return end;
            case client_1.OfferBillingType.MONTHLY:
            default:
                end.setMonth(end.getMonth() + 1);
                return end;
        }
    }
    toSubscriptionResponse(subscription) {
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
            entitlements: this.toEntitlementsResponse(offer, subscription.purchasedSeats),
            purchasedSeats: subscription.purchasedSeats ?? null,
            currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
        };
    }
    toEntitlementsResponse(offer, purchasedSeats) {
        const maxTeamMembers = purchasedSeats != null && purchasedSeats > 0
            ? purchasedSeats
            : (offer?.maxTeamMembers ?? 0);
        return {
            audience: offer?.audience ?? client_1.OfferAudience.PERSONAL,
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
    toOfferResponse(offer) {
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
    toOfferPriceResponse(price) {
        const priceAmount = typeof price.priceAmount === 'number'
            ? price.priceAmount
            : Number(price.priceAmount);
        const pricePerSeatRaw = price.pricePerSeat;
        const pricePerSeat = pricePerSeatRaw == null
            ? null
            : typeof pricePerSeatRaw === 'number'
                ? pricePerSeatRaw
                : Number(pricePerSeatRaw);
        return {
            id: price.id,
            billingType: price.billingType,
            priceLabel: price.priceLabel,
            priceAmount,
            pricePerSeat: pricePerSeat != null && Number.isFinite(pricePerSeat)
                ? pricePerSeat
                : null,
            currency: price.currency,
            discountPercent: price.discountPercent,
            badgeLabel: price.badgeLabel,
            isPopular: price.isPopular,
            sortOrder: price.sortOrder,
        };
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = SubscriptionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stripe_service_1.StripeService,
        paydunya_service_1.PaydunyaService,
        invoices_service_1.InvoicesService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map