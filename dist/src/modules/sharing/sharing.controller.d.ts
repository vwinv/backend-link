import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ShareCardDto } from './dto/share-card.dto';
import { SharingService } from './sharing.service';
export declare class SharingController {
    private readonly sharingService;
    private readonly jwtService;
    constructor(sharingService: SharingService, jwtService: JwtService);
    private resolveViewerUserId;
    private resolveViewMeta;
    getPublicCard(slug: string, req: Request): Promise<{
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
    renderPublicCardPage(slug: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    recordPublicCardSave(slug: string, req: Request): Promise<{
        ok: boolean;
    }>;
    shareCard(user: {
        userId: string;
    }, id: string, dto: ShareCardDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        method: import(".prisma/client").$Enums.ShareMethod;
        cardId: string;
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
