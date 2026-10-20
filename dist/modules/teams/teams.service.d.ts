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
    findAllForUser(userId: string): Promise<{
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
    findOneForUser(userId: string, id: string): Promise<{
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
    update(userId: string, id: string, dto: UpdateTeamDto): Promise<{
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
    remove(userId: string, id: string): Promise<{
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
    getMembers(userId: string, id: string): Promise<{
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
    getMyInvitations(userId: string): Promise<({
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
    addMember(userId: string, id: string, dto: AddMemberDto): Promise<{
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
    private generateTemporaryPassword;
    renderTeamInvitePage(inviteId: string): Promise<string>;
    acceptInvitation(userId: string, inviteId: string): Promise<{
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
    declineInvitation(userId: string, inviteId: string): Promise<{
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
    cancelInvitation(userId: string, teamId: string, inviteId: string): Promise<{
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
    updateMemberRole(userId: string, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        joinedAt: Date;
    }>;
    removeMember(userId: string, id: string, memberId: string): Promise<{
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        updatedAt: Date;
        teamId: string;
        joinedAt: Date;
    }>;
    private assertOwner;
    private assertOwnerOrAdmin;
    private getAccessiblePendingInvite;
    private expireStaleInvitationsForEmail;
    linkPendingInvitesToUser(userId: string, email: string): Promise<void>;
    private generateUniqueSlug;
}
