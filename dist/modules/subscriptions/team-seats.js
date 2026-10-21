"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_PURCHASABLE_SEATS = void 0;
exports.includedTeamSeats = includedTeamSeats;
exports.teamSeatQuota = teamSeatQuota;
exports.MAX_PURCHASABLE_SEATS = 500;
function includedTeamSeats(offer) {
    if (offer.maxTeamMembers > 0)
        return offer.maxTeamMembers;
    return Math.max(1, offer.minSeats ?? 1);
}
function teamSeatQuota(offer, purchasedSeats) {
    if (offer.maxTeamMembers > 0) {
        return Math.max(offer.maxTeamMembers, purchasedSeats ?? 0);
    }
    if (purchasedSeats != null && purchasedSeats > 0)
        return purchasedSeats;
    return offer.maxTeamMembers;
}
//# sourceMappingURL=team-seats.js.map