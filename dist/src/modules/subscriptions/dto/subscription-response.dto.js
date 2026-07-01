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
exports.SubscriptionResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const offer_entitlements_dto_1 = require("./offer-entitlements.dto");
class SubscriptionResponseDto {
    id;
    status;
    billingPeriod;
    planName;
    planSlug;
    offerTitle;
    offerSlug;
    billingType;
    entitlements;
    currentPeriodEnd;
}
exports.SubscriptionResponseDto = SubscriptionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.SubscriptionStatus }),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.BillingPeriod }),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "billingPeriod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "planName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "planSlug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "offerTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "offerSlug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.OfferBillingType }),
    __metadata("design:type", Object)
], SubscriptionResponseDto.prototype, "billingType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: offer_entitlements_dto_1.OfferEntitlementsDto }),
    __metadata("design:type", offer_entitlements_dto_1.OfferEntitlementsDto)
], SubscriptionResponseDto.prototype, "entitlements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], SubscriptionResponseDto.prototype, "currentPeriodEnd", void 0);
//# sourceMappingURL=subscription-response.dto.js.map