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
exports.TeamsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const team_members_response_dto_1 = require("./dto/team-members-response.dto");
const add_member_dto_1 = require("./dto/add-member.dto");
const create_team_dto_1 = require("./dto/create-team.dto");
const update_member_role_dto_1 = require("./dto/update-member-role.dto");
const update_team_dto_1 = require("./dto/update-team.dto");
const teams_service_1 = require("./teams.service");
let TeamsController = class TeamsController {
    teamsService;
    constructor(teamsService) {
        this.teamsService = teamsService;
    }
    create(user, dto) {
        return this.teamsService.create(user.userId, dto);
    }
    findAll(user) {
        return this.teamsService.findAllForUser(user.userId);
    }
    findOne(user, id) {
        return this.teamsService.findOneForUser(user.userId, id);
    }
    update(user, id, dto) {
        return this.teamsService.update(user.userId, id, dto);
    }
    remove(user, id) {
        return this.teamsService.remove(user.userId, id);
    }
    getMembers(user, id) {
        return this.teamsService.getMembers(user.userId, id);
    }
    addMember(user, id, dto) {
        return this.teamsService.addMember(user.userId, id, dto);
    }
    updateMemberRole(user, id, memberId, dto) {
        return this.teamsService.updateMemberRole(user.userId, id, memberId, dto);
    }
    removeMember(user, id, memberId) {
        return this.teamsService.removeMember(user.userId, id, memberId);
    }
};
exports.TeamsController = TeamsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une équipe' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_team_dto_1.CreateTeamDto]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les équipes de l\'utilisateur' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une équipe par ID' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une équipe' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_team_dto_1.UpdateTeamDto]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une équipe' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/members'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les membres d\'une équipe' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: team_members_response_dto_1.TeamMembersResponseDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un membre à l\'équipe' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_member_dto_1.AddMemberDto]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "addMember", null);
__decorate([
    (0, common_1.Patch)(':id/members/:memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier le rôle d\'un membre' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('memberId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, update_member_role_dto_1.UpdateMemberRoleDto]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "updateMemberRole", null);
__decorate([
    (0, common_1.Delete)(':id/members/:memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Retirer un membre de l\'équipe' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "removeMember", null);
exports.TeamsController = TeamsController = __decorate([
    (0, swagger_1.ApiTags)('Teams'),
    (0, common_1.Controller)('teams'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [teams_service_1.TeamsService])
], TeamsController);
//# sourceMappingURL=teams.controller.js.map