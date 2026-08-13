import { SubscriptionStatus } from '@prisma/client';
export declare class CreateAdminSubscriptionDto {
    userId: string;
    offerId: string;
    offerPriceId: string;
    status?: SubscriptionStatus;
    teamId?: string;
    purchasedSeats?: number;
    currentPeriodEnd?: string;
}
