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
        slug: string;
        name: string;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(user: {
        userId: string;
    }): Promise<{
        description: string | null;
        id: string;
        slug: string;
        name: string;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
        jobTitle: string | null;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        invitedById: string;
        inviteeUserId: string | null;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
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
        role: import(".prisma/client").$Enums.TeamMemberRole;
        id: string;
        updatedAt: Date;
        userId: string;
        joinedAt: Date;
        teamId: string;
    }>;
    declineInvitation(user: {
        userId: string;
    }, inviteId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        jobTitle: string | null;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        invitedById: string;
        inviteeUserId: string | null;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
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
            role: import(".prisma/client").$Enums.TeamMemberRole;
            id: string;
            updatedAt: Date;
            userId: string;
            joinedAt: Date;
            teamId: string;
        })[];
        description: string | null;
        id: string;
        slug: string;
        name: string;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(user: {
        userId: string;
    }, id: string, dto: UpdateTeamDto): Promise<{
        description: string | null;
        id: string;
        slug: string;
        name: string;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(user: {
        userId: string;
    }, id: string): Promise<{
        description: string | null;
        id: string;
        slug: string;
        name: string;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
            role: import(".prisma/client").$Enums.TeamMemberRole;
            id: string;
            updatedAt: Date;
            userId: string;
            joinedAt: Date;
            teamId: string;
        })[];
        pendingInvites: {
            email: string;
            firstName: string | null;
            lastName: string | null;
            jobTitle: string | null;
            avatarUrl: string | null;
            role: import(".prisma/client").$Enums.TeamMemberRole;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            invitedById: string;
            inviteeUserId: string | null;
            status: import(".prisma/client").$Enums.TeamInviteStatus;
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
        jobTitle: string | null;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        invitedById: string;
        inviteeUserId: string | null;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    cancelInvitation(user: {
        userId: string;
    }, id: string, inviteId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        jobTitle: string | null;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        invitedById: string;
        inviteeUserId: string | null;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    updateMemberRole(user: {
        userId: string;
    }, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        role: import(".prisma/client").$Enums.TeamMemberRole;
        id: string;
        updatedAt: Date;
        userId: string;
        joinedAt: Date;
        teamId: string;
    }>;
    removeMember(user: {
        userId: string;
    }, id: string, memberId: string): Promise<{
        role: import(".prisma/client").$Enums.TeamMemberRole;
        id: string;
        updatedAt: Date;
        userId: string;
        joinedAt: Date;
        teamId: string;
    }>;
}
