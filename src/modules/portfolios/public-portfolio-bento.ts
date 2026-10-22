import { desktopPortfolioCss } from './public-portfolio-desktop';
import type { CoverPortfolioInput } from './public-portfolio-cover';
import {
  renderChipGroup,
  renderEntryTimeline,
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

export function buildBentoPortfolioHtml(input: CoverPortfolioInput): string {
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
    : `<span class="initials">${escapeHtml(`${first[0] ?? ''}${last[0] ?? ''}`)}</span>`;

  const experience = renderEntryTimeline(
    input.experiences?.length
      ? input.experiences
      : job
        ? [{ role: job, company, period: "AUJOURD'HUI" }]
        : [],
  );
  const teachings = renderTeachings(input.teachings ?? []);

  const projectCards = input.projects
    .map((project, index) => {
      const image = httpUrl(project.imageUrl);
      const fallback = index % 2 === 0
        ? 'linear-gradient(160deg,#5B7CFF,#7A6CFF)'
        : 'linear-gradient(160deg,#FFB199,#F08A78)';
      const style = image
        ? `background-image:url('${escapeAttr(image)}')`
        : `background:${fallback}`;
      const href = httpUrl(project.projectUrl);
      const body = `<div class="shot" style="${style}"></div>
        <strong>${escapeHtml(project.title)}</strong>
        ${project.description?.trim() ? `<small>${escapeHtml(project.description.trim())}</small>` : ''}`;
      return href
        ? `<a class="project" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">${body}</a>`
        : `<article class="project">${body}</article>`;
    })
    .join('');

  const wash = pageWash(input.accentStart, input.accentEnd);
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

  const ctaHref = projectCards ? '#realisations' : experience ? '#parcours' : '#contact';

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
    .hello-name { font-size: 28px; font-weight: 700; letter-spacing: -0.4px; }
    .pill { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; font-weight: 700; }
    .ghost { background: var(--btn); color: var(--btn-ink); padding: 10px 16px; font-size: 14px; }
    .bento { display: grid; grid-template-columns: 1.05fr 1fr; gap: 10px; margin-top: 18px; }
    .photo, .tile, .bio, .info { border-radius: 22px; overflow: hidden; }
    .photo { grid-row: span 2; min-height: 230px; background: rgba(0,0,0,0.12); display: flex; align-items: center; justify-content: center; }
    .photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .initials { font-size: 36px; font-weight: 800; }
    .tile { padding: 16px; display: flex; flex-direction: column; justify-content: center; background: var(--glass); border: 1px solid var(--line); }
    .tile .label { margin: 0; letter-spacing: 1.4px; font-size: 11px; font-weight: 800; color: var(--muted); }
    .tile h1 { margin: 8px 0 0; font-size: 28px; line-height: 0.95; letter-spacing: -0.8px; }
    .job { background: var(--btn); color: var(--btn-ink); border: 0; font-size: 18px; font-weight: 800; line-height: 1.25; }
    .bio { margin-top: 10px; padding: 16px; background: var(--glass); border: 1px solid var(--line); color: var(--muted); line-height: 1.45; font-size: 15px; }
    .infos { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
    .info, .placeholder, .skill-card, .contact { background: var(--glass); border: 1px solid var(--line); }
    .info { padding: 12px 14px; }
    .info span, .section-kicker { display: block; letter-spacing: 1.2px; font-size: 11px; font-weight: 800; color: var(--muted); }
    .info strong { display: block; margin-top: 6px; font-size: 16px; }
    .cta { display: flex; width: 100%; margin-top: 12px; padding: 14px 18px; background: var(--btn); color: var(--btn-ink); font-size: 16px; }
    section { margin-top: 28px; }
    .section-kicker { margin: 0 0 6px; }
    h2 { margin: 0 0 16px; font-size: 30px; letter-spacing: -0.6px; line-height: 1.05; }
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
    .projects { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .project { display: block; }
    .shot { height: 160px; border-radius: 18px; background-size: cover; background-position: center; }
    .project strong { display: block; margin-top: 8px; }
    .project small { display: block; margin-top: 2px; color: var(--muted); }
    .contact { margin-top: 28px; padding: 22px 18px 18px; border-radius: 22px; }
    .contact h2 { margin-bottom: 8px; }
    .lead { margin: 0 0 14px; color: var(--muted); line-height: 1.4; }
    .contact-row { margin: 0 0 10px; padding: 14px 16px; border-radius: 14px; background: var(--glass); border: 1px solid var(--line); }
    .save { display: block; margin-top: 6px; background: var(--btn); color: var(--btn-ink); text-align: center; padding: 14px 16px; font-size: 16px; }
    .footer { margin: 22px 0 0; text-align: center; letter-spacing: 1.4px; font-size: 11px; color: var(--muted); font-weight: 700; }
    ${desktopPortfolioCss(`
      @media (min-width: 760px) {
        .bento { grid-template-columns: minmax(280px, 420px) minmax(0, 1fr); gap: 16px; }
        .photo { min-height: 420px; }
        .tile h1 { font-size: 40px; }
        .shot { height: 220px; }
      }
    `, input.colorId)}
  </style>
</head>
<body>
  <div class="page">
    <div class="top">
      <div class="hello-name">${escapeHtml(first || fullName)}.</div>
      <a class="pill ghost" href="#contact">Me contacter</a>
    </div>
    <div class="bento">
      <div class="photo">${portrait}</div>
      <div class="tile">
        <p class="label">BONJOUR</p>
        <h1>
          <span>${escapeHtml(first || fullName)}</span><br />
          ${last ? `<span class="grad">${escapeHtml(last)}</span>` : ''}
        </h1>
      </div>
      <div class="tile job">${job ? escapeHtml(job) : 'Portfolio'}</div>
    </div>
    ${bio ? `<p class="bio">${escapeHtml(bio)}</p>` : ''}
    ${company ? `<div class="infos"><article class="info"><span>POSTE</span><strong>${escapeHtml(company)}</strong></article></div>` : ''}
    <a class="pill cta" href="${ctaHref}">Voir mes réalisations</a>

    ${experience ? `<section id="parcours">
      <p class="section-kicker">PARCOURS</p>
      <h2>Expérience <span class="grad">professionnelle</span></h2>
      ${experience}
      <h2 style="margin-top:26px">Expérience pédagogique</h2>
      ${teachings}
    </section>` : ''}

    ${skillCards ? `<section>
      <p class="section-kicker">SKILLS</p>
      <h2>Ce que je <span class="grad">maîtrise</span></h2>
      <div class="skills">${skillCards}</div>
    </section>` : ''}

    ${competences}
    ${strengths}

    ${projectCards ? `<section id="realisations">
      <p class="section-kicker">RÉALISATIONS</p>
      <h2>Projets <span class="grad">récents</span></h2>
      <div class="projects">${projectCards}</div>
    </section>` : ''}

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
