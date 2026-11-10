import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { PointsService } from '../points/points.service';
import { EntitlementsService } from '../subscriptions/entitlements.service';
import { GuestContactDto } from './dto/guest-contact.dto';
import { ShareCardDto } from './dto/share-card.dto';
export declare class SharingService {
    private readonly prisma;
    private readonly configService;
    private readonly entitlementsService;
    private readonly pointsService;
    constructor(prisma: PrismaService, configService: ConfigService, entitlementsService: EntitlementsService, pointsService: PointsService);
    getShareQuota(userId: string): Promise<import("../subscriptions/entitlements.types").ShareQuota>;
    getPortfolioShareAccess(userId: string): Promise<{
        allowed: boolean;
        canShare: boolean;
        canCustomize: boolean;
        hasAnalytics: boolean;
        quota: import("../subscriptions/entitlements.types").ShareQuota;
    }>;
    private get appPublicUrl();
    getPublicCard(slug: string, viewerUserId?: string, meta?: {
        source?: string;
        userAgent?: string;
        ipAddress?: string;
    }): Promise<{
        slug: string;
        fullName: string;
        subtitle: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        website: string | null;
        avatarUrl: string | null;
        coverImageUrl: string | null;
        proDesignId: string;
        proDesignName: string;
        publicUrl: string;
        ogTitle: string;
        ogDescription: string;
        ogImageUrl: string;
    }>;
    renderPublicCardNotFoundPage(): string;
    renderPublicCardPage(slug: string, options?: {
        embed?: boolean;
        preview?: boolean;
        viewerUserId?: string;
        source?: string;
        userAgent?: string;
        ipAddress?: string;
    }): Promise<string | null>;
    renderPublicVCard(slug: string): Promise<string | null>;
    private vcardUrl;
    private resolveDownloadUrl;
    private appleAppStoreId;
    shareCard(userId: string, id: string, dto: ShareCardDto): Promise<{
        id: string;
        cardId: string;
        method: import("@prisma/client").$Enums.ShareMethod;
        createdAt: Date;
        quota: import("../subscriptions/entitlements.types").ShareQuota;
    }>;
    getQrCode(id: string): {
        message: string;
        id: string;
    };
    getShareLink(id: string): {
        message: string;
        id: string;
    };
    private normalizeViewSource;
    private recordCardView;
    saveGuestContact(slug: string, dto: GuestContactDto): Promise<{
        ok: boolean;
        viewId: string;
    }>;
    recordCardSave(slug: string, userId?: string): Promise<{
        ok: boolean;
    }>;
    private findPublicCard;
    private toPublicCardPayload;
    private toPublicSocialLinks;
    private normalizeWebsiteUrl;
    private buildSubtitle;
    private resolvePortraitUrl;
    private resolvePublicAssetUrl;
    private getBrandLogoUrl;
    private getOgImageUrl;
}
