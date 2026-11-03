"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAppLocale = normalizeAppLocale;
exports.pickLocalizedText = pickLocalizedText;
exports.subscriptionExpiredCopy = subscriptionExpiredCopy;
function normalizeAppLocale(value) {
    const code = value?.trim().toLowerCase();
    if (code?.startsWith('en'))
        return 'en';
    return 'fr';
}
function pickLocalizedText(input) {
    const locale = normalizeAppLocale(input.locale);
    if (locale === 'en') {
        const en = input.en?.trim();
        if (en)
            return en;
    }
    return input.fr;
}
function subscriptionExpiredCopy(locale, offerTitle) {
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
//# sourceMappingURL=notification-i18n.js.map