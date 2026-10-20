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
exports.UpdateAppUpdateConfigDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const SEMVER_OR_EMPTY = /^(?:|(?:\d+)(?:\.\d+){0,3}(?:[-a-zA-Z0-9.]*)?)$/;
class UpdateAppUpdateConfigDto {
    latestVersion;
    minVersion;
    iosStoreUrl;
    androidStoreUrl;
    message;
}
exports.UpdateAppUpdateConfigDto = UpdateAppUpdateConfigDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.0.1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    (0, class_validator_1.Matches)(SEMVER_OR_EMPTY, {
        message: 'latestVersion doit être vide ou ressembler à 1.0.1',
    }),
    __metadata("design:type", String)
], UpdateAppUpdateConfigDto.prototype, "latestVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.0.0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    (0, class_validator_1.Matches)(SEMVER_OR_EMPTY, {
        message: 'minVersion doit être vide ou ressembler à 1.0.0',
    }),
    __metadata("design:type", String)
], UpdateAppUpdateConfigDto.prototype, "minVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateAppUpdateConfigDto.prototype, "iosStoreUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateAppUpdateConfigDto.prototype, "androidStoreUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateAppUpdateConfigDto.prototype, "message", void 0);
//# sourceMappingURL=update-app-update-config.dto.js.map