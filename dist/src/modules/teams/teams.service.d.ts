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
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    findAllForUser(userId: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
    }[]>;
    findOneForUser(userId: string, id: string): Promise<{
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
            role: import(".prisma/client").$Enums.TeamMemberRole;
            updatedAt: Date;
            teamId: string;
            userId: string;
            joinedAt: Date;
        })[];
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    update(userId: string, id: string, dto: UpdateTeamDto): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    remove(userId: string, id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    getMembers(userId: string, id: string): Promise<{
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
            role: import(".prisma/client").$Enums.TeamMemberRole;
            updatedAt: Date;
            teamId: string;
            userId: string;
            joinedAt: Date;
        })[];
        pendingInvites: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.TeamMemberRole;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.TeamInviteStatus;
            inviteeUserId: string | null;
            expiresAt: Date | null;
            respondedAt: Date | null;
            teamId: string;
            invitedById: string;
        }[];
        seats: import("../subscriptions/entitlements.types").TeamSeatsQuota;
    }>;
    getMyInvitations(userId: string): Promise<({
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
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
    })[]>;
    addMember(userId: string, id: string, dto: AddMemberDto): Promise<{
        team: {
            name: string;
            id: string;
            logoUrl: string | null;
            brandColor: string | null;
        };
    } & {
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
    }>;
    acceptInvitation(userId: string, inviteId: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        userId: string;
        joinedAt: Date;
    }>;
    declineInvitation(userId: string, inviteId: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
    }>;
    cancelInvitation(userId: string, teamId: string, inviteId: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
    }>;
    updateMemberRole(userId: string, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        userId: string;
        joinedAt: Date;
    }>;
    removeMember(userId: string, id: string, memberId: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        userId: string;
        joinedAt: Date;
    }>;
    private assertOwner;
    private getAccessiblePendingInvite;
    private expireStaleInvitationsForEmail;
    linkPendingInvitesToUser(userId: string, email: string): Promise<void>;
    private generateUniqueSlug;
}
