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
        name: string;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        ownerId: string;
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        description: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    findAll(user: {
        userId: string;
    }): Promise<{
        entitlements: import("../subscriptions/entitlements.types").UserEntitlements;
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        ownerId: string;
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        description: string | null;
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
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        updatedAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string | null;
        lastName: string | null;
        jobTitle: string | null;
        email: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
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
            firstName: string;
            lastName: string;
            email: string;
            avatarUrl: string | null;
        };
    } & {
        role: import("@prisma/client").$Enums.TeamMemberRole;
        id: string;
        userId: string;
        teamId: string;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.TeamMemberRole;
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
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        updatedAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string | null;
        lastName: string | null;
        jobTitle: string | null;
        email: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
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
                firstName: string;
                lastName: string;
                email: string;
                avatarUrl: string | null;
            };
        } & {
            role: import("@prisma/client").$Enums.TeamMemberRole;
            id: string;
            userId: string;
            teamId: string;
            updatedAt: Date;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            joinedAt: Date;
        })[];
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        ownerId: string;
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
        description: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    update(user: {
        userId: string;
    }, id: string, dto: UpdateTeamDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        ownerId: string;
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        description: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    remove(user: {
        userId: string;
    }, id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        ownerId: string;
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        description: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    getMembers(user: {
        userId: string;
    }, id: string): Promise<{
        members: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                email: string;
                avatarUrl: string | null;
            };
        } & {
            role: import("@prisma/client").$Enums.TeamMemberRole;
            id: string;
            userId: string;
            teamId: string;
            updatedAt: Date;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            joinedAt: Date;
        })[];
        pendingInvites: {
            role: import("@prisma/client").$Enums.TeamMemberRole;
            status: import("@prisma/client").$Enums.TeamInviteStatus;
            id: string;
            teamId: string;
            createdAt: Date;
            teamId: string;
            status: import("@prisma/client").$Enums.TeamInviteStatus;
            updatedAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string | null;
            lastName: string | null;
            jobTitle: string | null;
            email: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.TeamMemberRole;
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
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        updatedAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string | null;
        lastName: string | null;
        jobTitle: string | null;
        email: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
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
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        updatedAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string | null;
        lastName: string | null;
        jobTitle: string | null;
        email: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
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
        role: import("@prisma/client").$Enums.TeamMemberRole;
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
        role: import("@prisma/client").$Enums.TeamMemberRole;
        joinedAt: Date;
    }>;
}
