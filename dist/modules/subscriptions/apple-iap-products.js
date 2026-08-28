"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAppleIapProductMap = loadAppleIapProductMap;
exports.appleProductIdFor = appleProductIdFor;
exports.appleProductRefsFromId = appleProductRefsFromId;
exports.appleProductRefFromId = appleProductRefFromId;
exports.allAppleProductIds = allAppleProductIds;
const client_1 = require("@prisma/client");
const DEFAULT_APPLE_IAP_PRODUCTS = {
    'link-premium:MONTHLY': 'com.mega.dropone.premium.monthly',
    'link-premium:YEARLY': 'com.mega.dropone.premium.yearly',
    'link-premium:LIFETIME': 'com.mega.dropone.premium.lifetime',
    'link-premium-plus:MONTHLY': 'com.mega.dropone.premiumplus.monthly',
    'link-premium-plus:YEARLY': 'com.mega.dropone.premiumplus.yearly',
    'link-premium-plus:LIFETIME': 'com.mega.dropone.premiumplus.lifetime',
    'link-premium-equipe:MONTHLY': 'com.mega.dropone.team.monthly',
    'link-premium-equipe:YEARLY': 'com.mega.dropone.team.yearly',
    'link-premium-equipe:LIFETIME': 'com.mega.dropone.team.lifetime',
    'link-entreprise-business:MONTHLY': 'com.mega.dropone.business.monthly',
    'link-entreprise-business:YEARLY': 'com.mega.dropone.business.yearly',
    'link-entreprise-business:LIFETIME': 'com.mega.dropone.business.lifetime',
    'drop-one-plus:MONTHLY': 'com.mega.dropone.premium.monthly',
    'drop-one-plus:YEARLY': 'com.mega.dropone.premium.yearly',
    'drop-one-plus:LIFETIME': 'com.mega.dropone.premium.lifetime',
    'drop-one-premium:MONTHLY': 'com.mega.dropone.premiumplus.monthly',
    'drop-one-premium:YEARLY': 'com.mega.dropone.premiumplus.yearly',
    'drop-one-premium:LIFETIME': 'com.mega.dropone.premiumplus.lifetime',
    'drop-one-business:MONTHLY': 'com.mega.dropone.business.monthly',
    'drop-one-business:YEARLY': 'com.mega.dropone.business.yearly',
    'drop-one-business:LIFETIME': 'com.mega.dropone.business.lifetime',
};
function productKey(offerSlug, billingType) {
    return `${offerSlug}:${billingType}`;
}
function loadAppleIapProductMap(jsonOverride) {
    const map = new Map(Object.entries(DEFAULT_APPLE_IAP_PRODUCTS));
    const raw = jsonOverride?.trim();
    if (!raw)
        return map;
    try {
        const parsed = JSON.parse(raw);
        for (const [key, value] of Object.entries(parsed)) {
            if (typeof value === 'string' && value.trim()) {
                map.set(key, value.trim());
            }
        }
    }
    catch {
    }
    return map;
}
function appleProductIdFor(products, offerSlug, billingType) {
    return products.get(productKey(offerSlug, billingType)) ?? null;
}
function appleProductRefsFromId(products, productId) {
    const wanted = productId.trim();
    const refs = [];
    for (const [key, id] of products.entries()) {
        if (id !== wanted)
            continue;
        const [offerSlug, billingType] = key.split(':');
        if (offerSlug &&
            (billingType === client_1.OfferBillingType.MONTHLY ||
                billingType === client_1.OfferBillingType.YEARLY ||
                billingType === client_1.OfferBillingType.LIFETIME)) {
            refs.push({ offerSlug, billingType, productId: id });
        }
    }
    return refs;
}
function appleProductRefFromId(products, productId) {
    return appleProductRefsFromId(products, productId)[0] ?? null;
}
function allAppleProductIds(products) {
    return [...new Set(products.values())];
}
//# sourceMappingURL=apple-iap-products.js.map