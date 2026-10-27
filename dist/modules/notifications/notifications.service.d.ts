import { PushPlatform } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FcmPushService } from './fcm-push.service';
export declare class NotificationsService {
    private readonly prisma;
    private readonly fcmPushService;
    private readonly logger;
    constructor(prisma: PrismaService, fcmPushService: FcmPushService);
    listMine(userId: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            title: string;
            createdAt: Date;
            isRead: boolean;
            campaignId: string | null;
            body: string;
            readAt: Date | null;
        }[];
        meta: {
            total: number;
            unreadCount: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    unreadCount(userId: string): Promise<{
        count: number;
    }>;
    markRead(userId: string, id: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        userId: string;
        isRead: boolean;
        campaignId: string | null;
        body: string;
        readAt: Date | null;
    }>;
    markAllRead(userId: string): Promise<{
        updated: number;
    }>;
    registerPushToken(userId: string, token: string, platform: PushPlatform): Promise<{
        id: string;
        updatedAt: Date;
        token: string;
        platform: import("@prisma/client").$Enums.PushPlatform;
    }>;
    unregisterPushToken(userId: string, token: string): Promise<{
        ok: boolean;
    }>;
    notifyUser(input: {
        userId: string;
        title: string;
        body: string;
        data?: Record<string, string>;
    }): Promise<void>;
}
