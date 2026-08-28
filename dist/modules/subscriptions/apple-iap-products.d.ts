import { OfferBillingType } from '@prisma/client';
export type AppleIapProductRef = {
    offerSlug: string;
    billingType: OfferBillingType;
    productId: string;
};
export declare function loadAppleIapProductMap(jsonOverride?: string): Map<string, string>;
export declare function appleProductIdFor(products: Map<string, string>, offerSlug: string, billingType: OfferBillingType): string | null;
export declare function appleProductRefsFromId(products: Map<string, string>, productId: string): AppleIapProductRef[];
export declare function appleProductRefFromId(products: Map<string, string>, productId: string): AppleIapProductRef | null;
export declare function allAppleProductIds(products: Map<string, string>): string[];
