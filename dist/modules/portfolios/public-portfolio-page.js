"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPublicPortfolioHtml = buildPublicPortfolioHtml;
exports.buildPublicPortfolioNotFoundHtml = buildPublicPortfolioNotFoundHtml;
function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
function buildPublicPortfolioHtml(input) {
    const name = escapeHtml(input.fullName || 'Portfolio');
    const initials = escapeHtml(input.initials || '•');
    const role = input.jobTitle?.trim() ? escapeHtml(input.jobTitle.trim()) : '';
    const company = input.company?.trim() ? escapeHtml(input.company.trim()) : '';
    const avatar = input.avatarUrl?.trim() ?? '';
    const safeAvatar = avatar.startsWith('https://') || avatar.startsWith('http://')
        ? escapeHtml(avatar)
        : '';
    const pageUrl = escapeHtml(input.pageUrl);
    const portrait = safeAvatar
        ? `<img src="${safeAvatar}" alt="" />`
        : `<span>${initials}</span>`;
    const roleBlock = role ? `<p class="role">${role}</p>` : '';
    const pathBlock = role || company
        ? `<div class="item"><i></i><div>${role ? `<strong>${role}</strong>` : ''}${company ? `<small>${company}</small>` : ''}</div></div>`
        : `<p class="empty">Parcours à compléter</p>`;
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${name} | DropOne Portfolio</title>
  <meta property="og:title" content="${name} | DropOne Portfolio" />
  <meta property="og:description" content="Découvrez mon portfolio DropOne" />
  <meta property="og:url" content="${pageUrl}" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f4f6f8; color: #fff; }
    main { min-height: 100vh; padding: 28px 20px 40px; background: linear-gradient(180deg, #14968f 0%, #1a6eae 48%, #1b4c96 100%); }
    .who { display: flex; gap: 14px; align-items: center; }
    .avatar { width: 72px; height: 72px; border-radius: 50%; border: 2px solid #fff; overflow: hidden; background: #fff; color: #14968f; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 22px; flex: none; }
    .avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
    h1 { margin: 0; font-size: 26px; letter-spacing: -0.4px; }
    .role { margin: 6px 0 0; opacity: 0.85; line-height: 1.35; }
    .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 28px; }
    h2 { margin: 0 0 10px; font-size: 11px; letter-spacing: 1.2px; opacity: 0.75; font-weight: 700; }
    .item { display: flex; gap: 8px; }
    .item i { width: 7px; height: 7px; margin-top: 6px; border-radius: 50%; background: #5ee0b5; flex: none; }
    strong, small, .empty { display: block; }
    strong { font-size: 14px; }
    small, .empty { margin-top: 2px; opacity: 0.78; font-size: 12px; line-height: 1.35; }
  </style>
</head>
<body>
  <main>
    <div class="who">
      <div class="avatar">${portrait}</div>
      <div>
        <h1>${name}</h1>
        ${roleBlock}
      </div>
    </div>
    <div class="cols">
      <section>
        <h2>PARCOURS</h2>
        ${pathBlock}
      </section>
      <section>
        <h2>SKILLS</h2>
        <p class="empty">Compétences à compléter</p>
      </section>
    </div>
  </main>
</body>
</html>`;
}
function buildPublicPortfolioNotFoundHtml() {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Portfolio introuvable | DropOne</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0c0d10;color:#fff;font-family:system-ui,sans-serif;">
  <main style="text-align:center;padding:24px;">
    <h1 style="font-size:1.25rem;margin:0 0 8px;">Portfolio introuvable</h1>
    <p style="margin:0;opacity:0.75;">Ce lien n'existe pas ou le portfolio n'est plus public.</p>
  </main>
</body>
</html>`;
}
//# sourceMappingURL=public-portfolio-page.js.map