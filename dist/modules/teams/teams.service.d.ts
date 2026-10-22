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
    private readonly logger;
    constructor(prisma: PrismaService, entitlementsService: EntitlementsService, mailService: MailService, cardsService: CardsService, configService: ConfigService, uploadsService: UploadsService);
    private get appPublicUrl();
    private formatUserName;
    create(userId: string, dto: CreateTeamDto): Promise<{
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        brandColor: string | null;
        ownerId: string;
    }>;
    private notifyOwnerDashboardReady;
    findAllForUser(userId: string): Promise<{
        entitlements: import("../subscriptions/entitlements.types").UserEntitlements;
        name: string;
        isActive: boolean;
        id: string;
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
            role: import("@prisma/client").$Enums.TeamMemberRole;
            id: string;
            userId: string;
            teamId: string;
            updatedAt: Date;
            joinedAt: Date;
        })[];
        name: string;
        isActive: boolean;
        id: string;
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
        isActive: boolean;
        id: string;
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
        isActive: boolean;
        id: string;
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
            role: import("@prisma/client").$Enums.TeamMemberRole;
            id: string;
            userId: string;
            teamId: string;
            updatedAt: Date;
            joinedAt: Date;
        })[];
        pendingInvites: {
            role: import("@prisma/client").$Enums.TeamMemberRole;
            status: import("@prisma/client").$Enums.TeamInviteStatus;
            id: string;
            teamId: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string | null;
            lastName: string | null;
            avatarUrl: string | null;
            jobTitle: string | null;
            invitedById: string;
            inviteeUserId: string | null;
            expiresAt: Date | null;
            respondedAt: Date | null;
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
        role: import("@prisma/client").$Enums.TeamMemberRole;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        id: string;
        teamId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    })[]>;
    addMember(userId: string, id: string, dto: AddMemberDto): Promise<{
        team: {
            name: string;
            id: string;
            logoUrl: string | null;
            brandColor: string | null;
        };
    } & {
        role: import("@prisma/client").$Enums.TeamMemberRole;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        id: string;
        teamId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
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
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        };
    } & {
        role: import("@prisma/client").$Enums.TeamMemberRole;
        id: string;
        userId: string;
        teamId: string;
        updatedAt: Date;
        joinedAt: Date;
    }>;
    declineInvitation(userId: string, inviteId: string): Promise<{
        role: import("@prisma/client").$Enums.TeamMemberRole;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        id: string;
        teamId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    cancelInvitation(userId: string, teamId: string, inviteId: string): Promise<{
        role: import("@prisma/client").$Enums.TeamMemberRole;
        status: import("@prisma/client").$Enums.TeamInviteStatus;
        id: string;
        teamId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        invitedById: string;
        inviteeUserId: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
    }>;
    updateMemberRole(userId: string, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        role: import("@prisma/client").$Enums.TeamMemberRole;
        id: string;
        userId: string;
        teamId: string;
        updatedAt: Date;
        joinedAt: Date;
    }>;
    removeMember(userId: string, id: string, memberId: string): Promise<{
        role: import("@prisma/client").$Enums.TeamMemberRole;
        id: string;
        userId: string;
        teamId: string;
        updatedAt: Date;
        joinedAt: Date;
    }>;
    private assertOwner;
    private assertOwnerOrAdmin;
    private getAccessiblePendingInvite;
    private expireStaleInvitationsForEmail;
    linkPendingInvitesToUser(userId: string, email: string): Promise<void>;
    private generateUniqueSlug;
}
