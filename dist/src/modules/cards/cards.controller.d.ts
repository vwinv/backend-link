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
        firstName: string;
        lastName: string;
        email: string | null;
        phone: string | null;
        jobTitle: string | null;
        company: string | null;
        id: string;
        slug: string;
        ownerId: string;
        teamId: string | null;
        bio: string | null;
        website: string | null;
        avatarUrl: string | null;
        coverImageUrl: string | null;
        logoUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        isPublic: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        kind: import(".prisma/client").$Enums.CardKind;
    }>;
    findAll(user: {
        userId: string;
    }): Promise<{
        firstName: string;
        lastName: string;
        email: string | null;
        phone: string | null;
        jobTitle: string | null;
        company: string | null;
        id: string;
        slug: string;
        ownerId: string;
        teamId: string | null;
        bio: string | null;
        website: string | null;
        avatarUrl: string | null;
        coverImageUrl: string | null;
        logoUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        isPublic: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        kind: import(".prisma/client").$Enums.CardKind;
    }[]>;
    findSharedWithMe(user: {
        userId: string;
    }): Promise<{
        id: string;
        source: import(".prisma/client").$Enums.ContactSource;
        fullName: string;
        initials: string;
        subtitle: string;
        email: string | null;
        phone: string | null;
        jobTitle: string | null;
        company: string | null;
        linkedCardId: string | null;
        avatarColor: number;
        addedAgo: string;
        sharedAgo: string;
        createdAt: string;
    }[]>;
    findOne(user: {
        userId: string;
    }, id: string): Promise<{
        firstName: string;
        lastName: string;
        email: string | null;
        phone: string | null;
        jobTitle: string | null;
        company: string | null;
        id: string;
        slug: string;
        ownerId: string;
        teamId: string | null;
        bio: string | null;
        website: string | null;
        avatarUrl: string | null;
        coverImageUrl: string | null;
        logoUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        isPublic: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        kind: import(".prisma/client").$Enums.CardKind;
    }>;
    update(user: {
        userId: string;
    }, id: string, dto: UpdateCardDto): Promise<{
        firstName: string;
        lastName: string;
        email: string | null;
        phone: string | null;
        jobTitle: string | null;
        company: string | null;
        id: string;
        slug: string;
        ownerId: string;
        teamId: string | null;
        bio: string | null;
        website: string | null;
        avatarUrl: string | null;
        coverImageUrl: string | null;
        logoUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        isPublic: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        kind: import(".prisma/client").$Enums.CardKind;
    }>;
    updateTheme(user: {
        userId: string;
    }, id: string, dto: UpdateCardThemeDto): Promise<{
        firstName: string;
        lastName: string;
        email: string | null;
        phone: string | null;
        jobTitle: string | null;
        company: string | null;
        id: string;
        slug: string;
        ownerId: string;
        teamId: string | null;
        bio: string | null;
        website: string | null;
        avatarUrl: string | null;
        coverImageUrl: string | null;
        logoUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        isPublic: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        kind: import(".prisma/client").$Enums.CardKind;
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
        order: number;
        cardId: string;
        platform: import(".prisma/client").$Enums.SocialPlatform;
        label: string | null;
        url: string;
    }[]>;
    getSocialLinks(user: {
        userId: string;
    }, id: string): Promise<{
        id: string;
        createdAt: Date;
        order: number;
        cardId: string;
        platform: import(".prisma/client").$Enums.SocialPlatform;
        label: string | null;
        url: string;
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
    }, id: string): Promise<{
        views: number;
        shares: number;
        saved: number;
    }>;
}
