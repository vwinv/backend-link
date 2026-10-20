"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizePublicHttpUrl = sanitizePublicHttpUrl;
exports.assertSafePublicHttpUrl = assertSafePublicHttpUrl;
exports.assertSafeRemoteImageUrl = assertSafeRemoteImageUrl;
exports.maskEmail = maskEmail;
const common_1 = require("@nestjs/common");
const node_net_1 = require("node:net");
const promises_1 = require("node:dns/promises");
const BLOCKED_HOSTNAMES = new Set([
    'localhost',
    'metadata.google.internal',
    'metadata.google',
]);
function isPrivateIp(ip) {
    const normalized = ip.toLowerCase();
    if (normalized === '::1' || normalized === '0.0.0.0')
        return true;
    if (normalized.startsWith('fe80:') || normalized.startsWith('fc') || normalized.startsWith('fd')) {
        return true;
    }
    const parts = normalized.split('.').map(Number);
    if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
        return false;
    }
    const [a, b] = parts;
    if (a === 10 || a === 127 || a === 0)
        return true;
    if (a === 169 && b === 254)
        return true;
    if (a === 172 && b >= 16 && b <= 31)
        return true;
    if (a === 192 && b === 168)
        return true;
    return false;
}
function sanitizePublicHttpUrl(raw, options) {
    const trimmed = raw?.trim();
    if (!trimmed)
        return null;
    let candidate = trimmed;
    if (!/^https?:\/\//i.test(candidate)) {
        candidate = `https://${candidate}`;
    }
    let parsed;
    try {
        parsed = new URL(candidate);
    }
    catch {
        return null;
    }
    const protocol = parsed.protocol.toLowerCase();
    if (protocol === 'https:') {
    }
    else if (protocol === 'http:' && options?.allowHttp !== false) {
    }
    else {
        return null;
    }
    if (!parsed.hostname || BLOCKED_HOSTNAMES.has(parsed.hostname.toLowerCase())) {
        return null;
    }
    return parsed.toString();
}
function assertSafePublicHttpUrl(raw, fieldLabel = 'URL') {
    const safe = sanitizePublicHttpUrl(raw);
    if (!safe) {
        throw new common_1.BadRequestException(`${fieldLabel} invalide (https requis)`);
    }
    return safe;
}
async function assertSafeRemoteImageUrl(raw, allowedOrigins = []) {
    let parsed;
    try {
        parsed = new URL(raw);
    }
    catch {
        throw new common_1.BadRequestException('URL image invalide');
    }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        throw new common_1.BadRequestException('Protocole image non autorisé');
    }
    const hostname = parsed.hostname.toLowerCase();
    if (BLOCKED_HOSTNAMES.has(hostname) ||
        hostname.endsWith('.local') ||
        hostname.endsWith('.internal')) {
        throw new common_1.BadRequestException('Hôte image non autorisé');
    }
    const allowedHostnames = new Set(allowedOrigins
        .map((origin) => {
        try {
            return new URL(origin).hostname.toLowerCase();
        }
        catch {
            return '';
        }
    })
        .filter(Boolean));
    if ((0, node_net_1.isIP)(hostname)) {
        if (isPrivateIp(hostname) && !allowedHostnames.has(hostname)) {
            throw new common_1.BadRequestException('Adresse image non autorisée');
        }
        return parsed.toString();
    }
    try {
        const records = await (0, promises_1.lookup)(hostname, { all: true });
        for (const record of records) {
            if (isPrivateIp(record.address) && !allowedHostnames.has(hostname)) {
                throw new common_1.BadRequestException('Hôte image non autorisé');
            }
        }
    }
    catch (error) {
        if (error instanceof common_1.BadRequestException)
            throw error;
        throw new common_1.BadRequestException('Impossible de résoudre l’hôte image');
    }
    return parsed.toString();
}
function maskEmail(email) {
    const trimmed = email.trim();
    const at = trimmed.indexOf('@');
    if (at <= 0)
        return '***';
    const local = trimmed.slice(0, at);
    const domain = trimmed.slice(at + 1);
    const visible = local.slice(0, Math.min(1, local.length));
    return `${visible}***@${domain}`;
}
//# sourceMappingURL=safe-url.js.map