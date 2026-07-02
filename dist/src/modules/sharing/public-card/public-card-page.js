"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPublicCardHtml = buildPublicCardHtml;
const public_card_body_1 = require("./public-card-body");
const public_card_styles_1 = require("./public-card-styles");
function accentRgba(hex, alpha) {
    const normalized = hex.replace('#', '').trim();
    if (normalized.length !== 6) {
        return `rgba(10, 107, 255, ${alpha})`;
    }
    const red = Number.parseInt(normalized.slice(0, 2), 16);
    const green = Number.parseInt(normalized.slice(2, 4), 16);
    const blue = Number.parseInt(normalized.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
function buildPublicCardHtml(params) {
    const title = `${params.fullName} | Link Cartes de visite digitales`;
    const description = 'Découvrez ma carte de visite Link';
    const safeTitle = (0, public_card_body_1.escapeHtml)(title);
    const safeDescription = (0, public_card_body_1.escapeHtml)(description);
    const safePageUrl = (0, public_card_body_1.escapeHtml)(params.pageUrl);
    const safeImageUrl = (0, public_card_body_1.escapeHtml)(params.ogImageUrl);
    const layoutClass = `layout-${params.design.layout.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    const lightClass = params.design.lightSurface ? 'layout-light' : '';
    const pageStyle = params.design.pageBackground.startsWith('linear-gradient')
        ? `background: ${params.design.pageBackground};`
        : `background: ${params.design.pageBackground};`;
    return `<!DOCTYPE html>
<html lang="fr"${params.embed ? ' class="embed"' : ''}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Link" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:url" content="${safePageUrl}" />
  <meta property="og:image" content="${safeImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDescription}" />
  <meta name="twitter:image" content="${safeImageUrl}" />
  <style>
    ${public_card_styles_1.PUBLIC_CARD_STYLES}
    :root,
    .page {
      --accent: ${params.design.accentColor};
      --link-blue: #0a6bff;
      --btn-border: ${accentRgba(params.design.accentColor, 0.55)};
      --social-border: ${accentRgba(params.design.accentColor, 0.45)};
      --text: ${params.design.textPrimary};
      --text-muted: ${params.design.textMuted};
      --btn-primary-bg: ${params.design.accentColor};
      --btn-primary-text: ${params.design.layout === 'or' ? '#1a1a1a' : '#ffffff'};
    }
    .page {
      ${pageStyle}
    }
  </style>
</head>
<body>
  <div class="page ${layoutClass} ${lightClass}">
    <main class="shell">
      ${(0, public_card_body_1.renderPublicCardBody)(params)}
    </main>
  </div>
  <script>${(0, public_card_body_1.buildInlineScript)(params.pageUrl)}</script>
</body>
</html>`;
}
//# sourceMappingURL=public-card-page.js.map