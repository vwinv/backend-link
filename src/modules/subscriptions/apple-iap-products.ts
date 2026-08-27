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

export function appleProductRefFromId(
  products: Map<string, string>,
  productId: string,
): AppleIapProductRef | null {
  const wanted = productId.trim();
  for (const [key, id] of products.entries()) {
    if (id !== wanted) continue;
    const [offerSlug, billingType] = key.split(':');
    if (
      offerSlug &&
      (billingType === OfferBillingType.MONTHLY ||
        billingType === OfferBillingType.YEARLY ||
        billingType === OfferBillingType.LIFETIME)
    ) {
      return { offerSlug, billingType, productId: id };
    }
  }
  return null;
}

export function allAppleProductIds(products: Map<string, string>): string[] {
  return [...new Set(products.values())];
}
