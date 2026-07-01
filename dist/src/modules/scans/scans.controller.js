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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScansController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const record_scan_contact_dto_1 = require("../contacts/dto/record-scan-contact.dto");
const usage_quota_dto_1 = require("../subscriptions/dto/usage-quota.dto");
const scans_service_1 = require("./scans.service");
let ScansController = class ScansController {
    scansService;
    constructor(scansService) {
        this.scansService = scansService;
    }
    getQuota(user) {
        return this.scansService.getQuota(user.userId);
    }
    recordScan(user, payload = {}) {
        return this.scansService.recordScan(user.userId, payload);
    }
};
exports.ScansController = ScansController;
__decorate([
    (0, common_1.Get)('quota'),
    (0, swagger_1.ApiOperation)({ summary: 'Quota de scans IA pour la période en cours' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: usage_quota_dto_1.AiScanQuotaDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ScansController.prototype, "getQuota", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Enregistrer un scan IA (consomme le quota)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, record_scan_contact_dto_1.RecordScanContactDto]),
    __metadata("design:returntype", void 0)
], ScansController.prototype, "recordScan", null);
exports.ScansController = ScansController = __decorate([
    (0, swagger_1.ApiTags)('Scans'),
    (0, common_1.Controller)('scans'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [scans_service_1.ScansService])
], ScansController);
//# sourceMappingURL=scans.controller.js.map