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
exports.TeamMembersResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const usage_quota_dto_1 = require("../../subscriptions/dto/usage-quota.dto");
class TeamMembersResponseDto {
    members;
    seats;
}
exports.TeamMembersResponseDto = TeamMembersResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object] }),
    __metadata("design:type", Array)
], TeamMembersResponseDto.prototype, "members", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: usage_quota_dto_1.TeamSeatsQuotaDto }),
    __metadata("design:type", usage_quota_dto_1.TeamSeatsQuotaDto)
], TeamMembersResponseDto.prototype, "seats", void 0);
//# sourceMappingURL=team-members-response.dto.js.map