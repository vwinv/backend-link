import type { Response } from 'express';
import { ShareCardDto } from './dto/share-card.dto';
import { SharingService } from './sharing.service';
export declare class SharingController {
    private readonly sharingService;
    constructor(sharingService: SharingService);
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
    renderPublicCardPage(slug: string, res: Response): Promise<Response<any, Record<string, any>>>;
    recordPublicCardSave(slug: string): Promise<{
        ok: boolean;
    }>;
    shareCard(user: {
        userId: string;
    }, id: string, dto: ShareCardDto): Promise<{
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
}
