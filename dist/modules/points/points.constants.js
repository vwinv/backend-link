"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFERRAL_SUBSCRIBE_REWARD_TENTHS = exports.CARD_VISIT_REWARD_TENTHS = exports.TENTHS_PER_POINT = exports.POINTS_FCFA_PER_POINT = void 0;
exports.buildAnonymousVisitorKey = buildAnonymousVisitorKey;
exports.pointsToTenths = pointsToTenths;
exports.tenthsToPoints = tenthsToPoints;
exports.fcfaToTenths = fcfaToTenths;
exports.tenthsToFcfa = tenthsToFcfa;
const crypto_1 = require("crypto");
exports.POINTS_FCFA_PER_POINT = 10;
exports.TENTHS_PER_POINT = 10;
exports.CARD_VISIT_REWARD_TENTHS = 1;
exports.REFERRAL_SUBSCRIBE_REWARD_TENTHS = 10;
function buildAnonymousVisitorKey(ipAddress, userAgent) {
    const ip = ipAddress?.trim() || '';
    const ua = userAgent?.trim() || '';
    if (!ip && !ua)
        return null;
    return (0, crypto_1.createHash)('sha256').update(`${ip}|${ua}`).digest('hex').slice(0, 32);
}
function pointsToTenths(points) {
    return Math.round(points * exports.TENTHS_PER_POINT);
}
function tenthsToPoints(tenths) {
    return Math.round(tenths) / exports.TENTHS_PER_POINT;
}
function fcfaToTenths(amountFcfa) {
    return Math.round((amountFcfa / exports.POINTS_FCFA_PER_POINT) * exports.TENTHS_PER_POINT);
}
function tenthsToFcfa(tenths) {
    return tenthsToPoints(tenths) * exports.POINTS_FCFA_PER_POINT;
}
//# sourceMappingURL=points.constants.js.map