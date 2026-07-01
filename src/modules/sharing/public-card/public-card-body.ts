import type { ProDesignLayout } from '../pro-design/pro-design.types';
import type { PublicCardPageParams } from './public-card.types';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value);
}

function buildInitials(firstName: string, lastName: string): string {
  const first = firstName.trim();
  const last = lastName.trim();
  if (!first && !last) return 'XX';
  if (!last) return first[0]?.toUpperCase() ?? 'X';
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

export function buildCardInitials(params: {
  fullName: string;
  fallback?: string;
}): string {
  if (params.fallback?.trim()) {
    return params.fallback.trim().slice(0, 2).toUpperCase();
  }

  const parts = params.fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return buildInitials(parts[0], '');
  }
  return buildInitials(parts[0] ?? '', parts[parts.length - 1] ?? '');
}

function renderAvatar(
  params: PublicCardPageParams,
  className: string,
  accentColor?: string,
): string {
  const safeInitials = escapeHtml(params.initials);
  const accentStyle = accentColor
    ? ` style="color: ${escapeAttr(accentColor)};"`
    : '';
  if (params.avatarUrl?.trim()) {
    return `<div class="avatar ${className}"${accentStyle}><img src="${escapeAttr(params.avatarUrl.trim())}" alt="${escapeAttr(params.fullName)}" /></div>`;
  }
  return `<div class="avatar ${className}"${accentStyle}>${safeInitials}</div>`;
}

type ButtonSkin =
  | 'primary-accent'
  | 'soft'
  | 'white-accent'
  | 'surface-outline'
  | 'white-outline'
  | 'glass'
  | 'glass-subtle'
  | 'white-dark'
  | 'accent-dark'
  | 'outline-white-soft';

type ActionIcon = 'share' | 'add' | 'phone' | 'mail' | 'portfolio';

function resolveButtonSkins(layout: ProDesignLayout): {
  primary: ButtonSkin;
  secondary: ButtonSkin;
} {
  switch (layout) {
    case 'bubble':
    case 'arc':
      return { primary: 'primary-accent', secondary: 'soft' };
    case 'blancLight':
      return { primary: 'primary-accent', secondary: 'surface-outline' };
    case 'nuit':
      return { primary: 'white-accent', secondary: 'white-outline' };
    case 'azurCentered':
      return { primary: 'white-accent', secondary: 'white-accent' };
    case 'corailGradient':
      return { primary: 'white-accent', secondary: 'glass' };
    case 'degradeNoir':
      return { primary: 'white-dark', secondary: 'glass-subtle' };
    case 'or':
      return { primary: 'accent-dark', secondary: 'outline-white-soft' };
    default:
      return { primary: 'primary-accent', secondary: 'glass' };
  }
}

function resolveSocialSkin(layout: ProDesignLayout): string {
  switch (layout) {
    case 'bubble':
    case 'arc':
      return 'social-soft';
    case 'blancLight':
      return 'social-accent';
    default:
      return 'social-glass';
  }
}

function renderActionIcon(icon: ActionIcon): string {
  const svgOpen =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';

  const paths: Record<ActionIcon, string> = {
    share: `${svgOpen}<path d="M12 3v10"/><path d="m8 7 4-4 4 4"/><path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>`,
    add: `${svgOpen}<circle cx="9" cy="8" r="3.5"/><path d="M3.5 20v-.75A4.25 4.25 0 0 1 7.75 15h2.5"/><path d="M16 11h5"/><path d="M18.5 8.5v5"/></svg>`,
    phone: `${svgOpen}<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    mail: `${svgOpen}<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
    portfolio: `${svgOpen}<path d="m12 2.5 1.35 4.15h4.4l-3.55 2.58 1.35 4.15L12 10.8l-3.55 2.58 1.35-4.15-3.55-2.58h4.4L12 2.5z"/><path d="M5 19h14"/></svg>`,
  };

  return paths[icon];
}

function renderActionButton(options: {
  skin: ButtonSkin;
  icon: ActionIcon;
  label: string;
  tag?: 'button' | 'a';
  attrs?: string;
  disabled?: boolean;
  shareAction?: boolean;
}): string {
  const tag = options.tag ?? 'button';
  const disabledAttr = options.disabled ? ' disabled' : '';
  const shareAttr = options.shareAction ? ' data-share-card' : '';
  const className = `btn btn-${options.skin}${options.disabled ? ' is-disabled' : ''}`;
  const label = escapeHtml(options.label);
  const content = `
    <span class="btn-icon" aria-hidden="true">${renderActionIcon(options.icon)}</span>
    <span class="btn-label">${label}</span>
  `;

  if (tag === 'a') {
    return `<a class="${className}" ${options.attrs ?? ''}>${content}</a>`;
  }

  return `<button class="${className}" type="button"${shareAttr}${options.attrs ?? ''}${disabledAttr}>${content}</button>`;
}

function renderActions(params: PublicCardPageParams): string {
  const phoneHref = params.phone?.trim()
    ? `href="tel:${escapeAttr(params.phone.trim())}"`
    : '';
  const emailHref = params.email?.trim()
    ? `href="mailto:${escapeAttr(params.email.trim())}"`
    : '';
  const vcardHref = `href="${escapeAttr(buildVCardDataUri(params))}" download="${escapeAttr(params.fullName.replace(/\s+/g, '_'))}.vcf"`;

  const skins = resolveButtonSkins(params.design.layout);

  return `
    <div class="actions">
      ${renderActionButton({
        skin: skins.primary,
        icon: 'share',
        label: 'Échanger mes coordonnées',
        shareAction: true,
      })}
      ${renderActionButton({
        skin: skins.secondary,
        icon: 'add',
        label: 'Enregistrer le contact',
        tag: 'a',
        attrs: `${vcardHref} data-save-contact`,
      })}
      ${params.phone?.trim()
        ? renderActionButton({
            skin: skins.secondary,
            icon: 'phone',
            label: 'M’appeler',
            tag: 'a',
            attrs: phoneHref,
          })
        : ''}
      ${params.email?.trim()
        ? renderActionButton({
            skin: skins.secondary,
            icon: 'mail',
            label: 'M’écrire',
            tag: 'a',
            attrs: emailHref,
          })
        : ''}
      ${renderActionButton({
        skin: skins.secondary,
        icon: 'portfolio',
        label: 'Consulter mon portfolio',
        disabled: true,
      })}
    </div>
  `;
}

function renderSocials(params: PublicCardPageParams): string {
  const socialClass = `social-link ${resolveSocialSkin(params.design.layout)}`;

  if (params.socialLinks.length === 0) {
    return `
      <div class="section-label">RÉSEAUX</div>
      <div class="socials">
        <span class="${socialClass}">in</span>
        <span class="${socialClass}">ig</span>
        <span class="${socialClass}">wa</span>
      </div>
    `;
  }

  const links = params.socialLinks
    .map((link) => {
      const label = escapeHtml(
        socialLabel(link.platform, link.label ?? undefined),
      );
      return `<a class="${socialClass}" href="${escapeAttr(link.url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    })
    .join('');

  return `
    <div class="section-label">RÉSEAUX</div>
    <div class="socials">${links}</div>
  `;
}

function socialLabel(platform: string, label?: string): string {
  if (label?.trim()) {
    return label.trim().slice(0, 3).toUpperCase();
  }

  const map: Record<string, string> = {
    LINKEDIN: 'in',
    INSTAGRAM: 'ig',
    WHATSAPP: 'wa',
    TWITTER: 'x',
    FACEBOOK: 'fb',
    GITHUB: 'gh',
    WEBSITE: 'www',
    YOUTUBE: 'yt',
    TIKTOK: 'tt',
    CUSTOM: 'lnk',
  };

  return map[platform] ?? platform.slice(0, 3).toLowerCase();
}

function buildVCardDataUri(params: PublicCardPageParams): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${params.fullName}`,
  ];

  const [firstName, ...rest] = params.fullName.split(/\s+/);
  const lastName = rest.join(' ');
  if (firstName) lines.push(`N:${lastName};${firstName};;;`);
  if (params.email?.trim()) lines.push(`EMAIL:${params.email.trim()}`);
  if (params.phone?.trim()) lines.push(`TEL:${params.phone.trim()}`);
  if (params.subtitle.trim()) lines.push(`TITLE:${params.subtitle.trim()}`);
  lines.push(`URL:${params.pageUrl}`);
  lines.push('END:VCARD');

  return `data:text/vcard;charset=utf-8,${encodeURIComponent(lines.join('\n'))}`;
}

function renderIdentity(params: PublicCardPageParams): string {
  const safeName = escapeHtml(params.fullName);
  const safeSubtitle = escapeHtml(params.subtitle);

  return `
    <h1 class="name">${safeName}</h1>
    ${params.subtitle ? `<p class="subtitle">${safeSubtitle}</p>` : ''}
  `;
}

function renderStandardBody(params: PublicCardPageParams): string {
  const avatarClass =
    params.design.layout === 'blancLight'
      ? 'avatar-accent-fill'
      : params.design.layout === 'nuit'
        ? ''
        : 'avatar-light-ring';

  return `
    <div class="content">
      <div class="avatar-wrap">
        ${renderAvatar(params, avatarClass)}
      </div>
      ${renderIdentity(params)}
      ${renderActions(params)}
      ${renderSocials(params)}
    </div>
  `;
}

function renderBubbleBody(params: PublicCardPageParams): string {
  const accent = escapeAttr(params.design.accentColor);

  return `
    <div class="bubble-stage">
      <div class="bubble-header" aria-hidden="true">
        <svg
          class="bubble-header-shape"
          viewBox="0 0 430 88"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="${accent}"
            d="M0,0 H430 V8 Q430,88 350,88 H271 A56,56 0 0,0 159,88 H80 Q0,88 0,8 Z"
          />
        </svg>
      </div>
      <div class="bubble-avatar-slot">
        ${renderAvatar(params, 'bubble-avatar', params.design.accentColor)}
      </div>
      <div class="bubble-body layout-light">
        ${renderIdentity(params)}
        ${renderActions(params)}
        ${renderSocials(params)}
      </div>
    </div>
  `;
}

function renderArcAvatar(params: PublicCardPageParams): string {
  const safeInitials = escapeHtml(params.initials);
  const accent = escapeAttr(params.design.accentColor);
  const core = params.avatarUrl?.trim()
    ? `<img src="${escapeAttr(params.avatarUrl.trim())}" alt="${escapeAttr(params.fullName)}" />`
    : safeInitials;

  return `
    <div class="arc-avatar-wrap">
      <div class="arc-avatar-ring">
        <div class="arc-avatar-core" style="background: ${accent};">${core}</div>
      </div>
    </div>
  `;
}

function renderArcBody(params: PublicCardPageParams): string {
  const accent = escapeAttr(params.design.accentColor);

  return `
    <div class="arc-stage layout-light" style="background: ${accent};">
      <div class="arc-sheet">
        ${renderIdentity(params)}
        ${renderActions(params)}
        ${renderSocials(params)}
      </div>
      ${renderArcAvatar(params)}
    </div>
  `;
}

export function renderPublicCardBody(params: PublicCardPageParams): string {
  switch (params.design.layout) {
    case 'bubble':
      return renderBubbleBody(params);
    case 'arc':
      return renderArcBody(params);
    default:
      return renderStandardBody(params);
  }
}

export function buildInlineScript(pageUrl: string): string {
  const safeUrl = JSON.stringify(pageUrl);
  const slug = pageUrl.split('/').filter(Boolean).pop() ?? '';
  const safeSlug = JSON.stringify(slug);
  return `
    (function () {
      var shareButton = document.querySelector('[data-share-card]');
      if (shareButton) {
        shareButton.addEventListener('click', function () {
          var url = ${safeUrl};
          var title = document.title;
          if (navigator.share) {
            navigator.share({ title: title, url: url }).catch(function () {});
            return;
          }
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
              var label = shareButton.querySelector('.btn-label');
              if (label) label.textContent = 'Lien copié';
            }).catch(function () {});
          }
        });
      }

      var saveLink = document.querySelector('[data-save-contact]');
      if (!saveLink) return;

      saveLink.addEventListener('click', function () {
        var slug = ${safeSlug};
        if (!slug) return;

        var endpoint = '/api/v1/sharing/public/' + encodeURIComponent(slug) + '/save';
        if (navigator.sendBeacon) {
          navigator.sendBeacon(endpoint, new Blob([], { type: 'application/json' }));
          return;
        }

        fetch(endpoint, { method: 'POST', keepalive: true }).catch(function () {});
      });
    })();
  `;
}

export { escapeHtml };
