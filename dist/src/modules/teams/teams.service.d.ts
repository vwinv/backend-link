import { PrismaService } from '../../prisma/prisma.service';
import { EntitlementsService } from '../subscriptions/entitlements.service';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
export declare class TeamsService {
    private readonly prisma;
    private readonly entitlementsService;
    constructor(prisma: PrismaService, entitlementsService: EntitlementsService);
    create(userId: string, dto: CreateTeamDto): Promise<{
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
    findAllForUser(userId: string): Promise<{
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
    findOneForUser(userId: string, id: string): Promise<{
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
    update(userId: string, id: string, dto: UpdateTeamDto): Promise<{
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
    remove(userId: string, id: string): Promise<{
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
    getMembers(userId: string, id: string): Promise<{
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
    getMyInvitations(userId: string): Promise<({
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
    addMember(userId: string, id: string, dto: AddMemberDto): Promise<{
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
    acceptInvitation(userId: string, inviteId: string): Promise<{
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
    declineInvitation(userId: string, inviteId: string): Promise<{
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
    cancelInvitation(userId: string, teamId: string, inviteId: string): Promise<{
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
    updateMemberRole(userId: string, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        role: import(".prisma/client").$Enums.TeamMemberRole;
        id: string;
        updatedAt: Date;
        userId: string;
        joinedAt: Date;
        teamId: string;
    }>;
    removeMember(userId: string, id: string, memberId: string): Promise<{
        role: import(".prisma/client").$Enums.TeamMemberRole;
        id: string;
        updatedAt: Date;
        userId: string;
        joinedAt: Date;
        teamId: string;
    }>;
    private assertOwner;
    private getAccessiblePendingInvite;
    private expireStaleInvitationsForEmail;
    linkPendingInvitesToUser(userId: string, email: string): Promise<void>;
    private generateUniqueSlug;
}
