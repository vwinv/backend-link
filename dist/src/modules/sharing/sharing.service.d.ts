import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ShareCardDto } from './dto/share-card.dto';
export declare class SharingService {
    private readonly prisma;
    private readonly configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    private get appPublicUrl();
    getPublicCard(slug: string): Promise<{
        slug: string;
        fullName: string;
        subtitle: string;
        email: string | null;
        phone: string | null;
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
    }): Promise<string | null>;
    shareCard(userId: string, id: string, dto: ShareCardDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        cardId: string;
        method: import(".prisma/client").$Enums.ShareMethod;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }>;
    getQrCode(id: string): {
        message: string;
        id: string;
    };
    getShareLink(id: string): {
        message: string;
        id: string;
    };
    private recordCardView;
    recordCardSave(slug: string, userId?: string): Promise<{
        ok: boolean;
    }>;
    private findPublicCard;
    private toPublicCardPayload;
    private buildSubtitle;
    private resolvePortraitUrl;
    private resolvePublicAssetUrl;
    private getBrandLogoUrl;
    private getOgImageUrl;
}
