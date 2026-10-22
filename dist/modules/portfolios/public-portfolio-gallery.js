"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGalleryPortfolioHtml = buildGalleryPortfolioHtml;
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
    'linear-gradient(180deg,#3EC6C6,#2A7CFF)',
];
function buildGalleryPortfolioHtml(input) {
    const first = input.firstName.trim();
    const last = input.lastName.trim();
    const fullName = `${first} ${last}`.trim() || 'Portfolio';
    const photo = httpUrl(input.photoUrl);
    const bio = input.bio?.trim() ?? '';
    const job = input.jobTitle?.trim() ?? '';
    const company = input.company?.trim() ?? '';
    const email = input.email?.trim() ?? '';
    const phone = input.phone?.trim() ?? '';
    const portrait = photo
        ? `<img src="${escapeAttr(photo)}" alt="" />`
        : `<span>${escapeHtml(`${first[0] ?? ''}${last[0] ?? ''}`)}</span>`;
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
            ? `background-image:linear-gradient(180deg,rgba(8,10,24,0.05),rgba(8,10,24,0.72)),url('${escapeAttr(image)}')`
            : `background:${fallback}`;
        const number = String(index + 1).padStart(2, '0');
        const href = httpUrl(project.projectUrl);
        const body = `<div class="tile" style="${style}">
          <div class="tile-copy">
            <span>${number}</span>
            <strong>${escapeHtml(project.title)}</strong>
            ${project.description?.trim() ? `<small>${escapeHtml(project.description.trim())}</small>` : ''}
          </div>
        </div>`;
        return href
            ? `<a class="project" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">${body}</a>`
            : `<article class="project">${body}</article>`;
    })
        .join('');
    const experience = (0, public_portfolio_blocks_1.renderEntryTimeline)(input.experiences?.length
        ? input.experiences
        : job
            ? [{ role: job, company, period: "AUJOURD'HUI" }]
            : []);
    const teachings = (0, public_portfolio_blocks_1.renderTeachings)(input.teachings ?? []);
    const wash = (0, public_portfolio_wash_1.pageWash)(input.accentStart, input.accentEnd);
    const skillCards = (input.skills ?? [])
        .filter((skill) => skill.name.trim())
        .map((skill) => {
        const level = Math.max(0, Math.min(100, Math.round(skill.level)));
        return `<article class="skill-card">
        <strong>${level} %</strong>
        <span>${escapeHtml(skill.name.trim())}</span>
        <div class="track"><div class="fill" style="width:${level}%"></div></div>
      </article>`;
    })
        .join('');
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
    .page {
      max-width: 480px;
      margin: 0 auto;
      min-height: 100vh;
      padding: 18px 18px 36px;
      background: linear-gradient(180deg, var(--a) 0%, var(--b) 100%);
    }
    a { color: inherit; text-decoration: none; }
    .grad { color: inherit; }
    .head { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 54px; height: 54px; border-radius: 50%; overflow: hidden; flex: none; background: rgba(0,0,0,0.12); display: flex; align-items: center; justify-content: center; font-weight: 800; }
    .avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .who { min-width: 0; flex: 1; }
    .who strong { display: block; font-size: 18px; letter-spacing: -0.3px; }
    .who span { display: block; margin-top: 2px; color: var(--muted); font-size: 13px; }
    .pill { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; font-weight: 700; }
    .contact-btn { background: var(--btn); color: var(--btn-ink); padding: 10px 16px; font-size: 14px; flex: none; }
    h2 { margin: 22px 0 14px; font-size: 32px; letter-spacing: -0.7px; line-height: 1; }
    .projects { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .tile { position: relative; height: 230px; border-radius: 22px; background-size: cover; background-position: center; overflow: hidden; }
    .tile-copy { position: absolute; left: 14px; right: 14px; bottom: 14px; color: #fff; }
    .tile-copy span { display: block; font-size: 12px; opacity: 0.85; }
    .tile-copy strong { display: block; margin-top: 2px; font-size: 18px; }
    .tile-copy small { display: block; margin-top: 2px; color: rgba(255,255,255,0.8); font-size: 13px; }
    .bio { margin: 16px 0 0; color: var(--muted); line-height: 1.45; font-size: 15px; }
    .infos { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
    .info, .placeholder, .skill-card, .contact { background: var(--glass); border: 1px solid var(--line); }
    .info { padding: 12px 14px; border-radius: 16px; }
    .info span, .section-kicker { display: block; color: var(--muted); letter-spacing: 1.2px; font-size: 11px; font-weight: 800; }
    .info strong { display: block; margin-top: 6px; font-size: 16px; }
    section { margin-top: 26px; }
    .section-kicker { margin: 0 0 6px; }
    h3.block { margin: 6px 0 14px; font-size: 28px; letter-spacing: -0.5px; line-height: 1.05; }
    .entry { display: grid; grid-template-columns: 92px 1fr; gap: 12px; }
    .when { display: flex; gap: 8px; color: var(--muted); font-size: 13px; }
    .when i { width: 10px; height: 10px; margin-top: 3px; border-radius: 50%; background: var(--ink); flex: none; }
    .entry h3 { margin: 0; font-size: 17px; line-height: 1.25; }
    .org { margin: 4px 0 0; font-weight: 800; color: var(--ink); }
    .placeholder { margin-top: 8px; padding: 16px; border-radius: 16px; color: var(--muted); }
    .placeholder strong, .placeholder span, .placeholder p { display: block; color: var(--muted); }
    .placeholder strong { color: var(--ink); }
    .skills { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .skill-card { padding: 14px 14px 12px; border-radius: 18px; }
    .skill-card strong { display: block; font-size: 28px; letter-spacing: -0.6px; }
    .skill-card span { display: block; margin-top: 4px; color: var(--muted); font-size: 14px; }
    .track { height: 6px; margin-top: 14px; border-radius: 99px; background: var(--track); }
    .fill { height: 100%; border-radius: 99px; background: var(--ink); }
    .contact { margin-top: 28px; padding: 22px 18px 18px; border-radius: 22px; }
    .contact h3 { margin: 0 0 8px; font-size: 26px; }
    .lead { margin: 0 0 14px; color: var(--muted); line-height: 1.4; }
    .contact-row { margin: 0 0 10px; padding: 14px 16px; border-radius: 14px; background: var(--glass); border: 1px solid var(--line); }
    .save { display: block; margin-top: 6px; background: var(--btn); color: var(--btn-ink); text-align: center; padding: 14px 16px; font-size: 16px; }
    .footer { margin: 22px 0 0; text-align: center; letter-spacing: 1.4px; font-size: 11px; color: var(--muted); font-weight: 700; }
    ${(0, public_portfolio_desktop_1.desktopPortfolioCss)(`
      @media (min-width: 760px) {
        .tile { height: 280px; }
        h2 { font-size: 44px; }
      }
      @media (min-width: 1180px) {
        .tile { height: 320px; }
      }
    `, input.colorId)}
  </style>
</head>
<body>
  <div class="page">
    <header class="head">
      <div class="avatar">${portrait}</div>
      <div class="who">
        <strong>${escapeHtml(fullName)}</strong>
        ${job ? `<span>${escapeHtml(job)}</span>` : ''}
      </div>
      <a class="pill contact-btn" href="#contact">Contact</a>
    </header>

    <h2>Mes <span class="grad">réalisations</span></h2>
    <div class="projects" id="realisations">${projectCards}</div>
    ${bio ? `<p class="bio">${escapeHtml(bio)}</p>` : ''}
    ${company ? `<div class="infos"><article class="info"><span>POSTE</span><strong>${escapeHtml(company)}</strong></article></div>` : ''}

    ${experience ? `<section>
      <p class="section-kicker">PARCOURS</p>
      <h3 class="block">Expérience <span class="grad">professionnelle</span></h3>
      ${experience}
      <h3 class="block" style="margin-top:26px">Expérience pédagogique</h3>
      ${teachings}
    </section>` : ''}

    ${skillCards ? `<section>
      <p class="section-kicker">SKILLS</p>
      <h3 class="block">Ce que je <span class="grad">maîtrise</span></h3>
      <div class="skills">${skillCards}</div>
    </section>` : ''}

    ${(0, public_portfolio_blocks_1.renderProfileExtras)(input, { includeSkills: false })}
    <section class="contact" id="contact">
      <h3>Travaillons ensemble</h3>
      <p class="lead">Un projet, une collaboration, une intervention ? Écrivez-moi.</p>
      ${contactRows || '<p class="contact-row">Ajoutez un email ou un téléphone</p>'}
      <a class="pill save" href="${escapeAttr(input.vcardUrl)}">Enregistrer le contact</a>
    </section>
    <p class="footer">CRÉÉ AVEC DROP ONE</p>
  </div>
</body>
</html>`;
}
//# sourceMappingURL=public-portfolio-gallery.js.map