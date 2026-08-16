"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIVE_SUBSCRIPTION_STATUSES = void 0;
exports.validSubscriptionWhere = validSubscriptionWhere;
const client_1 = require("@prisma/client");
exports.LIVE_SUBSCRIPTION_STATUSES = [
    client_1.SubscriptionStatus.TRIAL,
    client_1.SubscriptionStatus.ACTIVE,
    client_1.SubscriptionStatus.PAST_DUE,
];
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