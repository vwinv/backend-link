import { desktopPortfolioCss } from './public-portfolio-desktop';
import {
  renderJobTimeline,
  renderProfileExtras,
  renderSkillBars,
  renderTeachings,
} from './public-portfolio-blocks';
import { hexToRgba, pageWash } from './public-portfolio-wash';

export type CoverSocialLink = {
  platform: string;
  url: string;
};

export type CoverProject = {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  projectUrl?: string | null;
};

export type CoverExperience = {
  role: string;
  company?: string | null;
  period?: string | null;
  missions?: string | null;
};

export type CoverTeaching = {
  title: string;
  school?: string | null;
  year?: string | null;
  audience?: string | null;
};

export type CoverSkill = {
  name: string;
  level: number;
};

export type CoverPortfolioInput = {
  firstName: string;
  lastName: string;
  jobTitle?: string | null;
  company?: string | null;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  photoUrl?: string | null;
  pageUrl: string;
  vcardUrl: string;
  accentStart: string;
  accentEnd: string;
  colorId?: string;
  socialLinks: CoverSocialLink[];
  projects: CoverProject[];
  experiences?: CoverExperience[];
  teachings?: CoverTeaching[];
  skills?: CoverSkill[];
  competences?: string[];
  strengths?: string[];
  interests?: string[];
};

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

const PROJECT_FALLBACKS = [
  ['#5B7CFF', '#7A6CFF'],
  ['#FFB199', '#F08A78'],
  ['#3EC6C6', '#3B8CFF'],
];

export function buildCoverPortfolioHtml(input: CoverPortfolioInput): string {
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
  const accentStart = input.accentStart;
  const accentEnd = input.accentEnd;
  const wash = pageWash(accentStart, accentEnd);
  const heroFade = hexToRgba(accentStart, 0.42);

  const heroMedia = photo
    ? `<img class="hero-photo" src="${escapeAttr(photo)}" alt="" />`
    : `<div class="hero-fallback"><span>${escapeHtml((first[0] ?? '') + (last[0] ?? ''))}</span></div>`;

  const socials = [
    linkedin
      ? `<a class="social" href="${escapeAttr(linkedin.url)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${linkedinIcon}</a>`
      : '',
    instagram
      ? `<a class="social" href="${escapeAttr(instagram.url)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${instagramIcon}</a>`
      : '',
  ].join('');

  const infoCards = [
    company
      ? `<article class="info"><span>POSTE</span><strong>${escapeHtml(company)}</strong></article>`
      : '',
  ].join('');

  const experience = renderJobTimeline(
    input.experiences?.length
      ? input.experiences
      : job
        ? [{ role: job, company, period: "AUJOURD'HUI" }]
        : [],
  );
  const teachings = renderTeachings(input.teachings ?? []);
  const skillBars = renderSkillBars(input.skills ?? []);

  const projectCards =
    input.projects.length > 0
      ? input.projects
          .map((project, index) => {
            const colors = PROJECT_FALLBACKS[index % PROJECT_FALLBACKS.length]!;
            const image = httpUrl(project.imageUrl);
            const style = image
              ? `background-image:url('${escapeAttr(image)}')`
              : `background:linear-gradient(160deg, ${colors[0]}, ${colors[1]})`;
            const href = httpUrl(project.projectUrl);
            const body = `<div class="shot" style="${style}"></div>
              <h3>${escapeHtml(project.title)}</h3>
              ${project.description?.trim() ? `<p>${escapeHtml(project.description.trim())}</p>` : ''}`;
            return href
              ? `<a class="project" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">${body}</a>`
              : `<article class="project">${body}</article>`;
          })
          .join('')
      : `<article class="project"><div class="shot" style="background:linear-gradient(160deg,#5B7CFF,#7A6CFF)"></div><h3>Projet</h3><p>À compléter</p></article>
         <article class="project"><div class="shot" style="background:linear-gradient(160deg,#FFB199,#F08A78)"></div><h3>Projet</h3><p>À compléter</p></article>`;

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
      --a: ${accentStart};
      --b: ${accentEnd};
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
    body { margin: 0; background: var(--b); color: var(--ink); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .page {
      max-width: 480px;
      margin: 0 auto;
      padding-bottom: 28px;
      background: linear-gradient(180deg, var(--a) 0, var(--a) 100vh, var(--b) 100%);
    }
    a { color: inherit; }
    .grad { color: inherit; }
    .hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end; padding: 22px 20px 28px; overflow: hidden; }
    .hero-photo, .hero-fallback { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .hero-fallback { display: flex; align-items: center; justify-content: center; background: linear-gradient(180deg, var(--a), var(--b)); font-size: 64px; font-weight: 800; }
    .hero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.04) 26%, ${heroFade} 54%, var(--a) 76%, var(--a) 100%); }
    .hero-top, .hero-copy { position: relative; z-index: 1; }
    .hero-top { position: absolute; top: 18px; left: 20px; right: 20px; display: flex; align-items: center; justify-content: space-between; z-index: 2; color: #fff; }
    .hello { font-size: 28px; font-weight: 700; letter-spacing: -0.4px; }
    .pill { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; text-decoration: none; font-weight: 700; }
    .ghost { background: rgba(255,255,255,0.28); backdrop-filter: blur(8px); color: #fff; padding: 10px 16px; font-size: 14px; }
    .kicker { margin: 0 0 8px; color: var(--muted); letter-spacing: 1.6px; font-size: 12px; font-weight: 800; }
    h1 { margin: 0; font-size: 40px; line-height: 1.02; letter-spacing: -1px; }
    .role { margin: 8px 0 0; font-size: 18px; font-weight: 800; }
    .bio { margin: 14px 0 0; color: var(--muted); line-height: 1.45; font-size: 15px; }
    .actions { display: flex; align-items: center; gap: 10px; margin-top: 18px; }
    .cta { background: var(--btn); color: var(--btn-ink); padding: 12px 18px; font-size: 15px; }
    .social { width: 42px; height: 42px; border-radius: 50%; border: 1.5px solid var(--line); display: inline-flex; align-items: center; justify-content: center; text-decoration: none; }
    .social svg { width: 18px; height: 18px; fill: var(--ink); }
    .infos { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-top: 18px; }
    .info, .placeholder, .contact, .skill { background: var(--glass); border: 1px solid var(--line); border-radius: 18px; }
    .info { padding: 12px 14px; }
    .info span, .section-kicker { display: block; color: var(--muted); letter-spacing: 1.2px; font-size: 11px; font-weight: 800; }
    .info strong { display: block; margin-top: 6px; font-size: 16px; }
    section { padding: 8px 20px 18px; }
    h2 { margin: 6px 0 16px; font-size: 30px; letter-spacing: -0.6px; line-height: 1.05; }
    .job { position: relative; margin-left: 8px; padding: 0 0 8px 18px; background: transparent; border: 0; border-radius: 0; }
    .job::before { content: ""; position: absolute; left: 3px; top: 8px; bottom: 0; width: 1px; background: var(--line); }
    .dot { position: absolute; left: -2px; top: 4px; width: 11px; height: 11px; border-radius: 50%; background: var(--ink); }
    .when { margin: 0; color: var(--muted); font-size: 13px; letter-spacing: 0.4px; }
    .job h3, .placeholder strong { margin: 4px 0 0; font-size: 18px; }
    .org, .placeholder span, .placeholder p { display: block; margin-top: 2px; color: var(--muted); }
    .placeholder { padding: 16px; color: var(--muted); }
    .placeholder p, .placeholder strong, .placeholder span { color: var(--muted); font-weight: 600; }
    .placeholder strong { color: var(--ink); }
    .skill { padding: 14px 16px 12px; }
    .projects { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .project { text-decoration: none; color: inherit; }
    .shot { height: 148px; border-radius: 18px; background-size: cover; background-position: center; }
    .project h3 { margin: 10px 0 0; font-size: 16px; }
    .project p { margin: 2px 0 0; color: var(--muted); font-size: 13px; }
    .contact { margin: 8px 20px 0; padding: 22px 18px 18px; }
    .contact h2 { margin-bottom: 8px; }
    .contact .lead { margin: 0 0 14px; color: var(--muted); line-height: 1.4; }
    .contact-row { margin: 0 0 10px; padding: 14px 16px; border-radius: 14px; background: var(--glass); border: 1px solid var(--line); }
    .save { display: block; margin-top: 6px; background: var(--btn); color: var(--btn-ink); text-align: center; padding: 14px 16px; font-size: 16px; }
    .footer { margin: 22px 0 8px; text-align: center; letter-spacing: 1.4px; font-size: 11px; color: var(--muted); font-weight: 700; }
    ${desktopPortfolioCss(`
      @media (min-width: 760px) {
        .page { max-width: 1120px; padding-left: 0; padding-right: 0; }
        body, .page { background: linear-gradient(180deg, var(--a) 0, var(--a) 78vh, var(--b) 100%); }
        .hero { min-height: 78vh; padding: 40px 56px 48px; }
        .hero-top { top: 28px; left: 56px; right: 56px; }
        section { padding-left: 56px; padding-right: 56px; }
        h1 { font-size: 64px; }
        .shot { height: 260px; }
      }
      @media (min-width: 1180px) {
        .page { padding-left: 0; padding-right: 0; max-width: 1200px; }
      }
    `, input.colorId)}
  </style>
</head>
<body>
  <div class="page">
    <header class="hero">
      ${heroMedia}
      <div class="hero-top">
        <div class="hello">${escapeHtml(first || fullName)}.</div>
        <a class="pill ghost" href="#contact">Me contacter</a>
      </div>
      <div class="hero-copy">
        <p class="kicker">PORTFOLIO</p>
        <h1>${escapeHtml(first || fullName)}${last ? ` <span class="grad">${escapeHtml(last)}</span>` : ''}</h1>
        ${job ? `<p class="role">${escapeHtml(job)}</p>` : ''}
        ${bio ? `<p class="bio">${escapeHtml(bio)}</p>` : ''}
        <div class="actions">
          <a class="pill cta" href="#realisations">Voir mes réalisations</a>
          ${socials}
        </div>
        ${infoCards ? `<div class="infos">${infoCards}</div>` : ''}
      </div>
    </header>

    <section>
      <p class="section-kicker">PARCOURS</p>
      <h2>Expérience <span class="grad">professionnelle</span></h2>
      ${experience}
      <h2 style="margin-top:28px">Expérience pédagogique</h2>
      ${teachings}
    </section>

    <section>
      <p class="section-kicker">SKILLS</p>
      <h2>Ce que je <span class="grad">maîtrise</span></h2>
      ${skillBars}
    </section>

    <section id="realisations">
      <p class="section-kicker">RÉALISATIONS</p>
      <h2>Projets <span class="grad">récents</span></h2>
      <div class="projects">${projectCards}</div>
    </section>

    ${renderProfileExtras(input, { includeSkills: false })}
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

export function coverAccent(color: string): { start: string; end: string } {
  const palette: Record<string, [string, string]> = {
    bleu: ['#2F6BFF', '#7EB0FF'],
    ivoire: ['#F3EFE6', '#F3EFE6'],
    noir: ['#FFFFFF', '#B7B7B7'],
    foret: ['#0C4630', '#06281C'],
    neon: ['#16132A', '#0A0E1C'],
    corail: ['#FF8A6A', '#FF4F8B'],
    lagon: ['#3DCFC2', '#1E8CFF'],
    lilas: ['#F5C8DF', '#C9A6F0'],
    terre: ['#C2410E', '#7F2B0F'],
    sable: ['#F4EFE4', '#CDB892'],
    soleil: ['#FFE14A', '#FFE14A'],
    minuit: ['#10182C', '#2A3E5C'],
  };
  const pair = palette[color] ?? palette.neon!;
  return { start: pair[0], end: pair[1] };
}
