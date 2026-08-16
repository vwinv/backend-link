import { SubscriptionStatus } from '@prisma/client';
export declare class UpdateAdminSubscriptionDto {
    offerId?: string;
    offerPriceId?: string;
    status?: SubscriptionStatus;
    teamId?: string;
    purchasedSeats?: number;
    currentPeriodEnd?: string;
}
