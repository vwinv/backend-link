export declare const TEAM_SEAT_ORDER_CAP = 500;
export declare function includedTeamSeats(maxTeamMembers: number): number;
export declare function effectiveTeamSeats(maxTeamMembers: number, purchasedSeats?: number | null): number;
export declare function paidExtraSeats(maxTeamMembers: number, purchasedSeats?: number | null): number;
