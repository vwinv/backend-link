"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCartesPortfolioHtml = buildCartesPortfolioHtml;
const public_portfolio_desktop_1 = require("./public-portfolio-desktop");
const public_portfolio_blocks_1 = require("./public-portfolio-blocks");
const public_portfolio_wash_1 = require("./public-portfolio-wash");
function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, '&#39;');
}
function httpUrl(value) {
    const trimmed = value?.trim() ?? '';
    if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
        return trimmed;
    }
    return '';
}
const TILE_FALLBACKS = [
    'linear-gradient(180deg,#6B8CFF,#3A4DCC)',
    'linear-gradient(180deg,#FFC2AE,#E88978)',
];
function buildCartesPortfolioHtml(input) {
    const first = input.firstName.trim();
    const last = input.lastName.trim();
    const fullName = `${first} ${last}`.trim() || 'Portfolio';
    const photo = httpUrl(input.photoUrl);
    const bio = input.bio?.trim() ?? '';
    const job = input.jobTitle?.trim() ?? '';
    const company = input.company?.trim() ?? '';
    const email = input.email?.trim() ?? '';
    const phone = input.phone?.trim() ?? '';
    const linkedin = input.socialLinks.find((link) => link.platform === 'LINKEDIN');
    const instagram = input.socialLinks.find((link) => link.platform === 'INSTAGRAM');
    const portrait = photo
        ? `<img src="${escapeAttr(photo)}" alt="" />`
        : `<span>${escapeHtml(`${first[0] ?? ''}${last[0] ?? ''}`)}</span>`;
    const socials = [
        linkedin
            ? `<a class="social" href="${escapeAttr(linkedin.url)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${linkedinIcon}</a>`
            : '',
        instagram
            ? `<a class="social" href="${escapeAttr(instagram.url)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${instagramIcon}</a>`
            : '',
    ].join('');
    const tiles = input.projects.length > 0
        ? input.projects
        : [
            { title: 'Projet', description: 'À compléter', imageUrl: null, projectUrl: null },
            { title: 'Projet', description: 'À compléter', imageUrl: null, projectUrl: null },
        ];
    const projectCards = tiles
        .map((project, index) => {
        const image = httpUrl(project.imageUrl);
        const fallback = TILE_FALLBACKS[index % TILE_FALLBACKS.length];
        const style = image
            ? `background-image:url('${escapeAttr(image)}')`
            : `background:${fallback}`;
        const href = httpUrl(project.projectUrl);
        const body = `<div class="shot" style="${style}"></div>
        <div class="foot">
          <div>
            <strong>${escapeHtml(project.title)}</strong>
            ${project.description?.trim() ? `<small>${escapeHtml(project.description.trim())}</small>` : ''}
          </div>
          <span class="arrow" aria-hidden="true">↗</span>
        </div>`;
        return href
            ? `<a class="work" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">${body}</a>`
            : `<article class="work">${body}</article>`;
    })
        .join('');
    const experience = (0, public_portfolio_blocks_1.renderEntryTimeline)(input.experiences?.length
        ? input.experiences
        : job
            ? [{ role: job, company, period: "AUJOURD'HUI" }]
            : []);
    const teachings = (0, public_portfolio_blocks_1.renderTeachings)(input.teachings ?? []);
    const wash = (0, public_portfolio_wash_1.pageWash)(input.accentStart, input.accentEnd);
    const contactRows = [
        email ? `<p class="contact-row">${escapeHtml(email)}</p>` : '',
        phone ? `<p class="contact-row">${escapeHtml(phone)}</p>` : '',
        input.address?.trim() ? `<p class="contact-row">${escapeHtml(input.address.trim())}</p>` : '',
    ].join('');
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(fullName)} | DropOne Portfolio</title>
  <meta property="og:title" content="${escapeHtml(fullName)} | DropOne Portfolio" />
  <meta property="og:description" content="${escapeHtml(bio || job || 'Découvrez mon portfolio DropOne')}" />
  <meta property="og:url" content="${escapeAttr(input.pageUrl)}" />
  ${photo ? `<meta property="og:image" content="${escapeAttr(photo)}" />` : ''}
  <style>
    :root {
      --a: ${input.accentStart};
      --b: ${input.accentEnd};
      --ink: ${wash.ink};
      --muted: ${wash.muted};
      --glass: ${wash.glass};
      --line: ${wash.line};
      --btn: ${wash.button};
      --btn-ink: ${wash.buttonInk};
      --track: ${wash.track};
      --bar: ${wash.ink};
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; color: var(--ink); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--b); }
    .page { max-width: 480px; margin: 0 auto; min-height: 100vh; padding: 18px 16px 36px; background: linear-gradient(180deg, var(--a) 0%, var(--b) 100%); }
    a { color: inherit; text-decoration: none; }
    .grad { color: inherit; }
    .top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
    .hello { font-size: 26px; font-weight: 700; letter-spacing: -0.4px; }
    .pill { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; font-weight: 700; }
    .ghost { background: var(--btn); color: var(--btn-ink); padding: 10px 16px; font-size: 14px; }
    .panel, .contact { margin-bottom: 12px; padding: 16px; border-radius: 22px; background: var(--glass); border: 1px solid var(--line); }
    .identity { display: flex; gap: 12px; align-items: center; }
    .avatar { width: 64px; height: 64px; border-radius: 16px; overflow: hidden; flex: none; background: rgba(0,0,0,0.12); display: flex; align-items: center; justify-content: center; font-weight: 800; }
    .avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .identity h1 { margin: 0; font-size: 22px; letter-spacing: -0.4px; }
    .role { margin: 4px 0 0; color: var(--ink); font-weight: 700; font-size: 14px; }
    .bio { margin: 12px 0 0; color: var(--muted); line-height: 1.45; font-size: 15px; }
    .actions { display: flex; align-items: center; gap: 10px; margin-top: 14px; }
    .cta { background: var(--btn); color: var(--btn-ink); padding: 12px 16px; font-size: 14px; }
    .social { width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid var(--line); display: inline-flex; align-items: center; justify-content: center; }
    .social svg { width: 16px; height: 16px; fill: var(--ink); }
    .infos { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
    .info { padding: 12px 14px; }
    .info span, .section-kicker { display: block; color: var(--muted); letter-spacing: 1.2px; font-size: 11px; font-weight: 800; }
    .info strong { display: block; margin-top: 6px; font-size: 16px; }
    .section-kicker { margin: 0 0 6px; }
    h2 { margin: 0 0 14px; font-size: 26px; letter-spacing: -0.5px; line-height: 1.05; }
    .entry { display: grid; grid-template-columns: 92px 1fr; gap: 12px; }
    .when { display: flex; gap: 8px; color: var(--muted); font-size: 13px; }
    .when i { width: 10px; height: 10px; margin-top: 3px; border-radius: 50%; background: var(--ink); flex: none; }
    .entry h3 { margin: 0; font-size: 16px; line-height: 1.25; }
    .org { margin: 4px 0 0; font-weight: 800; color: var(--ink); }
    .placeholder, .skill { margin-top: 12px; padding: 14px; border-radius: 16px; background: var(--glass); border: 1px solid var(--line); color: var(--muted); }
    .placeholder strong, .placeholder span, .placeholder p { display: block; color: var(--muted); }
    .placeholder strong { color: var(--ink); }
    .work { display: block; margin-bottom: 12px; border-radius: 22px; overflow: hidden; background: var(--glass); border: 1px solid var(--line); }
    .shot { height: 150px; background-size: cover; background-position: center; }
    .foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; }
    .foot strong { display: block; font-size: 16px; }
    .foot small { display: block; margin-top: 2px; color: var(--muted); font-size: 13px; }
    .arrow { width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--btn); color: var(--btn-ink); font-size: 16px; flex: none; }
    .contact { padding: 22px 18px 18px; }
    .contact h2 { margin-bottom: 8px; }
    .lead { margin: 0 0 14px; color: var(--muted); line-height: 1.4; }
    .contact-row { margin: 0 0 10px; padding: 14px 16px; border-radius: 14px; background: var(--glass); border: 1px solid var(--line); }
    .save { display: block; margin-top: 6px; background: var(--btn); color: var(--btn-ink); text-align: center; padding: 14px 16px; font-size: 16px; }
    .footer { margin: 18px 0 0; text-align: center; letter-spacing: 1.4px; font-size: 11px; color: var(--muted); font-weight: 700; }
    ${(0, public_portfolio_desktop_1.desktopPortfolioCss)(`
      @media (min-width: 760px) {
        .page { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
        .top, .footer, #contact, section.panel:first-of-type, #realisations { grid-column: 1 / -1; }
        .panel { margin-bottom: 0; }
        #realisations { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        #realisations > :not(.work) { grid-column: 1 / -1; }
        .work { margin-bottom: 0; }
      }
      @media (min-width: 1180px) {
        #realisations { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      }
    `, input.colorId)}
  </style>
</head>
<body>
  <div class="page">
    <div class="top">
      <div class="hello">${escapeHtml(first || fullName)}.</div>
      <a class="pill ghost" href="#contact">Me contacter</a>
    </div>

    <section class="panel">
      <div class="identity">
        <div class="avatar">${portrait}</div>
        <div>
          <h1>${escapeHtml(fullName)}</h1>
          ${job ? `<p class="role">${escapeHtml(job)}</p>` : ''}
        </div>
      </div>
      ${bio ? `<p class="bio">${escapeHtml(bio)}</p>` : ''}
      <div class="actions">
        <a class="pill cta" href="#realisations">Voir mes réalisations</a>
        ${socials}
      </div>
    </section>

    ${company ? `<div class="infos"><article class="panel info"><span>POSTE</span><strong>${escapeHtml(company)}</strong></article></div>` : ''}

    ${experience ? `<section class="panel">
      <p class="section-kicker">PARCOURS</p>
      <h2>Expérience <span class="grad">professionnelle</span></h2>
      ${experience}
    </section>` : ''}
    ${experience || (input.teachings?.length ?? 0) > 0 ? `<section class="panel">
      <h2>Expérience pédagogique</h2>
      ${teachings}
    </section>` : ''}

    <section class="panel" id="realisations">
      <p class="section-kicker">RÉALISATIONS</p>
      <h2>Projets <span class="grad">récents</span></h2>
      ${projectCards}
    </section>

    ${(0, public_portfolio_blocks_1.renderProfileExtras)(input, { panel: true })}
    <section class="panel contact" id="contact">
      <h2>Travaillons ensemble</h2>
      <p class="lead">Un projet, une collaboration, une intervention ? Écrivez-moi.</p>
      ${contactRows || '<p class="contact-row">Ajoutez un email ou un téléphone</p>'}
      <a class="pill save" href="${escapeAttr(input.vcardUrl)}">Enregistrer le contact</a>
    </section>
    <p class="footer">CRÉÉ AVEC DROP ONE</p>
  </div>
</body>
</html>`;
}
const linkedinIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.7 3.3A2.2 2.2 0 1 0 4.7 7.7 2.2 2.2 0 0 0 4.7 3.3zM3 9h3.4v12H3zM10 9h3.3v1.6h.1c.5-.9 1.6-1.8 3.3-1.8 3.5 0 4.2 2.3 4.2 5.3V21H17.5v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H10z"/></svg>';
const instagramIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2zM17.4 6.6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/></svg>';
//# sourceMappingURL=public-portfolio-cartes.js.map