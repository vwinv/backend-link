import { NotificationAudience } from '@prisma/client';
export declare class CreateNotificationCampaignDto {
    title: string;
    body: string;
    titleEn?: string;
    bodyEn?: string;
    audience: NotificationAudience;
    userIds?: string[];
}
