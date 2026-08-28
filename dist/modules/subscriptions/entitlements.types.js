"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FULL_ACCESS_ENTITLEMENTS = exports.DEFAULT_ENTITLEMENTS = void 0;
const client_1 = require("@prisma/client");
exports.DEFAULT_ENTITLEMENTS = {
    audience: client_1.OfferAudience.PERSONAL,
    canCustomize: false,
    maxTeamMembers: 0,
    hasPortfolio: false,
    hasWallet: false,
    hasAnalytics: false,
    hasVisitorInsights: false,
    hasSocialLinks: false,
    maxAiScans: 0,
    maxShares: 10,
};
exports.FULL_ACCESS_ENTITLEMENTS = {
    audience: client_1.OfferAudience.TEAM,
    canCustomize: true,
    maxTeamMembers: -1,
    hasPortfolio: true,
    hasWallet: true,
    hasAnalytics: true,
    hasVisitorInsights: true,
    hasSocialLinks: true,
    maxAiScans: -1,
    maxShares: -1,
};
//# sourceMappingURL=entitlements.types.js.map