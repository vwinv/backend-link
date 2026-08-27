import { OfferBillingType } from '@prisma/client';

export type AppleIapProductRef = {
  offerSlug: string;
  billingType: OfferBillingType;
  productId: string;
};

const DEFAULT_APPLE_IAP_PRODUCTS: Record<string, string> = {
  'link-premium:MONTHLY': 'com.mega.dropone.premium.monthly',
  'link-premium:YEARLY': 'com.mega.dropone.premium.yearly',
  'link-premium:LIFETIME': 'com.mega.dropone.premium.lifetime',
  'link-premium-plus:MONTHLY': 'com.mega.dropone.premiumplus.monthly',
  'link-premium-plus:YEARLY': 'com.mega.dropone.premiumplus.yearly',
  'link-premium-plus:LIFETIME': 'com.mega.dropone.premiumplus.lifetime',
  'link-premium-equipe:MONTHLY': 'com.mega.dropone.team.monthly',
  'link-premium-equipe:YEARLY': 'com.mega.dropone.team.yearly',
  'link-premium-equipe:LIFETIME': 'com.mega.dropone.team.lifetime',
  'link-entreprise-business:MONTHLY': 'com.mega.dropone.business.monthly',
  'link-entreprise-business:YEARLY': 'com.mega.dropone.business.yearly',
  'link-entreprise-business:LIFETIME': 'com.mega.dropone.business.lifetime',
  // Slugs réellement en prod (backoffice)
  'drop-one-plus:MONTHLY': 'com.mega.dropone.premium.monthly',
  'drop-one-plus:YEARLY': 'com.mega.dropone.premium.yearly',
  'drop-one-plus:LIFETIME': 'com.mega.dropone.premium.lifetime',
  'drop-one-premium:MONTHLY': 'com.mega.dropone.premiumplus.monthly',
  'drop-one-premium:YEARLY': 'com.mega.dropone.premiumplus.yearly',
  'drop-one-premium:LIFETIME': 'com.mega.dropone.premiumplus.lifetime',
  'drop-one-business:MONTHLY': 'com.mega.dropone.business.monthly',
  'drop-one-business:YEARLY': 'com.mega.dropone.business.yearly',
  'drop-one-business:LIFETIME': 'com.mega.dropone.business.lifetime',
};

function productKey(offerSlug: string, billingType: OfferBillingType): string {
  return `${offerSlug}:${billingType}`;
}

export function loadAppleIapProductMap(
  jsonOverride?: string,
): Map<string, string> {
  const map = new Map(Object.entries(DEFAULT_APPLE_IAP_PRODUCTS));
  const raw = jsonOverride?.trim();
  if (!raw) return map;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'string' && value.trim()) {
        map.set(key, value.trim());
      }
    }
  } catch {
    // Ignore invalid JSON; defaults remain.
  }
  return map;
}

export function appleProductIdFor(
  products: Map<string, string>,
  offerSlug: string,
  billingType: OfferBillingType,
): string | null {
  return products.get(productKey(offerSlug, billingType)) ?? null;
}

export function appleProductRefsFromId(
  products: Map<string, string>,
  productId: string,
): AppleIapProductRef[] {
  const wanted = productId.trim();
  const refs: AppleIapProductRef[] = [];
  for (const [key, id] of products.entries()) {
    if (id !== wanted) continue;
    const [offerSlug, billingType] = key.split(':');
    if (
      offerSlug &&
      (billingType === OfferBillingType.MONTHLY ||
        billingType === OfferBillingType.YEARLY ||
        billingType === OfferBillingType.LIFETIME)
    ) {
      refs.push({ offerSlug, billingType, productId: id });
    }
  }
  return refs;
}

export function appleProductRefFromId(
  products: Map<string, string>,
  productId: string,
): AppleIapProductRef | null {
  return appleProductRefsFromId(products, productId)[0] ?? null;
}

export function allAppleProductIds(products: Map<string, string>): string[] {
  return [...new Set(products.values())];
}
