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
exports.AiScanQuotaDto = exports.TeamSeatsQuotaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TeamSeatsQuotaDto {
    used;
    max;
    canAddMember;
}
exports.TeamSeatsQuotaDto = TeamSeatsQuotaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    __metadata("design:type", Number)
], TeamSeatsQuotaDto.prototype, "used", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], TeamSeatsQuotaDto.prototype, "max", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], TeamSeatsQuotaDto.prototype, "canAddMember", void 0);
class AiScanQuotaDto {
    used;
    max;
    canScan;
    isUnlimited;
}
exports.AiScanQuotaDto = AiScanQuotaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], AiScanQuotaDto.prototype, "used", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50,
        description: 'Quota max (-1 = illimité, 0 = aucun)',
    }),
    __metadata("design:type", Number)
], AiScanQuotaDto.prototype, "max", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], AiScanQuotaDto.prototype, "canScan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], AiScanQuotaDto.prototype, "isUnlimited", void 0);
//# sourceMappingURL=usage-quota.dto.js.map