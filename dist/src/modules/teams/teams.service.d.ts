import { PrismaService } from '../../prisma/prisma.service';
import { EntitlementsService } from '../subscriptions/entitlements.service';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
export declare class TeamsService {
    private readonly prisma;
    private readonly entitlementsService;
    constructor(prisma: PrismaService, entitlementsService: EntitlementsService);
    create(userId: string, dto: CreateTeamDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        ownerId: string;
        brandColor: string | null;
    }>;
    findAllForUser(userId: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        ownerId: string;
        brandColor: string | null;
    }[]>;
    findOneForUser(userId: string, id: string): Promise<{
        seats: import("../subscriptions/entitlements.types").TeamSeatsQuota;
        members: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.TeamMemberRole;
            updatedAt: Date;
            teamId: string;
            userId: string;
            joinedAt: Date;
        })[];
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        ownerId: string;
        brandColor: string | null;
    }>;
    update(userId: string, id: string, dto: UpdateTeamDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        ownerId: string;
        brandColor: string | null;
    }>;
    remove(userId: string, id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        ownerId: string;
        brandColor: string | null;
    }>;
    getMembers(userId: string, id: string): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.TeamMemberRole;
            updatedAt: Date;
            teamId: string;
            userId: string;
            joinedAt: Date;
        })[];
        seats: import("../subscriptions/entitlements.types").TeamSeatsQuota;
    }>;
    addMember(userId: string, id: string, dto: AddMemberDto): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        userId: string;
        joinedAt: Date;
    }>;
    updateMemberRole(userId: string, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        userId: string;
        joinedAt: Date;
    }>;
    removeMember(userId: string, id: string, memberId: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        userId: string;
        joinedAt: Date;
    }>;
    private assertOwner;
    private generateUniqueSlug;
}
