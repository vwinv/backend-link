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
        email: string | null;
        firstName: string;
        lastName: string;
        jobTitle: string | null;
        avatarUrl: string | null;
        id: string;
        slug: string;
        logoUrl: string | null;
        ownerId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        teamId: string | null;
        company: string | null;
        kind: import(".prisma/client").$Enums.CardKind;
        bio: string | null;
        website: string | null;
        coverImageUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        isPublic: boolean;
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
        platform: import(".prisma/client").$Enums.SocialPlatform;
        url: string;
        label: string | null;
        order: number;
        cardId: string;
    }[]>;
    getSocialLinks(userId: string, cardId: string): Promise<{
        id: string;
        createdAt: Date;
        platform: import(".prisma/client").$Enums.SocialPlatform;
        url: string;
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
