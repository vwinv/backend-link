import { desktopPortfolioCss } from './public-portfolio-desktop';
import type { CoverPortfolioInput } from './public-portfolio-cover';
import {
  renderChipGroup,
  renderEntryTimeline,
  renderSkillBars,
  renderTeachings,
} from './public-portfolio-blocks';
import { pageWash } from './public-portfolio-wash';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

function httpUrl(value?: string | null): string {
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

export function buildPortraitPortfolioHtml(input: CoverPortfolioInput): string {
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
    : `<span class="initials">${escapeHtml(`${first[0] ?? ''}${last[0] ?? ''}`)}</span>`;

  const socials = [
    linkedin
      ? `<a class="social" href="${escapeAttr(linkedin.url)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${linkedinIcon}</a>`
      : '',
    instagram
      ? `<a class="social" href="${escapeAttr(instagram.url)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${instagramIcon}</a>`
      : '',
  ].join('');

  const tiles =
    input.projects.length > 0
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
      const number = String(index + 1).padStart(2, '0');
      const href = httpUrl(project.projectUrl);
      const body = `<div class="shot" style="${style}"></div>
        <div class="caption">
          <span>${number}</span>
          <div>
            <strong>${escapeHtml(project.title)}</strong>
            ${project.description?.trim() ? `<small>${escapeHtml(project.description.trim())}</small>` : ''}
          </div>
        </div>`;
      return href
        ? `<a class="project" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">${body}</a>`
        : `<article class="project">${body}</article>`;
    })
    .join('');

  const experience = renderEntryTimeline(
    input.experiences?.length
      ? input.experiences
      : job
        ? [{ role: job, company, period: "AUJOURD'HUI" }]
        : [],
  );
  const teachings = renderTeachings(input.teachings ?? []);

  const wash = pageWash(input.accentStart, input.accentEnd);
  const skills =
    input.skills && input.skills.length > 0 ? renderSkillBars(input.skills) : '';
  const competences = renderChipGroup(
    'Compétences',
    'Savoir-faire métier',
    input.competences ?? [],
  );
  const strengths = renderChipGroup(
    'Atouts',
    'Ce qui vous distingue',
    input.strengths ?? [],
  );
  const interests = renderChipGroup(
    "Centres d'intérêt",
    'Une touche personnelle',
    input.interests ?? [],
  );

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
      padding: 20px 18px 36px;
      background: linear-gradient(180deg, var(--a) 0%, var(--b) 100%);
    }
    a { color: inherit; text-decoration: none; }
    .grad { color: inherit; }
    .top { display: flex; align-items: center; justify-content: space-between; }
    .hello { font-size: 28px; font-weight: 700; letter-spacing: -0.4px; }
    .pill { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; font-weight: 700; }
    .ghost { background: var(--btn); color: var(--btn-ink); padding: 10px 16px; font-size: 14px; }
    .frame { position: relative; margin-top: 18px; border-radius: 28px; overflow: hidden; background: rgba(0,0,0,0.12); min-height: 360px; }
    .frame img { width: 100%; height: 420px; object-fit: cover; display: block; }
    .initials { display: flex; align-items: center; justify-content: center; height: 420px; font-size: 64px; font-weight: 800; }
    .badge { position: absolute; left: 14px; bottom: 14px; display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: rgba(255,255,255,0.92); color: #12121a; font-size: 13px; font-weight: 700; }
    .badge i { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }
    h1 { margin: 18px 0 0; font-size: 40px; line-height: 0.95; letter-spacing: -1.1px; }
    .role { margin: 10px 0 0; font-size: 18px; font-weight: 800; }
    .bio { margin: 10px 0 0; color: var(--muted); line-height: 1.45; font-size: 15px; }
    .actions { display: flex; align-items: center; gap: 10px; margin-top: 16px; }
    .cta { background: var(--btn); color: var(--btn-ink); padding: 12px 18px; font-size: 15px; }
    .social { width: 42px; height: 42px; border-radius: 50%; border: 1.5px solid var(--line); display: inline-flex; align-items: center; justify-content: center; }
    .social svg { width: 18px; height: 18px; fill: var(--ink); }
    .infos { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
    .info, .placeholder, .skill, .contact { background: var(--glass); border: 1px solid var(--line); }
    .info { padding: 12px 14px; border-radius: 16px; }
    .info span, .section-kicker { display: block; color: var(--muted); letter-spacing: 1.2px; font-size: 11px; font-weight: 800; }
    .info strong { display: block; margin-top: 6px; font-size: 16px; }
    section { margin-top: 28px; }
    .section-kicker { margin: 0; letter-spacing: 1.4px; font-size: 12px; font-weight: 800; }
    h2 { margin: 6px 0 16px; font-size: 30px; letter-spacing: -0.6px; line-height: 1.05; }
    .entry { display: grid; grid-template-columns: 92px 1fr; gap: 12px; }
    .when { display: flex; gap: 8px; color: var(--muted); font-size: 13px; }
    .when i { width: 10px; height: 10px; margin-top: 3px; border-radius: 50%; background: var(--ink); flex: none; }
    .entry h3 { margin: 0; font-size: 17px; line-height: 1.25; }
    .org { margin: 4px 0 0; font-weight: 800; color: var(--ink); }
    .placeholder { margin-top: 8px; padding: 16px; border-radius: 16px; color: var(--muted); }
    .placeholder strong, .placeholder span, .placeholder p { display: block; color: var(--muted); }
    .placeholder strong { color: var(--ink); }
    .skill { padding: 14px 16px 12px; border-radius: 18px; }
    .project { display: block; margin-bottom: 18px; }
    .shot { height: 190px; border-radius: 18px; background-size: cover; background-position: center; }
    .caption { display: flex; gap: 12px; align-items: flex-start; margin-top: 10px; }
    .caption > span { color: var(--muted); font-weight: 800; font-size: 14px; padding-top: 2px; }
    .caption strong { display: block; font-size: 18px; }
    .caption small { display: block; margin-top: 2px; color: var(--muted); font-size: 14px; }
    .contact { margin-top: 12px; padding: 22px 18px 18px; border-radius: 22px; }
    .contact h2 { margin-bottom: 8px; }
    .lead { margin: 0 0 14px; color: var(--muted); line-height: 1.4; }
    .contact-row { margin: 0 0 10px; padding: 14px 16px; border-radius: 14px; background: var(--glass); border: 1px solid var(--line); }
    .save { display: block; margin-top: 6px; background: var(--btn); color: var(--btn-ink); text-align: center; padding: 14px 16px; font-size: 16px; }
    .footer { margin: 22px 0 0; text-align: center; letter-spacing: 1.4px; font-size: 11px; color: var(--muted); font-weight: 700; }
    ${desktopPortfolioCss(`
      @media (min-width: 760px) {
        .identity { display: grid; grid-template-columns: minmax(280px, 460px) minmax(0, 1fr); gap: 32px; align-items: center; }
        .frame { margin-top: 0; }
        .frame img, .initials { height: 520px; }
        h1 { font-size: 52px; }
        #realisations { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        #realisations > :not(.project) { grid-column: 1 / -1; }
        .project { margin-bottom: 0; }
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
    <div class="identity">
      <div class="frame">
        ${portrait}
        <span class="badge"><i></i>Disponible</span>
      </div>
      <div>
        <h1>${escapeHtml(first || fullName)}${last ? ` <span class="grad">${escapeHtml(last)}</span>` : ''}</h1>
        ${job ? `<p class="role">${escapeHtml(job)}</p>` : ''}
        ${bio ? `<p class="bio">${escapeHtml(bio)}</p>` : ''}
        <div class="actions">
          <a class="pill cta" href="#realisations">Voir mes réalisations</a>
          ${socials}
        </div>
      </div>
    </div>
    ${company ? `<div class="infos"><article class="info"><span>POSTE</span><strong>${escapeHtml(company)}</strong></article></div>` : ''}

    ${experience ? `<section>
      <p class="section-kicker">PARCOURS</p>
      <h2>Expérience <span class="grad">professionnelle</span></h2>
      ${experience}
      <h2 style="margin-top:28px">Expérience pédagogique</h2>
      ${teachings}
    </section>` : ''}

    ${skills ? `<section>
      <p class="section-kicker">SKILLS</p>
      <h2>Ce que je <span class="grad">maîtrise</span></h2>
      ${skills}
    </section>` : ''}

    ${competences}
    ${strengths}

    <section id="realisations">
      <p class="section-kicker">RÉALISATIONS</p>
      <h2>Projets <span class="grad">récents</span></h2>
      ${projectCards}
    </section>

    ${interests}
    <section class="contact" id="contact">
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

const linkedinIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.7 3.3A2.2 2.2 0 1 0 4.7 7.7 2.2 2.2 0 0 0 4.7 3.3zM3 9h3.4v12H3zM10 9h3.3v1.6h.1c.5-.9 1.6-1.8 3.3-1.8 3.5 0 4.2 2.3 4.2 5.3V21H17.5v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H10z"/></svg>';

const instagramIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2zM17.4 6.6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/></svg>';
