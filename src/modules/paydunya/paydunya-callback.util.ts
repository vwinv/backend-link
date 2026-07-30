import { Logger, ServiceUnavailableException } from '@nestjs/common';

/**
 * URL publique de base pour l’IPN PayDunya.
 * Callback final : {base}/api/v1/webhooks/paydunya
 */
export function resolvePaydunyaCallbackBaseUrl(logger?: Logger): string {
  let base = (
    process.env.PAYDUNYA_CALLBACK_BASE_URL?.trim() ||
    process.env.PUBLIC_API_URL?.trim() ||
    process.env.APP_PUBLIC_URL?.trim() ||
    ''
  ).replace(/\/$/, '');

  if (!base) {
    throw new ServiceUnavailableException(
      'PUBLIC_API_URL ou PAYDUNYA_CALLBACK_BASE_URL requis pour les paiements PayDunya (IPN)',
    );
  }

  if (!/^https?:\/\//i.test(base)) {
    base = `https://${base.replace(/^\/+/, '')}`;
  }

  let host = '';
  try {
    host = new URL(base).hostname.toLowerCase();
  } catch {
    throw new ServiceUnavailableException(
      'PUBLIC_API_URL invalide pour PayDunya (URL mal formée)',
    );
  }

  const isLocal =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '[::1]' ||
    host.endsWith('.local');

  if (isLocal) {
    const msg =
      'PUBLIC_API_URL pointe vers localhost : PayDunya ne peut pas appeler l’IPN. ' +
      'Utilisez une URL publique (ngrok / Render) ou le bouton de confirmation après SoftPay.';
    logger?.error(msg);
    if (process.env.NODE_ENV === 'production') {
      throw new ServiceUnavailableException(msg);
    }
  }

  return base;
}

export function paydunyaIpnCallbackUrl(logger?: Logger): string {
  const base = resolvePaydunyaCallbackBaseUrl(logger);
  const apiPrefix = (process.env.API_PREFIX ?? 'api/v1').replace(/^\/|\/$/g, '');
  return `${base}/${apiPrefix}/webhooks/paydunya`;
}
