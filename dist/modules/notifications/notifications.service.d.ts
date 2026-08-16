import { PushPlatform } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
        token: string;
        updatedAt: Date;
        platform: import("@prisma/client").$Enums.PushPlatform;
    }>;
    unregisterPushToken(userId: string, token: string): Promise<{
        ok: boolean;
    }>;
}
