import { BadRequestException } from '@nestjs/common';
import { isIP } from 'node:net';
import { lookup } from 'node:dns/promises';

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'metadata.google.internal',
  'metadata.google',
]);

function isPrivateIp(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1' || normalized === '0.0.0.0') return true;
  if (normalized.startsWith('fe80:') || normalized.startsWith('fc') || normalized.startsWith('fd')) {
    return true;
  }

  const parts = normalized.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }

  const [a, b] = parts;
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

/** Autorise uniquement http(s) pour les liens publics (anti XSS javascript:/data:). */
export function sanitizePublicHttpUrl(
  raw: string | null | undefined,
  options?: { allowHttp?: boolean },
): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return null;
  }

  const protocol = parsed.protocol.toLowerCase();
  if (protocol === 'https:') {
    // ok
  } else if (protocol === 'http:' && options?.allowHttp !== false) {
    // ok
  } else {
    return null;
  }

  if (!parsed.hostname || BLOCKED_HOSTNAMES.has(parsed.hostname.toLowerCase())) {
    return null;
  }

  return parsed.toString();
}

export function assertSafePublicHttpUrl(
  raw: string,
  fieldLabel = 'URL',
): string {
  const safe = sanitizePublicHttpUrl(raw);
  if (!safe) {
    throw new BadRequestException(`${fieldLabel} invalide (https requis)`);
  }
  return safe;
}

/** Vérifie qu’une URL distante est safe à fetch côté serveur (anti-SSRF). */
export async function assertSafeRemoteImageUrl(
  raw: string,
  allowedOrigins: string[] = [],
): Promise<string> {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new BadRequestException('URL image invalide');
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new BadRequestException('Protocole image non autorisé');
  }

  const hostname = parsed.hostname.toLowerCase();
  if (
    BLOCKED_HOSTNAMES.has(hostname) ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal')
  ) {
    throw new BadRequestException('Hôte image non autorisé');
  }

  const allowedHostnames = new Set(
    allowedOrigins
      .map((origin) => {
        try {
          return new URL(origin).hostname.toLowerCase();
        } catch {
          return '';
        }
      })
      .filter(Boolean),
  );

  if (isIP(hostname)) {
    if (isPrivateIp(hostname) && !allowedHostnames.has(hostname)) {
      throw new BadRequestException('Adresse image non autorisée');
    }
    return parsed.toString();
  }

  try {
    const records = await lookup(hostname, { all: true });
    for (const record of records) {
      if (isPrivateIp(record.address) && !allowedHostnames.has(hostname)) {
        throw new BadRequestException('Hôte image non autorisé');
      }
    }
  } catch (error) {
    if (error instanceof BadRequestException) throw error;
    throw new BadRequestException('Impossible de résoudre l’hôte image');
  }

  return parsed.toString();
}

export function maskEmail(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.indexOf('@');
  if (at <= 0) return '***';
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const visible = local.slice(0, Math.min(1, local.length));
  return `${visible}***@${domain}`;
}
