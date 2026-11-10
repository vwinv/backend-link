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
exports.PointsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const apply_referral_code_dto_1 = require("./dto/apply-referral-code.dto");
const redeem_points_dto_1 = require("./dto/redeem-points.dto");
const points_service_1 = require("./points.service");
const points_redeem_service_1 = require("./points-redeem.service");
let PointsController = class PointsController {
    pointsService;
    pointsRedeemService;
    constructor(pointsService, pointsRedeemService) {
        this.pointsService = pointsService;
        this.pointsRedeemService = pointsRedeemService;
    }
    getMe(user) {
        return this.pointsService.getOverview(user.userId);
    }
    applyCode(user, dto) {
        return this.pointsService.applyReferralCode(user.userId, dto);
    }
    redeem(user, dto) {
        return this.pointsRedeemService.redeem(user.userId, dto);
    }
};
exports.PointsController = PointsController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Solde, code de parrainage et historique' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)('referral-code'),
    (0, swagger_1.ApiOperation)({ summary: 'Enregistrer un code de parrainage (filleul)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, apply_referral_code_dto_1.ApplyReferralCodeDto]),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "applyCode", null);
__decorate([
    (0, common_1.Post)('redeem'),
    (0, swagger_1.ApiOperation)({
        summary: 'Acheter un produit avec des points (abonnement, thèmes plus tard)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, redeem_points_dto_1.RedeemPointsDto]),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "redeem", null);
exports.PointsController = PointsController = __decorate([
    (0, swagger_1.ApiTags)('Points'),
    (0, common_1.Controller)('points'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [points_service_1.PointsService,
        points_redeem_service_1.PointsRedeemService])
], PointsController);
//# sourceMappingURL=points.controller.js.map