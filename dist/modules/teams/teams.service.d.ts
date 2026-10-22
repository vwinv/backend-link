import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CardsService } from '../cards/cards.service';
import { MailService } from '../mail/mail.service';
import { EntitlementsService } from '../subscriptions/entitlements.service';
import { UploadsService } from '../uploads/uploads.service';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
export declare class TeamsService {
    private readonly prisma;
    private readonly entitlementsService;
    private readonly mailService;
    private readonly cardsService;
    private readonly configService;
    private readonly uploadsService;
    constructor(prisma: PrismaService, entitlementsService: EntitlementsService, mailService: MailService, cardsService: CardsService, configService: ConfigService, uploadsService: UploadsService);
    private get appPublicUrl();
    private formatUserName;
    create(userId: string, dto: CreateTeamDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        ownerId: string;
        logoUrl: string | null;
        description: string | null;
        brandColor: string | null;
    }>;
    findAllForUser(userId: string): Promise<{
        entitlements: import("../subscriptions/entitlements.types").UserEntitlements;
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        ownerId: string;
        logoUrl: string | null;
        description: string | null;
        brandColor: string | null;
    }[]>;
    findOneForUser(userId: string, id: string): Promise<{
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
        logoUrl: string | null;
        description: string | null;
        brandColor: string | null;
    }>;
    update(userId: string, id: string, dto: UpdateTeamDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        ownerId: string;
        logoUrl: string | null;
        description: string | null;
        brandColor: string | null;
    }>;
    remove(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        ownerId: string;
        logoUrl: string | null;
        description: string | null;
        brandColor: string | null;
    }>;
    getMembers(userId: string, id: string): Promise<{
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
            userId: string;
            teamId: string;
            updatedAt: Date;
            role: import("@prisma/client").$Enums.TeamMemberRole;
            joinedAt: Date;
        })[];
        pendingInvites: {
            id: string;
            createdAt: Date;
            teamId: string;
            status: import("@prisma/client").$Enums.TeamInviteStatus;
            updatedAt: Date;
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
    getMyInvitations(userId: string): Promise<({
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
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        updatedAt: Date;
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
    addMember(userId: string, id: string, dto: AddMemberDto): Promise<{
        team: {
            id: string;
            name: string;
            logoUrl: string | null;
            brandColor: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        updatedAt: Date;
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
    private generateTemporaryPassword;
    renderTeamInvitePage(inviteId: string): Promise<string>;
    acceptInvitation(userId: string, inviteId: string): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        userId: string;
        teamId: string;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        joinedAt: Date;
    }>;
    declineInvitation(userId: string, inviteId: string): Promise<{
        id: string;
        createdAt: Date;
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        updatedAt: Date;
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
    cancelInvitation(userId: string, teamId: string, inviteId: string): Promise<{
        id: string;
        createdAt: Date;
        teamId: string;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        updatedAt: Date;
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
    updateMemberRole(userId: string, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        id: string;
        userId: string;
        teamId: string;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        joinedAt: Date;
    }>;
    removeMember(userId: string, id: string, memberId: string): Promise<{
        id: string;
        userId: string;
        teamId: string;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        joinedAt: Date;
    }>;
    private assertOwner;
    private assertOwnerOrAdmin;
    private getAccessiblePendingInvite;
    private expireStaleInvitationsForEmail;
    linkPendingInvitesToUser(userId: string, email: string): Promise<void>;
    private generateUniqueSlug;
}
