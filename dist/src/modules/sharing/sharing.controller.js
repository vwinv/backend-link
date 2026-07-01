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
exports.SharingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const share_card_dto_1 = require("./dto/share-card.dto");
const sharing_service_1 = require("./sharing.service");
let SharingController = class SharingController {
    sharingService;
    constructor(sharingService) {
        this.sharingService = sharingService;
    }
    getPublicCard(slug) {
        return this.sharingService.getPublicCard(slug);
    }
    async renderPublicCardPage(slug, res) {
        const html = await this.sharingService.renderPublicCardPage(slug);
        if (!html) {
            return res
                .status(404)
                .type('text/html; charset=utf-8')
                .send(this.sharingService.renderPublicCardNotFoundPage());
        }
        return res.status(200).type('text/html; charset=utf-8').send(html);
    }
    recordPublicCardSave(slug) {
        return this.sharingService.recordCardSave(slug);
    }
    shareCard(user, id, dto) {
        return this.sharingService.shareCard(user.userId, id, dto);
    }
    getQrCode(id) {
        return this.sharingService.getQrCode(id);
    }
    getShareLink(id) {
        return this.sharingService.getShareLink(id);
    }
};
exports.SharingController = SharingController;
__decorate([
    (0, common_1.Get)('public/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Afficher une carte publique par slug (JSON)' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SharingController.prototype, "getPublicCard", null);
__decorate([
    (0, common_1.Get)('public/:slug/view'),
    (0, common_1.Header)('Content-Type', 'text/html; charset=utf-8'),
    (0, swagger_1.ApiOperation)({ summary: 'Page HTML publique de la carte' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SharingController.prototype, "renderPublicCardPage", null);
__decorate([
    (0, common_1.Post)('public/:slug/save'),
    (0, swagger_1.ApiOperation)({
        summary: 'Enregistrer qu’un visiteur a sauvegardé la carte (page publique)',
    }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SharingController.prototype, "recordPublicCardSave", null);
__decorate([
    (0, common_1.Post)('cards/:id/share'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Enregistrer un partage (WhatsApp, Airdrop, etc.)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, share_card_dto_1.ShareCardDto]),
    __metadata("design:returntype", void 0)
], SharingController.prototype, "shareCard", null);
__decorate([
    (0, common_1.Get)('cards/:id/qr'),
    (0, swagger_1.ApiOperation)({ summary: 'Générer le QR code de partage' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SharingController.prototype, "getQrCode", null);
__decorate([
    (0, common_1.Get)('cards/:id/link'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir le lien de partage public' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SharingController.prototype, "getShareLink", null);
exports.SharingController = SharingController = __decorate([
    (0, swagger_1.ApiTags)('Sharing'),
    (0, common_1.Controller)('sharing'),
    __metadata("design:paramtypes", [sharing_service_1.SharingService])
], SharingController);
//# sourceMappingURL=sharing.controller.js.map