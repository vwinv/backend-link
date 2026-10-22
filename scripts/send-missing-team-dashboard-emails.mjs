/**
 * Envoie le lien du tableau de bord aux propriétaires d'équipes actives
 * qui ne l'ont jamais reçu (équipes créées avant cet e-mail).
 *
 * Usage :
 *   node scripts/send-missing-team-dashboard-emails.mjs
 *
 * Le lien public est https://dropone.pro/espace_{slug}
 * (APP_LANDING_URL locale n'est pas utilisée).
 */
import 'dotenv/config';
import pg from 'pg';
import nodemailer from 'nodemailer';

const LANDING_URL = 'https://dropone.pro';

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildEmail({ firstName, teamName, dashboardUrl }) {
  const greeting = firstName ? `Bonjour ${firstName},` : 'Bonjour,';
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

function databaseUrl() {
  const fromEnv = process.env.CATCHUP_DATABASE_URL?.trim();
  return fromEnv || process.env.DATABASE_URL;
}

const connectionString = databaseUrl();
if (!connectionString) {
  console.error('DATABASE_URL manquante');
  process.exit(1);
}

const needsSsl = !/localhost|127\.0\.0\.1/.test(connectionString);
const pool = new pg.Pool({
  connectionString,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
});

const host = process.env.SMTP_HOST?.trim();
const user = process.env.SMTP_USER?.trim();
const password = process.env.SMTP_PASSWORD ?? '';
const from = process.env.MAIL_FROM?.trim() || 'Drop One <contact@mega-sn.com>';

if (process.env.SMTP_ENABLED === 'false' || !host || !user || !password) {
  console.error('SMTP non configuré');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user, pass: password },
});

const { rows } = await pool.query(`
  SELECT t.name, t.slug, u.email, u."firstName"
  FROM teams t
  JOIN users u ON u.id = t."ownerId"
  WHERE t."isActive" = true
    AND u."isActive" = true
    AND u.email IS NOT NULL
    AND btrim(u.email) <> ''
  ORDER BY t."createdAt" ASC
`);

console.log(`${rows.length} propriétaire(s) à notifier`);

let sent = 0;
let failed = 0;

for (const row of rows) {
  const dashboardUrl = `${LANDING_URL}/espace_${row.slug}`;
  const email = buildEmail({
    firstName: row.firstName?.trim() || '',
    teamName: row.name,
    dashboardUrl,
  });
  try {
    await transporter.sendMail({
      from,
      to: row.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
    sent += 1;
    console.log(`envoyé  ${row.email}  ${row.name}  ${dashboardUrl}`);
  } catch (error) {
    failed += 1;
    const message = error instanceof Error ? error.message : 'envoi impossible';
    console.error(`échec   ${row.email}  ${row.name}  ${message}`);
  }
}

await pool.end();
console.log(`terminé : ${sent} envoyé(s), ${failed} échec(s)`);
if (failed > 0) process.exit(1);
