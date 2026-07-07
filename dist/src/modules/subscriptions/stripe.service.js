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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var StripeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const stripe_1 = __importDefault(require("stripe"));
let StripeService = StripeService_1 = class StripeService {
    configService;
    logger = new common_1.Logger(StripeService_1.name);
    client = null;
    constructor(configService) {
        this.configService = configService;
    }
    isEnabled() {
        const stripe = this.configService.get('stripe');
        return Boolean(stripe?.enabled && stripe.secretKey?.trim());
    }
    getClient() {
        if (this.client) {
            return this.client;
        }
        const secretKey = this.configService.get('stripe.secretKey', '');
        this.client = new stripe_1.default(secretKey, {
            apiVersion: '2026-06-24.dahlia',
        });
        return this.client;
    }
    async createCustomer(input) {
        return this.getClient().customers.create({
            email: input.email,
            name: input.name,
            metadata: { userId: input.userId },
        });
    }
    async createCheckoutSession(params) {
        const isLifetime = params.billingType === client_1.OfferBillingType.LIFETIME;
        const successUrl = this.configService.get('stripe.successUrl', '');
        const cancelUrl = this.configService.get('stripe.cancelUrl', '');
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
    constructWebhookEvent(payload, signature) {
        const webhookSecret = this.configService.get('stripe.webhookSecret', '');
        return this.getClient().webhooks.constructEvent(payload, signature, webhookSecret);
    }
    logDisabledCheckoutAttempt(userId) {
        this.logger.warn(`[dev] Paiement Stripe désactivé — abonnement instantané pour ${userId}`);
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = StripeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map