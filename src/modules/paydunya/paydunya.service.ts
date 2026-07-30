import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import type {
  PaydunyaSoftPayResponse,
  SoftPayFreeMoneySenegalInput,
  SoftPayOrangeMoneySenegalInput,
  SoftPayWaveSenegalInput,
} from './paydunya-softpay.types';

export type CreatePaydunyaInvoiceInput = {
  totalAmountFcfa: number;
  description: string;
  storeName: string;
  callbackUrl: string;
  returnUrl?: string;
  cancelUrl?: string;
  customData: Record<string, string | number | boolean | null | undefined>;
};

export type CreatePaydunyaInvoiceResult = {
  checkoutUrl: string;
  invoiceToken: string;
  responseCode: string;
  responseText: string;
};

export type PaydunyaConfirmInvoiceResult = {
  hash: string;
  status: string;
  totalAmount: number;
  invoiceToken: string;
  customData: Record<string, unknown>;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function strVal(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return '';
}

function redactSoftPayBodyForLog(
  body: Record<string, unknown>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(body)) {
    const s = val == null ? '' : typeof val === 'string' ? val : String(val);
    if (/token/i.test(key)) {
      out[key] = s.length > 8 ? `${s.slice(0, 6)}…` : '[redacted]';
    } else if (/phone|tel/i.test(key)) {
      out[key] = s.length >= 2 ? `***${s.slice(-2)}` : '[redacted]';
    } else if (/email/i.test(key)) {
      out[key] = s.length > 0 ? '[redacted]' : '';
    } else if (/name|fullname/i.test(key)) {
      out[key] = s.length > 24 ? `${s.slice(0, 24)}…` : s;
    } else {
      out[key] = s.length > 120 ? `${s.slice(0, 120)}…` : s;
    }
  }
  return out;
}

@Injectable()
export class PaydunyaService {
  private readonly logger = new Logger(PaydunyaService.name);

  private masterKey(): string {
    const k = process.env.PAYDUNYA_MASTER_KEY?.trim();
    if (!k) {
      throw new ServiceUnavailableException(
        'Paiement indisponible : PAYDUNYA_MASTER_KEY manquant',
      );
    }
    return k;
  }

  private privateKey(): string {
    const k = process.env.PAYDUNYA_PRIVATE_KEY?.trim();
    if (!k) {
      throw new ServiceUnavailableException(
        'Paiement indisponible : PAYDUNYA_PRIVATE_KEY manquant',
      );
    }
    return k;
  }

  private token(): string {
    const k = process.env.PAYDUNYA_TOKEN?.trim();
    if (!k) {
      throw new ServiceUnavailableException(
        'Paiement indisponible : PAYDUNYA_TOKEN manquant',
      );
    }
    return k;
  }

  private baseUrl(): string {
    return (
      process.env.PAYDUNYA_API_BASE_URL?.trim() || 'https://app.paydunya.com'
    ).replace(/\/$/, '');
  }

  private paydunyaAuthHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'PAYDUNYA-MASTER-KEY': this.masterKey(),
      'PAYDUNYA-PRIVATE-KEY': this.privateKey(),
      'PAYDUNYA-TOKEN': this.token(),
    };
  }

  private parseSoftPayResponse(raw: unknown): PaydunyaSoftPayResponse {
    if (!isRecord(raw)) {
      return { success: false, message: 'Réponse SoftPay invalide' };
    }
    const success = raw['success'] === true;
    const message = strVal(raw['message']).trim() || undefined;
    const url = strVal(raw['url']).trim() || undefined;
    let other_url: PaydunyaSoftPayResponse['other_url'];
    const ou = raw['other_url'];
    if (isRecord(ou)) {
      const om = strVal(ou['om_url']).trim();
      const mx = strVal(ou['maxit_url']).trim();
      if (om || mx) {
        other_url = {
          ...(om ? { om_url: om } : {}),
          ...(mx ? { maxit_url: mx } : {}),
        };
      }
    }
    const feesRaw = raw['fees'];
    const fees =
      typeof feesRaw === 'number' && Number.isFinite(feesRaw)
        ? feesRaw
        : undefined;
    const currency = strVal(raw['currency']).trim() || undefined;
    const data = raw['data'];
    const return_url = strVal(raw['return_url']).trim() || undefined;
    const token = strVal(raw['token']).trim() || undefined;
    const errors = raw['errors'];
    return {
      success,
      message,
      url,
      other_url,
      fees,
      currency,
      data: data !== undefined ? data : undefined,
      errors: errors !== undefined ? errors : undefined,
      return_url,
      token,
    };
  }

  async softPayPost(
    path: string,
    body: Record<string, unknown>,
  ): Promise<PaydunyaSoftPayResponse> {
    const p = path.startsWith('/') ? path : `/${path}`;
    const url = `${this.baseUrl()}${p}`;
    this.logger.log(
      `PayDunya SoftPay → POST ${p} body=${JSON.stringify(redactSoftPayBodyForLog(body))}`,
    );
    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: this.paydunyaAuthHeaders(),
        body: JSON.stringify(body),
      });
    } catch (e) {
      this.logger.warn(`SoftPay ${p}: fetch error ${String(e)}`);
      throw new ServiceUnavailableException('Réseau PayDunya indisponible');
    }
    const rawText = await res.text();
    let parsed: unknown;
    try {
      parsed = rawText ? JSON.parse(rawText) : {};
    } catch {
      this.logger.warn(
        `SoftPay ${p}: réponse non JSON ${rawText.slice(0, 200)}`,
      );
      return { success: false, message: 'Réponse PayDunya non JSON' };
    }
    const out = this.parseSoftPayResponse(parsed);
    if (!res.ok) {
      return {
        ...out,
        success: false,
        message: out.message || `HTTP ${String(res.status)}`,
      };
    }
    return out;
  }

  isConfigured(): boolean {
    if (process.env.PAYDUNYA_ENABLED === 'false') {
      return false;
    }
    try {
      this.masterKey();
      this.privateKey();
      this.token();
      return true;
    } catch {
      return false;
    }
  }

  /** SHA-512 du Master Key (vérification IPN selon doc PayDunya). */
  verifyIpnHash(receivedHash: string | undefined | null): boolean {
    const mk = process.env.PAYDUNYA_MASTER_KEY?.trim();
    if (!mk || !receivedHash || typeof receivedHash !== 'string') return false;
    const expected = createHash('sha512').update(mk, 'utf8').digest('hex');
    const a = receivedHash.trim().toLowerCase();
    const b = expected.toLowerCase();
    return a.length === b.length && a === b;
  }

  async createCheckoutInvoice(
    input: CreatePaydunyaInvoiceInput,
  ): Promise<CreatePaydunyaInvoiceResult> {
    const url = `${this.baseUrl()}/api/v1/checkout-invoice/create`;
    const amount = Math.round(Number(input.totalAmountFcfa));
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new ServiceUnavailableException('Montant facture invalide');
    }

    const body = {
      invoice: {
        total_amount: amount,
        description: input.description.slice(0, 500),
      },
      store: {
        name: input.storeName.slice(0, 200),
      },
      custom_data: Object.fromEntries(
        Object.entries(input.customData).filter(
          ([, v]) => v !== undefined && v !== null && String(v).length > 0,
        ),
      ) as Record<string, string | number | boolean>,
      actions: {
        callback_url: input.callbackUrl,
        ...(input.returnUrl ? { return_url: input.returnUrl } : {}),
        ...(input.cancelUrl ? { cancel_url: input.cancelUrl } : {}),
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: this.paydunyaAuthHeaders(),
      body: JSON.stringify(body),
    });

    const rawText = await res.text();
    let parsed: unknown;
    try {
      parsed = rawText ? JSON.parse(rawText) : {};
    } catch {
      throw new ServiceUnavailableException('Réponse PayDunya invalide');
    }

    if (!isRecord(parsed)) {
      throw new ServiceUnavailableException('Réponse PayDunya invalide');
    }

    if (!res.ok) {
      throw new ServiceUnavailableException(
        strVal(parsed['response_text']) ||
          'Impossible de créer la facture PayDunya',
      );
    }

    const code = strVal(parsed['response_code']);
    if (code !== '00') {
      throw new ServiceUnavailableException(
        strVal(parsed['response_text']) || 'Facture PayDunya refusée',
      );
    }

    const invoiceToken = strVal(parsed['token']).trim();
    const checkoutUrl = strVal(parsed['response_text']).trim();
    if (!invoiceToken || !checkoutUrl) {
      throw new ServiceUnavailableException(
        'Réponse PayDunya incomplète (token / URL)',
      );
    }

    return {
      checkoutUrl,
      invoiceToken,
      responseCode: code,
      responseText: strVal(parsed['description']) || 'OK',
    };
  }

  async confirmCheckoutInvoice(
    invoiceToken: string,
  ): Promise<PaydunyaConfirmInvoiceResult | null> {
    const token = invoiceToken?.trim();
    if (!token) return null;

    const url = `${this.baseUrl()}/api/v1/checkout-invoice/confirm/${encodeURIComponent(token)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.paydunyaAuthHeaders(),
      },
    });

    const rawText = await res.text();
    let parsed: unknown;
    try {
      parsed = rawText ? JSON.parse(rawText) : {};
    } catch {
      return null;
    }
    if (!isRecord(parsed)) return null;

    if (!res.ok || strVal(parsed['response_code']) !== '00') {
      return null;
    }

    const hash = strVal(parsed['hash']).trim();
    const status = strVal(parsed['status']).trim().toLowerCase();
    const inv = parsed['invoice'];
    let totalAmount = NaN;
    let invToken = token;
    if (inv && typeof inv === 'object' && !Array.isArray(inv)) {
      const invObj = inv as Record<string, unknown>;
      totalAmount = Number(invObj.total_amount);
      invToken = strVal(invObj.token).trim() || token;
    }
    const customRaw = parsed['custom_data'];
    const customData =
      customRaw && typeof customRaw === 'object' && !Array.isArray(customRaw)
        ? (customRaw as Record<string, unknown>)
        : {};

    if (!hash || !Number.isFinite(totalAmount)) return null;

    return {
      hash,
      status,
      totalAmount,
      invoiceToken: invToken,
      customData,
    };
  }

  softPayOrangeMoneySenegal(input: SoftPayOrangeMoneySenegalInput) {
    return this.softPayPost('/api/v1/softpay/new-orange-money-senegal', {
      ...input,
    });
  }

  softPayFreeMoneySenegal(input: SoftPayFreeMoneySenegalInput) {
    return this.softPayPost('/api/v1/softpay/free-money-senegal', {
      ...input,
    });
  }

  softPayWaveSenegal(input: SoftPayWaveSenegalInput) {
    return this.softPayPost('/api/v1/softpay/wave-senegal', { ...input });
  }
}
