import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ADMIN_MODULES,
  ADMIN_PERMISSION_CATALOG,
  SUPER_ADMIN_ROLE_NAME,
} from './admin-permissions.catalog';
import { CreateAdminRoleDto } from './dto/create-admin-role.dto';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto';

@Injectable()
export class AdminRolesService {
  constructor(private readonly prisma: PrismaService) {}

  listPermissions() {
    const byModule = ADMIN_MODULES.map((module) => ({
      key: module.key,
      label: module.label,
      permissions: ADMIN_PERMISSION_CATALOG.filter(
        (permission) => permission.module === module.key,
      ),
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

  async findOne(id: string) {
    const role = await this.prisma.adminRole.findUnique({
      where: { id },
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
    });
    if (!role) throw new NotFoundException('Rôle introuvable');
    return this.toRoleDto(role);
  }

  async create(dto: CreateAdminRoleDto) {
    const name = dto.name.trim();
    const existing = await this.prisma.adminRole.findUnique({ where: { name } });
    if (existing) {
      throw new ConflictException('Un rôle avec ce nom existe déjà');
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

  async update(id: string, dto: UpdateAdminRoleDto) {
    const role = await this.prisma.adminRole.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Rôle introuvable');

    if (role.isSystem && dto.name && dto.name.trim() !== role.name) {
      throw new ForbiddenException(
        'Le nom du rôle système ne peut pas être modifié',
      );
    }

    if (dto.name) {
      const name = dto.name.trim();
      const existing = await this.prisma.adminRole.findFirst({
        where: { name, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException('Un rôle avec ce nom existe déjà');
      }
    }

    const data: Prisma.AdminRoleUpdateInput = {
      ...(dto.name !== undefined && { name: dto.name.trim() }),
      ...(dto.description !== undefined && {
        description: dto.description?.trim() || null,
      }),
    };

    if (dto.permissionKeys) {
      if (role.isSystem && role.name === SUPER_ADMIN_ROLE_NAME) {
        // Super Admin garde toujours toutes les permissions catalogue
        const permissionIds = await this.resolvePermissionIds(
          ADMIN_PERMISSION_CATALOG.map((item) => item.key),
        );
        await this.prisma.adminRolePermission.deleteMany({ where: { roleId: id } });
        await this.prisma.adminRolePermission.createMany({
          data: permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
          skipDuplicates: true,
        });
      } else {
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

  async remove(id: string) {
    const role = await this.prisma.adminRole.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });
    if (!role) throw new NotFoundException('Rôle introuvable');
    if (role.isSystem) {
      throw new ForbiddenException('Ce rôle système ne peut pas être supprimé');
    }
    if (role._count.users > 0) {
      throw new BadRequestException(
        'Impossible de supprimer un rôle encore attribué à des utilisateurs',
      );
    }

    await this.prisma.adminRole.delete({ where: { id } });
    return { message: 'Rôle supprimé' };
  }

  private async resolvePermissionIds(keys: string[]) {
    const uniqueKeys = [...new Set(keys.map((key) => key.trim()).filter(Boolean))];
    if (uniqueKeys.length === 0) {
      throw new BadRequestException('Au moins une permission est requise');
    }

    const permissions = await this.prisma.adminPermission.findMany({
      where: { key: { in: uniqueKeys } },
    });

    if (permissions.length !== uniqueKeys.length) {
      throw new BadRequestException('Une ou plusieurs permissions sont invalides');
    }

    return permissions.map((permission) => permission.id);
  }

  private toRoleDto(role: {
    id: string;
    name: string;
    description: string | null;
    isSystem: boolean;
    createdAt: Date;
    updatedAt: Date;
    permissions: Array<{ permission: { key: string; module: string; action: string; label: string } }>;
    _count: { users: number };
  }) {
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
}
