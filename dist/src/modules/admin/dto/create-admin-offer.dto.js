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
exports.CreateAdminOfferDto = exports.CreateAdminOfferPriceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateAdminOfferPriceDto {
    billingType;
    priceAmount;
    pricePerSeat;
    priceLabel;
    currency;
    discountPercent;
    badgeLabel;
    isPopular;
    sortOrder;
    isActive;
    stripePriceId;
}
exports.CreateAdminOfferPriceDto = CreateAdminOfferPriceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.OfferBillingType }),
    (0, class_validator_1.IsEnum)(client_1.OfferBillingType),
    __metadata("design:type", String)
], CreateAdminOfferPriceDto.prototype, "billingType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4000 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateAdminOfferPriceDto.prototype, "priceAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 700,
        description: 'Prix par utilisateur supplémentaire (au-delà des sièges inclus)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Object)
], CreateAdminOfferPriceDto.prototype, "pricePerSeat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", Object)
], CreateAdminOfferPriceDto.prototype, "priceLabel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'FCFA' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(16),
    __metadata("design:type", String)
], CreateAdminOfferPriceDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Object)
], CreateAdminOfferPriceDto.prototype, "discountPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", Object)
], CreateAdminOfferPriceDto.prototype, "badgeLabel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAdminOfferPriceDto.prototype, "isPopular", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAdminOfferPriceDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAdminOfferPriceDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", Object)
], CreateAdminOfferPriceDto.prototype, "stripePriceId", void 0);
class CreateAdminOfferDto {
    title;
    slug;
    subtitle;
    audience;
    canCustomize;
    maxTeamMembers;
    minSeats;
    hasPortfolio;
    hasWallet;
    hasAnalytics;
    hasVisitorInsights;
    hasSocialLinks;
    maxAiScans;
    maxShares;
    sortOrder;
    isActive;
    listedInApp;
    prices;
}
exports.CreateAdminOfferDto = CreateAdminOfferDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DropOne Premium' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateAdminOfferDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'link-premium' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(80),
    (0, class_validator_1.Matches)(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'slug: kebab-case uniquement (a-z, 0-9, tirets)',
    }),
    __metadata("design:type", String)
], CreateAdminOfferDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(240),
    __metadata("design:type", Object)
], CreateAdminOfferDto.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.OfferAudience }),
    (0, class_validator_1.IsEnum)(client_1.OfferAudience),
    __metadata("design:type", String)
], CreateAdminOfferDto.prototype, "audience", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAdminOfferDto.prototype, "canCustomize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '0 = perso, N = plafond, -1 = illimité',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAdminOfferDto.prototype, "maxTeamMembers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateAdminOfferDto.prototype, "minSeats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAdminOfferDto.prototype, "hasPortfolio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAdminOfferDto.prototype, "hasWallet", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAdminOfferDto.prototype, "hasAnalytics", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAdminOfferDto.prototype, "hasVisitorInsights", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAdminOfferDto.prototype, "hasSocialLinks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '-1 = illimité' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAdminOfferDto.prototype, "maxAiScans", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '-1 = illimité' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAdminOfferDto.prototype, "maxShares", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAdminOfferDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAdminOfferDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'false = hors catalogue app (offre gratuite)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAdminOfferDto.prototype, "listedInApp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CreateAdminOfferPriceDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateAdminOfferPriceDto),
    __metadata("design:type", Array)
], CreateAdminOfferDto.prototype, "prices", void 0);
//# sourceMappingURL=create-admin-offer.dto.js.map