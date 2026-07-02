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
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const entitlements_service_1 = require("../subscriptions/entitlements.service");
let TeamsService = class TeamsService {
    prisma;
    entitlementsService;
    constructor(prisma, entitlementsService) {
        this.prisma = prisma;
        this.entitlementsService = entitlementsService;
    }
    async create(userId, dto) {
        const existingOwnedTeam = await this.prisma.team.findFirst({
            where: { ownerId: userId, isActive: true },
        });
        if (existingOwnedTeam) {
            return this.prisma.team.update({
                where: { id: existingOwnedTeam.id },
                data: {
                    name: dto.name.trim(),
                    ...(dto.description !== undefined && {
                        description: dto.description.trim() || null,
                    }),
                    ...(dto.logoUrl !== undefined && {
                        logoUrl: dto.logoUrl.trim() || null,
                    }),
                    ...(dto.brandColor !== undefined && {
                        brandColor: dto.brandColor.trim() || null,
                    }),
                },
            });
        }
        const slug = await this.generateUniqueSlug(dto.name);
        return this.prisma.$transaction(async (tx) => {
            const team = await tx.team.create({
                data: {
                    name: dto.name.trim(),
                    slug,
                    description: dto.description?.trim() || null,
                    logoUrl: dto.logoUrl?.trim() || null,
                    brandColor: dto.brandColor?.trim() || null,
                    ownerId: userId,
                },
            });
            await tx.teamMember.create({
                data: {
                    teamId: team.id,
                    userId,
                    role: client_1.TeamMemberRole.OWNER,
                },
            });
            return team;
        });
    }
    async findAllForUser(userId) {
        return this.prisma.team.findMany({
            where: {
                isActive: true,
                OR: [
                    { ownerId: userId },
                    { members: { some: { userId } } },
                ],
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOneForUser(userId, id) {
        const team = await this.prisma.team.findFirst({
            where: {
                id,
                isActive: true,
                OR: [
                    { ownerId: userId },
                    { members: { some: { userId } } },
                ],
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                avatarUrl: true,
                            },
                        },
                    },
                    orderBy: { joinedAt: 'asc' },
                },
            },
        });
        if (!team) {
            throw new common_1.NotFoundException('Équipe introuvable');
        }
        const seats = await this.entitlementsService.getTeamSeatsQuota(userId, id);
        return {
            ...team,
            seats,
        };
    }
    async update(userId, id, dto) {
        await this.assertOwner(userId, id);
        return this.prisma.team.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name.trim() }),
                ...(dto.description !== undefined && {
                    description: dto.description.trim() || null,
                }),
                ...(dto.logoUrl !== undefined && {
                    logoUrl: dto.logoUrl.trim() || null,
                }),
                ...(dto.brandColor !== undefined && {
                    brandColor: dto.brandColor.trim() || null,
                }),
            },
        });
    }
    async remove(userId, id) {
        await this.assertOwner(userId, id);
        return this.prisma.team.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async getMembers(userId, id) {
        const team = await this.findOneForUser(userId, id);
        const seats = await this.entitlementsService.getTeamSeatsQuota(userId, id);
        const pendingInvites = await this.prisma.teamInvite.findMany({
            where: {
                teamId: id,
                status: client_1.TeamInviteStatus.PENDING,
            },
            orderBy: { createdAt: 'asc' },
        });
        return {
            members: team.members,
            pendingInvites,
            seats,
        };
    }
    async getMyInvitations(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        await this.expireStaleInvitationsForEmail(user.email);
        return this.prisma.teamInvite.findMany({
            where: {
                status: client_1.TeamInviteStatus.PENDING,
                OR: [{ inviteeUserId: userId }, { email: user.email }],
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                        logoUrl: true,
                        brandColor: true,
                    },
                },
                invitedBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async addMember(userId, id, dto) {
        await this.entitlementsService.assertCanAddTeamMember(userId, id);
        const email = dto.email.trim().toLowerCase();
        const inviter = await this.prisma.user.findUnique({ where: { id: userId } });
        if (inviter?.email === email) {
            throw new common_1.BadRequestException('Vous ne pouvez pas vous inviter vous-même');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            const existingMember = await this.prisma.teamMember.findUnique({
                where: {
                    teamId_userId: {
                        teamId: id,
                        userId: existingUser.id,
                    },
                },
            });
            if (existingMember) {
                throw new common_1.BadRequestException('Cet utilisateur fait déjà partie de l’équipe');
            }
        }
        const existingInvite = await this.prisma.teamInvite.findFirst({
            where: {
                teamId: id,
                email,
                status: client_1.TeamInviteStatus.PENDING,
            },
        });
        if (existingInvite) {
            throw new common_1.BadRequestException('Une invitation est déjà en attente pour cet email');
        }
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        return this.prisma.teamInvite.create({
            data: {
                teamId: id,
                email,
                invitedById: userId,
                inviteeUserId: existingUser?.id ?? null,
                role: dto.role ?? client_1.TeamMemberRole.MEMBER,
                status: client_1.TeamInviteStatus.PENDING,
                expiresAt,
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                        logoUrl: true,
                        brandColor: true,
                    },
                },
            },
        });
    }
    async acceptInvitation(userId, inviteId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        const invite = await this.getAccessiblePendingInvite(userId, inviteId, user.email);
        const team = await this.prisma.team.findFirst({
            where: { id: invite.teamId, isActive: true },
        });
        if (!team) {
            throw new common_1.BadRequestException('Équipe introuvable');
        }
        const existingMember = await this.prisma.teamMember.findUnique({
            where: {
                teamId_userId: {
                    teamId: invite.teamId,
                    userId,
                },
            },
        });
        if (existingMember) {
            await this.prisma.teamInvite.update({
                where: { id: invite.id },
                data: {
                    status: client_1.TeamInviteStatus.ACCEPTED,
                    inviteeUserId: userId,
                    respondedAt: new Date(),
                },
            });
            throw new common_1.BadRequestException('Vous faites déjà partie de cette équipe');
        }
        return this.prisma.$transaction(async (tx) => {
            const member = await tx.teamMember.create({
                data: {
                    teamId: invite.teamId,
                    userId,
                    role: invite.role,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            avatarUrl: true,
                        },
                    },
                },
            });
            await tx.teamInvite.update({
                where: { id: invite.id },
                data: {
                    status: client_1.TeamInviteStatus.ACCEPTED,
                    inviteeUserId: userId,
                    respondedAt: new Date(),
                },
            });
            return member;
        });
    }
    async declineInvitation(userId, inviteId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        const invite = await this.getAccessiblePendingInvite(userId, inviteId, user.email);
        return this.prisma.teamInvite.update({
            where: { id: invite.id },
            data: {
                status: client_1.TeamInviteStatus.DECLINED,
                inviteeUserId: userId,
                respondedAt: new Date(),
            },
        });
    }
    async cancelInvitation(userId, teamId, inviteId) {
        await this.assertOwner(userId, teamId);
        const invite = await this.prisma.teamInvite.findFirst({
            where: {
                id: inviteId,
                teamId,
                status: client_1.TeamInviteStatus.PENDING,
            },
        });
        if (!invite) {
            throw new common_1.NotFoundException('Invitation introuvable');
        }
        return this.prisma.teamInvite.update({
            where: { id: invite.id },
            data: {
                status: client_1.TeamInviteStatus.CANCELLED,
                respondedAt: new Date(),
            },
        });
    }
    async updateMemberRole(userId, id, memberId, dto) {
        await this.assertOwner(userId, id);
        return this.prisma.teamMember.update({
            where: { id: memberId },
            data: { role: dto.role },
        });
    }
    async removeMember(userId, id, memberId) {
        await this.assertOwner(userId, id);
        return this.prisma.teamMember.delete({ where: { id: memberId } });
    }
    async assertOwner(userId, teamId) {
        const team = await this.prisma.team.findFirst({
            where: { id: teamId, ownerId: userId, isActive: true },
        });
        if (!team) {
            throw new common_1.BadRequestException('Action réservée au propriétaire de l’équipe');
        }
    }
    async getAccessiblePendingInvite(userId, inviteId, email) {
        const invite = await this.prisma.teamInvite.findUnique({
            where: { id: inviteId },
        });
        if (!invite || invite.status !== client_1.TeamInviteStatus.PENDING) {
            throw new common_1.NotFoundException('Invitation introuvable');
        }
        if (invite.expiresAt && invite.expiresAt < new Date()) {
            await this.prisma.teamInvite.update({
                where: { id: invite.id },
                data: { status: client_1.TeamInviteStatus.EXPIRED, respondedAt: new Date() },
            });
            throw new common_1.BadRequestException('Cette invitation a expiré');
        }
        const canAccess = invite.inviteeUserId === userId || invite.email === email;
        if (!canAccess) {
            throw new common_1.ForbiddenException('Cette invitation ne vous est pas destinée');
        }
        return invite;
    }
    async expireStaleInvitationsForEmail(email) {
        await this.prisma.teamInvite.updateMany({
            where: {
                email,
                status: client_1.TeamInviteStatus.PENDING,
                expiresAt: { lt: new Date() },
            },
            data: {
                status: client_1.TeamInviteStatus.EXPIRED,
                respondedAt: new Date(),
            },
        });
    }
    async linkPendingInvitesToUser(userId, email) {
        await this.prisma.teamInvite.updateMany({
            where: {
                email,
                status: client_1.TeamInviteStatus.PENDING,
                inviteeUserId: null,
            },
            data: { inviteeUserId: userId },
        });
    }
    async generateUniqueSlug(name) {
        const base = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        const safeBase = base.length > 0 ? base : 'equipe';
        let slug = safeBase;
        let counter = 1;
        while (await this.prisma.team.findUnique({ where: { slug } })) {
            slug = `${safeBase}-${counter++}`;
        }
        return slug;
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        entitlements_service_1.EntitlementsService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map