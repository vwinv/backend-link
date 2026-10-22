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

export function buildEditorialPortfolioHtml(input: CoverPortfolioInput): string {
  const first = input.firstName.trim();
  const last = input.lastName.trim();
  const fullName = `${first} ${last}`.trim() || 'Portfolio';
  const photo = httpUrl(input.photoUrl);
  const bio = input.bio?.trim() ?? '';
  const job = input.jobTitle?.trim() ?? '';
  const company = input.company?.trim() ?? '';
  const email = input.email?.trim() ?? '';
  const phone = input.phone?.trim() ?? '';
  const year = new Date().getFullYear();
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

  const meta = company
    ? `<div class="meta"><span>POSTE</span><strong>${escapeHtml(company)}</strong></div>`
    : '';

  const experience = renderEntryTimeline(
    input.experiences?.length
      ? input.experiences
      : job
        ? [{ role: job, company, period: "AUJOURD'HUI" }]
        : [],
  );

  const projectCards = input.projects
    .map((project, index) => {
      const image = httpUrl(project.imageUrl);
      const fallback = index % 2 === 0
        ? 'linear-gradient(160deg,#5B7CFF,#7A6CFF)'
        : 'linear-gradient(160deg,#FFB199,#F08A78)';
      const style = image
        ? `background-image:url('${escapeAttr(image)}')`
        : `background:${fallback}`;
      const number = String(index + 1).padStart(2, '0');
      const href = httpUrl(project.projectUrl);
      const body = `<div class="project-head"><span class="num">${number}</span><div><h3>${escapeHtml(project.title)}</h3>${
        project.description?.trim()
          ? `<p>${escapeHtml(project.description.trim())}</p>`
          : ''
      }</div></div><div class="shot" style="${style}"></div>`;
      return href
        ? `<a class="project" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">${body}</a>`
        : `<article class="project">${body}</article>`;
    })
    .join('');

  const wash = pageWash(input.accentStart, input.accentEnd);
  const teachings = renderTeachings(input.teachings ?? []);
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
      padding: 22px 22px 36px;
      background: linear-gradient(180deg, var(--a) 0%, var(--b) 100%);
    }
    a { color: inherit; }
    .grad { color: inherit; }
    .top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .kicker { margin: 0; letter-spacing: 1.6px; font-size: 12px; font-weight: 700; color: var(--muted); }
    .link { color: var(--ink); font-weight: 700; font-size: 15px; text-decoration: underline; text-underline-offset: 4px; }
    .mast { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-top: 28px; }
    h1 { margin: 0; font-size: 48px; line-height: 0.92; letter-spacing: -1.4px; display: flex; flex-direction: column; }
    .photo { width: 108px; height: 108px; border-radius: 50%; overflow: hidden; flex: none; background: rgba(0,0,0,0.12); display: flex; align-items: center; justify-content: center; }
    .photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .initials { font-size: 28px; font-weight: 800; }
    .role { margin: 18px 0 0; font-size: 18px; font-weight: 800; }
    .bio { margin: 8px 0 0; color: var(--muted); line-height: 1.45; font-size: 15px; }
    .rule { height: 1px; margin: 18px 0; background: var(--line); }
    .meta { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding: 10px 0; border-bottom: 1px solid var(--line); }
    .meta span { letter-spacing: 1.3px; font-size: 12px; font-weight: 800; color: var(--muted); }
    .meta strong { font-size: 16px; }
    .actions { display: flex; align-items: center; gap: 10px; margin-top: 16px; }
    .pill { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; text-decoration: none; font-weight: 700; }
    .cta { background: var(--btn); color: var(--btn-ink); padding: 12px 18px; font-size: 15px; }
    .social { width: 42px; height: 42px; border-radius: 50%; border: 1.5px solid var(--line); display: inline-flex; align-items: center; justify-content: center; }
    .social svg { width: 18px; height: 18px; fill: var(--ink); }
    section { margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--line); }
    .section-kicker { margin: 0; color: var(--muted); letter-spacing: 1.4px; font-size: 12px; font-weight: 800; }
    h2 { margin: 6px 0 16px; font-size: 30px; letter-spacing: -0.6px; line-height: 1.05; }
    .entry { display: grid; grid-template-columns: 108px 1fr; gap: 12px; align-items: start; }
    .when { display: block; color: var(--muted); font-size: 12px; letter-spacing: 0.4px; line-height: 1.35; }
    .when i { display: none; }
    .entry h3 { margin: 0; font-size: 18px; line-height: 1.2; }
    .org { margin: 4px 0 0; font-weight: 700; color: var(--ink); }
    .placeholder, .skill, .contact { background: var(--glass); border: 1px solid var(--line); border-radius: 18px; }
    .placeholder { padding: 16px; color: var(--muted); }
    .placeholder strong, .placeholder span, .placeholder p { display: block; color: var(--muted); }
    .placeholder strong { color: var(--ink); margin-top: 4px; }
    .skill { padding: 14px 16px 12px; }
    .projects { display: grid; grid-template-columns: 1fr; gap: 22px; }
    .project { text-decoration: none; color: inherit; display: block; }
    .project-head { display: grid; grid-template-columns: 36px 1fr; gap: 8px; margin-bottom: 12px; }
    .num { font-size: 14px; font-weight: 800; color: var(--muted); }
    .shot { height: 190px; border-radius: 18px; background-size: cover; background-position: center; }
    .project h3 { margin: 0; font-size: 18px; }
    .project p { margin: 2px 0 0; color: var(--muted); font-size: 14px; }
    .contact { margin-top: 22px; padding: 22px 18px 18px; }
    .contact h2 { margin-bottom: 8px; }
    .lead { margin: 0 0 14px; color: var(--muted); line-height: 1.4; }
    .contact-row { margin: 0 0 10px; padding: 14px 16px; border-radius: 14px; background: var(--glass); border: 1px solid var(--line); }
    .save { display: block; margin-top: 6px; background: var(--btn); color: var(--btn-ink); text-align: center; padding: 14px 16px; font-size: 16px; }
    .footer { margin: 22px 0 0; text-align: center; letter-spacing: 1.4px; font-size: 11px; color: var(--muted); font-weight: 700; }
    ${desktopPortfolioCss(`
      @media (min-width: 760px) {
        h1 { font-size: 72px; }
        .photo { width: 140px; height: 140px; }
        .shot { height: 260px; }
      }
    `, input.colorId)}
  </style>
</head>
<body>
  <div class="page">
    <div class="top">
      <p class="kicker">PORTFOLIO · ${year}</p>
      <a class="link" href="#contact">Me contacter</a>
    </div>
    <div class="mast">
      <h1>
        <span>${escapeHtml(first || fullName)}</span>
        ${last ? `<span class="grad">${escapeHtml(last)}</span>` : ''}
      </h1>
      <div class="photo">${portrait}</div>
    </div>
    ${job ? `<p class="role">${escapeHtml(job)}</p>` : ''}
    ${bio ? `<p class="bio">${escapeHtml(bio)}</p>` : ''}
    ${meta ? `<div class="rule"></div>${meta}` : ''}
    <div class="actions">
      <a class="pill cta" href="#realisations">Voir mes réalisations</a>
      ${socials}
    </div>

    ${experience ? `<section>
      <p class="section-kicker">PARCOURS</p>
      <h2>Expérience <span class="grad">professionnelle</span></h2>
      ${experience}
    </section>` : ''}

    <section>
      <h2>Expérience pédagogique</h2>
      ${teachings}
    </section>

    ${skills ? `<section>
      <p class="section-kicker">SKILLS</p>
      <h2>Ce que je <span class="grad">maîtrise</span></h2>
      ${skills}
    </section>` : ''}

    ${competences}
    ${strengths}

    ${projectCards ? `<section id="realisations">
      <p class="section-kicker">RÉALISATIONS</p>
      <h2>Projets <span class="grad">récents</span></h2>
      <div class="projects">${projectCards}</div>
    </section>` : '<div id="realisations"></div>'}

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
