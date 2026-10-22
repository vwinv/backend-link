/** Plafond de sécurité pour une commande de places payantes. */
export const TEAM_SEAT_ORDER_CAP = 500;

/**
 * Places incluses dans l’offre.
 * `maxTeamMembers` > 0 : ce nombre de places est compris dans l’abonnement.
 * < 0 : illimité. 0 : aucune place équipe.
 */
export function includedTeamSeats(maxTeamMembers: number): number {
  if (maxTeamMembers < 0) return -1;
  return Math.max(0, maxTeamMembers);
}

/**
 * Places utilisables : les places incluses, plus les sièges déjà payés au-delà.
 * Un abonnement enregistré avec le minimum (ex. 1) ne réduit pas les places incluses.
 */
export function effectiveTeamSeats(
  maxTeamMembers: number,
  purchasedSeats?: number | null,
): number {
  const included = includedTeamSeats(maxTeamMembers);
  if (included < 0) return -1;
  const purchased =
    purchasedSeats != null && purchasedSeats > 0 ? purchasedSeats : 0;
  return Math.max(included, purchased);
}

/** Sièges facturés en plus des places incluses. */
export function paidExtraSeats(
  maxTeamMembers: number,
  purchasedSeats?: number | null,
): number {
  const included = includedTeamSeats(maxTeamMembers);
  if (included < 0) return 0;
  const total = effectiveTeamSeats(maxTeamMembers, purchasedSeats);
  return Math.max(0, total - included);
}
