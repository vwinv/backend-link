function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildPremiumSuccessPage(): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Paiement réussi | DropOne</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0c0d10;color:#fff;font-family:system-ui,sans-serif;">
  <main style="text-align:center;padding:24px;max-width:420px;">
    <h1 style="font-size:1.5rem;margin:0 0 12px;">Paiement réussi</h1>
    <p style="margin:0;opacity:0.75;line-height:1.6;">
      Votre abonnement DropOne est en cours d'activation. Revenez dans l'application pour profiter de vos avantages Premium.
    </p>
  </main>
</body>
</html>`;
}

export function buildPremiumCancelPage(): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Paiement annulé | DropOne</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0c0d10;color:#fff;font-family:system-ui,sans-serif;">
  <main style="text-align:center;padding:24px;max-width:420px;">
    <h1 style="font-size:1.5rem;margin:0 0 12px;">Paiement annulé</h1>
    <p style="margin:0;opacity:0.75;line-height:1.6;">
      Aucun paiement n'a été effectué. Vous pouvez réessayer depuis l'application DropOne.
    </p>
  </main>
</body>
</html>`;
}

export function buildPremiumSuccessPageWithSession(sessionId: string): string {
  const safeSessionId = escapeHtml(sessionId);
  return buildPremiumSuccessPage().replace(
    '</main>',
    `<p style="margin:16px 0 0;font-size:12px;opacity:0.35;">Réf. ${safeSessionId}</p></main>`,
  );
}
