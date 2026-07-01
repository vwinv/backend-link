import { PrismaService } from '../../prisma/prisma.service';
import { SubscribeDto } from './dto/subscribe.dto';
export declare class SubscriptionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    getPlan(slug: string): {
        message: string;
        slug: string;
    };
    getMySubscription(userId: string): Promise<{
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
    subscribe(userId: string, dto: SubscribeDto): Promise<{
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
    handleWebhook(): {
        message: string;
    };
    private ensurePremiumPlan;
    private buildPlanFeatures;
    private findActiveSubscription;
    private mapBillingPeriod;
    private computePeriodEnd;
    private toSubscriptionResponse;
    private toEntitlementsResponse;
    private toOfferResponse;
    private toOfferPriceResponse;
}
