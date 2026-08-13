import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { SyncSocialLinksDto } from './dto/sync-social-links.dto';
import { UpdateCardThemeDto } from './dto/update-card-theme.dto';
import { CardsService } from './cards.service';
export declare class CardsController {
    private readonly cardsService;
    constructor(cardsService: CardsService);
    create(user: {
        userId: string;
    }, dto: CreateCardDto): Promise<{
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
        address: string | null;
        website: string | null;
        coverImageUrl: string | null;
        logoUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        isPublic: boolean;
    }>;
    findAll(user: {
        userId: string;
    }): Promise<{
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
        address: string | null;
        website: string | null;
        coverImageUrl: string | null;
        logoUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        isPublic: boolean;
    }[]>;
    findSharedWithMe(user: {
        userId: string;
    }): Promise<{
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
    findOne(user: {
        userId: string;
    }, id: string): Promise<{
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
        address: string | null;
        website: string | null;
        coverImageUrl: string | null;
        logoUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        isPublic: boolean;
    }>;
    update(user: {
        userId: string;
    }, id: string, dto: UpdateCardDto): Promise<{
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
        address: string | null;
        website: string | null;
        coverImageUrl: string | null;
        logoUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        isPublic: boolean;
    }>;
    updateTheme(user: {
        userId: string;
    }, id: string, dto: UpdateCardThemeDto): Promise<{
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
        address: string | null;
        website: string | null;
        coverImageUrl: string | null;
        logoUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        isPublic: boolean;
    }>;
    remove(id: string): {
        message: string;
        id: string;
    };
    syncSocialLinks(user: {
        userId: string;
    }, id: string, dto: SyncSocialLinksDto): Promise<{
        id: string;
        createdAt: Date;
        label: string | null;
        platform: import("@prisma/client").$Enums.SocialPlatform;
        url: string;
        order: number;
        cardId: string;
    }[]>;
    getSocialLinks(user: {
        userId: string;
    }, id: string): Promise<{
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
    getAnalytics(user: {
        userId: string;
    }, id: string, days?: string, from?: string, to?: string): Promise<{
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
    getVisitors(user: {
        userId: string;
    }, id: string, filter?: string): Promise<{
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
}
