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
exports.PremiumOfferResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const premium_offer_price_response_dto_1 = require("./premium-offer-price-response.dto");
class PremiumOfferResponseDto {
    id;
    title;
    slug;
    subtitle;
    audience;
    canCustomize;
    maxTeamMembers;
    hasPortfolio;
    maxAiScans;
    sortOrder;
    prices;
}
exports.PremiumOfferResponseDto = PremiumOfferResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PremiumOfferResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DropOne Premium' }),
    __metadata("design:type", String)
], PremiumOfferResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'link-premium' }),
    __metadata("design:type", String)
], PremiumOfferResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Carte personnelle enrichie' }),
    __metadata("design:type", Object)
], PremiumOfferResponseDto.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.OfferAudience }),
    __metadata("design:type", String)
], PremiumOfferResponseDto.prototype, "audience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PremiumOfferResponseDto.prototype, "canCustomize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], PremiumOfferResponseDto.prototype, "maxTeamMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PremiumOfferResponseDto.prototype, "hasPortfolio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -1 }),
    __metadata("design:type", Number)
], PremiumOfferResponseDto.prototype, "maxAiScans", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PremiumOfferResponseDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [premium_offer_price_response_dto_1.PremiumOfferPriceResponseDto] }),
    __metadata("design:type", Array)
], PremiumOfferResponseDto.prototype, "prices", void 0);
//# sourceMappingURL=premium-offer-response.dto.js.map