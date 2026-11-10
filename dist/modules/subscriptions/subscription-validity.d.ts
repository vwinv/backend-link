import { OfferAudience, Prisma, SubscriptionStatus } from '@prisma/client';
export declare const LIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[];
export declare const CARD_OFFER_AUDIENCES: OfferAudience[];
export declare function isPortfolioAudience(audience: OfferAudience): boolean;
export declare function sameSubscriptionFamilyWhere(audience: OfferAudience): Prisma.SubscriptionWhereInput;
export declare function validSubscriptionWhere(extra?: Prisma.SubscriptionWhereInput, now?: Date): Prisma.SubscriptionWhereInput;
