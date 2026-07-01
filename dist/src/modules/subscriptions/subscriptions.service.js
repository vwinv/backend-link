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
let SubscriptionsService = class SubscriptionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
    async subscribe(userId, dto) {
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
            throw new common_1.NotFoundException('Offre Premium introuvable');
        }
        const price = offer.prices[0];
        if (!price) {
            throw new common_1.BadRequestException('Ce mode de paiement n’est pas disponible pour cette offre');
        }
        if (dto.teamId && offer.audience !== client_1.OfferAudience.TEAM) {
            throw new common_1.BadRequestException('Cette offre ne couvre pas un espace équipe');
        }
        const plan = await this.ensurePremiumPlan(offer);
        const billingPeriod = this.mapBillingPeriod(price.billingType);
        const currentPeriodEnd = this.computePeriodEnd(price.billingType);
        await this.prisma.subscription.updateMany({
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
            data: {
                status: client_1.SubscriptionStatus.CANCELLED,
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
                status: client_1.SubscriptionStatus.ACTIVE,
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map