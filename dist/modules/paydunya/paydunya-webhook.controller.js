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
var PaydunyaWebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaydunyaWebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const subscriptions_service_1 = require("../subscriptions/subscriptions.service");
let PaydunyaWebhookController = PaydunyaWebhookController_1 = class PaydunyaWebhookController {
    subscriptionsService;
    logger = new common_1.Logger(PaydunyaWebhookController_1.name);
    constructor(subscriptionsService) {
        this.subscriptionsService = subscriptionsService;
    }
    handle(body) {
        this.logger.log(`IPN PayDunya brut: ${JSON.stringify(body ?? {}).slice(0, 600)}`);
        return this.subscriptionsService.handlePaydunyaIpn(body ?? {});
    }
};
exports.PaydunyaWebhookController = PaydunyaWebhookController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'IPN PayDunya (callback paiement SoftPay)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaydunyaWebhookController.prototype, "handle", null);
exports.PaydunyaWebhookController = PaydunyaWebhookController = PaydunyaWebhookController_1 = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('webhooks/paydunya'),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService])
], PaydunyaWebhookController);
//# sourceMappingURL=paydunya-webhook.controller.js.map