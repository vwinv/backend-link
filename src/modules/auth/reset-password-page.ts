export type ResetPasswordPageState =
  | { kind: 'form'; token: string; error?: string }
  | { kind: 'invalid' }
  | { kind: 'success' };

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildResetPasswordPage(
  state: ResetPasswordPageState,
): string {
  const title =
    state.kind === 'success'
      ? 'Mot de passe mis à jour'
      : 'Nouveau mot de passe';

  const body =
    state.kind === 'success'
      ? successBody()
      : state.kind === 'invalid'
        ? invalidBody()
        : formBody(state.token, state.error);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} | DropOne</title>
  <style>
    :root {
      --text: #0c0d10;
      --muted: #5b616e;
      --border: #e5e5ea;
      --accent: #0a6bff;
      --error: #b42318;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      background:
        radial-gradient(ellipse 80% 60% at 20% 0%, rgba(10, 107, 255, 0.16), transparent 55%),
        #f4f6fb;
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .card {
      width: min(100%, 420px);
      padding: 36px 32px;
      border-radius: 24px;
      background: #fff;
      border: 1px solid var(--border);
      box-shadow: 0 24px 60px rgba(12, 13, 16, 0.08);
    }
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin: 0 auto 28px;
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.04em;
    }
    .logo-mark {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: var(--accent);
      color: #fff;
      display: grid;
      place-items: center;
      font-size: 1.1rem;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 1.6rem;
      letter-spacing: -0.03em;
      text-align: center;
    }
    .lead {
      margin: 0 0 28px;
      color: var(--muted);
      line-height: 1.5;
      text-align: center;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 0.875rem;
      font-weight: 600;
    }
    input {
      min-height: 48px;
      padding: 0 14px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: #fafbfc;
      font: inherit;
      font-weight: 500;
    }
    input:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(10, 107, 255, 0.15);
      background: #fff;
    }
    .error {
      margin: 0 0 16px;
      padding: 10px 12px;
      border-radius: 10px;
      background: #fff1f1;
      color: var(--error);
      font-size: 0.875rem;
      font-weight: 600;
    }
    button {
      width: 100%;
      min-height: 52px;
      margin-top: 8px;
      border: 0;
      border-radius: 14px;
      background: var(--accent);
      color: #fff;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
    }
    button:hover { background: #0854cc; }
  </style>
</head>
<body>
  <main class="card">
    <div class="logo" aria-label="DropOne">
      <span class="logo-mark">D</span>
      DropOne
    </div>
    ${body}
  </main>
  <script>
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', function (event) {
        const password = form.querySelector('[name="password"]');
        const confirm = form.querySelector('[name="confirmPassword"]');
        if (!password || !confirm) return;
        if (password.value !== confirm.value) {
          event.preventDefault();
          alert('Les deux mots de passe ne correspondent pas.');
        }
      });
    }
  </script>
</body>
</html>`;
}

function formBody(token: string, error?: string): string {
  return `
    <h1>Nouveau mot de passe</h1>
    <p class="lead">Choisissez un mot de passe d’au moins 8 caractères pour retrouver l’accès à votre compte DropOne.</p>
    ${error ? `<p class="error">${escapeHtml(error)}</p>` : ''}
    <form method="post" action="/reset-password">
      <input type="hidden" name="token" value="${escapeHtml(token)}" />
      <label>
        Nouveau mot de passe
        <input type="password" name="password" minlength="8" required autocomplete="new-password" />
      </label>
      <label>
        Confirmer le mot de passe
        <input type="password" name="confirmPassword" minlength="8" required autocomplete="new-password" />
      </label>
      <button type="submit">Enregistrer</button>
    </form>
  `;
}

function invalidBody(): string {
  return `
    <h1>Lien invalide</h1>
    <p class="lead">Ce lien a expiré ou a déjà été utilisé. Demandez une nouvelle réinitialisation depuis l’application DropOne.</p>
  `;
}

function successBody(): string {
  return `
    <h1>Mot de passe mis à jour</h1>
    <p class="lead">Vous pouvez maintenant vous connecter à DropOne avec votre nouveau mot de passe.</p>
  `;
}
