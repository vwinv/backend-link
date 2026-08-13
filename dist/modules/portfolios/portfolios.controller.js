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
const create_portfolio_dto_1 = require("./dto/create-portfolio.dto");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_portfolio_dto_1 = require("./dto/update-portfolio.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const portfolios_service_1 = require("./portfolios.service");
let PortfoliosController = class PortfoliosController {
    portfoliosService;
    constructor(portfoliosService) {
        this.portfoliosService = portfoliosService;
    }
    create(dto) {
        return this.portfoliosService.create(dto);
    }
    findByCard(cardId) {
        return this.portfoliosService.findByCard(cardId);
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
    (0, common_1.Get)('card/:cardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer le portfolio d\'une carte' }),
    __param(0, (0, common_1.Param)('cardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "findByCard", null);
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
    __metadata("design:paramtypes", [portfolios_service_1.PortfoliosService])
], PortfoliosController);
//# sourceMappingURL=portfolios.controller.js.map