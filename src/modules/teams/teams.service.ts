import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TeamInviteStatus, TeamMemberRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EntitlementsService } from '../subscriptions/entitlements.service';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlementsService: EntitlementsService,
  ) {}

  async create(userId: string, dto: CreateTeamDto) {
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
          role: TeamMemberRole.OWNER,
        },
      });

      return team;
    });
  }

  async findAllForUser(userId: string) {
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

  async findOneForUser(userId: string, id: string) {
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
      throw new NotFoundException('Équipe introuvable');
    }

    const seats = await this.entitlementsService.getTeamSeatsQuota(userId, id);

    return {
      ...team,
      seats,
    };
  }

  async update(userId: string, id: string, dto: UpdateTeamDto) {
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

  async remove(userId: string, id: string) {
    await this.assertOwner(userId, id);

    return this.prisma.team.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getMembers(userId: string, id: string) {
    const team = await this.findOneForUser(userId, id);
    const seats = await this.entitlementsService.getTeamSeatsQuota(userId, id);
    const pendingInvites = await this.prisma.teamInvite.findMany({
      where: {
        teamId: id,
        status: TeamInviteStatus.PENDING,
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      members: team.members,
      pendingInvites,
      seats,
    };
  }

  async getMyInvitations(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    await this.expireStaleInvitationsForEmail(user.email);

    return this.prisma.teamInvite.findMany({
      where: {
        status: TeamInviteStatus.PENDING,
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

  async addMember(userId: string, id: string, dto: AddMemberDto) {
    await this.entitlementsService.assertCanAddTeamMember(userId, id);

    const email = dto.email.trim().toLowerCase();
    const inviter = await this.prisma.user.findUnique({ where: { id: userId } });

    if (inviter?.email === email) {
      throw new BadRequestException(
        'Vous ne pouvez pas vous inviter vous-même',
      );
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
        throw new BadRequestException(
          'Cet utilisateur fait déjà partie de l’équipe',
        );
      }
    }

    const existingInvite = await this.prisma.teamInvite.findFirst({
      where: {
        teamId: id,
        email,
        status: TeamInviteStatus.PENDING,
      },
    });
    if (existingInvite) {
      throw new BadRequestException('Une invitation est déjà en attente pour cet email');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return this.prisma.teamInvite.create({
      data: {
        teamId: id,
        email,
        invitedById: userId,
        inviteeUserId: existingUser?.id ?? null,
        role: dto.role ?? TeamMemberRole.MEMBER,
        status: TeamInviteStatus.PENDING,
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

  async acceptInvitation(userId: string, inviteId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const invite = await this.getAccessiblePendingInvite(userId, inviteId, user.email);
    const team = await this.prisma.team.findFirst({
      where: { id: invite.teamId, isActive: true },
    });

    if (!team) {
      throw new BadRequestException('Équipe introuvable');
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
          status: TeamInviteStatus.ACCEPTED,
          inviteeUserId: userId,
          respondedAt: new Date(),
        },
      });
      throw new BadRequestException('Vous faites déjà partie de cette équipe');
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
          status: TeamInviteStatus.ACCEPTED,
          inviteeUserId: userId,
          respondedAt: new Date(),
        },
      });

      return member;
    });
  }

  async declineInvitation(userId: string, inviteId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const invite = await this.getAccessiblePendingInvite(userId, inviteId, user.email);

    return this.prisma.teamInvite.update({
      where: { id: invite.id },
      data: {
        status: TeamInviteStatus.DECLINED,
        inviteeUserId: userId,
        respondedAt: new Date(),
      },
    });
  }

  async cancelInvitation(userId: string, teamId: string, inviteId: string) {
    await this.assertOwner(userId, teamId);

    const invite = await this.prisma.teamInvite.findFirst({
      where: {
        id: inviteId,
        teamId,
        status: TeamInviteStatus.PENDING,
      },
    });

    if (!invite) {
      throw new NotFoundException('Invitation introuvable');
    }

    return this.prisma.teamInvite.update({
      where: { id: invite.id },
      data: {
        status: TeamInviteStatus.CANCELLED,
        respondedAt: new Date(),
      },
    });
  }

  async updateMemberRole(
    userId: string,
    id: string,
    memberId: string,
    dto: UpdateMemberRoleDto,
  ) {
    await this.assertOwner(userId, id);

    return this.prisma.teamMember.update({
      where: { id: memberId },
      data: { role: dto.role },
    });
  }

  async removeMember(userId: string, id: string, memberId: string) {
    await this.assertOwner(userId, id);

    return this.prisma.teamMember.delete({ where: { id: memberId } });
  }

  private async assertOwner(userId: string, teamId: string) {
    const team = await this.prisma.team.findFirst({
      where: { id: teamId, ownerId: userId, isActive: true },
    });

    if (!team) {
      throw new BadRequestException('Action réservée au propriétaire de l’équipe');
    }
  }

  private async getAccessiblePendingInvite(
    userId: string,
    inviteId: string,
    email: string,
  ) {
    const invite = await this.prisma.teamInvite.findUnique({
      where: { id: inviteId },
    });

    if (!invite || invite.status !== TeamInviteStatus.PENDING) {
      throw new NotFoundException('Invitation introuvable');
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      await this.prisma.teamInvite.update({
        where: { id: invite.id },
        data: { status: TeamInviteStatus.EXPIRED, respondedAt: new Date() },
      });
      throw new BadRequestException('Cette invitation a expiré');
    }

    const canAccess =
      invite.inviteeUserId === userId || invite.email === email;
    if (!canAccess) {
      throw new ForbiddenException('Cette invitation ne vous est pas destinée');
    }

    return invite;
  }

  private async expireStaleInvitationsForEmail(email: string) {
    await this.prisma.teamInvite.updateMany({
      where: {
        email,
        status: TeamInviteStatus.PENDING,
        expiresAt: { lt: new Date() },
      },
      data: {
        status: TeamInviteStatus.EXPIRED,
        respondedAt: new Date(),
      },
    });
  }

  async linkPendingInvitesToUser(userId: string, email: string) {
    await this.prisma.teamInvite.updateMany({
      where: {
        email,
        status: TeamInviteStatus.PENDING,
        inviteeUserId: null,
      },
      data: { inviteeUserId: userId },
    });
  }

  private async generateUniqueSlug(name: string): Promise<string> {
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
}
