"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSubscriptionSignupNoticeEmail = buildSubscriptionSignupNoticeEmail;
function buildSubscriptionSignupNoticeEmail(payload) {
    const name = `${payload.firstName} ${payload.lastName}`.trim();
    const billing = payload.billingType === 'YEARLY'
        ? 'annuel'
        : payload.billingType === 'MONTHLY'
            ? 'mensuel'
            : payload.billingType.toLowerCase();
    const seats = payload.seats != null ? `\nSièges : ${payload.seats}` : '';
    const phone = payload.phone?.trim()
        ? `\nTéléphone : ${payload.phone.trim()}`
        : '';
    const subject = `Demande d’inscription DropOne — ${name} (${payload.offerTitle})`;
    const text = [
        'Nouvelle demande d’inscription (paiement masqué dans l’app).',
        '',
        `Nom : ${name}`,
        `E-mail : ${payload.email}${phone}`,
        `Offre : ${payload.offerTitle}`,
        `Facturation : ${billing}${seats}`,
        '',
        'Recontactez cette personne pour les modalités d’inscription.',
    ].join('\n');
    const html = `
    <p>Nouvelle demande d’inscription (paiement masqué dans l’app).</p>
    <ul>
      <li><strong>Nom :</strong> ${escapeHtml(name)}</li>
      <li><strong>E-mail :</strong> ${escapeHtml(payload.email)}</li>
      ${payload.phone?.trim() ? `<li><strong>Téléphone :</strong> ${escapeHtml(payload.phone.trim())}</li>` : ''}
      <li><strong>Offre :</strong> ${escapeHtml(payload.offerTitle)}</li>
      <li><strong>Facturation :</strong> ${escapeHtml(billing)}</li>
      ${payload.seats != null ? `<li><strong>Sièges :</strong> ${payload.seats}</li>` : ''}
    </ul>
    <p>Recontactez cette personne pour les modalités d’inscription.</p>
  `;
    return { subject, text, html };
}
function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
//# sourceMappingURL=subscription-signup-email.js.map