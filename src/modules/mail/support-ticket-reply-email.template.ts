import type { SupportTicketReplyEmailPayload } from './mail.types';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildSupportTicketReplyEmail(
  payload: SupportTicketReplyEmailPayload,
) {
  const firstName = escapeHtml(payload.firstName.trim() || 'Bonjour');
  const replyBody = escapeHtml(payload.replyBody).replaceAll('\n', '<br />');
  const closeUrl = escapeHtml(payload.closeUrl);
  const ticketRef = escapeHtml(payload.ticketId.slice(-8).toUpperCase());

  const subject = `Réponse DropOne Support · ticket ${payload.ticketId.slice(-8).toUpperCase()}`;

  const text = [
    `Bonjour ${payload.firstName.trim() || ''},`.trim(),
    '',
    payload.replyBody.trim(),
    '',
    '—',
    'Si nous avons répondu à votre problème, cliquez ici pour clôturer le ticket :',
    payload.closeUrl,
    '',
    `Référence ticket : ${payload.ticketId.slice(-8).toUpperCase()}`,
    'L’équipe DropOne',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0c0d10;">
  <div style="max-width:560px;margin:32px auto;padding:0 16px;">
    <div style="background:#fff;border-radius:16px;padding:28px 24px;border:1px solid #e8eaee;">
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5;">Bonjour ${firstName},</p>
      <div style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#2b303b;">${replyBody}</div>
      <hr style="border:none;border-top:1px solid #eceef2;margin:24px 0;" />
      <p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#5b616e;">
        Si nous avons répondu à votre problème, cliquez ici pour clôturer le ticket :
      </p>
      <p style="margin:0 0 20px;">
        <a href="${closeUrl}" style="display:inline-block;background:#0c0d10;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-size:14px;font-weight:600;">
          Clôturer le ticket
        </a>
      </p>
      <p style="margin:0;font-size:12px;color:#9aa0ac;">Référence : ${ticketRef} · DropOne Support</p>
    </div>
  </div>
</body>
</html>`;

  return { subject, text, html };
}
