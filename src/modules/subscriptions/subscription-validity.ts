import { OfferAudience, Prisma, SubscriptionStatus } from '@prisma/client';

export const LIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  SubscriptionStatus.TRIAL,
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.PAST_DUE,
];

/** Carte (perso / équipe) et portfolio sont des abonnements indépendants. */
export const CARD_OFFER_AUDIENCES: OfferAudience[] = [
  OfferAudience.PERSONAL,
  OfferAudience.TEAM,
];

export function isPortfolioAudience(audience: OfferAudience): boolean {
  return audience === OfferAudience.PORTFOLIO;
}

/**
 * Filtre Prisma : abonnements de la même famille que `audience`.
 * - PORTFOLIO → uniquement portfolio
 * - PERSONAL / TEAM → carte (perso + équipe) + legacy sans offre
 */
export function sameSubscriptionFamilyWhere(
  audience: OfferAudience,
): Prisma.SubscriptionWhereInput {
  if (isPortfolioAudience(audience)) {
    return { offer: { audience: OfferAudience.PORTFOLIO } };
  }

  return {
    OR: [
      { offer: { audience: { in: CARD_OFFER_AUDIENCES } } },
      { offerId: null },
    ],
  };
}

/**
 * Abonnement encore utilisable : statut vivant et date de fin non dépassée.
 * `currentPeriodEnd` null = legacy / durée indéterminée (on laisse passer).
 */
export function validSubscriptionWhere(
  extra: Prisma.SubscriptionWhereInput = {},
  now = new Date(),
): Prisma.SubscriptionWhereInput {
  return {
    AND: [
      extra,
      {
        status: { in: LIVE_SUBSCRIPTION_STATUSES },
        OR: [
          { currentPeriodEnd: null },
          { currentPeriodEnd: { gt: now } },
        ],
      },
    ],
  };
}
