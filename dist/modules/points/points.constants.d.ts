export declare const POINTS_FCFA_PER_POINT = 10;
export declare const TENTHS_PER_POINT = 10;
export declare const CARD_VISIT_REWARD_TENTHS = 1;
export declare const REFERRAL_SUBSCRIBE_REWARD_TENTHS = 10;
export declare function buildAnonymousVisitorKey(ipAddress?: string | null, userAgent?: string | null): string | null;
export declare function pointsToTenths(points: number): number;
export declare function tenthsToPoints(tenths: number): number;
export declare function fcfaToTenths(amountFcfa: number): number;
export declare function tenthsToFcfa(tenths: number): number;
