import type { CardThemeJson } from './pro-design.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

export function parseCardTheme(theme: unknown): CardThemeJson {
  if (theme == null) {
    return {};
  }

  if (typeof theme === 'string') {
    try {
      return parseCardTheme(JSON.parse(theme) as unknown);
    } catch {
      return {};
    }
  }

  if (!isRecord(theme)) {
    return {};
  }

  return theme as CardThemeJson;
}

export function normalizeHexColor(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('#') ? trimmed.toUpperCase() : `#${trimmed.toUpperCase()}`;
}

export function normalizeCardThemeForStorage(theme: unknown): CardThemeJson {
  const parsed = parseCardTheme(theme);
  const useCompanyColors = parsed.useCompanyColors === true;
  const brandColorRaw =
    typeof parsed.brandColor === 'string' ? parsed.brandColor.trim() : '';

  const normalized: CardThemeJson = {
    style: typeof parsed.style === 'string' ? parsed.style : 'noir',
    showQrCode: parsed.showQrCode !== false,
    cardBadge:
      typeof parsed.cardBadge === 'string' ? parsed.cardBadge : 'personalTag',
    useCompanyColors,
  };

  if (parsed.proDesignId != null && String(parsed.proDesignId).trim()) {
    normalized.proDesignId = String(parsed.proDesignId).trim();
  }

  if (useCompanyColors && brandColorRaw) {
    normalized.brandColor = normalizeHexColor(brandColorRaw);
  }

  return normalized;
}

export function resolveCardThemeForRender(theme: unknown): CardThemeJson {
  const parsed = parseCardTheme(theme);

  if (parsed.useCompanyColors === false) {
    return {
      ...parsed,
      useCompanyColors: false,
      brandColor: null,
    };
  }

  if (parsed.useCompanyColors === true) {
    const brandColor =
      typeof parsed.brandColor === 'string'
        ? normalizeHexColor(parsed.brandColor)
        : '';
    return {
      ...parsed,
      useCompanyColors: true,
      brandColor: brandColor || null,
    };
  }

  const legacyBrand =
    typeof parsed.brandColor === 'string' ? parsed.brandColor.trim() : '';
  if (legacyBrand) {
    return {
      ...parsed,
      useCompanyColors: true,
      brandColor: normalizeHexColor(legacyBrand),
    };
  }

  return {
    ...parsed,
    useCompanyColors: false,
    brandColor: null,
  };
}
