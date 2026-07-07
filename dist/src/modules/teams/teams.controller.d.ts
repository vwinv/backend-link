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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        description: string | null;
        brandColor: string | null;
    }>;
    findAll(user: {
        userId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        description: string | null;
        brandColor: string | null;
    }[]>;
    getMyInvitations(user: {
        userId: string;
    }): Promise<({
        team: {
            id: string;
            name: string;
            logoUrl: string | null;
            brandColor: string | null;
        };
        invitedBy: {
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        id: string;
        jobTitle: string | null;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    })[]>;
    acceptInvitation(user: {
        userId: string;
    }, inviteId: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            id: string;
        };
    } & {
        id: string;
        userId: string;
        updatedAt: Date;
        teamId: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        joinedAt: Date;
    }>;
    declineInvitation(user: {
        userId: string;
    }, inviteId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        id: string;
        jobTitle: string | null;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    findOne(user: {
        userId: string;
    }, id: string): Promise<{
        seats: import("../subscriptions/entitlements.types").TeamSeatsQuota;
        members: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                id: string;
            };
        } & {
            id: string;
            userId: string;
            updatedAt: Date;
            teamId: string;
            role: import(".prisma/client").$Enums.TeamMemberRole;
            joinedAt: Date;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        description: string | null;
        brandColor: string | null;
    }>;
    update(user: {
        userId: string;
    }, id: string, dto: UpdateTeamDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        description: string | null;
        brandColor: string | null;
    }>;
    remove(user: {
        userId: string;
    }, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        description: string | null;
        brandColor: string | null;
    }>;
    getMembers(user: {
        userId: string;
    }, id: string): Promise<{
        members: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                id: string;
            };
        } & {
            id: string;
            userId: string;
            updatedAt: Date;
            teamId: string;
            role: import(".prisma/client").$Enums.TeamMemberRole;
            joinedAt: Date;
        })[];
        pendingInvites: {
            email: string;
            firstName: string | null;
            lastName: string | null;
            avatarUrl: string | null;
            id: string;
            jobTitle: string | null;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            role: import(".prisma/client").$Enums.TeamMemberRole;
            status: import(".prisma/client").$Enums.TeamInviteStatus;
            invitedById: string;
            inviteeUserId: string | null;
            expiresAt: Date | null;
            respondedAt: Date | null;
        }[];
        seats: import("../subscriptions/entitlements.types").TeamSeatsQuota;
    }>;
    addMember(user: {
        userId: string;
    }, id: string, dto: AddMemberDto): Promise<{
        team: {
            id: string;
            name: string;
            logoUrl: string | null;
            brandColor: string | null;
        };
    } & {
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        id: string;
        jobTitle: string | null;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    cancelInvitation(user: {
        userId: string;
    }, id: string, inviteId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        id: string;
        jobTitle: string | null;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    updateMemberRole(user: {
        userId: string;
    }, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        teamId: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        joinedAt: Date;
    }>;
    removeMember(user: {
        userId: string;
    }, id: string, memberId: string): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        teamId: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        joinedAt: Date;
    }>;
}
