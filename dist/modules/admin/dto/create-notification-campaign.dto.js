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
exports.CreateNotificationCampaignDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateNotificationCampaignDto {
    title;
    body;
    audience;
    userIds;
}
exports.CreateNotificationCampaignDto = CreateNotificationCampaignDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nouvelle fonctionnalité' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateNotificationCampaignDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Découvrez le nouveau design de cartes.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateNotificationCampaignDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.NotificationAudience }),
    (0, class_validator_1.IsEnum)(client_1.NotificationAudience),
    __metadata("design:type", String)
], CreateNotificationCampaignDto.prototype, "audience", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'IDs clients ciblés (requis si audience = USER_IDS)',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(500),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateNotificationCampaignDto.prototype, "userIds", void 0);
//# sourceMappingURL=create-notification-campaign.dto.js.map