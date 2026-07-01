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
exports.PremiumOfferPriceResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class PremiumOfferPriceResponseDto {
    id;
    billingType;
    priceLabel;
    priceAmount;
    currency;
    discountPercent;
    badgeLabel;
    isPopular;
    sortOrder;
}
exports.PremiumOfferPriceResponseDto = PremiumOfferPriceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PremiumOfferPriceResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.OfferBillingType }),
    __metadata("design:type", String)
], PremiumOfferPriceResponseDto.prototype, "billingType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '4 000 FCFA / mois' }),
    __metadata("design:type", Object)
], PremiumOfferPriceResponseDto.prototype, "priceLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4000 }),
    __metadata("design:type", Number)
], PremiumOfferPriceResponseDto.prototype, "priceAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FCFA' }),
    __metadata("design:type", String)
], PremiumOfferPriceResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 40 }),
    __metadata("design:type", Object)
], PremiumOfferPriceResponseDto.prototype, "discountPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Populaire' }),
    __metadata("design:type", Object)
], PremiumOfferPriceResponseDto.prototype, "badgeLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PremiumOfferPriceResponseDto.prototype, "isPopular", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PremiumOfferPriceResponseDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=premium-offer-price-response.dto.js.map