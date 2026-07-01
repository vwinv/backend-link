"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ENTITLEMENTS = void 0;
const client_1 = require("@prisma/client");
exports.DEFAULT_ENTITLEMENTS = {
    audience: client_1.OfferAudience.PERSONAL,
    canCustomize: false,
    maxTeamMembers: 0,
    hasPortfolio: false,
    maxAiScans: 0,
};
//# sourceMappingURL=entitlements.types.js.map