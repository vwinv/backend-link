import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthProvider, Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminUsersQueryDto } from './dto/admin-users-query.dto';
import { CreateBackofficeUserDto } from './dto/create-backoffice-user.dto';
import { UpdateBackofficeUserDto } from './dto/update-backoffice-user.dto';

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: AdminUsersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      OR: [{ adminRoleId: { not: null } }, { role: UserRole.ADMIN }],
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

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        OR: [{ adminRoleId: { not: null } }, { role: UserRole.ADMIN }],
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
      throw new NotFoundException('Utilisateur backoffice introuvable');
    }

    return {
      ...this.toListItem(user),
      permissions:
        user.adminRole?.permissions.map((item) => item.permission.key) ??
        (user.role === UserRole.ADMIN ? ['*'] : []),
    };
  }

  async create(dto: CreateBackofficeUserDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
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
        authProvider: AuthProvider.LOCAL,
        role: UserRole.ADMIN,
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

  async update(id: string, dto: UpdateBackofficeUserDto, actorUserId: string) {
    if (
      dto.adminRoleId === undefined &&
      dto.isActive === undefined &&
      dto.firstName === undefined &&
      dto.lastName === undefined &&
      dto.phone === undefined &&
      dto.password === undefined
    ) {
      throw new BadRequestException('Aucune modification fournie');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || (!user.adminRoleId && user.role !== UserRole.ADMIN)) {
      throw new NotFoundException('Utilisateur backoffice introuvable');
    }

    if (id === actorUserId) {
      if (dto.isActive === false) {
        throw new ForbiddenException(
          'Vous ne pouvez pas désactiver votre propre compte',
        );
      }
      if (dto.adminRoleId === null as unknown as string) {
        throw new ForbiddenException(
          'Vous ne pouvez pas retirer votre propre rôle',
        );
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

  private async assertRoleExists(adminRoleId: string) {
    const role = await this.prisma.adminRole.findUnique({
      where: { id: adminRoleId },
    });
    if (!role) {
      throw new BadRequestException('Rôle backoffice introuvable');
    }
  }

  private toListItem(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    avatarUrl: string | null;
    role: UserRole;
    isActive: boolean;
    authProvider: string;
    createdAt: Date;
    updatedAt: Date;
    adminRole: { id: string; name: string; isSystem: boolean } | null;
  }) {
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
}
