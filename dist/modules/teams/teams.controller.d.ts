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
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
    }>;
    findAll(user: {
        userId: string;
    }): Promise<{
        entitlements: import("../subscriptions/entitlements.types").UserEntitlements;
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
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
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        jobTitle: string | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
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
        role: import("@prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        userId: string;
        teamId: string;
        joinedAt: Date;
    }>;
    declineInvitation(user: {
        userId: string;
    }, inviteId: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        jobTitle: string | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
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
            role: import("@prisma/client").$Enums.TeamMemberRole;
            updatedAt: Date;
            userId: string;
            teamId: string;
            joinedAt: Date;
        })[];
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
    }>;
    update(user: {
        userId: string;
    }, id: string, dto: UpdateTeamDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
    }>;
    remove(user: {
        userId: string;
    }, id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
            role: import("@prisma/client").$Enums.TeamMemberRole;
            updatedAt: Date;
            userId: string;
            teamId: string;
            joinedAt: Date;
        })[];
        pendingInvites: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date | null;
            status: import("@prisma/client").$Enums.TeamInviteStatus;
            inviteeUserId: string | null;
            jobTitle: string | null;
            respondedAt: Date | null;
            teamId: string;
            invitedById: string;
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
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        jobTitle: string | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
    }>;
    cancelInvitation(user: {
        userId: string;
    }, id: string, inviteId: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        jobTitle: string | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
    }>;
    updateMemberRole(user: {
        userId: string;
    }, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        id: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        userId: string;
        teamId: string;
        joinedAt: Date;
    }>;
    removeMember(user: {
        userId: string;
    }, id: string, memberId: string): Promise<{
        id: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        userId: string;
        teamId: string;
        joinedAt: Date;
    }>;
}
