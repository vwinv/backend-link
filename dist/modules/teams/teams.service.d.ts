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
    findAllForUser(userId: string): Promise<{
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
    update(userId: string, id: string, dto: UpdateTeamDto): Promise<{
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
    remove(userId: string, id: string): Promise<{
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
    getMyInvitations(userId: string): Promise<({
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
    addMember(userId: string, id: string, dto: AddMemberDto): Promise<{
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
        teamId: string;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        userId: string;
        joinedAt: Date;
    }>;
    declineInvitation(userId: string, inviteId: string): Promise<{
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
    cancelInvitation(userId: string, teamId: string, inviteId: string): Promise<{
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
    updateMemberRole(userId: string, id: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        id: string;
        teamId: string;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        userId: string;
        joinedAt: Date;
    }>;
    removeMember(userId: string, id: string, memberId: string): Promise<{
        id: string;
        teamId: string;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        userId: string;
        joinedAt: Date;
    }>;
    private assertOwner;
    private assertOwnerOrAdmin;
    private getAccessiblePendingInvite;
    private expireStaleInvitationsForEmail;
    linkPendingInvitesToUser(userId: string, email: string): Promise<void>;
    private generateUniqueSlug;
}
