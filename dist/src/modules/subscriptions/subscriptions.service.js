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
const prisma_service_1 = require("../../prisma/prisma.service");
const paydunya_callback_util_1 = require("../paydunya/paydunya-callback.util");
const paydunya_service_1 = require("../paydunya/paydunya.service");
const stripe_service_1 = require("./stripe.service");
let SubscriptionsService = SubscriptionsService_1 = class SubscriptionsService {
    prisma;
    stripeService;
    paydunyaService;
    logger = new common_1.Logger(SubscriptionsService_1.name);
    constructor(prisma, stripeService, paydunyaService) {
        this.prisma = prisma;
        this.stripeService = stripeService;
        this.paydunyaService = paydunyaService;
    }
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
        const { offer, price } = await this.resolveOfferPrice(dto.offerSlug, dto.billingType);
        if (dto.teamId && offer.audience !== client_1.OfferAudience.TEAM) {
            throw new common_1.BadRequestException('Cette offre ne couvre pas un espace équipe');
        }
        const amount = Math.round(Number(price.priceAmount));
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new common_1.BadRequestException('Cette offre est gratuite. Utilisez /subscriptions/subscribe.');
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        const callbackUrl = (0, paydunya_callback_util_1.paydunyaIpnCallbackUrl)(this.logger);
        const storeName = process.env.PAYDUNYA_STORE_NAME?.trim() || 'Drop One';
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
    async softPay(userId, dto) {
        if (!this.paydunyaService.isConfigured()) {
            throw new common_1.ServiceUnavailableException('Paiement PayDunya non configuré sur le serveur');
        }
        const { offer, price } = await this.resolveOfferPrice(dto.offerSlug, dto.billingType);
        const amount = Math.round(Number(price.priceAmount));
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
        const billingType = String(custom['billingType'] ?? '').trim();
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
        const existing = await this.prisma.subscription.findFirst({
            where: { paydunyaInvoiceToken: parsed.invoiceToken },
        });
        if (existing) {
            return { ok: true, alreadyProcessed: true };
        }
        const { offer, price } = await this.resolveOfferPrice(parsed.offerSlug, parsed.billingType);
        const expected = Math.round(Number(price.priceAmount));
        const paid = Math.round(parsed.totalAmount);
        if (Math.abs(paid - expected) > 1) {
            this.logger.warn(`IPN PayDunya: écart montant payé=${paid} attendu=${expected}`);
            return { ok: false, error: 'amount_mismatch' };
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
        this.logger.log(`IPN PayDunya abonnement activé userId=${parsed.userId} offer=${offer.slug}`);
        return { ok: true };
    }
    async subscribe(userId, dto) {
        const { offer, price } = await this.resolveOfferPrice(dto.offerSlug, dto.billingType);
        if (dto.teamId && offer.audience !== client_1.OfferAudience.TEAM) {
            throw new common_1.BadRequestException('Cette offre ne couvre pas un espace équipe');
        }
        const amount = Math.round(Number(price.priceAmount));
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
            billingType: price.billingType,
            teamId: dto.teamId ?? null,
            offerPriceId: price.id,
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
                    where: {
                        billingType,
                        isActive: true,
                    },
                },
            },
        });
        if (!offer) {
            throw new common_1.NotFoundException('Offre Premium introuvable');
        }
        const price = offer.prices[0];
        if (!price) {
            throw new common_1.BadRequestException('Ce mode de paiement n’est pas disponible pour cette offre');
        }
        return { offer, price };
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
        if (kind !== 'subscription' ||
            !hash ||
            !Number.isFinite(totalAmount) ||
            !invoiceToken ||
            !userId ||
            !offerSlug ||
            !billingType) {
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
    async activateSubscription(input) {
        const { offer, price } = await this.resolveOfferPrice(input.offerSlug, input.billingType);
        if (input.offerPriceId && input.offerPriceId !== price.id) {
            throw new common_1.BadRequestException('Tarif d’offre invalide');
        }
        const plan = await this.ensurePremiumPlan(offer);
        const billingPeriod = this.mapBillingPeriod(price.billingType);
        const currentPeriodEnd = input.currentPeriodEnd ?? this.computePeriodEnd(price.billingType);
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
        return this.prisma.subscription.create({
            data: {
                userId: input.userId,
                teamId: input.teamId ?? null,
                planId: plan.id,
                offerId: offer.id,
                offerPriceId: price.id,
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
            entitlements: this.toEntitlementsResponse(offer),
            currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
        };
    }
    toEntitlementsResponse(offer) {
        return {
            audience: offer?.audience ?? client_1.OfferAudience.PERSONAL,
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
    toOfferResponse(offer) {
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
    toOfferPriceResponse(price) {
        const priceAmount = typeof price.priceAmount === 'number'
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
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = SubscriptionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stripe_service_1.StripeService,
        paydunya_service_1.PaydunyaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map