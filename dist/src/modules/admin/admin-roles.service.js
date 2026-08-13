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
exports.AdminRolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const admin_permissions_catalog_1 = require("./admin-permissions.catalog");
let AdminRolesService = class AdminRolesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listPermissions() {
        const byModule = admin_permissions_catalog_1.ADMIN_MODULES.map((module) => ({
            key: module.key,
            label: module.label,
            permissions: admin_permissions_catalog_1.ADMIN_PERMISSION_CATALOG.filter((permission) => permission.module === module.key),
        }));
        return { modules: byModule };
    }
    async listRoles() {
        const roles = await this.prisma.adminRole.findMany({
            orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
            include: {
                permissions: { include: { permission: true } },
                _count: { select: { users: true } },
            },
        });
        return roles.map((role) => this.toRoleDto(role));
    }
    async findOne(id) {
        const role = await this.prisma.adminRole.findUnique({
            where: { id },
            include: {
                permissions: { include: { permission: true } },
                _count: { select: { users: true } },
            },
        });
        if (!role)
            throw new common_1.NotFoundException('Rôle introuvable');
        return this.toRoleDto(role);
    }
    async create(dto) {
        const name = dto.name.trim();
        const existing = await this.prisma.adminRole.findUnique({ where: { name } });
        if (existing) {
            throw new common_1.ConflictException('Un rôle avec ce nom existe déjà');
        }
        const permissionIds = await this.resolvePermissionIds(dto.permissionKeys);
        const role = await this.prisma.adminRole.create({
            data: {
                name,
                description: dto.description?.trim() || null,
                permissions: {
                    create: permissionIds.map((permissionId) => ({ permissionId })),
                },
            },
            include: {
                permissions: { include: { permission: true } },
                _count: { select: { users: true } },
            },
        });
        return this.toRoleDto(role);
    }
    async update(id, dto) {
        const role = await this.prisma.adminRole.findUnique({ where: { id } });
        if (!role)
            throw new common_1.NotFoundException('Rôle introuvable');
        if (role.isSystem && dto.name && dto.name.trim() !== role.name) {
            throw new common_1.ForbiddenException('Le nom du rôle système ne peut pas être modifié');
        }
        if (dto.name) {
            const name = dto.name.trim();
            const existing = await this.prisma.adminRole.findFirst({
                where: { name, NOT: { id } },
            });
            if (existing) {
                throw new common_1.ConflictException('Un rôle avec ce nom existe déjà');
            }
        }
        const data = {
            ...(dto.name !== undefined && { name: dto.name.trim() }),
            ...(dto.description !== undefined && {
                description: dto.description?.trim() || null,
            }),
        };
        if (dto.permissionKeys) {
            if (role.isSystem && role.name === admin_permissions_catalog_1.SUPER_ADMIN_ROLE_NAME) {
                const permissionIds = await this.resolvePermissionIds(admin_permissions_catalog_1.ADMIN_PERMISSION_CATALOG.map((item) => item.key));
                await this.prisma.adminRolePermission.deleteMany({ where: { roleId: id } });
                await this.prisma.adminRolePermission.createMany({
                    data: permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
                    skipDuplicates: true,
                });
            }
            else {
                const permissionIds = await this.resolvePermissionIds(dto.permissionKeys);
                await this.prisma.adminRolePermission.deleteMany({ where: { roleId: id } });
                await this.prisma.adminRolePermission.createMany({
                    data: permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
                    skipDuplicates: true,
                });
            }
        }
        const updated = await this.prisma.adminRole.update({
            where: { id },
            data,
            include: {
                permissions: { include: { permission: true } },
                _count: { select: { users: true } },
            },
        });
        return this.toRoleDto(updated);
    }
    async remove(id) {
        const role = await this.prisma.adminRole.findUnique({
            where: { id },
            include: { _count: { select: { users: true } } },
        });
        if (!role)
            throw new common_1.NotFoundException('Rôle introuvable');
        if (role.isSystem) {
            throw new common_1.ForbiddenException('Ce rôle système ne peut pas être supprimé');
        }
        if (role._count.users > 0) {
            throw new common_1.BadRequestException('Impossible de supprimer un rôle encore attribué à des utilisateurs');
        }
        await this.prisma.adminRole.delete({ where: { id } });
        return { message: 'Rôle supprimé' };
    }
    async resolvePermissionIds(keys) {
        const uniqueKeys = [...new Set(keys.map((key) => key.trim()).filter(Boolean))];
        if (uniqueKeys.length === 0) {
            throw new common_1.BadRequestException('Au moins une permission est requise');
        }
        const permissions = await this.prisma.adminPermission.findMany({
            where: { key: { in: uniqueKeys } },
        });
        if (permissions.length !== uniqueKeys.length) {
            throw new common_1.BadRequestException('Une ou plusieurs permissions sont invalides');
        }
        return permissions.map((permission) => permission.id);
    }
    toRoleDto(role) {
        return {
            id: role.id,
            name: role.name,
            description: role.description,
            isSystem: role.isSystem,
            usersCount: role._count.users,
            permissionKeys: role.permissions.map((item) => item.permission.key),
            permissions: role.permissions.map((item) => item.permission),
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        };
    }
};
exports.AdminRolesService = AdminRolesService;
exports.AdminRolesService = AdminRolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminRolesService);
//# sourceMappingURL=admin-roles.service.js.map