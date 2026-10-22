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
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    findAll(user: {
        userId: string;
    }): Promise<{
        entitlements: import("../subscriptions/entitlements.types").UserEntitlements;
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
    }[]>;
    getMyInvitations(user: {
        userId: string;
    }): Promise<({
        team: {
            name: string;
            id: string;
            logoUrl: string | null;
            brandColor: string | null;
        };
        invitedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        role: import("@prisma/client").$Enums.TeamMemberRole;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        id: string;
        teamId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    })[]>;
    acceptInvitation(user: {
        userId: string;
    }, inviteId: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        };
    } & {
        role: import("@prisma/client").$Enums.TeamMemberRole;
        id: string;
        userId: string;
        teamId: string;
        updatedAt: Date;
        joinedAt: Date;
    }>;
    declineInvitation(user: {
        userId: string;
    }, inviteId: string): Promise<{
        role: import("@prisma/client").$Enums.TeamMemberRole;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        id: string;
        teamId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
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
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            };
        } & {
            role: import("@prisma/client").$Enums.TeamMemberRole;
            id: string;
            userId: string;
            teamId: string;
            updatedAt: Date;
            joinedAt: Date;
        })[];
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    update(user: {
        userId: string;
    }, id: string, dto: UpdateTeamDto): Promise<{
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    remove(user: {
        userId: string;
    }, id: string): Promise<{
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
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
            role: import("@prisma/client").$Enums.TeamMemberRole;
            id: string;
            userId: string;
            teamId: string;
            updatedAt: Date;
            joinedAt: Date;
        })[];
        pendingInvites: {
            role: import("@prisma/client").$Enums.TeamMemberRole;
            status: import("@prisma/client").$Enums.TeamInviteStatus;
            id: string;
            teamId: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string | null;
            lastName: string | null;
            avatarUrl: string | null;
            jobTitle: string | null;
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
            name: string;
            id: string;
            logoUrl: string | null;
            brandColor: string | null;
        };
    } & {
        role: import("@prisma/client").$Enums.TeamMemberRole;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        id: string;
        teamId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    cancelInvitation(user: {
        userId: string;
    }, id: string, inviteId: string): Promise<{
        role: import("@prisma/client").$Enums.TeamMemberRole;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        id: string;
        teamId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    updateMemberRole(user: {
        userId: string;
    }, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        role: import("@prisma/client").$Enums.TeamMemberRole;
        id: string;
        userId: string;
        teamId: string;
        updatedAt: Date;
        joinedAt: Date;
    }>;
    removeMember(user: {
        userId: string;
    }, id: string, memberId: string): Promise<{
        role: import("@prisma/client").$Enums.TeamMemberRole;
        id: string;
        userId: string;
        teamId: string;
        updatedAt: Date;
        joinedAt: Date;
    }>;
}
