import { NotificationAudience } from '@prisma/client';
export declare class CreateNotificationCampaignDto {
    title: string;
    body: string;
    audience: NotificationAudience;
    userIds?: string[];
}
