export type AppLocale = 'fr' | 'en';

export function normalizeAppLocale(value?: string | null): AppLocale {
  const code = value?.trim().toLowerCase();
  if (code?.startsWith('en')) return 'en';
  return 'fr';
}

export function pickLocalizedText(input: {
  locale?: string | null;
  fr: string;
  en?: string | null;
}): string {
  const locale = normalizeAppLocale(input.locale);
  if (locale === 'en') {
    const en = input.en?.trim();
    if (en) return en;
  }
  return input.fr;
}

export function subscriptionExpiredCopy(
  locale: AppLocale | string | null | undefined,
  offerTitle: string,
): { title: string; body: string } {
  const titleOffer = offerTitle.trim() || 'Premium';
  if (normalizeAppLocale(locale) === 'en') {
    return {
      title: 'Your subscription has expired',
      body: `Your ${titleOffer} plan is no longer active. Renew it to get your benefits back.`,
    };
  }
  return {
    title: 'Votre abonnement a expiré',
    body: `Votre offre ${titleOffer} n’est plus active. Renouvelez-la pour retrouver vos avantages.`,
  };
}
