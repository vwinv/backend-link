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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const checkout_dto_1 = require("./dto/checkout.dto");
const payment_config_response_dto_1 = require("./dto/payment-config-response.dto");
const premium_offer_response_dto_1 = require("./dto/premium-offer-response.dto");
const subscribe_dto_1 = require("./dto/subscribe.dto");
const subscription_response_dto_1 = require("./dto/subscription-response.dto");
const subscriptions_service_1 = require("./subscriptions.service");
let SubscriptionsController = class SubscriptionsController {
    subscriptionsService;
    constructor(subscriptionsService) {
        this.subscriptionsService = subscriptionsService;
    }
    getPaymentConfig() {
        return this.subscriptionsService.getPaymentConfig();
    }
    getOffers() {
        return this.subscriptionsService.getOffers();
    }
    getPlans() {
        return this.subscriptionsService.getPlans();
    }
    getMySubscription(user) {
        return this.subscriptionsService.getMySubscription(user.userId);
    }
    getPlan(slug) {
        return this.subscriptionsService.getPlan(slug);
    }
    createCheckout(user, dto) {
        return this.subscriptionsService.createCheckout(user.userId, dto);
    }
    subscribe(user, dto) {
        return this.subscriptionsService.subscribe(user.userId, dto);
    }
    cancel() {
        return this.subscriptionsService.cancel();
    }
    webhook(request) {
        const signature = request.headers['stripe-signature'];
        const payload = request.rawBody;
        if (!payload) {
            throw new Error('Corps brut du webhook manquant');
        }
        return this.subscriptionsService.handleStripeWebhook(payload, typeof signature === 'string' ? signature : undefined);
    }
};
exports.SubscriptionsController = SubscriptionsController;
__decorate([
    (0, common_1.Get)('config'),
    (0, swagger_1.ApiOperation)({
        summary: 'Configuration paiement (Stripe activé ou mode test instantané)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payment_config_response_dto_1.PaymentConfigResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "getPaymentConfig", null);
__decorate([
    (0, common_1.Get)('offers'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les offres Premium disponibles' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [premium_offer_response_dto_1.PremiumOfferResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "getOffers", null);
__decorate([
    (0, common_1.Get)('plans'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les forfaits disponibles' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [premium_offer_response_dto_1.PremiumOfferResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "getPlans", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer l'abonnement actif de l'utilisateur" }),
    (0, swagger_1.ApiResponse)({ status: 200, type: subscription_response_dto_1.SubscriptionResponseDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "getMySubscription", null);
__decorate([
    (0, common_1.Get)('plans/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un forfait par slug' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "getPlan", null);
__decorate([
    (0, common_1.Post)('checkout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une session Stripe Checkout' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: payment_config_response_dto_1.CheckoutSessionResponseDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, checkout_dto_1.CheckoutDto]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "createCheckout", null);
__decorate([
    (0, common_1.Post)('subscribe'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Souscrire sans paiement (tests uniquement, si STRIPE_ENABLED=false)',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: subscription_response_dto_1.SubscriptionResponseDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, subscribe_dto_1.SubscribeDto]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Delete)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Annuler l'abonnement" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, swagger_1.ApiOperation)({ summary: 'Webhook Stripe' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "webhook", null);
exports.SubscriptionsController = SubscriptionsController = __decorate([
    (0, swagger_1.ApiTags)('Subscriptions'),
    (0, common_1.Controller)('subscriptions'),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService])
], SubscriptionsController);
//# sourceMappingURL=subscriptions.controller.js.map