import { AddMemberDto } from './dto/add-member.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsService } from './teams.service';
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
    create(user: {
        userId: string;
    }, dto: CreateTeamDto): Promise<{
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
    }>;
    findAll(user: {
        userId: string;
    }): Promise<{
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
    }[]>;
    findOne(user: {
        userId: string;
    }, id: string): Promise<{
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
            userId: string;
            teamId: string;
            joinedAt: Date;
        })[];
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
    }>;
    update(user: {
        userId: string;
    }, id: string, dto: UpdateTeamDto): Promise<{
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
    }>;
    remove(user: {
        userId: string;
    }, id: string): Promise<{
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
    }>;
    getMembers(user: {
        userId: string;
    }, id: string): Promise<{
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
            userId: string;
            teamId: string;
            joinedAt: Date;
        })[];
        seats: import("../subscriptions/entitlements.types").TeamSeatsQuota;
    }>;
    addMember(user: {
        userId: string;
    }, id: string, dto: AddMemberDto): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        userId: string;
        teamId: string;
        joinedAt: Date;
    }>;
    updateMemberRole(user: {
        userId: string;
    }, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        userId: string;
        teamId: string;
        joinedAt: Date;
    }>;
    removeMember(user: {
        userId: string;
    }, id: string, memberId: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        userId: string;
        teamId: string;
        joinedAt: Date;
    }>;
}
