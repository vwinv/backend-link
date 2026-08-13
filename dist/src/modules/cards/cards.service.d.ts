import { BusinessCard } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { SocialLinkItemDto } from './dto/social-link-item.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { UpdateCardThemeDto } from './dto/update-card-theme.dto';
import { ContactsService } from '../contacts/contacts.service';
import { EntitlementsService } from '../subscriptions/entitlements.service';
export declare class CardsService {
    private readonly prisma;
    private readonly contactsService;
    private readonly entitlementsService;
    constructor(prisma: PrismaService, contactsService: ContactsService, entitlementsService: EntitlementsService);
    create(userId: string, dto: CreateCardDto): Promise<BusinessCard>;
    findAll(userId: string): Promise<{
        id: string;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        jobTitle: string | null;
        teamId: string | null;
        slug: string;
        ownerId: string;
        kind: import("@prisma/client").$Enums.CardKind;
        company: string | null;
        bio: string | null;
        website: string | null;
        coverImageUrl: string | null;
        logoUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        isPublic: boolean;
    }[]>;
    findOne(userId: string, id: string): Promise<BusinessCard>;
    update(userId: string, id: string, dto: UpdateCardDto): Promise<BusinessCard>;
    updateTheme(userId: string, id: string, dto: UpdateCardThemeDto): Promise<BusinessCard>;
    private syncTeamMemberCardsVisuals;
    remove(id: string): {
        message: string;
        id: string;
    };
    syncSocialLinks(userId: string, cardId: string, links: SocialLinkItemDto[]): Promise<{
        id: string;
        createdAt: Date;
        label: string | null;
        platform: import("@prisma/client").$Enums.SocialPlatform;
        url: string;
        order: number;
        cardId: string;
    }[]>;
    getSocialLinks(userId: string, cardId: string): Promise<{
        id: string;
        createdAt: Date;
        label: string | null;
        platform: import("@prisma/client").$Enums.SocialPlatform;
        url: string;
        order: number;
        cardId: string;
    }[]>;
    addSocialLink(id: string): {
        message: string;
        id: string;
    };
    removeSocialLink(id: string, linkId: string): {
        message: string;
        id: string;
        linkId: string;
    };
    getAnalytics(userId: string, id: string, options?: {
        days?: number;
        from?: string;
        to?: string;
    }): Promise<{
        views: number;
        shares: number;
        saved: number;
        uniqueVisitors: number;
        periodDays: number;
        periodViews: number;
        previousPeriodViews: number;
        viewsChangePercent: number;
        viewsSeries: {
            date: string;
            label: string;
            count: number;
        }[];
        sources: {
            key: "link" | "qr" | "share" | "nfc" | "app" | "other";
            count: number;
            percent: number;
        }[];
        sparklines: {
            views: number[];
            uniqueVisitors: number[];
            saved: number[];
            shares: number[];
        };
    }>;
    private resolveAnalyticsPeriod;
    private toDayKey;
    private toWeekdayLabel;
    private toShortDateLabel;
    private normalizeAnalyticsSource;
    getVisitors(userId: string, id: string, filter?: 'all' | 'dropone' | 'guest'): Promise<{
        summary: {
            views: number;
            uniqueVisitors: number;
            saved: number;
            shares: number;
            dropOneCount: number;
            guestCount: number;
        };
        visitors: {
            id: string;
            viewedAt: string;
            isDropOneUser: boolean;
            source: string;
            displayName: string;
            subtitle: string;
            avatarUrl: string | null;
            initials: string;
            viewerUserId: string | null;
            viewerCardSlug: string | null;
            hasSaved: boolean;
            hasShared: boolean;
            durationSeconds: number | null;
            locationLabel: string | null;
            deviceLabel: string | null;
        }[];
    }>;
    private parseDeviceLabel;
    findSharedWithMe(userId: string): Promise<{
        id: string;
        source: import("@prisma/client").$Enums.ContactSource;
        fullName: string;
        initials: string;
        subtitle: string;
        email: string | null;
        phone: string | null;
        jobTitle: string | null;
        company: string | null;
        linkedCardId: string | null;
        linkedCardSlug: string | null;
        avatarUrl: string | null;
        avatarColor: number;
        addedAgo: string;
        sharedAgo: string;
        createdAt: string;
    }[]>;
    private optionalString;
    private generateUniqueSlug;
}
