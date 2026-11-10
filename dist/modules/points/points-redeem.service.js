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
exports.PointsRedeemService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const subscriptions_service_1 = require("../subscriptions/subscriptions.service");
const points_service_1 = require("./points.service");
const points_constants_1 = require("./points.constants");
let PointsRedeemService = class PointsRedeemService {
    pointsService;
    subscriptionsService;
    constructor(pointsService, subscriptionsService) {
        this.pointsService = pointsService;
        this.subscriptionsService = subscriptionsService;
    }
    async redeem(userId, dto) {
        if (dto.productType === client_1.PointsProductType.CARD_THEME) {
            throw new common_1.BadRequestException('Les thèmes payants arriveront bientôt. Vos points pourront les acheter.');
        }
        if (dto.productType !== client_1.PointsProductType.SUBSCRIPTION) {
            throw new common_1.BadRequestException('Produit non supporté');
        }
        if (!dto.billingType) {
            throw new common_1.BadRequestException('billingType requis');
        }
        const quote = await this.subscriptionsService.quoteSubscriptionAmount({
            userId,
            offerSlug: dto.productRef,
            billingType: dto.billingType,
            teamId: dto.teamId,
            seats: dto.seats,
        });
        const amountTenths = this.pointsService.fcfaToRequiredTenths(quote.amountFcfa);
        if (amountTenths <= 0) {
            throw new common_1.BadRequestException('Cette offre ne peut pas être payée en points');
        }
        const debit = await this.pointsService.debitForPurchase({
            userId,
            amountTenths,
            productType: client_1.PointsProductType.SUBSCRIPTION,
            productRef: dto.productRef,
            meta: {
                billingType: dto.billingType,
                seats: dto.seats ?? null,
                amountFcfa: quote.amountFcfa,
            },
        });
        try {
            const subscription = await this.subscriptionsService.activateSubscriptionWithPoints({
                userId,
                offerSlug: dto.productRef,
                billingType: dto.billingType,
                teamId: dto.teamId,
                seats: dto.seats,
                invoiceAmount: quote.amountFcfa,
            });
            return {
                ok: true,
                productType: client_1.PointsProductType.SUBSCRIPTION,
                productRef: dto.productRef,
                pointsSpent: (0, points_constants_1.tenthsToPoints)(amountTenths),
                amountFcfa: (0, points_constants_1.tenthsToFcfa)(amountTenths),
                balancePoints: debit.balancePoints,
                subscriptionId: subscription.id,
            };
        }
        catch (error) {
            await this.pointsService.creditAdjustment({
                userId,
                amountTenths,
                meta: { refundOf: debit.entryId, reason: 'redeem_failed' },
            });
            throw error;
        }
    }
};
exports.PointsRedeemService = PointsRedeemService;
exports.PointsRedeemService = PointsRedeemService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscriptions_service_1.SubscriptionsService))),
    __metadata("design:paramtypes", [points_service_1.PointsService,
        subscriptions_service_1.SubscriptionsService])
], PointsRedeemService);
//# sourceMappingURL=points-redeem.service.js.map