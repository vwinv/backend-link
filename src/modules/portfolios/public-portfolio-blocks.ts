function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type BlockExperience = {
  role: string;
  company?: string | null;
  period?: string | null;
  missions?: string | null;
};

export type BlockTeaching = {
  title: string;
  school?: string | null;
  year?: string | null;
  audience?: string | null;
};

export type BlockSkill = {
  name: string;
  level: number;
};

export function renderEntryTimeline(items: BlockExperience[]): string {
  return items
    .filter((item) => item.role.trim())
    .map((item) => {
      const company = item.company?.trim() ?? '';
      const period = item.period?.trim() || "AUJOURD'HUI";
      const missions = item.missions?.trim() ?? '';
      return `<article class="entry">
        <div class="when"><i></i><span>${escapeHtml(period)}</span></div>
        <div>
          <h3>${escapeHtml(item.role.trim())}</h3>
          ${company ? `<p class="org">${escapeHtml(company)}</p>` : ''}
          ${missions ? `<p style="margin:6px 0 0;color:var(--muted, rgba(255,255,255,.72));font-size:14px">${escapeHtml(missions)}</p>` : ''}
        </div>
      </article>`;
    })
    .join('');
}

export function renderJobTimeline(items: BlockExperience[]): string {
  const rows = items.filter((item) => item.role.trim());
  if (rows.length === 0) {
    return `<article class="placeholder">
        <p>[ANNÉE]</p>
        <strong>[Intitulé du poste]</strong>
        <span>[Entreprise]</span>
      </article>`;
  }
  return rows
    .map((item) => {
      const company = item.company?.trim() ?? '';
      const period = item.period?.trim() || "AUJOURD'HUI";
      const missions = item.missions?.trim() ?? '';
      return `<article class="job">
        <span class="dot"></span>
        <p class="when">${escapeHtml(period)}</p>
        <h3>${escapeHtml(item.role.trim())}</h3>
        ${company ? `<p class="org">${escapeHtml(company)}</p>` : ''}
        ${missions ? `<p class="org">${escapeHtml(missions)}</p>` : ''}
      </article>`;
    })
    .join('');
}

export function renderTeachings(items: BlockTeaching[]): string {
  const rows = items.filter((item) => item.title.trim());
  if (rows.length === 0) {
    return `<article class="placeholder">
        <p>[ANNÉE]</p>
        <strong>[Intitulé du cours / atelier]</strong>
        <span>[Établissement]</span>
      </article>`;
  }
  return rows
    .map((item) => {
      const year = item.year?.trim() || '[ANNÉE]';
      const school = item.school?.trim() || '';
      const audience = item.audience?.trim() || '';
      return `<article class="placeholder">
        <p>${escapeHtml(year)}</p>
        <strong>${escapeHtml(item.title.trim())}</strong>
        ${school ? `<span>${escapeHtml(school)}</span>` : ''}
        ${audience ? `<span>${escapeHtml(audience)}</span>` : ''}
      </article>`;
    })
    .join('');
}

export function renderSkillBars(items: BlockSkill[]): string {
  const rows = items.filter((item) => item.name.trim());
  if (rows.length === 0) {
    return `<article class="placeholder"><strong>Ajoutez vos compétences</strong></article>`;
  }
  const bars = rows
    .map((item) => {
      const level = Math.max(0, Math.min(100, Math.round(item.level)));
      return `<div class="skill" style="margin:0 0 14px">
        <div style="display:flex;justify-content:space-between;gap:12px;font-size:15px;margin-bottom:6px">
          <span>${escapeHtml(item.name.trim())}</span><span>${level} %</span>
        </div>
        <div style="height:6px;border-radius:99px;background:var(--track, rgba(255,255,255,.16))">
          <div style="width:${level}%;height:100%;border-radius:99px;background:var(--bar, linear-gradient(90deg,var(--a),var(--b)))"></div>
        </div>
      </div>`;
    })
    .join('');
  return `<div class="skill-list">${bars}</div>`;
}

export function renderChipGroup(
  title: string,
  hint: string,
  items: string[],
  className = '',
): string {
  const chips = items.map((item) => item.trim()).filter(Boolean);
  if (chips.length === 0) return '';
  const pills = chips
    .map(
      (item) =>
        `<span class="chip" style="display:inline-flex;margin:0 8px 8px 0;padding:8px 14px;border-radius:999px;border:1px solid var(--line, rgba(255,255,255,.22));font-size:14px">${escapeHtml(item)}</span>`,
    )
    .join('');
  const cls = className ? ` class="${className}"` : '';
  return `<section${cls}>
      <h2 style="margin-bottom:6px">${escapeHtml(title)}</h2>
      <p style="margin:0 0 12px;color:var(--muted, rgba(255,255,255,.6))">${escapeHtml(hint)}</p>
      <div>${pills}</div>
    </section>`;
}

export function renderProfileExtras(
  input: {
    skills?: BlockSkill[];
    competences?: string[];
    strengths?: string[];
    interests?: string[];
  },
  options?: { includeSkills?: boolean; panel?: boolean },
): string {
  const panel = options?.panel ? 'panel' : '';
  const skills =
    options?.includeSkills !== false && input.skills && input.skills.length > 0
      ? `<section${panel ? ' class="panel"' : ''}>
          <p class="section-kicker">SKILLS</p>
          <h2>Ce que je <span class="grad">maîtrise</span></h2>
          ${renderSkillBars(input.skills)}
        </section>`
      : '';
  return (
    skills +
    [
      renderChipGroup('Compétences', 'Savoir-faire métier', input.competences ?? [], panel),
      renderChipGroup('Atouts', 'Ce qui vous distingue', input.strengths ?? [], panel),
      renderChipGroup("Centres d'intérêt", 'Une touche personnelle', input.interests ?? [], panel),
    ].join('')
  );
}
