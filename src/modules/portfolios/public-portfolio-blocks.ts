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

const contactChipStyle =
  'display:inline-flex;align-items:center;gap:8px;margin:0 8px 8px 0;padding:8px 14px;border-radius:999px;border:1px solid var(--line, rgba(255,255,255,.22));font-size:14px;text-decoration:none;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent';

const iconMail =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
const iconPhone =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
const iconPin =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
const iconLinkedin =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.7 3.3A2.2 2.2 0 1 0 4.7 7.7 2.2 2.2 0 0 0 4.7 3.3zM3 9h3.4v12H3zM10 9h3.3v1.6h.1c.5-.9 1.6-1.8 3.3-1.8 3.5 0 4.2 2.3 4.2 5.3V21H17.5v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H10z"/></svg>';
const iconInstagram =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2zM17.4 6.6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/></svg>';

function renderContactChip(options: {
  href?: string;
  icon: string;
  label: string;
}): string {
  const label = escapeHtml(options.label);
  const inner = `${options.icon}<span>${label}</span>`;
  if (!options.href) {
    return `<span class="chip" style="${contactChipStyle}">${inner}</span>`;
  }
  const href = options.href.trim();
  const isAppLink = /^(mailto|tel|sms):/i.test(href);
  const openAttrs = isAppLink
    ? ''
    : ' target="_blank" rel="noopener noreferrer"';
  return `<a class="chip" href="${escapeAttr(href)}" style="${contactChipStyle}"${openAttrs}>${inner}</a>`;
}

/** Section contact style « Centres d'intérêt » + formulaire guest comme sur la carte. */
export function renderContactLeadSection(options: {
  slug: string;
  preview?: boolean;
  className?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  socialLinks?: { platform: string; url: string }[];
}): string {
  const slug = options.slug.trim();
  if (!slug) return '';
  const className = options.className?.trim() || 'contact';
  const previewAttr = options.preview ? ' data-guest-preview="1"' : '';
  const email = options.email?.trim() ?? '';
  const phone = options.phone?.trim() ?? '';
  const address = options.address?.trim() ?? '';
  const socials = options.socialLinks ?? [];
  const linkedin = socials.find((link) => link.platform.toUpperCase() === 'LINKEDIN');
  const instagram = socials.find((link) => link.platform.toUpperCase() === 'INSTAGRAM');

  const contactChips = [
    email
      ? renderContactChip({
          href: `mailto:${email}`,
          icon: iconMail,
          label: email,
        })
      : '',
    phone
      ? renderContactChip({
          href: `tel:${phone.replace(/[^\d+]/g, '')}`,
          icon: iconPhone,
          label: phone,
        })
      : '',
    address
      ? renderContactChip({
          icon: iconPin,
          label: address,
        })
      : '',
    linkedin?.url
      ? renderContactChip({
          href: linkedin.url,
          icon: iconLinkedin,
          label: 'LinkedIn',
        })
      : '',
    instagram?.url
      ? renderContactChip({
          href: instagram.url,
          icon: iconInstagram,
          label: 'Instagram',
        })
      : '',
  ]
    .filter(Boolean)
    .join('');

  const contactMeSection = contactChips
    ? `<section class="${escapeAttr(className)}" style="margin-bottom:8px">
      <h2 style="margin-bottom:4px">Contactez moi</h2>
      <p style="margin:0 0 8px;color:var(--muted, rgba(255,255,255,.6))">Mes coordonnées</p>
      <div>${contactChips}</div>
    </section>`
    : '';

  /* Styles isolés : les h2 portfolio (30px) ne doivent pas écraser le formulaire carte. */
  const guestLeadStyles = `
    .guest-lead {
      margin: 8px 0 0;
      padding: 20px 18px 18px;
      border-radius: 14px;
      border: 1px solid var(--line, rgba(255,255,255,.28));
      background: var(--glass, rgba(255,255,255,.14));
      color: var(--ink, inherit);
      box-shadow: none;
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
    }
    .guest-lead .guest-lead-title,
    .guest-lead h2.guest-lead-title {
      margin: 0;
      font-size: 1.05rem;
      line-height: 1.2;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: inherit;
    }
    .guest-lead .guest-lead-lead {
      margin: 4px 0 8px;
      font-size: 0.88rem;
      line-height: 1.35;
      color: inherit;
      opacity: 0.72;
    }
    .guest-lead .guest-lead-form {
      display: grid;
      gap: 8px;
      padding: 0;
    }
    .guest-lead .guest-lead-field {
      display: block;
      width: 100%;
    }
    .guest-lead .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .guest-lead .guest-lead-input {
      width: 100%;
      height: 48px;
      margin: 0;
      padding: 0 14px;
      border: 1px solid color-mix(in srgb, currentColor 35%, transparent);
      border-radius: 14px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 15px;
      font-weight: 600;
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      box-sizing: border-box;
    }
    .guest-lead .guest-lead-input::placeholder {
      color: inherit;
      opacity: 0.28;
    }
    .guest-lead .guest-lead-input:focus {
      border-color: color-mix(in srgb, currentColor 65%, transparent);
    }
    .guest-lead .guest-lead-error {
      margin: 0;
      font-size: 0.85rem;
      font-weight: 600;
      color: #ff6b6b;
    }
    .guest-lead .guest-lead-submit {
      width: 100%;
      height: 58px;
      margin-top: 0;
      border: 0;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--btn, var(--a, #2F6BFF));
      color: var(--btn-ink, #fff);
      font: inherit;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
    }
    .guest-lead .guest-lead-submit .btn-label {
      flex: 0 1 auto;
      text-align: center;
    }
    .guest-lead .guest-lead-submit:disabled {
      opacity: 0.7;
      cursor: wait;
    }
    .guest-lead .guest-lead-thanks {
      margin: 10px 0 0;
      font-size: 0.95rem;
      font-weight: 700;
      color: inherit;
    }
  `;

  return `${contactMeSection}
    <style>${guestLeadStyles}</style>
    <section class="guest-lead" id="contact" data-guest-lead data-slug="${escapeAttr(slug)}"${previewAttr}>
      <h2 class="guest-lead-title">Laissez moi votre contact</h2>
      <p class="guest-lead-lead">Un projet, une collaboration ? Laissez vos coordonnées.</p>
      <form class="guest-lead-form" data-guest-lead-form novalidate>
        <label class="guest-lead-field">
          <span class="sr-only">Nom et prénom</span>
          <input class="guest-lead-input" type="text" name="fullName" required autocomplete="name" placeholder="Ibrahima Fall" />
        </label>
        <label class="guest-lead-field">
          <span class="sr-only">Email</span>
          <input class="guest-lead-input" type="email" name="email" required autocomplete="email" inputmode="email" placeholder="ibrahima.fall@email.com" />
        </label>
        <label class="guest-lead-field">
          <span class="sr-only">Téléphone</span>
          <input class="guest-lead-input" type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="771234567" />
        </label>
        <p class="guest-lead-error" data-guest-lead-error hidden></p>
        <button class="guest-lead-submit" type="submit">
          <span class="btn-label">Envoyer</span>
        </button>
      </form>
      <p class="guest-lead-thanks" data-guest-lead-thanks hidden>Merci, vos coordonnées ont bien été envoyées.</p>
    </section>
    <script>
    (function () {
      var guestBox = document.querySelector('[data-guest-lead]');
      if (!guestBox) return;
      var storageKey = 'dropone-guest-lead:' + (guestBox.getAttribute('data-slug') || '');
      try {
        if (localStorage.getItem(storageKey) === '1') {
          guestBox.setAttribute('hidden', 'hidden');
          return;
        }
      } catch (e) {}
      var form = guestBox.querySelector('[data-guest-lead-form]');
      var errorEl = guestBox.querySelector('[data-guest-lead-error]');
      var thanksEl = guestBox.querySelector('[data-guest-lead-thanks]');
      if (!form) return;
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (errorEl) { errorEl.setAttribute('hidden', 'hidden'); errorEl.textContent = ''; }
        var fullName = String((form.querySelector('input[name="fullName"]') || {}).value || '').trim();
        var nameParts = fullName.split(/\\s+/).filter(Boolean);
        var firstName = nameParts[0] || '';
        var lastName = nameParts.slice(1).join(' ');
        var email = String((form.querySelector('input[name="email"]') || {}).value || '').trim();
        var phone = String((form.querySelector('input[name="phone"]') || {}).value || '').trim();
        if (!firstName) {
          if (errorEl) { errorEl.textContent = 'Indiquez votre nom et prénom.'; errorEl.removeAttribute('hidden'); }
          return;
        }
        if (!email || email.indexOf('@') < 1) {
          if (errorEl) { errorEl.textContent = 'Indiquez un email valide.'; errorEl.removeAttribute('hidden'); }
          return;
        }
        if (guestBox.getAttribute('data-guest-preview') === '1') {
          form.setAttribute('hidden', 'hidden');
          if (thanksEl) {
            thanksEl.textContent = 'Aperçu : vos visiteurs verront ce formulaire ici.';
            thanksEl.removeAttribute('hidden');
          }
          return;
        }
        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Envoi…'; }
        var slug = guestBox.getAttribute('data-slug') || '';
        fetch('/api/v1/sharing/public/' + encodeURIComponent(slug) + '/guest-contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ firstName: firstName, lastName: lastName, email: email, phone: phone || undefined })
        }).then(function (response) {
          if (!response.ok) throw new Error('fail');
          try { localStorage.setItem(storageKey, '1'); } catch (e) {}
          form.setAttribute('hidden', 'hidden');
          if (thanksEl) thanksEl.removeAttribute('hidden');
        }).catch(function () {
          if (errorEl) {
            errorEl.textContent = 'Envoi impossible. Réessayez.';
            errorEl.removeAttribute('hidden');
          }
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Envoyer'; }
        });
      });
    })();
    </script>`;
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
