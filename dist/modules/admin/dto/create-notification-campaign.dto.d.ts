import { NotificationAudience, NotificationRecurrence } from '@prisma/client';
export declare class CreateNotificationCampaignDto {
    title: string;
    body: string;
    titleEn?: string;
    bodyEn?: string;
    audience: NotificationAudience;
    userIds?: string[];
    scheduledAt?: string;
    recurrence?: NotificationRecurrence;
    recurrenceEndsAt?: string;
    maxOccurrences?: number;
}
