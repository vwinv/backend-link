import type { AuthUserPayload } from '../auth/decorators/current-user.decorator';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';
import { UnregisterPushTokenDto } from './dto/unregister-push-token.dto';
import { NotificationsService } from './notifications.service';
declare class NotificationsQueryDto {
    page?: number;
    limit?: number;
}
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    listMine(user: AuthUserPayload, query: NotificationsQueryDto): Promise<{
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
    unreadCount(user: AuthUserPayload): Promise<{
        count: number;
    }>;
    markRead(user: AuthUserPayload, id: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        userId: string;
        isRead: boolean;
        campaignId: string | null;
        body: string;
        readAt: Date | null;
    }>;
    markAllRead(user: AuthUserPayload): Promise<{
        updated: number;
    }>;
    registerToken(user: AuthUserPayload, dto: RegisterPushTokenDto): Promise<{
        id: string;
        token: string;
        updatedAt: Date;
        platform: import("@prisma/client").$Enums.PushPlatform;
    }>;
    unregisterToken(user: AuthUserPayload, dto: UnregisterPushTokenDto): Promise<{
        ok: boolean;
    }>;
}
export {};
