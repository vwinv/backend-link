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
exports.CardsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_card_dto_1 = require("./dto/create-card.dto");
const update_card_dto_1 = require("./dto/update-card.dto");
const sync_social_links_dto_1 = require("./dto/sync-social-links.dto");
const update_card_theme_dto_1 = require("./dto/update-card-theme.dto");
const cards_service_1 = require("./cards.service");
let CardsController = class CardsController {
    cardsService;
    constructor(cardsService) {
        this.cardsService = cardsService;
    }
    create(user, dto) {
        return this.cardsService.create(user.userId, dto);
    }
    findAll(user) {
        return this.cardsService.findAll(user.userId);
    }
    findSharedWithMe(user) {
        return this.cardsService.findSharedWithMe(user.userId);
    }
    findOne(user, id) {
        return this.cardsService.findOne(user.userId, id);
    }
    update(user, id, dto) {
        return this.cardsService.update(user.userId, id, dto);
    }
    updateTheme(user, id, dto) {
        return this.cardsService.updateTheme(user.userId, id, dto);
    }
    remove(id) {
        return this.cardsService.remove(id);
    }
    syncSocialLinks(user, id, dto) {
        return this.cardsService.syncSocialLinks(user.userId, id, dto.links);
    }
    getSocialLinks(user, id) {
        return this.cardsService.getSocialLinks(user.userId, id);
    }
    addSocialLink(id) {
        return this.cardsService.addSocialLink(id);
    }
    removeSocialLink(id, linkId) {
        return this.cardsService.removeSocialLink(id, linkId);
    }
    getAnalytics(user, id) {
        return this.cardsService.getAnalytics(user.userId, id);
    }
};
exports.CardsController = CardsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une carte de visite' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_card_dto_1.CreateCardDto]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les cartes de l\'utilisateur' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('shared-with-me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les cartes partagées avec moi' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "findSharedWithMe", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une carte par ID' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une carte de visite' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_card_dto_1.UpdateCardDto]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/theme'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Personnaliser le thème de la carte' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_card_theme_dto_1.UpdateCardThemeDto]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "updateTheme", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une carte de visite' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/social-links'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Synchroniser les liens sociaux de la carte' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, sync_social_links_dto_1.SyncSocialLinksDto]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "syncSocialLinks", null);
__decorate([
    (0, common_1.Get)(':id/social-links'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les liens sociaux de la carte' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "getSocialLinks", null);
__decorate([
    (0, common_1.Post)(':id/social-links'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un lien social à la carte' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "addSocialLink", null);
__decorate([
    (0, common_1.Delete)(':id/social-links/:linkId'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un lien social' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('linkId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "removeSocialLink", null);
__decorate([
    (0, common_1.Get)(':id/analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques de vues, partages et enregistrements' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "getAnalytics", null);
exports.CardsController = CardsController = __decorate([
    (0, swagger_1.ApiTags)('Business Cards'),
    (0, common_1.Controller)('cards'),
    __metadata("design:paramtypes", [cards_service_1.CardsService])
], CardsController);
//# sourceMappingURL=cards.controller.js.map