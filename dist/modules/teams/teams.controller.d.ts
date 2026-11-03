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
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        brandColor: string | null;
    }>;
    findAll(user: {
        userId: string;
    }): Promise<{
        entitlements: import("../subscriptions/entitlements.types").UserEntitlements;
        myRole: import("@prisma/client").$Enums.TeamMemberRole;
        id: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        brandColor: string | null;
    }[]>;
    getMyInvitations(user: {
        userId: string;
    }): Promise<({
        team: {
            id: string;
            logoUrl: string | null;
            name: string;
            brandColor: string | null;
        };
        invitedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        teamId: string;
        firstName: string | null;
        lastName: string | null;
        jobTitle: string | null;
        email: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        invitedById: string;
        inviteeUserId: string | null;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
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
        id: string;
        teamId: string;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        userId: string;
        joinedAt: Date;
    }>;
    declineInvitation(user: {
        userId: string;
    }, inviteId: string): Promise<{
        id: string;
        teamId: string;
        firstName: string | null;
        lastName: string | null;
        jobTitle: string | null;
        email: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        invitedById: string;
        inviteeUserId: string | null;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
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
            id: string;
            teamId: string;
            updatedAt: Date;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            userId: string;
            joinedAt: Date;
        })[];
        id: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        brandColor: string | null;
    }>;
    update(user: {
        userId: string;
    }, id: string, dto: UpdateTeamDto): Promise<{
        id: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        brandColor: string | null;
    }>;
    remove(user: {
        userId: string;
    }, id: string): Promise<{
        id: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        brandColor: string | null;
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
            id: string;
            teamId: string;
            updatedAt: Date;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            userId: string;
            joinedAt: Date;
        })[];
        pendingInvites: {
            id: string;
            teamId: string;
            firstName: string | null;
            lastName: string | null;
            jobTitle: string | null;
            email: string;
            avatarUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            invitedById: string;
            inviteeUserId: string | null;
            status: import("@prisma/client").$Enums.TeamInviteStatus;
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
            logoUrl: string | null;
            name: string;
            brandColor: string | null;
        };
    } & {
        id: string;
        teamId: string;
        firstName: string | null;
        lastName: string | null;
        jobTitle: string | null;
        email: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        invitedById: string;
        inviteeUserId: string | null;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    cancelInvitation(user: {
        userId: string;
    }, id: string, inviteId: string): Promise<{
        id: string;
        teamId: string;
        firstName: string | null;
        lastName: string | null;
        jobTitle: string | null;
        email: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        invitedById: string;
        inviteeUserId: string | null;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    updateMemberRole(user: {
        userId: string;
    }, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        id: string;
        teamId: string;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        userId: string;
        joinedAt: Date;
    }>;
    removeMember(user: {
        userId: string;
    }, id: string, memberId: string): Promise<{
        id: string;
        teamId: string;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        userId: string;
        joinedAt: Date;
    }>;
}
