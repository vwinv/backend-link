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
        isActive: boolean;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
    }>;
    findAll(user: {
        userId: string;
    }): Promise<{
        entitlements: import("../subscriptions/entitlements.types").UserEntitlements;
        description: string | null;
        isActive: boolean;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        ownerId: string;
        logoUrl: string | null;
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
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        teamId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        expiresAt: Date | null;
        invitedById: string;
        inviteeUserId: string | null;
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
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        teamId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        expiresAt: Date | null;
        invitedById: string;
        inviteeUserId: string | null;
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
        description: string | null;
        isActive: boolean;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
    }>;
    update(user: {
        userId: string;
    }, id: string, dto: UpdateTeamDto): Promise<{
        description: string | null;
        isActive: boolean;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
    }>;
    remove(user: {
        userId: string;
    }, id: string): Promise<{
        description: string | null;
        isActive: boolean;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
            status: import("@prisma/client").$Enums.TeamInviteStatus;
            teamId: string;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            email: string;
            firstName: string | null;
            lastName: string | null;
            avatarUrl: string | null;
            jobTitle: string | null;
            expiresAt: Date | null;
            invitedById: string;
            inviteeUserId: string | null;
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
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        teamId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        expiresAt: Date | null;
        invitedById: string;
        inviteeUserId: string | null;
        respondedAt: Date | null;
    }>;
    cancelInvitation(user: {
        userId: string;
    }, id: string, inviteId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        teamId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        expiresAt: Date | null;
        invitedById: string;
        inviteeUserId: string | null;
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
