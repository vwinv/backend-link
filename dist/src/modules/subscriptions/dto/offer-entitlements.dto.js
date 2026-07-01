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
exports.OfferEntitlementsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class OfferEntitlementsDto {
    audience;
    canCustomize;
    maxTeamMembers;
    hasPortfolio;
    maxAiScans;
}
exports.OfferEntitlementsDto = OfferEntitlementsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.OfferAudience, example: client_1.OfferAudience.PERSONAL }),
    __metadata("design:type", String)
], OfferEntitlementsDto.prototype, "audience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], OfferEntitlementsDto.prototype, "canCustomize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: 'Nombre max de membres équipe (0 si offre personnelle)',
    }),
    __metadata("design:type", Number)
], OfferEntitlementsDto.prototype, "maxTeamMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], OfferEntitlementsDto.prototype, "hasPortfolio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: -1,
        description: 'Quota de scans IA (-1 = illimité, 0 = aucun)',
    }),
    __metadata("design:type", Number)
], OfferEntitlementsDto.prototype, "maxAiScans", void 0);
//# sourceMappingURL=offer-entitlements.dto.js.map