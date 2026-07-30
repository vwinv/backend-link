import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CardsService } from '../cards/cards.service';
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
    private readonly cardsService;
    private readonly configService;
    constructor(prisma: PrismaService, entitlementsService: EntitlementsService, mailService: MailService, cardsService: CardsService, configService: ConfigService);
    private get appPublicUrl();
    private formatUserName;
    create(userId: string, dto: CreateTeamDto): Promise<{
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
    }>;
    findAllForUser(userId: string): Promise<{
        entitlements: import("../subscriptions/entitlements.types").UserEntitlements;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
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
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
    }>;
    update(userId: string, id: string, dto: UpdateTeamDto): Promise<{
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
    }>;
    remove(userId: string, id: string): Promise<{
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        ownerId: string;
        logoUrl: string | null;
        brandColor: string | null;
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
            firstName: string | null;
            lastName: string | null;
            avatarUrl: string | null;
            role: import(".prisma/client").$Enums.TeamMemberRole;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.TeamInviteStatus;
            inviteeUserId: string | null;
            jobTitle: string | null;
            expiresAt: Date | null;
            respondedAt: Date | null;
            teamId: string;
            invitedById: string;
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
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        jobTitle: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
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
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        jobTitle: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
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
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        jobTitle: string | null;
        expiresAt: Date | null;
        respondedAt: Date | null;
        teamId: string;
        invitedById: string;
    }>;
    cancelInvitation(userId: string, teamId: string, inviteId: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TeamInviteStatus;
        inviteeUserId: string | null;
        jobTitle: string | null;
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
    private assertOwnerOrAdmin;
    private getAccessiblePendingInvite;
    private expireStaleInvitationsForEmail;
    linkPendingInvitesToUser(userId: string, email: string): Promise<void>;
    private generateUniqueSlug;
}
