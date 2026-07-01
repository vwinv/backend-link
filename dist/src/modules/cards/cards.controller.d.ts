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
        slug: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        company: string | null;
        ownerId: string;
        teamId: string | null;
        kind: import(".prisma/client").$Enums.CardKind;
        bio: string | null;
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
        slug: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        company: string | null;
        ownerId: string;
        teamId: string | null;
        kind: import(".prisma/client").$Enums.CardKind;
        bio: string | null;
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
        id: string;
        slug: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        company: string | null;
        ownerId: string;
        teamId: string | null;
        kind: import(".prisma/client").$Enums.CardKind;
        bio: string | null;
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
        slug: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        company: string | null;
        ownerId: string;
        teamId: string | null;
        kind: import(".prisma/client").$Enums.CardKind;
        bio: string | null;
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
        slug: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        jobTitle: string | null;
        company: string | null;
        ownerId: string;
        teamId: string | null;
        kind: import(".prisma/client").$Enums.CardKind;
        bio: string | null;
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
        url: string;
        id: string;
        createdAt: Date;
        platform: import(".prisma/client").$Enums.SocialPlatform;
        label: string | null;
        order: number;
        cardId: string;
    }[]>;
    getSocialLinks(user: {
        userId: string;
    }, id: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        platform: import(".prisma/client").$Enums.SocialPlatform;
        label: string | null;
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
    }, id: string): Promise<{
        views: number;
        shares: number;
        saved: number;
    }>;
}
