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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const stripe_service_1 = require("./stripe.service");
let SubscriptionsService = class SubscriptionsService {
    prisma;
    stripeService;
    constructor(prisma, stripeService) {
        this.prisma = prisma;
        this.stripeService = stripeService;
    }
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
        if (!this.stripeService.isEnabled()) {
            throw new common_1.BadRequestException('Le paiement Stripe est désactivé. Utilisez /subscriptions/subscribe pour les tests.');
        }
        const { offer, price } = await this.resolveOfferPrice(dto.offerSlug, dto.billingType);
        if (dto.teamId && offer.audience !== client_1.OfferAudience.TEAM) {
            throw new common_1.BadRequestException('Cette offre ne couvre pas un espace équipe');
        }
        if (!price.stripePriceId?.trim()) {
            throw new common_1.BadRequestException('Cette offre n’est pas encore configurée pour le paiement en ligne');
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
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
            throw new common_1.BadRequestException('Impossible de créer la session de paiement');
        }
        return {
            checkoutUrl: session.url,
            sessionId: session.id,
        };
    }
    async subscribe(userId, dto) {
        if (this.stripeService.isEnabled()) {
            throw new common_1.BadRequestException('Un paiement en ligne est requis pour souscrire à cette offre');
        }
        this.stripeService.logDisabledCheckoutAttempt(userId);
        const { offer, price } = await this.resolveOfferPrice(dto.offerSlug, dto.billingType);
        if (dto.teamId && offer.audience !== client_1.OfferAudience.TEAM) {
            throw new common_1.BadRequestException('Cette offre ne couvre pas un espace équipe');
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
                features: this.buildPlanFeatures(offer ?? {
                    audience: isTeam ? client_1.OfferAudience.TEAM : client_1.OfferAudience.PERSONAL,
                    canCustomize: true,
                    maxTeamMembers: isTeam ? 5 : 0,
                    hasPortfolio: true,
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
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stripe_service_1.StripeService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map