import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { EntitlementsService } from '../subscriptions/entitlements.service';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
export declare class TeamsService {
    private readonly prisma;
    private readonly entitlementsService;
    private readonly mailService;
    private readonly configService;
    constructor(prisma: PrismaService, entitlementsService: EntitlementsService, mailService: MailService, configService: ConfigService);
    private get appPublicUrl();
    private formatUserName;
    create(userId: string, dto: CreateTeamDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        description: string | null;
        brandColor: string | null;
    }>;
    findAllForUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        description: string | null;
        brandColor: string | null;
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
            id: string;
            userId: string;
            updatedAt: Date;
            teamId: string;
            role: import(".prisma/client").$Enums.TeamMemberRole;
            joinedAt: Date;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        description: string | null;
        brandColor: string | null;
    }>;
    update(userId: string, id: string, dto: UpdateTeamDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        description: string | null;
        brandColor: string | null;
    }>;
    remove(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        isActive: boolean;
        description: string | null;
        brandColor: string | null;
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
            id: string;
            userId: string;
            updatedAt: Date;
            teamId: string;
            role: import(".prisma/client").$Enums.TeamMemberRole;
            joinedAt: Date;
        })[];
        pendingInvites: {
            email: string;
            firstName: string | null;
            lastName: string | null;
            avatarUrl: string | null;
            id: string;
            jobTitle: string | null;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            role: import(".prisma/client").$Enums.TeamMemberRole;
            status: import(".prisma/client").$Enums.TeamInviteStatus;
            invitedById: string;
            inviteeUserId: string | null;
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
        avatarUrl: string | null;
        id: string;
        jobTitle: string | null;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        invitedById: string;
        inviteeUserId: string | null;
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
        avatarUrl: string | null;
        id: string;
        jobTitle: string | null;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    renderTeamInvitePage(inviteId: string): Promise<string>;
    acceptInvitation(userId: string, inviteId: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            id: string;
        };
    } & {
        id: string;
        userId: string;
        updatedAt: Date;
        teamId: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        joinedAt: Date;
    }>;
    declineInvitation(userId: string, inviteId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        id: string;
        jobTitle: string | null;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    cancelInvitation(userId: string, teamId: string, inviteId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        id: string;
        jobTitle: string | null;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    updateMemberRole(userId: string, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        teamId: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        joinedAt: Date;
    }>;
    removeMember(userId: string, id: string, memberId: string): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        teamId: string;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        joinedAt: Date;
    }>;
    private assertOwner;
    private getAccessiblePendingInvite;
    private expireStaleInvitationsForEmail;
    linkPendingInvitesToUser(userId: string, email: string): Promise<void>;
    private generateUniqueSlug;
}
