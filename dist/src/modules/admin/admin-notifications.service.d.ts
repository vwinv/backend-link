import { FcmPushService } from '../notifications/fcm-push.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminNotificationsQueryDto } from './dto/admin-notifications-query.dto';
import { CreateNotificationCampaignDto } from './dto/create-notification-campaign.dto';
export declare class AdminNotificationsService {
    private readonly prisma;
    private readonly fcmPushService;
    private readonly logger;
    constructor(prisma: PrismaService, fcmPushService: FcmPushService);
    getStats(): Promise<{
        campaigns: number;
        sent: number;
        failed: number;
        delivered: number;
        unread: number;
        pushTokens: number;
    }>;
    list(query: AdminNotificationsQueryDto): Promise<{
        data: {
            id: string;
            title: string;
            body: string;
            audience: import("@prisma/client").$Enums.NotificationAudience;
            userIds: string[];
            status: import("@prisma/client").$Enums.NotificationCampaignStatus;
            targetCount: number;
            deliveredCount: number;
            readCount: number;
            pushAttempted: number;
            errorMessage: string | null;
            createdAt: Date;
            sentAt: Date | null;
            updatedAt: Date;
            createdBy: {
                id: string;
                email: string;
                name: string;
            } | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        title: string;
        body: string;
        audience: import("@prisma/client").$Enums.NotificationAudience;
        userIds: string[];
        status: import("@prisma/client").$Enums.NotificationCampaignStatus;
        targetCount: number;
        deliveredCount: number;
        readCount: number;
        pushAttempted: number;
        errorMessage: string | null;
        createdAt: Date;
        sentAt: Date | null;
        updatedAt: Date;
        createdBy: {
            id: string;
            email: string;
            name: string;
        } | null;
    }>;
    createAndSend(dto: CreateNotificationCampaignDto, actorUserId: string): Promise<{
        id: string;
        title: string;
        body: string;
        audience: import("@prisma/client").$Enums.NotificationAudience;
        userIds: string[];
        status: import("@prisma/client").$Enums.NotificationCampaignStatus;
        targetCount: number;
        deliveredCount: number;
        readCount: number;
        pushAttempted: number;
        errorMessage: string | null;
        createdAt: Date;
        sentAt: Date | null;
        updatedAt: Date;
        createdBy: {
            id: string;
            email: string;
            name: string;
        } | null;
    }>;
    private resolveAudience;
    private toCampaignDto;
}
