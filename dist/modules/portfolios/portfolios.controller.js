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
exports.PortfoliosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_1 = require("@nestjs/jwt");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_portfolio_dto_1 = require("./dto/create-portfolio.dto");
const save_portfolio_profile_dto_1 = require("./dto/save-portfolio-profile.dto");
const save_portfolio_style_dto_1 = require("./dto/save-portfolio-style.dto");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_portfolio_dto_1 = require("./dto/update-portfolio.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const portfolios_service_1 = require("./portfolios.service");
let PortfoliosController = class PortfoliosController {
    portfoliosService;
    jwtService;
    constructor(portfoliosService, jwtService) {
        this.portfoliosService = portfoliosService;
        this.jwtService = jwtService;
    }
    resolveViewerUserId(req) {
        const authorization = req.headers.authorization;
        if (!authorization?.startsWith('Bearer '))
            return undefined;
        try {
            const payload = this.jwtService.verify(authorization.slice('Bearer '.length));
            return payload.sub;
        }
        catch {
            return undefined;
        }
    }
    create(dto) {
        return this.portfoliosService.create(dto);
    }
    getStats(user, cardId) {
        return this.portfoliosService.getStats(user.userId, cardId);
    }
    recordClick(slug, req) {
        return this.portfoliosService.recordClick(slug, this.resolveViewerUserId(req));
    }
    findByCard(user, cardId) {
        return this.portfoliosService.findOwnedByCard(user.userId, cardId);
    }
    getEditor(user, cardId) {
        return this.portfoliosService.getEditor(user.userId, cardId);
    }
    saveProfile(user, cardId, dto) {
        return this.portfoliosService.saveProfile(user.userId, cardId, dto);
    }
    saveStyle(user, cardId, dto) {
        return this.portfoliosService.saveStyle(user.userId, cardId, dto);
    }
    findOne(id) {
        return this.portfoliosService.findOne(id);
    }
    update(id, dto) {
        return this.portfoliosService.update(id, dto);
    }
    remove(id) {
        return this.portfoliosService.remove(id);
    }
    addProject(id, dto) {
        return this.portfoliosService.addProject(id, dto);
    }
    updateProject(id, projectId, dto) {
        return this.portfoliosService.updateProject(id, projectId, dto);
    }
    removeProject(id, projectId) {
        return this.portfoliosService.removeProject(id, projectId);
    }
};
exports.PortfoliosController = PortfoliosController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un portfolio lié à une carte' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_portfolio_dto_1.CreatePortfolioDto]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('card/:cardId/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Visites du site et clics « Voir mon portfolio »',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('cardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('public/:slug/click'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Enregistrer un clic sur « Voir mon portfolio »',
    }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "recordClick", null);
__decorate([
    (0, common_1.Get)('card/:cardId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer le portfolio d\'une carte' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('cardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "findByCard", null);
__decorate([
    (0, common_1.Get)('card/:cardId/editor'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Contenu de l’éditeur de portfolio' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('cardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "getEditor", null);
__decorate([
    (0, common_1.Patch)('card/:cardId/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Enregistrer le contenu du portfolio' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('cardId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, save_portfolio_profile_dto_1.SavePortfolioProfileDto]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "saveProfile", null);
__decorate([
    (0, common_1.Patch)('card/:cardId/style'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer le portfolio ou mettre à jour son modèle et sa couleur',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('cardId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, save_portfolio_style_dto_1.SavePortfolioStyleDto]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "saveStyle", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un portfolio par ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un portfolio' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_portfolio_dto_1.UpdatePortfolioDto]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un portfolio' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/projects'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un projet au portfolio' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "addProject", null);
__decorate([
    (0, common_1.Patch)(':id/projects/:projectId'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un projet' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "updateProject", null);
__decorate([
    (0, common_1.Delete)(':id/projects/:projectId'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un projet' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "removeProject", null);
exports.PortfoliosController = PortfoliosController = __decorate([
    (0, swagger_1.ApiTags)('Portfolios'),
    (0, common_1.Controller)('portfolios'),
    __metadata("design:paramtypes", [portfolios_service_1.PortfoliosService,
        jwt_1.JwtService])
], PortfoliosController);
//# sourceMappingURL=portfolios.controller.js.map