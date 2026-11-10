import { createHash } from 'crypto';

/** 1 point = 10 FCFA ; stockage interne en dixièmes (10 tenths = 1 point). */
export const POINTS_FCFA_PER_POINT = 10;
export const TENTHS_PER_POINT = 10;
export const CARD_VISIT_REWARD_TENTHS = 1; // 0,1 point par personne (visiteur unique)
export const REFERRAL_SUBSCRIBE_REWARD_TENTHS = 10; // 1 point

/** Empreinte anonyme pour ne créditer qu’une fois la même personne sans compte. */
export function buildAnonymousVisitorKey(
  ipAddress?: string | null,
  userAgent?: string | null,
): string | null {
  const ip = ipAddress?.trim() || '';
  const ua = userAgent?.trim() || '';
  if (!ip && !ua) return null;
  return createHash('sha256').update(`${ip}|${ua}`).digest('hex').slice(0, 32);
}

export function pointsToTenths(points: number): number {
  return Math.round(points * TENTHS_PER_POINT);
}

export function tenthsToPoints(tenths: number): number {
  return Math.round(tenths) / TENTHS_PER_POINT;
}

export function fcfaToTenths(amountFcfa: number): number {
  return Math.round((amountFcfa / POINTS_FCFA_PER_POINT) * TENTHS_PER_POINT);
}

export function tenthsToFcfa(tenths: number): number {
  return tenthsToPoints(tenths) * POINTS_FCFA_PER_POINT;
}
