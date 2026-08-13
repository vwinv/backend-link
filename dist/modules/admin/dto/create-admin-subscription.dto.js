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
exports.CreateAdminSubscriptionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateAdminSubscriptionDto {
    userId;
    offerId;
    offerPriceId;
    status;
    teamId;
    purchasedSeats;
    currentPeriodEnd;
}
exports.CreateAdminSubscriptionDto = CreateAdminSubscriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du client (utilisateur app)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateAdminSubscriptionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de l’offre' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateAdminSubscriptionDto.prototype, "offerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du tarif' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateAdminSubscriptionDto.prototype, "offerPriceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: [client_1.SubscriptionStatus.ACTIVE, client_1.SubscriptionStatus.TRIAL],
        default: client_1.SubscriptionStatus.ACTIVE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([client_1.SubscriptionStatus.ACTIVE, client_1.SubscriptionStatus.TRIAL]),
    __metadata("design:type", String)
], CreateAdminSubscriptionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID d’équipe (offres pro)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAdminSubscriptionDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nombre de sièges (offres pro)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateAdminSubscriptionDto.prototype, "purchasedSeats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fin de période (ISO). Calculée automatiquement si absente.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAdminSubscriptionDto.prototype, "currentPeriodEnd", void 0);
//# sourceMappingURL=create-admin-subscription.dto.js.map