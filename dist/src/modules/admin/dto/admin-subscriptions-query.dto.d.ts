import { SubscriptionStatus } from '@prisma/client';
export declare class AdminSubscriptionsQueryDto {
    search?: string;
    status?: SubscriptionStatus;
    offerId?: string;
    page?: number;
    limit?: number;
}
