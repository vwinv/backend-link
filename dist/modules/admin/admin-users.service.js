"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminUsersService = class AdminUsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = {
            OR: [{ adminRoleId: { not: null } }, { role: client_1.UserRole.ADMIN }],
        };
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        const search = query.search?.trim();
        if (search) {
            where.AND = [
                {
                    OR: [
                        { email: { contains: search, mode: 'insensitive' } },
                        { firstName: { contains: search, mode: 'insensitive' } },
                        { lastName: { contains: search, mode: 'insensitive' } },
                    ],
                },
            ];
        }
        const [total, users] = await Promise.all([
            this.prisma.user.count({ where }),
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    avatarUrl: true,
                    role: true,
                    isActive: true,
                    authProvider: true,
                    createdAt: true,
                    updatedAt: true,
                    adminRole: {
                        select: { id: true, name: true, isSystem: true },
                    },
                },
            }),
        ]);
        return {
            data: users.map((user) => this.toListItem(user)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }
    async findOne(id) {
        const user = await this.prisma.user.findFirst({
            where: {
                id,
                OR: [{ adminRoleId: { not: null } }, { role: client_1.UserRole.ADMIN }],
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatarUrl: true,
                role: true,
                isActive: true,
                authProvider: true,
                createdAt: true,
                updatedAt: true,
                adminRole: {
                    select: {
                        id: true,
                        name: true,
                        isSystem: true,
                        permissions: {
                            include: { permission: true },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur backoffice introuvable');
        }
        return {
            ...this.toListItem(user),
            permissions: user.adminRole?.permissions.map((item) => item.permission.key) ??
                (user.role === client_1.UserRole.ADMIN ? ['*'] : []),
        };
    }
    async create(dto) {
        const email = dto.email.trim().toLowerCase();
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('Cet email est déjà utilisé');
        }
        await this.assertRoleExists(dto.adminRoleId);
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                firstName: dto.firstName.trim(),
                lastName: dto.lastName.trim(),
                phone: dto.phone?.trim() || null,
                passwordHash,
                authProvider: client_1.AuthProvider.LOCAL,
                role: client_1.UserRole.ADMIN,
                adminRoleId: dto.adminRoleId,
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatarUrl: true,
                role: true,
                isActive: true,
                authProvider: true,
                createdAt: true,
                updatedAt: true,
                adminRole: {
                    select: { id: true, name: true, isSystem: true },
                },
            },
        });
        return this.toListItem(user);
    }
    async update(id, dto, actorUserId) {
        if (dto.adminRoleId === undefined &&
            dto.isActive === undefined &&
            dto.firstName === undefined &&
            dto.lastName === undefined &&
            dto.phone === undefined &&
            dto.password === undefined) {
            throw new common_1.BadRequestException('Aucune modification fournie');
        }
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user || (!user.adminRoleId && user.role !== client_1.UserRole.ADMIN)) {
            throw new common_1.NotFoundException('Utilisateur backoffice introuvable');
        }
        if (id === actorUserId) {
            if (dto.isActive === false) {
                throw new common_1.ForbiddenException('Vous ne pouvez pas désactiver votre propre compte');
            }
            if (dto.adminRoleId === null) {
                throw new common_1.ForbiddenException('Vous ne pouvez pas retirer votre propre rôle');
            }
        }
        if (dto.adminRoleId) {
            await this.assertRoleExists(dto.adminRoleId);
        }
        const passwordHash = dto.password
            ? await bcrypt.hash(dto.password, 10)
            : undefined;
        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                ...(dto.adminRoleId !== undefined && { adminRoleId: dto.adminRoleId }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
                ...(dto.firstName !== undefined && {
                    firstName: dto.firstName.trim(),
                }),
                ...(dto.lastName !== undefined && { lastName: dto.lastName.trim() }),
                ...(dto.phone !== undefined && {
                    phone: dto.phone?.trim() || null,
                }),
                ...(passwordHash && { passwordHash }),
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatarUrl: true,
                role: true,
                isActive: true,
                authProvider: true,
                createdAt: true,
                updatedAt: true,
                adminRole: {
                    select: { id: true, name: true, isSystem: true },
                },
            },
        });
        return this.toListItem(updated);
    }
    async assertRoleExists(adminRoleId) {
        const role = await this.prisma.adminRole.findUnique({
            where: { id: adminRoleId },
        });
        if (!role) {
            throw new common_1.BadRequestException('Rôle backoffice introuvable');
        }
    }
    toListItem(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            role: user.role,
            isActive: user.isActive,
            authProvider: user.authProvider,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            adminRole: user.adminRole,
        };
    }
};
exports.AdminUsersService = AdminUsersService;
exports.AdminUsersService = AdminUsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminUsersService);
//# sourceMappingURL=admin-users.service.js.map