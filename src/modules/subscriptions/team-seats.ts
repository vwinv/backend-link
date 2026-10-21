/** Plafond d’une commande de places supplémentaires. */
export const MAX_PURCHASABLE_SEATS = 500;

/**
 * Places incluses dans le tarif de base.
 * « Max membres » > 0 = ce nombre de places offertes par l’abonnement.
 */
export function includedTeamSeats(offer: {
  maxTeamMembers: number;
  minSeats?: number | null;
}): number {
  if (offer.maxTeamMembers > 0) return offer.maxTeamMembers;
  return Math.max(1, offer.minSeats ?? 1);
}

/**
 * Places utilisables : au moins les places incluses, plus celles achetées en plus.
 */
export function teamSeatQuota(
  offer: { maxTeamMembers: number },
  purchasedSeats?: number | null,
): number {
  if (offer.maxTeamMembers > 0) {
    return Math.max(offer.maxTeamMembers, purchasedSeats ?? 0);
  }
  if (purchasedSeats != null && purchasedSeats > 0) return purchasedSeats;
  return offer.maxTeamMembers;
}
