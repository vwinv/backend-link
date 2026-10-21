export declare const MAX_PURCHASABLE_SEATS = 500;
export declare function includedTeamSeats(offer: {
    maxTeamMembers: number;
    minSeats?: number | null;
}): number;
export declare function teamSeatQuota(offer: {
    maxTeamMembers: number;
}, purchasedSeats?: number | null): number;
