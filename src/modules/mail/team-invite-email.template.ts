import type { TeamInviteEmailPayload } from './mail.types';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildTeamInviteEmail(payload: TeamInviteEmailPayload) {
  const greetingName = payload.inviteeFirstName?.trim();
  const greeting = greetingName
    ? `Bonjour ${escapeHtml(greetingName)},`
    : 'Bonjour,';
  const teamName = escapeHtml(payload.teamName);
  const inviterName = escapeHtml(payload.inviterName);
  const inviteUrl = escapeHtml(payload.inviteUrl);
  const to = payload.to.trim();

  const subject = `${payload.inviterName} vous invite à rejoindre ${payload.teamName} sur DropOne`;

  const text = [
    greetingName ? `Bonjour ${greetingName},` : 'Bonjour,',
    '',
    `${payload.inviterName} vous invite à rejoindre l'équipe « ${payload.teamName} » sur DropOne.`,
    '',
    'Pour accepter l\'invitation :',
    '1. Installez l\'application DropOne sur votre téléphone',
    `2. Connectez-vous avec l'adresse e-mail ${to}`,
    '3. Acceptez l\'invitation depuis l\'application',
    '',
    `Ou ouvrez ce lien : ${payload.inviteUrl}`,
    '',
    'Si vous n\'avez pas encore de compte, créez-en un avec cette même adresse e-mail.',
    '',
    '— L\'équipe DropOne',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0c0d10;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:32px 28px;">
          <tr>
            <td>
              <p style="margin:0 0 16px;font-size:14px;color:#5b616e;">DropOne</p>
              <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;font-weight:700;">Invitation équipe</h1>
              <p style="margin:0 0 12px;font-size:16px;line-height:1.5;">${greeting}</p>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;">
                <strong>${inviterName}</strong> vous invite à rejoindre l'équipe
                <strong>${teamName}</strong> sur DropOne.
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#5b616e;">
                Connectez-vous dans l'application avec <strong>${escapeHtml(to)}</strong>
                pour accepter l'invitation. Si vous n'avez pas encore de compte, créez-en un avec cette adresse.
              </p>
              <p style="margin:0 0 28px;text-align:center;">
                <a href="${inviteUrl}" style="display:inline-block;background:#0a6bff;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 24px;border-radius:999px;">
                  Voir l'invitation
                </a>
              </p>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#9aa0ac;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br />
                <a href="${inviteUrl}" style="color:#0a6bff;word-break:break-all;">${inviteUrl}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}
