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
exports.EspaceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const add_member_dto_1 = require("../teams/dto/add-member.dto");
const add_seats_dto_1 = require("./dto/add-seats.dto");
const confirm_seats_dto_1 = require("./dto/confirm-seats.dto");
const espace_service_1 = require("./espace.service");
let EspaceController = class EspaceController {
    espaceService;
    constructor(espaceService) {
        this.espaceService = espaceService;
    }
    listMine(user) {
        return this.espaceService.listMyEspaces(user.userId);
    }
    getDashboard(user, slug) {
        return this.espaceService.getDashboard(user.userId, slug);
    }
    getMembers(user, slug) {
        return this.espaceService.getMembers(user.userId, slug);
    }
    checkoutSeats(user, slug, dto) {
        return this.espaceService.checkoutAdditionalSeats(user.userId, slug, dto.additionalSeats);
    }
    confirmSeats(user, slug, dto) {
        return this.espaceService.confirmAdditionalSeats(user.userId, slug, dto.invoiceToken);
    }
    payInvoice(user, slug, invoiceId) {
        return this.espaceService.payInvoice(user.userId, slug, invoiceId);
    }
    confirmInvoice(user, slug, dto) {
        return this.espaceService.confirmInvoicePayment(user.userId, slug, dto.invoiceToken);
    }
    getMemberAnalytics(user, slug, memberId, days) {
        const parsed = Number.parseInt(days ?? '30', 10);
        return this.espaceService.getMemberAnalytics(user.userId, slug, memberId, Number.isFinite(parsed) ? parsed : 30);
    }
    addMember(user, slug, dto) {
        return this.espaceService.addMember(user.userId, slug, dto);
    }
    removeMember(user, slug, memberId) {
        return this.espaceService.removeMember(user.userId, slug, memberId);
    }
    cancelInvitation(user, slug, inviteId) {
        return this.espaceService.cancelInvitation(user.userId, slug, inviteId);
    }
    getInvoices(user, slug) {
        return this.espaceService.getInvoices(user.userId, slug);
    }
};
exports.EspaceController = EspaceController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister mes espaces équipe (owner/admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EspaceController.prototype, "listMine", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Tableau de bord espace équipe' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EspaceController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)(':slug/members'),
    (0, swagger_1.ApiOperation)({ summary: 'Membres + invitations de l’espace' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EspaceController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Post)(':slug/seats/checkout'),
    (0, swagger_1.ApiOperation)({ summary: 'Payer pour ajouter des sièges immédiatement' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('slug')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_seats_dto_1.AddSeatsDto]),
    __metadata("design:returntype", void 0)
], EspaceController.prototype, "checkoutSeats", null);
__decorate([
    (0, common_1.Post)(':slug/seats/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirmer le paiement d’ajout de sièges' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('slug')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, confirm_seats_dto_1.ConfirmSeatsDto]),
    __metadata("design:returntype", void 0)
], EspaceController.prototype, "confirmSeats", null);
__decorate([
    (0, common_1.Post)(':slug/invoices/:invoiceId/pay'),
    (0, swagger_1.ApiOperation)({ summary: 'Payer une facture PENDING' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('slug')),
    __param(2, (0, common_1.Param)('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], EspaceController.prototype, "payInvoice", null);
__decorate([
    (0, common_1.Post)(':slug/invoices/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirmer le paiement d’une facture' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('slug')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, confirm_seats_dto_1.ConfirmSeatsDto]),
    __metadata("design:returntype", void 0)
], EspaceController.prototype, "confirmInvoice", null);
__decorate([
    (0, common_1.Get)(':slug/members/:memberId/analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques détaillées d’un membre' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('slug')),
    __param(2, (0, common_1.Param)('memberId')),
    __param(3, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], EspaceController.prototype, "getMemberAnalytics", null);
__decorate([
    (0, common_1.Post)(':slug/members'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer / inviter un membre depuis l’espace web' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('slug')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_member_dto_1.AddMemberDto]),
    __metadata("design:returntype", void 0)
], EspaceController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':slug/members/:memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Retirer un membre' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('slug')),
    __param(2, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], EspaceController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Delete)(':slug/invitations/:inviteId'),
    (0, swagger_1.ApiOperation)({ summary: 'Annuler une invitation' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('slug')),
    __param(2, (0, common_1.Param)('inviteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], EspaceController.prototype, "cancelInvitation", null);
__decorate([
    (0, common_1.Get)(':slug/invoices'),
    (0, swagger_1.ApiOperation)({ summary: 'Factures de paiement de l’équipe' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EspaceController.prototype, "getInvoices", null);
exports.EspaceController = EspaceController = __decorate([
    (0, swagger_1.ApiTags)('Espace équipe'),
    (0, common_1.Controller)('espace'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [espace_service_1.EspaceService])
], EspaceController);
//# sourceMappingURL=espace.controller.js.map