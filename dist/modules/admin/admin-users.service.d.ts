import { PrismaService } from '../../prisma/prisma.service';
import type { AuthUserPayload } from '../auth/decorators/current-user.decorator';
import { AdminUsersQueryDto } from './dto/admin-users-query.dto';
import { CreateBackofficeUserDto } from './dto/create-backoffice-user.dto';
import { ResetBackofficePasswordDto } from './dto/reset-backoffice-password.dto';
import { UpdateBackofficeUserDto } from './dto/update-backoffice-user.dto';
export declare class AdminUsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(query: AdminUsersQueryDto): Promise<{
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
            authProvider: string;
            createdAt: Date;
            updatedAt: Date;
            adminRole: {
                id: string;
                name: string;
                isSystem: boolean;
            } | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        permissions: string[];
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        authProvider: string;
        createdAt: Date;
        updatedAt: Date;
        adminRole: {
            id: string;
            name: string;
            isSystem: boolean;
        } | null;
    }>;
    create(dto: CreateBackofficeUserDto, actor: AuthUserPayload): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        authProvider: string;
        createdAt: Date;
        updatedAt: Date;
        adminRole: {
            id: string;
            name: string;
            isSystem: boolean;
        } | null;
    }>;
    update(id: string, dto: UpdateBackofficeUserDto, actor: AuthUserPayload): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        authProvider: string;
        createdAt: Date;
        updatedAt: Date;
        adminRole: {
            id: string;
            name: string;
            isSystem: boolean;
        } | null;
    }>;
    resetPassword(id: string, dto: ResetBackofficePasswordDto, actor: AuthUserPayload): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        authProvider: string;
        createdAt: Date;
        updatedAt: Date;
        adminRole: {
            id: string;
            name: string;
            isSystem: boolean;
        } | null;
    }>;
    private assertRoleExists;
    private toListItem;
}
