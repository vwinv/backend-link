import { BusinessCard } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { SocialLinkItemDto } from './dto/social-link-item.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { UpdateCardThemeDto } from './dto/update-card-theme.dto';
import { ContactsService } from '../contacts/contacts.service';
export declare class CardsService {
    private readonly prisma;
    private readonly contactsService;
    constructor(prisma: PrismaService, contactsService: ContactsService);
    create(userId: string, dto: CreateCardDto): Promise<BusinessCard>;
    findAll(userId: string): Promise<{
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
    findOne(userId: string, id: string): Promise<BusinessCard>;
    update(userId: string, id: string, dto: UpdateCardDto): Promise<BusinessCard>;
    updateTheme(userId: string, id: string, dto: UpdateCardThemeDto): Promise<BusinessCard>;
    remove(id: string): {
        message: string;
        id: string;
    };
    syncSocialLinks(userId: string, cardId: string, links: SocialLinkItemDto[]): Promise<{
        id: string;
        createdAt: Date;
        order: number;
        cardId: string;
        platform: import(".prisma/client").$Enums.SocialPlatform;
        label: string | null;
        url: string;
    }[]>;
    getSocialLinks(userId: string, cardId: string): Promise<{
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
    getAnalytics(userId: string, id: string): Promise<{
        views: number;
        shares: number;
        saved: number;
    }>;
    findSharedWithMe(userId: string): Promise<{
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
    private optionalString;
    private generateUniqueSlug;
}
