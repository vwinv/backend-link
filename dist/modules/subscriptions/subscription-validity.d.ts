import { Prisma, SubscriptionStatus } from '@prisma/client';
export declare const LIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[];
export declare function validSubscriptionWhere(extra?: Prisma.SubscriptionWhereInput, now?: Date): Prisma.SubscriptionWhereInput;
