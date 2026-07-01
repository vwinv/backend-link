import { SubscribeDto } from './dto/subscribe.dto';
import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    getOffers(): Promise<{
        id: string;
        title: string;
        slug: string;
        subtitle: string | null;
        audience: import(".prisma/client").$Enums.OfferAudience;
        canCustomize: boolean;
        maxTeamMembers: number;
        hasPortfolio: boolean;
        maxAiScans: number;
        sortOrder: number;
        prices: {
            id: string;
            billingType: import(".prisma/client").$Enums.OfferBillingType;
            priceLabel: string | null;
            priceAmount: number;
            currency: string;
            discountPercent: number | null;
            badgeLabel: string | null;
            isPopular: boolean;
            sortOrder: number;
        }[];
    }[]>;
    getPlans(): Promise<{
        id: string;
        title: string;
        slug: string;
        subtitle: string | null;
        audience: import(".prisma/client").$Enums.OfferAudience;
        canCustomize: boolean;
        maxTeamMembers: number;
        hasPortfolio: boolean;
        maxAiScans: number;
        sortOrder: number;
        prices: {
            id: string;
            billingType: import(".prisma/client").$Enums.OfferBillingType;
            priceLabel: string | null;
            priceAmount: number;
            currency: string;
            discountPercent: number | null;
            badgeLabel: string | null;
            isPopular: boolean;
            sortOrder: number;
        }[];
    }[]>;
    getMySubscription(user: {
        userId: string;
    }): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        billingPeriod: import(".prisma/client").$Enums.BillingPeriod;
        planName: string;
        planSlug: string;
        offerTitle: string;
        offerSlug: string;
        billingType: import(".prisma/client").$Enums.OfferBillingType | null;
        entitlements: {
            audience: import(".prisma/client").$Enums.OfferAudience;
            canCustomize: boolean;
            maxTeamMembers: number;
            hasPortfolio: boolean;
            maxAiScans: number;
        };
        currentPeriodEnd: string | null;
    }>;
    getPlan(slug: string): {
        message: string;
        slug: string;
    };
    subscribe(user: {
        userId: string;
    }, dto: SubscribeDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        billingPeriod: import(".prisma/client").$Enums.BillingPeriod;
        planName: string;
        planSlug: string;
        offerTitle: string;
        offerSlug: string;
        billingType: import(".prisma/client").$Enums.OfferBillingType | null;
        entitlements: {
            audience: import(".prisma/client").$Enums.OfferAudience;
            canCustomize: boolean;
            maxTeamMembers: number;
            hasPortfolio: boolean;
            maxAiScans: number;
        };
        currentPeriodEnd: string | null;
    }>;
    cancel(): {
        message: string;
    };
    webhook(): {
        message: string;
    };
}
