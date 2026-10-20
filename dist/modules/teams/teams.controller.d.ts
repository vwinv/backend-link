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
        id: string;
        createdAt: Date;
        slug: string;
        isActive: boolean;
        updatedAt: Date;
        ownerId: string;
        logoUrl: string | null;
        description: string | null;
        brandColor: string | null;
    }>;
    findAll(user: {
        userId: string;
    }): Promise<{
        entitlements: import("../subscriptions/entitlements.types").UserEntitlements;
        name: string;
        id: string;
        createdAt: Date;
        slug: string;
        isActive: boolean;
        updatedAt: Date;
        ownerId: string;
        logoUrl: string | null;
        description: string | null;
        brandColor: string | null;
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
            lastName: string;
            firstName: string;
        };
    } & {
        id: string;
        expiresAt: Date | null;
        createdAt: Date;
        lastName: string | null;
        firstName: string | null;
        email: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        jobTitle: string | null;
        inviteeUserId: string | null;
        respondedAt: Date | null;
        invitedById: string;
    })[]>;
    acceptInvitation(user: {
        userId: string;
    }, inviteId: string): Promise<{
        user: {
            id: string;
            lastName: string;
            firstName: string;
            email: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        joinedAt: Date;
    }>;
    declineInvitation(user: {
        userId: string;
    }, inviteId: string): Promise<{
        id: string;
        expiresAt: Date | null;
        createdAt: Date;
        lastName: string | null;
        firstName: string | null;
        email: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        jobTitle: string | null;
        inviteeUserId: string | null;
        respondedAt: Date | null;
        invitedById: string;
    }>;
    findOne(user: {
        userId: string;
    }, id: string): Promise<{
        seats: import("../subscriptions/entitlements.types").TeamSeatsQuota;
        members: ({
            user: {
                id: string;
                lastName: string;
                firstName: string;
                email: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            userId: string;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            updatedAt: Date;
            teamId: string;
            joinedAt: Date;
        })[];
        name: string;
        id: string;
        createdAt: Date;
        slug: string;
        isActive: boolean;
        updatedAt: Date;
        ownerId: string;
        logoUrl: string | null;
        description: string | null;
        brandColor: string | null;
    }>;
    update(user: {
        userId: string;
    }, id: string, dto: UpdateTeamDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        slug: string;
        isActive: boolean;
        updatedAt: Date;
        ownerId: string;
        logoUrl: string | null;
        description: string | null;
        brandColor: string | null;
    }>;
    remove(user: {
        userId: string;
    }, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        slug: string;
        isActive: boolean;
        updatedAt: Date;
        ownerId: string;
        logoUrl: string | null;
        description: string | null;
        brandColor: string | null;
    }>;
    getMembers(user: {
        userId: string;
    }, id: string): Promise<{
        members: ({
            user: {
                id: string;
                lastName: string;
                firstName: string;
                email: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            userId: string;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            updatedAt: Date;
            teamId: string;
            joinedAt: Date;
        })[];
        pendingInvites: {
            id: string;
            expiresAt: Date | null;
            createdAt: Date;
            lastName: string | null;
            firstName: string | null;
            email: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            updatedAt: Date;
            teamId: string;
            status: import("@prisma/client").$Enums.TeamInviteStatus;
            jobTitle: string | null;
            inviteeUserId: string | null;
            respondedAt: Date | null;
            invitedById: string;
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
        id: string;
        expiresAt: Date | null;
        createdAt: Date;
        lastName: string | null;
        firstName: string | null;
        email: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        jobTitle: string | null;
        inviteeUserId: string | null;
        respondedAt: Date | null;
        invitedById: string;
    }>;
    cancelInvitation(user: {
        userId: string;
    }, id: string, inviteId: string): Promise<{
        id: string;
        expiresAt: Date | null;
        createdAt: Date;
        lastName: string | null;
        firstName: string | null;
        email: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        jobTitle: string | null;
        inviteeUserId: string | null;
        respondedAt: Date | null;
        invitedById: string;
    }>;
    updateMemberRole(user: {
        userId: string;
    }, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        joinedAt: Date;
    }>;
    removeMember(user: {
        userId: string;
    }, id: string, memberId: string): Promise<{
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        joinedAt: Date;
    }>;
}
