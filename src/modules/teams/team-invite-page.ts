type TeamInvitePageInput = {
  teamName: string;
  inviterName: string;
  inviteeEmail: string;
  inviteeFirstName?: string | null;
  isExpired: boolean;
  isUnavailable: boolean;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildTeamInviteNotFoundPage(): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invitation introuvable | DropOne</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0c0d10;color:#fff;font-family:system-ui,sans-serif;">
  <main style="text-align:center;padding:24px;max-width:420px;">
    <h1 style="font-size:1.35rem;margin:0 0 8px;">Invitation introuvable</h1>
    <p style="margin:0;opacity:0.75;line-height:1.5;">Ce lien n'existe plus ou l'invitation a déjà été traitée.</p>
  </main>
</body>
</html>`;
}

export function buildTeamInviteLandingPage(input: TeamInvitePageInput): string {
  if (input.isUnavailable) {
    return buildTeamInviteNotFoundPage();
  }

  const greeting = input.inviteeFirstName?.trim()
    ? `Bonjour ${escapeHtml(input.inviteeFirstName.trim())},`
    : 'Bonjour,';
  const teamName = escapeHtml(input.teamName);
  const inviterName = escapeHtml(input.inviterName);
  const inviteeEmail = escapeHtml(input.inviteeEmail);

  const statusBlock = input.isExpired
    ? `<p style="margin:0 0 20px;padding:12px 14px;border-radius:12px;background:#fdecec;color:#b42318;font-size:14px;line-height:1.5;">
         Cette invitation a expiré. Demandez à ${inviterName} de vous renvoyer une invitation.
       </p>`
    : `<ol style="margin:0 0 24px;padding-left:20px;line-height:1.7;font-size:15px;color:#5b616e;">
         <li>Ouvrez l'application <strong>DropOne</strong> sur votre téléphone</li>
         <li>Connectez-vous avec <strong>${inviteeEmail}</strong></li>
         <li>Acceptez l'invitation à l'équipe <strong>${teamName}</strong></li>
       </ol>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invitation équipe | DropOne</title>
</head>
<body style="margin:0;min-height:100vh;background:#0c0d10;color:#fff;font-family:system-ui,sans-serif;">
  <main style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <p style="margin:0 0 12px;font-size:14px;color:rgba(255,255,255,0.55);">DropOne</p>
    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;">Invitation équipe</h1>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:rgba(255,255,255,0.72);">
      ${greeting}<br />
      <strong>${inviterName}</strong> vous invite à rejoindre <strong>${teamName}</strong>.
    </p>
    <section style="background:#151518;border:1px solid #2a2a2e;border-radius:16px;padding:24px;">
      ${statusBlock}
      <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.55);">
        Pas encore de compte ? Créez-en un dans l'application avec la même adresse e-mail.
      </p>
    </section>
  </main>
</body>
</html>`;
}
