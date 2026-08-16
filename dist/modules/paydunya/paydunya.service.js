"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PaydunyaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaydunyaService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
function isRecord(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
}
function strVal(v) {
    if (v == null)
        return '';
    if (typeof v === 'string')
        return v;
    if (typeof v === 'number' || typeof v === 'boolean')
        return String(v);
    return '';
}
function firstNonEmpty(...vals) {
    for (const val of vals) {
        const s = strVal(val).trim();
        if (s)
            return s;
    }
    return undefined;
}
function parseOtherUrl(raw) {
    let rec = null;
    if (typeof raw === 'string') {
        const trimmed = raw.trim();
        if (!trimmed)
            return undefined;
        try {
            const parsed = JSON.parse(trimmed);
            if (isRecord(parsed))
                rec = parsed;
        }
        catch {
            return undefined;
        }
    }
    else if (isRecord(raw)) {
        rec = raw;
    }
    if (!rec)
        return undefined;
    const om = firstNonEmpty(rec['om_url'], rec['omUrl'], rec['orange_money_url']);
    const mx = firstNonEmpty(rec['maxit_url'], rec['maxitUrl'], rec['max_it_url']);
    if (!om && !mx)
        return undefined;
    return {
        ...(om ? { om_url: om } : {}),
        ...(mx ? { maxit_url: mx } : {}),
    };
}
function extractOmQrImageBase64(url, data) {
    const fromData = isRecord(data)
        ? firstNonEmpty(data['qrcode'], data['qr_code'], data['qrCode'])
        : undefined;
    if (fromData?.startsWith('iVBOR')) {
        return fromData.replace(/\s/g, '');
    }
    if (!url)
        return undefined;
    try {
        const parsed = new URL(url);
        const qr = parsed.searchParams.get('data[qrcode]') ??
            parsed.searchParams.get('data[qrCode]') ??
            parsed.searchParams.get('qrcode');
        const cleaned = qr?.replace(/\s/g, '');
        if (cleaned?.startsWith('iVBOR'))
            return cleaned;
    }
    catch {
        return undefined;
    }
    return undefined;
}
function redactSoftPayBodyForLog(body) {
    const out = {};
    for (const [key, val] of Object.entries(body)) {
        const s = val == null ? '' : typeof val === 'string' ? val : String(val);
        if (/token/i.test(key)) {
            out[key] = s.length > 8 ? `${s.slice(0, 6)}…` : '[redacted]';
        }
        else if (/phone|tel/i.test(key)) {
            out[key] = s.length >= 2 ? `***${s.slice(-2)}` : '[redacted]';
        }
        else if (/email/i.test(key)) {
            out[key] = s.length > 0 ? '[redacted]' : '';
        }
        else if (/name|fullname/i.test(key)) {
            out[key] = s.length > 24 ? `${s.slice(0, 24)}…` : s;
        }
        else {
            out[key] = s.length > 120 ? `${s.slice(0, 120)}…` : s;
        }
    }
    return out;
}
let PaydunyaService = PaydunyaService_1 = class PaydunyaService {
    logger = new common_1.Logger(PaydunyaService_1.name);
    masterKey() {
        const k = process.env.PAYDUNYA_MASTER_KEY?.trim();
        if (!k) {
            throw new common_1.ServiceUnavailableException('Paiement indisponible : PAYDUNYA_MASTER_KEY manquant');
        }
        return k;
    }
    privateKey() {
        const k = process.env.PAYDUNYA_PRIVATE_KEY?.trim();
        if (!k) {
            throw new common_1.ServiceUnavailableException('Paiement indisponible : PAYDUNYA_PRIVATE_KEY manquant');
        }
        return k;
    }
    token() {
        const k = process.env.PAYDUNYA_TOKEN?.trim();
        if (!k) {
            throw new common_1.ServiceUnavailableException('Paiement indisponible : PAYDUNYA_TOKEN manquant');
        }
        return k;
    }
    baseUrl() {
        return (process.env.PAYDUNYA_API_BASE_URL?.trim() || 'https://app.paydunya.com').replace(/\/$/, '');
    }
    paydunyaAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'PAYDUNYA-MASTER-KEY': this.masterKey(),
            'PAYDUNYA-PRIVATE-KEY': this.privateKey(),
            'PAYDUNYA-TOKEN': this.token(),
        };
    }
    parseSoftPayResponse(raw) {
        if (!isRecord(raw)) {
            return { success: false, message: 'Réponse SoftPay invalide' };
        }
        const nested = isRecord(raw['data']) ? raw['data'] : undefined;
        const success = raw['success'] === true ||
            raw['success'] === 'true' ||
            raw['success'] === 1;
        const message = firstNonEmpty(raw['message'], nested?.['message']) || undefined;
        const url = firstNonEmpty(raw['url'], nested?.['url']);
        const other_url = parseOtherUrl(raw['other_url']) ??
            parseOtherUrl(raw['otherUrl']) ??
            parseOtherUrl(nested?.['other_url']) ??
            parseOtherUrl(nested?.['otherUrl']);
        const qrImageBase64 = extractOmQrImageBase64(url, nested);
        const feesRaw = raw['fees'] ?? nested?.['fees'];
        const fees = typeof feesRaw === 'number' && Number.isFinite(feesRaw)
            ? feesRaw
            : undefined;
        const currency = firstNonEmpty(raw['currency'], nested?.['currency']) || undefined;
        const data = raw['data'];
        const return_url = firstNonEmpty(raw['return_url'], raw['returnUrl']) || undefined;
        const token = firstNonEmpty(raw['token'], nested?.['token']);
        const errors = raw['errors'];
        this.logger.log(`SoftPay parse: success=${String(success)} url=${url ? 'yes' : 'no'} om=${other_url?.om_url ? 'yes' : 'no'} maxit=${other_url?.maxit_url ? 'yes' : 'no'} qrPng=${qrImageBase64 ? 'yes' : 'no'}`);
        return {
            success,
            message,
            url,
            other_url,
            qrImageBase64,
            fees,
            currency,
            data: data !== undefined ? data : undefined,
            errors: errors !== undefined ? errors : undefined,
            return_url,
            token,
        };
    }
    async softPayPost(path, body) {
        const p = path.startsWith('/') ? path : `/${path}`;
        const url = `${this.baseUrl()}${p}`;
        this.logger.log(`PayDunya SoftPay → POST ${p} body=${JSON.stringify(redactSoftPayBodyForLog(body))}`);
        let res;
        try {
            res = await fetch(url, {
                method: 'POST',
                headers: this.paydunyaAuthHeaders(),
                body: JSON.stringify(body),
            });
        }
        catch (e) {
            this.logger.warn(`SoftPay ${p}: fetch error ${String(e)}`);
            throw new common_1.ServiceUnavailableException('Réseau PayDunya indisponible');
        }
        const rawText = await res.text();
        let parsed;
        try {
            parsed = rawText ? JSON.parse(rawText) : {};
        }
        catch {
            this.logger.warn(`SoftPay ${p}: réponse non JSON ${rawText.slice(0, 200)}`);
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
    isConfigured() {
        if (process.env.PAYDUNYA_ENABLED === 'false') {
            return false;
        }
        try {
            this.masterKey();
            this.privateKey();
            this.token();
            return true;
        }
        catch {
            return false;
        }
    }
    verifyIpnHash(receivedHash) {
        const mk = process.env.PAYDUNYA_MASTER_KEY?.trim();
        if (!mk || !receivedHash || typeof receivedHash !== 'string')
            return false;
        const expected = (0, node_crypto_1.createHash)('sha512').update(mk, 'utf8').digest('hex');
        const a = receivedHash.trim().toLowerCase();
        const b = expected.toLowerCase();
        return a.length === b.length && a === b;
    }
    async createCheckoutInvoice(input) {
        const url = `${this.baseUrl()}/api/v1/checkout-invoice/create`;
        const amount = Math.round(Number(input.totalAmountFcfa));
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new common_1.ServiceUnavailableException('Montant facture invalide');
        }
        const body = {
            invoice: {
                total_amount: amount,
                description: input.description.slice(0, 500),
            },
            store: {
                name: input.storeName.slice(0, 200),
            },
            custom_data: Object.fromEntries(Object.entries(input.customData).filter(([, v]) => v !== undefined && v !== null && String(v).length > 0)),
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
        let parsed;
        try {
            parsed = rawText ? JSON.parse(rawText) : {};
        }
        catch {
            throw new common_1.ServiceUnavailableException('Réponse PayDunya invalide');
        }
        if (!isRecord(parsed)) {
            throw new common_1.ServiceUnavailableException('Réponse PayDunya invalide');
        }
        if (!res.ok) {
            throw new common_1.ServiceUnavailableException(strVal(parsed['response_text']) ||
                'Impossible de créer la facture PayDunya');
        }
        const code = strVal(parsed['response_code']);
        if (code !== '00') {
            throw new common_1.ServiceUnavailableException(strVal(parsed['response_text']) || 'Facture PayDunya refusée');
        }
        const invoiceToken = strVal(parsed['token']).trim();
        const checkoutUrl = strVal(parsed['response_text']).trim();
        if (!invoiceToken || !checkoutUrl) {
            throw new common_1.ServiceUnavailableException('Réponse PayDunya incomplète (token / URL)');
        }
        return {
            checkoutUrl,
            invoiceToken,
            responseCode: code,
            responseText: strVal(parsed['description']) || 'OK',
        };
    }
    async confirmCheckoutInvoice(invoiceToken) {
        const token = invoiceToken?.trim();
        if (!token)
            return null;
        const url = `${this.baseUrl()}/api/v1/checkout-invoice/confirm/${encodeURIComponent(token)}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...this.paydunyaAuthHeaders(),
            },
        });
        const rawText = await res.text();
        let parsed;
        try {
            parsed = rawText ? JSON.parse(rawText) : {};
        }
        catch {
            return null;
        }
        if (!isRecord(parsed))
            return null;
        if (!res.ok || strVal(parsed['response_code']) !== '00') {
            return null;
        }
        const hash = strVal(parsed['hash']).trim();
        const status = strVal(parsed['status']).trim().toLowerCase();
        const inv = parsed['invoice'];
        let totalAmount = NaN;
        let invToken = token;
        if (inv && typeof inv === 'object' && !Array.isArray(inv)) {
            const invObj = inv;
            totalAmount = Number(invObj.total_amount);
            invToken = strVal(invObj.token).trim() || token;
        }
        const customRaw = parsed['custom_data'];
        const customData = customRaw && typeof customRaw === 'object' && !Array.isArray(customRaw)
            ? customRaw
            : {};
        if (!hash || !Number.isFinite(totalAmount))
            return null;
        return {
            hash,
            status,
            totalAmount,
            invoiceToken: invToken,
            customData,
        };
    }
    softPayOrangeMoneySenegal(input) {
        return this.softPayPost('/api/v1/softpay/new-orange-money-senegal', {
            ...input,
        });
    }
    softPayFreeMoneySenegal(input) {
        return this.softPayPost('/api/v1/softpay/free-money-senegal', {
            ...input,
        });
    }
    softPayWaveSenegal(input) {
        return this.softPayPost('/api/v1/softpay/wave-senegal', { ...input });
    }
};
exports.PaydunyaService = PaydunyaService;
exports.PaydunyaService = PaydunyaService = PaydunyaService_1 = __decorate([
    (0, common_1.Injectable)()
], PaydunyaService);
//# sourceMappingURL=paydunya.service.js.map