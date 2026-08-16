import { Prisma, SubscriptionStatus } from '@prisma/client';

export const LIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  SubscriptionStatus.TRIAL,
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.PAST_DUE,
];

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
