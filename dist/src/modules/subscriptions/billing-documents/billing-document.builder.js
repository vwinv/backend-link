"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOfferSnapshotContent = buildOfferSnapshotContent;
exports.buildBillingDocumentHtml = buildBillingDocumentHtml;
const client_1 = require("@prisma/client");
const BRAND_COLOR = '#C2564E';
const BRAND_LIGHT = '#F3EBE6';
function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
function formatDate(value) {
    return value.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}
function formatAmount(amount) {
    return new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: 0,
    })
        .format(amount)
        .replace(/\s/g, '.');
}
function billingTypeLabel(type) {
    switch (type) {
        case client_1.OfferBillingType.YEARLY:
            return 'Annuel';
        case client_1.OfferBillingType.LIFETIME:
            return 'À vie';
        case client_1.OfferBillingType.MONTHLY:
        default:
            return 'Mensuel';
    }
}
function billingDuration(type) {
    switch (type) {
        case client_1.OfferBillingType.YEARLY:
            return '1 an';
        case client_1.OfferBillingType.LIFETIME:
            return 'À vie';
        case client_1.OfferBillingType.MONTHLY:
        default:
            return '1 mois';
    }
}
function billingPeriodSuffix(type) {
    switch (type) {
        case client_1.OfferBillingType.YEARLY:
            return '/an';
        case client_1.OfferBillingType.LIFETIME:
            return '';
        case client_1.OfferBillingType.MONTHLY:
        default:
            return '/mois';
    }
}
function scansLabel(maxAiScans) {
    if (maxAiScans < 0)
        return 'Scans IA illimités';
    if (maxAiScans === 0)
        return 'Scans IA non inclus';
    return `${maxAiScans} scans IA / période`;
}
function buildOfferSnapshotContent(offer, selectedBillingType) {
    const selectedPrice = offer.prices.find((price) => price.billingType === selectedBillingType) ??
        offer.prices[0];
    const personalizationBullets = [
        'Cartes de visite digitales',
        'Partage QR code, lien et réseaux',
        'Designs professionnels',
    ];
    if (offer.canCustomize) {
        personalizationBullets.push('Personnalisation avancée des cartes');
    }
    if (offer.hasPortfolio) {
        personalizationBullets.push('Portfolio professionnel lié à la carte');
    }
    const premiumBullets = [
        scansLabel(offer.maxAiScans),
        'Analytics et suivi des partages',
        'Enregistrement dans Apple / Google Wallet',
    ];
    if (offer.audience === client_1.OfferAudience.TEAM) {
        premiumBullets.unshift(`Espace équipe jusqu'à ${offer.maxTeamMembers} membres`);
        premiumBullets.push('Gestion des invitations par e-mail');
    }
    else {
        premiumBullets.unshift('Compte personnel DropOne Premium');
    }
    const lineItems = [
        {
            title: offer.title,
            bullets: [
                offer.subtitle?.trim() || 'Abonnement DropOne Premium',
                `Formule : ${billingTypeLabel(selectedBillingType)}`,
                ...personalizationBullets.slice(0, 3),
            ],
            duration: billingDuration(selectedBillingType),
            priceLabel: selectedPrice
                ? `${formatAmount(Number(selectedPrice.priceAmount))} FCFA`
                : '—',
            variant: 'light',
        },
        {
            title: 'Fonctionnalités incluses',
            bullets: premiumBullets,
            duration: billingDuration(selectedBillingType),
            priceLabel: 'Inclus',
            variant: 'brand',
        },
    ];
    const featureBlocks = [
        {
            title: 'Carte & visibilité :',
            bullets: personalizationBullets,
            variant: 'light',
        },
        {
            title: 'Premium DropOne :',
            bullets: premiumBullets,
            variant: 'brand',
        },
    ];
    const priceRows = offer.prices.map((price) => ({
        label: `Abonnement ${billingTypeLabel(price.billingType)}`,
        amountLabel: `${formatAmount(Number(price.priceAmount))} FCFA${billingPeriodSuffix(price.billingType)}`,
        variant: price.billingType === client_1.OfferBillingType.YEARLY ||
            price.billingType === selectedBillingType
            ? 'brand'
            : 'light',
        highlighted: price.billingType === selectedBillingType,
    }));
    return { lineItems, featureBlocks, priceRows };
}
function renderBullets(items) {
    return `<ul>${items
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join('')}</ul>`;
}
function renderLineItems(items) {
    return items
        .map((item) => {
        const isBrand = item.variant === 'brand';
        return `<tr class="${isBrand ? 'row-brand' : 'row-light'}">
        <td class="cell-designation">
          <strong>${escapeHtml(item.title)}</strong>
          ${renderBullets(item.bullets)}
        </td>
        <td class="cell-duration">${escapeHtml(item.duration)}</td>
        <td class="cell-price">${escapeHtml(item.priceLabel)}</td>
      </tr>`;
    })
        .join('');
}
function renderFeatureBlocks(blocks) {
    return blocks
        .map((block) => {
        const isBrand = block.variant === 'brand';
        return `<section class="feature-block ${isBrand ? 'feature-brand' : 'feature-light'}">
        <h3>${escapeHtml(block.title)}</h3>
        ${renderBullets(block.bullets)}
      </section>`;
    })
        .join('');
}
function renderPriceRows(rows) {
    return rows
        .map((row) => {
        const classes = [
            'price-row',
            row.variant === 'brand' ? 'price-brand' : 'price-light',
            row.highlighted ? 'price-highlight' : '',
        ]
            .filter(Boolean)
            .join(' ');
        return `<div class="${classes}">
        <span>${escapeHtml(row.label)}</span>
        <strong>${escapeHtml(row.amountLabel)}</strong>
      </div>`;
    })
        .join('');
}
function buildBillingDocumentHtml(input) {
    const kindLabel = input.kind === 'devis' ? 'DEVIS' : 'FACTURE';
    const title = `${kindLabel} N°${escapeHtml(input.documentNumber)} – ${escapeHtml(input.projectTitle)}`;
    const paidBadge = input.kind === 'facture' && input.paidAt
        ? `<p class="paid-badge">Payée le ${escapeHtml(formatDate(input.paidAt))}</p>`
        : '';
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    :root {
      --brand: ${BRAND_COLOR};
      --brand-light: ${BRAND_LIGHT};
      --text: #1f1f1f;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #ececec;
      color: var(--text);
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.45;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 16px auto;
      background: #fff;
      padding: 18mm 16mm 20mm;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    }
    .page + .page { page-break-before: always; }
    .header {
      display: flex;
      gap: 18px;
      align-items: flex-start;
      margin-bottom: 28px;
    }
    .logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--brand);
      font-size: 34px;
      font-weight: 700;
      line-height: 0.82;
      letter-spacing: -1px;
      text-transform: lowercase;
      min-width: 56px;
    }
    .issuer p {
      margin: 0 0 4px;
      font-size: 15px;
    }
    .doc-title {
      text-align: center;
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 8px;
    }
    .doc-meta {
      text-align: center;
      margin: 0 0 18px;
      font-size: 16px;
    }
    .client-line {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 16px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
    }
    thead th {
      background: var(--brand);
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      padding: 10px 12px;
      text-align: left;
    }
    thead th:nth-child(2),
    thead th:nth-child(3) {
      width: 110px;
      text-align: center;
    }
    td {
      vertical-align: top;
      padding: 14px 12px;
      font-size: 14px;
    }
    .row-light { background: var(--brand-light); }
    .row-brand { background: var(--brand); color: #fff; }
    .cell-designation ul {
      margin: 8px 0 0;
      padding-left: 18px;
    }
    .cell-designation li { margin-bottom: 4px; }
    .cell-duration,
    .cell-price {
      text-align: center;
      font-weight: 700;
      font-size: 16px;
      vertical-align: middle;
    }
    .feature-block {
      padding: 16px 18px;
      margin-bottom: 0;
    }
    .feature-block h3 {
      margin: 0 0 8px;
      font-size: 16px;
      font-weight: 700;
    }
    .feature-block ul {
      margin: 0;
      padding-left: 18px;
    }
    .feature-block li { margin-bottom: 4px; }
    .feature-light { background: var(--brand-light); }
    .feature-brand { background: var(--brand); color: #fff; }
    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      font-size: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }
    .price-light { background: #fff; }
    .price-brand { background: var(--brand); color: #fff; }
    .price-highlight { outline: 2px solid var(--brand); }
    .signatures {
      margin-top: 28px;
    }
    .signatures h3 {
      margin: 0 0 18px;
      font-size: 16px;
      font-weight: 700;
    }
    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
    .signature-box {
      min-height: 90px;
    }
    .signature-line {
      border-top: 2px solid #222;
      padding-top: 8px;
      font-weight: 700;
      text-align: center;
    }
    .paid-badge {
      text-align: center;
      color: var(--brand);
      font-weight: 700;
      margin: 0 0 12px;
    }
    @media print {
      body { background: #fff; }
      .page {
        margin: 0;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="header">
      <div class="logo" aria-hidden="true">
        <span>d</span><span>r</span><span>o</span><span>p</span><span>o</span><span>n</span><span>e</span>
      </div>
      <div class="issuer">
        <p><strong>Établi par :</strong> ${escapeHtml(input.companyName)}</p>
        <p><strong>Courriel :</strong> ${escapeHtml(input.companyEmail)}</p>
        <p><strong>Téléphone :</strong> ${escapeHtml(input.companyPhone)}</p>
      </div>
    </header>

    <h1 class="doc-title">${title}</h1>
    <p class="doc-meta">Date : ${escapeHtml(formatDate(input.issuedAt))}</p>
    ${paidBadge}
    <p class="client-line">Client : ${escapeHtml(input.clientName)}</p>

    <h2 class="section-title">${escapeHtml(input.sectionTitle)}</h2>
    <table>
      <thead>
        <tr>
          <th>Désignation</th>
          <th>Durée</th>
          <th>Prix (FCFA)</th>
        </tr>
      </thead>
      <tbody>
        ${renderLineItems(input.lineItems)}
      </tbody>
    </table>
  </main>

  <section class="page">
    <header class="header">
      <div class="logo" aria-hidden="true">
        <span>d</span><span>r</span><span>o</span><span>p</span><span>o</span><span>n</span><span>e</span>
      </div>
    </header>

    ${renderFeatureBlocks(input.featureBlocks)}
    <div class="pricing-block">
      ${renderPriceRows(input.priceRows)}
    </div>

    <div class="signatures">
      <h3>Signatures des différentes parties :</h3>
      <div class="signature-grid">
        <div class="signature-box">
          <div class="signature-line">${escapeHtml(input.companyName)}</div>
        </div>
        <div class="signature-box">
          <div class="signature-line">Le Client</div>
        </div>
      </div>
    </div>
  </section>
</body>
</html>`;
}
//# sourceMappingURL=billing-document.builder.js.map