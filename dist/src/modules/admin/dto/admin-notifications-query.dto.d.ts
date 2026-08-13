import { NotificationCampaignStatus } from '@prisma/client';
export declare class AdminNotificationsQueryDto {
    search?: string;
    status?: NotificationCampaignStatus;
    page?: number;
    limit?: number;
}
