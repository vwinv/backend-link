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
exports.CheckoutSessionResponseDto = exports.PaymentConfigResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PaymentConfigResponseDto {
    paymentsEnabled;
}
exports.PaymentConfigResponseDto = PaymentConfigResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Si true, la souscription passe par Stripe Checkout. Sinon, activation immédiate (tests).',
    }),
    __metadata("design:type", Boolean)
], PaymentConfigResponseDto.prototype, "paymentsEnabled", void 0);
class CheckoutSessionResponseDto {
    checkoutUrl;
    sessionId;
}
exports.CheckoutSessionResponseDto = CheckoutSessionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CheckoutSessionResponseDto.prototype, "checkoutUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CheckoutSessionResponseDto.prototype, "sessionId", void 0);
//# sourceMappingURL=payment-config-response.dto.js.map