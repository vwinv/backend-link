import type { AuthUserPayload } from '../auth/decorators/current-user.decorator';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';
import { UnregisterPushTokenDto } from './dto/unregister-push-token.dto';
import { NotificationsService } from './notifications.service';
import { PushProgramService } from './push-program.service';
declare class HeartbeatDto {
    timezone?: string;
}
declare class NotificationsQueryDto {
    page?: number;
    limit?: number;
}
export declare class NotificationsController {
    private readonly notificationsService;
    private readonly pushProgramService;
    constructor(notificationsService: NotificationsService, pushProgramService: PushProgramService);
    listMine(user: AuthUserPayload, query: NotificationsQueryDto): Promise<{
        data: {
            id: string;
            createdAt: Date;
            title: string;
            isRead: boolean;
            body: string;
            campaignId: string | null;
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
        userId: string;
        createdAt: Date;
        title: string;
        isRead: boolean;
        body: string;
        campaignId: string | null;
        readAt: Date | null;
    }>;
    markAllRead(user: AuthUserPayload): Promise<{
        updated: number;
    }>;
    heartbeat(user: AuthUserPayload, dto: HeartbeatDto): Promise<{
        id: string;
        timezone: string;
        lastOpenedAt: Date | null;
    }>;
    registerToken(user: AuthUserPayload, dto: RegisterPushTokenDto): Promise<{
        token: string;
        id: string;
        updatedAt: Date;
        platform: import("@prisma/client").$Enums.PushPlatform;
    }>;
    unregisterToken(user: AuthUserPayload, dto: UnregisterPushTokenDto): Promise<{
        ok: boolean;
    }>;
}
export {};
