"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTeamDashboardEmail = buildTeamDashboardEmail;
function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
function buildTeamDashboardEmail(payload) {
    const firstName = payload.firstName?.trim() ?? '';
    const greeting = firstName ? `Bonjour ${firstName},` : 'Bonjour,';
    const teamName = payload.teamName.trim();
    const dashboardUrl = payload.dashboardUrl.trim();
    const subject = `Votre tableau de bord ${teamName} est prêt`;
    const text = [
        greeting,
        '',
        `Votre espace équipe « ${teamName} » est créé.`,
        'Voici le lien de votre tableau de bord business :',
        dashboardUrl,
        '',
        'Connectez-vous avec l’adresse e-mail de votre compte DropOne.',
        '- L’équipe DropOne',
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
              <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#0a6bff;">DropOne</p>
              <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;font-weight:700;">Votre tableau de bord est prêt</h1>
              <p style="margin:0 0 12px;font-size:16px;line-height:1.5;">${escapeHtml(greeting)}</p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#5b616e;">
                Votre espace équipe <strong style="color:#0c0d10;">${escapeHtml(teamName)}</strong> est créé.
                Ouvrez votre tableau de bord business et connectez-vous avec l’adresse e-mail de votre compte DropOne.
              </p>
              <p style="margin:0 0 28px;text-align:center;">
                <a href="${escapeHtml(dashboardUrl)}" style="display:inline-block;background:#0a6bff;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 24px;border-radius:999px;">
                  Ouvrir le tableau de bord
                </a>
              </p>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#9aa0ac;">
                Si le bouton ne fonctionne pas, copiez ce lien :<br />
                <a href="${escapeHtml(dashboardUrl)}" style="color:#0a6bff;word-break:break-all;">${escapeHtml(dashboardUrl)}</a>
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
//# sourceMappingURL=team-dashboard-email.template.js.map