import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TeamMemberRole } from '@prisma/client';
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

    return {
      members: team.members,
      seats,
    };
  }

  async addMember(userId: string, id: string, dto: AddMemberDto) {
    await this.entitlementsService.assertCanAddTeamMember(userId, id);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });
    if (!user) {
      throw new BadRequestException('Utilisateur introuvable');
    }

    const existingMember = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: id,
          userId: user.id,
        },
      },
    });
    if (existingMember) {
      throw new BadRequestException('Cet utilisateur fait déjà partie de l’équipe');
    }

    return this.prisma.teamMember.create({
      data: {
        teamId: id,
        userId: user.id,
        role: dto.role ?? TeamMemberRole.MEMBER,
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
