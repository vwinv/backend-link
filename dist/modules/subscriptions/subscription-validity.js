"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CARD_OFFER_AUDIENCES = exports.LIVE_SUBSCRIPTION_STATUSES = void 0;
exports.isPortfolioAudience = isPortfolioAudience;
exports.sameSubscriptionFamilyWhere = sameSubscriptionFamilyWhere;
exports.validSubscriptionWhere = validSubscriptionWhere;
const client_1 = require("@prisma/client");
exports.LIVE_SUBSCRIPTION_STATUSES = [
    client_1.SubscriptionStatus.TRIAL,
    client_1.SubscriptionStatus.ACTIVE,
    client_1.SubscriptionStatus.PAST_DUE,
];
exports.CARD_OFFER_AUDIENCES = [
    client_1.OfferAudience.PERSONAL,
    client_1.OfferAudience.TEAM,
];
function isPortfolioAudience(audience) {
    return audience === client_1.OfferAudience.PORTFOLIO;
}
function sameSubscriptionFamilyWhere(audience) {
    if (isPortfolioAudience(audience)) {
        return { offer: { audience: client_1.OfferAudience.PORTFOLIO } };
    }
    return {
        OR: [
            { offer: { audience: { in: exports.CARD_OFFER_AUDIENCES } } },
            { offerId: null },
        ],
    };
}
function validSubscriptionWhere(extra = {}, now = new Date()) {
    return {
        AND: [
            extra,
            {
                status: { in: exports.LIVE_SUBSCRIPTION_STATUSES },
                OR: [
                    { currentPeriodEnd: null },
                    { currentPeriodEnd: { gt: now } },
                ],
            },
        ],
    };
}
//# sourceMappingURL=subscription-validity.js.map