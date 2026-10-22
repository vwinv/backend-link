/** Règles ajoutées aux pages publiques : le téléphone reste identique, l’ordinateur s’élargit. */
export function desktopPortfolioCss(extra = '', colorId = ''): string {
  return `
    @media (min-width: 760px) {
      body {
        min-height: 100vh;
        background: linear-gradient(180deg, var(--a) 0%, var(--b) 100%);
      }
      .page {
        max-width: 960px;
        padding-left: 40px;
        padding-right: 40px;
      }
      .projects { grid-template-columns: 1fr 1fr; gap: 16px; }
      .skills { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .skill-list { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 28px; }
      .shot { height: 220px; }
    }
    @media (min-width: 1180px) {
      .page { max-width: 1120px; padding-left: 56px; padding-right: 56px; }
      .projects { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .skills { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
    ${extra}
    ${colorId === 'neon' ? neonAccentCss() : ''}
    ${colorId === 'terre' ? terreAccentCss() : ''}
    ${colorId === 'lilas' ? lilasAccentCss() : ''}
    ${colorId === 'ivoire' ? ivoireAccentCss() : ''}
    ${colorId === 'soleil' ? soleilAccentCss() : ''}
  `;
}

function ivoireAccentCss(): string {
  return `
    :root {
      --btn: #B45428;
      --btn-ink: #ffffff;
      --bar: #B45428;
      --glass: #ffffff;
    }
    .grad, .skill-card strong { color: #B45428; }
    .section-kicker, .kicker, .label { color: #B45428; }
    .when i, .arrow, .fill { background: #B45428; }
    .arrow { color: #ffffff; }
    .ghost, .cta, .contact-btn, .save {
      background: #B45428;
      color: #ffffff;
    }
  `;
}

function soleilAccentCss(): string {
  return `
    :root {
      --ink: #111111;
      --muted: rgba(17, 17, 17, 0.72);
      --btn: #111111;
      --btn-ink: #FFE14A;
      --bar: #111111;
      --glass: #ffffff;
      --line: #111111;
      --track: rgba(17, 17, 17, 0.16);
    }
    body, .page { color: #111111; background: #FFE14A; }
    .grad, .org, .skill-card strong { color: #111111; }
    .section-kicker, .kicker, .label { color: #111111; }
    .ghost, .cta, .contact-btn, .save {
      background: #111111;
      color: #FFE14A;
      border: 2px solid #111111;
      border-radius: 12px;
      box-shadow: 4px 4px 0 #111111;
    }
    .info, .project, .contact, .placeholder, .skill, .skill-card, .panel, .bio, .tile {
      background-color: #ffffff;
      border: 2px solid #111111;
      box-shadow: 4px 4px 0 #111111;
    }
    .skill, .bio { padding: 14px 16px 12px; }
    .contact-row {
      background: #ffffff;
      border: 2px solid #111111;
      box-shadow: none;
    }
    .chip {
      background: #ffffff !important;
      border: 2px solid #111111 !important;
      color: #111111;
      box-shadow: 3px 3px 0 #111111;
    }
    .social {
      border-radius: 10px;
      border: 2px solid #111111;
      background: #ffffff;
      box-shadow: 3px 3px 0 #111111;
    }
    .social svg { fill: #111111; }
    .ring, .photo, .frame, .avatar {
      border: 3px solid #111111;
      box-shadow: 8px 8px 0 #111111;
    }
    .ring { background: #111111; }
    .when i, .arrow, .fill { background: #111111; color: #FFE14A; }
    .arrow { box-shadow: 3px 3px 0 #111111; }
  `;
}

function terreAccentCss(): string {
  return `
    :root { --bar: #FC874D; }
    .grad, .skill-card strong { color: #FC874D; }
    .section-kicker { color: #FC874D; }
    .when i, .arrow { background: #FC874D; color: #3A1408; }
    .ghost, .cta, .contact-btn, .save {
      background: #FC874D;
      color: #3A1408;
    }
    .fill { background: #FC874D; }
  `;
}

function lilasAccentCss(): string {
  return `
    :root {
      --ink: #2A163E;
      --muted: rgba(42, 22, 62, 0.72);
      --btn: #2A163E;
      --btn-ink: #ffffff;
      --bar: #2A163E;
    }
    body, .page { color: #2A163E; }
    .section-kicker, .kicker, .label { color: #2A163E; }
    .when i, .fill { background: #2A163E; }
    .skill-card strong { color: #2A163E; }
  `;
}

function neonAccentCss(): string {
  return `
    :root { --bar: linear-gradient(90deg, #3EC8FF, #A06CFF); }
    .grad, .org, .skill-card strong {
      background-image: linear-gradient(100deg, #3EE0FF 0%, #6E8CFF 45%, #B06CFF 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .section-kicker { color: #3EC8FF; }
    .when i { background: #3EC8FF; }
    .ghost, .cta, .contact-btn {
      background: linear-gradient(90deg, #3EC8FF, #7A5CFF);
      color: #fff;
    }
    .contact {
      background: linear-gradient(165deg, #3B2A86 0%, #6A3EBE 58%, #8B4FE0 100%);
      border-color: transparent;
    }
    .contact .contact-row {
      background: rgba(255,255,255,0.12);
      border-color: rgba(255,255,255,0.18);
    }
    .save { background: #fff; color: #2A1868; }
    .fill { background: linear-gradient(90deg, #3EC8FF, #A06CFF); }
  `;
}
