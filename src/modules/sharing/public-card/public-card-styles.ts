export const PUBLIC_CARD_STYLES = `
  :root {
    --link-blue: #0a6bff;
    --accent: #0a6bff;
    --text: #ffffff;
    --text-muted: rgba(255, 255, 255, 0.78);
    --btn-height: 58px;
    --radius-lg: 16px;
    --radius-xl: 20px;
    --page-bg: #121212;
    --sheet-bg: transparent;
    --btn-primary-bg: var(--accent);
    --btn-primary-text: #ffffff;
    --btn-muted-bg: rgba(255, 255, 255, 0.12);
    --btn-muted-text: #ffffff;
    --btn-border: rgba(10, 107, 255, 0.55);
    --social-bg: rgba(255, 255, 255, 0.14);
    --social-border: rgba(10, 107, 255, 0.45);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #0c0d10;
    color: var(--text);
    min-height: 100vh;
  }

  body:has(.layout-bubble) {
    background: #ffffff;
  }

  .page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    background: var(--page-bg);
  }

  .layout-arc.page {
    background: var(--accent);
  }

  .shell {
    width: 100%;
    max-width: 430px;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }

  .content {
    padding: 56px 20px 40px;
    padding-top: calc(56px + env(safe-area-inset-top, 0px));
  }

  .layout-arc .content,
  .layout-bubble .content {
    padding-left: 0;
    padding-right: 0;
  }

  .avatar-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .layout-nuit .avatar-wrap {
    justify-content: flex-start;
  }

  .avatar {
    width: 136px;
    height: 136px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -0.5px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .layout-nuit .avatar {
    width: 88px;
    height: 88px;
    border-radius: 18px;
    font-size: 28px;
    background: #ffffff;
    color: var(--accent);
  }

  .layout-or .avatar {
    background: var(--accent);
    color: #1a1a1a;
    box-shadow: 0 0 28px rgba(212, 168, 67, 0.4);
  }

  .avatar-light-ring {
    background: #ffffff;
    color: var(--accent);
    box-shadow: 0 0 28px rgba(255, 255, 255, 0.35);
  }

  .avatar-accent-fill {
    background: var(--accent);
    color: #ffffff;
    box-shadow: 0 0 24px color-mix(in srgb, var(--accent) 35%, transparent);
  }

  .name {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.3px;
    line-height: 1.15;
    text-align: center;
    color: var(--text);
  }

  .layout-nuit .name,
  .layout-nuit .subtitle {
    text-align: left;
  }

  .subtitle {
    margin-top: 8px;
    font-size: 15px;
    line-height: 1.35;
    text-align: center;
    color: var(--text-muted);
  }

  .team-row {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .layout-nuit .team-row {
    justify-content: flex-start;
  }

  .team-logo {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    object-fit: cover;
    background: rgba(255, 255, 255, 0.16);
    flex-shrink: 0;
  }

  .team-name {
    font-size: 15px;
    font-weight: 700;
    line-height: 1.2;
    color: var(--text);
  }

  .address {
    margin-top: 8px;
    font-size: 13px;
    line-height: 1.35;
    text-align: center;
    color: var(--text-muted);
  }

  .layout-nuit .address {
    text-align: left;
  }

  .actions {
    margin-top: 24px;
    display: grid;
    gap: 8px;
  }

  .btn {
    height: 58px;
    border-radius: 16px;
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    padding: 0 16px;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.2;
    text-decoration: none;
    cursor: pointer;
    width: 100%;
    background: transparent;
    color: inherit;
    font-family: inherit;
    appearance: none;
    -webkit-appearance: none;
  }

  .btn-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .btn-icon svg {
    display: block;
    width: 20px;
    height: 20px;
  }

  .btn-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .btn.is-disabled,
  .btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .btn-primary-accent {
    background: var(--accent);
    color: #ffffff;
  }

  .btn-soft {
    background: #f2f2f7;
    color: #0c0d10;
    border-color: transparent;
  }

  .btn-white-accent {
    background: #ffffff;
    color: var(--accent);
  }

  .btn-surface-outline {
    background: #ffffff;
    color: var(--accent);
    border-color: color-mix(in srgb, var(--accent) 35%, transparent);
  }

  .btn-white-outline {
    background: transparent;
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.55);
  }

  .btn-glass {
    background: rgba(255, 255, 255, 0.14);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.28);
  }

  .btn-glass-subtle {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.18);
  }

  .btn-white-dark {
    background: #ffffff;
    color: #0c0d10;
  }

  .btn-accent-dark {
    background: var(--accent);
    color: #1a1a1a;
  }

  .btn-outline-white-soft {
    background: transparent;
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.35);
  }

  .section-label {
    margin-top: 24px;
    margin-bottom: 14px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.1px;
    color: var(--text-muted);
    text-align: left;
  }

  .socials {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .social-link {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2px;
    padding: 10px;
    box-sizing: border-box;
  }

  .social-link .social-logo {
    width: 28px;
    height: 28px;
    object-fit: contain;
    display: block;
  }

  .social-link .social-fallback {
    font-size: 11px;
    font-weight: 800;
    line-height: 1;
  }

  .social-soft {
    background: #f2f2f7;
    color: #0c0d10;
    border: 1px solid #e5e5ea;
  }

  .social-accent {
    background: color-mix(in srgb, var(--accent) 6%, #ffffff);
    color: var(--accent);
    border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  }

  .social-glass {
    background: rgba(255, 255, 255, 0.14);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }

  .layout-corail-gradient .social-glass {
    border-color: rgba(255, 255, 255, 0.28);
  }

  .brand {
    margin-top: 28px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--text-muted);
    font-size: 14px;
    font-weight: 600;
  }

  .brand img {
    width: 22px;
    height: 22px;
    border-radius: 6px;
  }

  .layout-bubble {
    background: #ffffff;
  }

  .layout-bubble .bubble-stage {
    position: relative;
    background: #ffffff;
  }

  .layout-bubble .bubble-header {
    position: relative;
    width: 100%;
    height: 120px;
    line-height: 0;
  }

  .layout-bubble .bubble-header-shape {
    display: block;
    width: 100%;
    height: 120px;
  }

  .layout-bubble .bubble-avatar-slot {
    position: absolute;
    top: 56px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .layout-bubble .bubble-avatar-slot .avatar,
  .layout-bubble .avatar.bubble-avatar {
    width: 112px;
    height: 112px;
    background: #ffffff;
    box-shadow: 0 8px 28px rgba(12, 13, 16, 0.12);
  }

  .layout-bubble .bubble-body {
    margin-top: 96px;
    background: #ffffff;
    padding: 0 20px 40px;
  }

  .layout-arc .shell {
    min-height: 100vh;
    overflow: visible;
  }

  .layout-arc .arc-stage {
    position: relative;
    min-height: 100vh;
    background: var(--accent);
  }

  .layout-arc .arc-sheet {
    position: absolute;
    top: 164px;
    left: 24px;
    right: 24px;
    bottom: 0;
    background: #ffffff;
    border-radius: 50px 50px 0 0;
    padding: 74px 16px 40px;
  }

  .layout-arc .arc-avatar-wrap {
    position: absolute;
    top: 94px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .layout-arc .arc-avatar-ring {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 28px rgba(12, 13, 16, 0.08);
  }

  .layout-arc .arc-avatar-core {
    width: 124px;
    height: 124px;
    border-radius: 50%;
    background: var(--accent);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -0.5px;
    overflow: hidden;
  }

  .layout-arc .arc-avatar-core img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .layout-light {
    --text: #0c0d10;
    --text-muted: rgba(12, 13, 16, 0.62);
  }

  html.embed,
  html.embed body {
    width: 100%;
    min-height: 100%;
    height: auto;
  }

  html.embed body {
    background: transparent;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* height:auto + overflow visible : le contenu long doit scroller dans la WebView */
  html.embed .page {
    width: 100%;
    max-width: none;
    min-height: 100%;
    height: auto;
  }

  html.embed .shell {
    width: 100%;
    max-width: none;
    min-height: 100%;
    height: auto;
    overflow: visible;
  }

  html.embed .content {
    min-height: auto;
    display: flex;
    flex-direction: column;
    padding-top: 104px;
    padding-bottom: 48px;
  }

  html.embed .layout-bubble .bubble-header,
  html.embed .layout-bubble .bubble-header-shape {
    height: 152px;
  }

  html.embed .layout-bubble .bubble-avatar-slot {
    top: 96px;
  }

  html.embed .layout-bubble .bubble-body {
    margin-top: 144px;
    padding-bottom: 48px;
  }

  html.embed .layout-arc .arc-avatar-wrap {
    top: 126px;
  }

  html.embed .layout-arc .arc-stage,
  html.embed .layout-bubble .bubble-stage {
    min-height: 100%;
    height: auto;
  }

  html.embed .layout-arc .shell {
    min-height: 100%;
    height: auto;
    overflow: visible;
  }

  /* Feuille Arc en flux : sinon le contenu absolu ne rallonge pas la page */
  html.embed .layout-arc .arc-sheet {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    bottom: auto;
    margin: 196px 24px 0;
    padding-bottom: 48px;
  }

  html.embed [data-save-contact],
  html.embed [data-download-app],
  html.embed .guest-lead {
    display: none !important;
  }

  .sr-only {
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

  .guest-lead {
    margin: 8px 0 0;
    padding: 20px 18px 18px;
    border-radius: 14px;
    border: 1px solid transparent;
    box-shadow: none;
    color: inherit;
  }

  .layout-bubble .guest-lead,
  .layout-arc .guest-lead {
    margin-left: 0;
    margin-right: 0;
  }

  .guest-lead-title {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: inherit;
  }

  .guest-lead-lead {
    margin: 4px 0 8px;
    font-size: 0.88rem;
    line-height: 1.35;
    color: inherit;
    opacity: 0.72;
  }

  .guest-lead-form {
    display: grid;
    gap: 8px;
    padding: 0;
  }

  .guest-lead-field {
    display: block;
    width: 100%;
  }

  .guest-lead-input {
    width: 100%;
    height: 48px;
    border: 1px solid color-mix(in srgb, currentColor 35%, transparent);
    border-radius: 14px;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    padding: 0 14px;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
  }

  .guest-lead-input::placeholder {
    color: inherit;
    opacity: 0.28;
  }

  .guest-lead-input:focus {
    border-color: color-mix(in srgb, currentColor 65%, transparent);
  }

  .theme-simple .btn-white-accent,
  .theme-simple .btn-surface-outline {
    color: var(--card-color, var(--accent));
  }

  .theme-simple .btn-surface-outline {
    border-color: color-mix(in srgb, var(--card-color, var(--accent)) 35%, transparent);
  }

  .theme-simple .btn-primary-accent {
    background: var(--card-color, var(--accent));
    color: #ffffff;
  }

  .theme-simple .social-accent {
    color: var(--card-color, var(--accent));
    border-color: color-mix(in srgb, var(--card-color, var(--accent)) 20%, transparent);
  }

  .theme-simple .guest-lead,
  .theme-simple .guest-lead-title,
  .theme-simple .guest-lead-lead,
  .theme-simple .guest-lead-thanks,
  .theme-simple .guest-lead-input {
    color: var(--card-color, var(--accent));
  }

  .theme-simple .guest-lead-lead {
    opacity: 0.75;
  }

  .theme-simple .guest-lead-input {
    border-color: color-mix(in srgb, var(--card-color, var(--accent)) 55%, transparent);
  }

  .theme-simple .guest-lead-input::placeholder {
    color: var(--card-color, var(--accent));
    opacity: 0.28;
  }

  .theme-simple .guest-lead-input:focus {
    border-color: var(--card-color, var(--accent));
  }

  .theme-simple .guest-lead-submit.btn {
    background: var(--card-color, var(--accent));
    color: #ffffff;
    border-color: transparent;
  }

  /* Blanc = inversion noir/blanc des boutons */
  .theme-simple-blanc .btn-white-accent {
    background: #0c0d10;
    color: #ffffff;
  }

  .theme-simple-blanc .btn-primary-accent {
    background: #0c0d10;
    color: #ffffff;
  }

  .theme-simple-blanc .guest-lead.btn-white-accent,
  .theme-simple-blanc .guest-lead {
    background: #0c0d10;
    color: #ffffff;
    border-color: transparent;
  }

  .theme-simple-blanc .guest-lead-title,
  .theme-simple-blanc .guest-lead-lead,
  .theme-simple-blanc .guest-lead-thanks,
  .theme-simple-blanc .guest-lead-input {
    color: #ffffff;
  }

  .theme-simple-blanc .guest-lead-input {
    border-color: rgba(255, 255, 255, 0.4);
  }

  .theme-simple-blanc .guest-lead-input::placeholder {
    color: #ffffff;
    opacity: 0.28;
  }

  .theme-simple-blanc .guest-lead-input:focus {
    border-color: #ffffff;
  }

  .theme-simple-blanc .guest-lead-submit.btn {
    background: #ffffff;
    color: #0c0d10;
  }

  .guest-lead-submit.btn {
    margin-top: 0;
    justify-content: center;
  }

  .guest-lead-submit .btn-label {
    flex: 0 1 auto;
    text-align: center;
  }

  .guest-lead-submit.btn:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  .guest-lead-error {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 600;
    color: #ff6b6b;
  }

  .guest-lead-thanks {
    margin: 10px 0 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: inherit;
  }
`;
