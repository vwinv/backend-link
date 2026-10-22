"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEAM_SEAT_ORDER_CAP = void 0;
exports.includedTeamSeats = includedTeamSeats;
exports.effectiveTeamSeats = effectiveTeamSeats;
exports.paidExtraSeats = paidExtraSeats;
exports.TEAM_SEAT_ORDER_CAP = 500;
function includedTeamSeats(maxTeamMembers) {
    if (maxTeamMembers < 0)
        return -1;
    return Math.max(0, maxTeamMembers);
}
function effectiveTeamSeats(maxTeamMembers, purchasedSeats) {
    const included = includedTeamSeats(maxTeamMembers);
    if (included < 0)
        return -1;
    const purchased = purchasedSeats != null && purchasedSeats > 0 ? purchasedSeats : 0;
    return Math.max(included, purchased);
}
function paidExtraSeats(maxTeamMembers, purchasedSeats) {
    const included = includedTeamSeats(maxTeamMembers);
    if (included < 0)
        return 0;
    const total = effectiveTeamSeats(maxTeamMembers, purchasedSeats);
    return Math.max(0, total - included);
}
//# sourceMappingURL=team-seats.js.map