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
        slug: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    findAll(user: {
        userId: string;
    }): Promise<{
        entitlements: import("../subscriptions/entitlements.types").UserEntitlements;
        id: string;
        slug: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
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
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
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
        id: string;
        updatedAt: Date;
        userId: string;
        teamId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        joinedAt: Date;
    }>;
    declineInvitation(user: {
        userId: string;
    }, inviteId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
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
            id: string;
            updatedAt: Date;
            userId: string;
            teamId: string;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            joinedAt: Date;
        })[];
        id: string;
        slug: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    update(user: {
        userId: string;
    }, id: string, dto: UpdateTeamDto): Promise<{
        id: string;
        slug: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    remove(user: {
        userId: string;
    }, id: string): Promise<{
        id: string;
        slug: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
            id: string;
            updatedAt: Date;
            userId: string;
            teamId: string;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            joinedAt: Date;
        })[];
        pendingInvites: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            status: import("@prisma/client").$Enums.TeamInviteStatus;
            email: string;
            firstName: string | null;
            lastName: string | null;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.TeamMemberRole;
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
            id: string;
            name: string;
            logoUrl: string | null;
            brandColor: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        jobTitle: string | null;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    cancelInvitation(user: {
        userId: string;
    }, id: string, inviteId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        jobTitle: string | null;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    updateMemberRole(user: {
        userId: string;
    }, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        teamId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        joinedAt: Date;
    }>;
    removeMember(user: {
        userId: string;
    }, id: string, memberId: string): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        teamId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        joinedAt: Date;
    }>;
}
