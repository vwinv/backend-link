"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWalletStripAssets = generateWalletStripAssets;
const sharp_1 = __importDefault(require("sharp"));
function escapeXml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
function truncate(value, max) {
    const t = value.trim();
    if (t.length <= max)
        return t;
    return `${t.slice(0, Math.max(0, max - 1))}…`;
}
async function generateWalletStripAssets(input) {
    const w = 1125;
    const h = 369;
    const { palette, fullName, subtitle, email, phone, initials, showQr, avatarBuffer, } = input;
    const name = escapeXml(truncate(fullName || 'DropOne', 28));
    const role = escapeXml(truncate(subtitle || '', 36));
    const mail = escapeXml(truncate(email || '', 34));
    const tel = escapeXml(truncate(phone || '', 22));
    const ini = escapeXml(truncate(initials || 'XX', 3));
    const divider = palette.lightTheme ? '#E5E5EA' : '#2A2A2E';
    const pad = 36;
    const avatarSize = 96;
    const qrSize = showQr ? 110 : 0;
    const textRight = showQr ? w - pad - qrSize - 28 : w - pad;
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" rx="28" ry="28" fill="${palette.backgroundHex}"/>
  <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="26" ry="26"
    fill="none" stroke="${palette.accentHex}" stroke-opacity="0.35" stroke-width="3"/>

  <!-- Avatar cercle -->
  <circle cx="${pad + avatarSize / 2}" cy="${pad + avatarSize / 2 + 8}"
    r="${avatarSize / 2}" fill="${palette.accentHex}"/>
  <text x="${pad + avatarSize / 2}" y="${pad + avatarSize / 2 + 16}"
    text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
    font-size="34" font-weight="700" fill="${palette.primaryTextHex}">${ini}</text>

  <!-- Nom / poste -->
  <text x="${pad + avatarSize + 28}" y="${pad + 48}"
    font-family="Helvetica, Arial, sans-serif" font-size="42" font-weight="700"
    fill="${palette.primaryTextHex}">${name}</text>
  <text x="${pad + avatarSize + 28}" y="${pad + 92}"
    font-family="Helvetica, Arial, sans-serif" font-size="28"
    fill="${palette.secondaryTextHex}">${role}</text>

  <line x1="${pad}" y1="${pad + avatarSize + 36}" x2="${textRight}"
    y2="${pad + avatarSize + 36}" stroke="${divider}" stroke-width="2"/>

  <!-- Contacts -->
  <text x="${pad}" y="${pad + avatarSize + 88}"
    font-family="Helvetica, Arial, sans-serif" font-size="26"
    fill="${palette.primaryTextHex}">${mail}</text>
  <text x="${pad}" y="${pad + avatarSize + 128}"
    font-family="Helvetica, Arial, sans-serif" font-size="26"
    fill="${palette.primaryTextHex}">${tel}</text>

  ${showQr
        ? `<!-- QR décoratif (le vrai QR reste le barcode PassKit) -->
  <rect x="${w - pad - qrSize}" y="${h - pad - qrSize - 8}" width="${qrSize}" height="${qrSize}"
    rx="12" ry="12" fill="#FFFFFF"/>
  <rect x="${w - pad - qrSize + 14}" y="${h - pad - qrSize + 6}" width="28" height="28" fill="${palette.accentHex}"/>
  <rect x="${w - pad - 42}" y="${h - pad - qrSize + 6}" width="28" height="28" fill="${palette.accentHex}"/>
  <rect x="${w - pad - qrSize + 14}" y="${h - pad - 42}" width="28" height="28" fill="${palette.accentHex}"/>
  <rect x="${w - pad - qrSize + 50}" y="${h - pad - qrSize + 50}" width="18" height="18" fill="${palette.accentHex}"/>
  <rect x="${w - pad - 70}" y="${h - pad - qrSize + 50}" width="14" height="14" fill="${palette.accentHex}"/>
  <rect x="${w - pad - qrSize + 50}" y="${h - pad - 70}" width="14" height="14" fill="${palette.accentHex}"/>`
        : ''}
</svg>`;
    const base = (0, sharp_1.default)(Buffer.from(svg)).png();
    let strip3x = await base.toBuffer();
    if (avatarBuffer && avatarBuffer.length > 0) {
        try {
            const circleSize = avatarSize;
            const avatarPng = await (0, sharp_1.default)(avatarBuffer)
                .resize(circleSize, circleSize, { fit: 'cover' })
                .png()
                .toBuffer();
            const mask = Buffer.from(`<svg width="${circleSize}" height="${circleSize}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${circleSize / 2}" cy="${circleSize / 2}" r="${circleSize / 2}" fill="#fff"/>
        </svg>`);
            const rounded = await (0, sharp_1.default)(avatarPng)
                .composite([{ input: await (0, sharp_1.default)(mask).png().toBuffer(), blend: 'dest-in' }])
                .png()
                .toBuffer();
            strip3x = await (0, sharp_1.default)(strip3x)
                .composite([
                {
                    input: rounded,
                    left: pad,
                    top: pad + 8,
                },
            ])
                .png()
                .toBuffer();
        }
        catch {
        }
    }
    const strip2x = await (0, sharp_1.default)(strip3x)
        .resize(750, 246, { fit: 'fill' })
        .png()
        .toBuffer();
    const strip1x = await (0, sharp_1.default)(strip3x)
        .resize(375, 123, { fit: 'fill' })
        .png()
        .toBuffer();
    return {
        'strip.png': strip1x,
        'strip@2x.png': strip2x,
        'strip@3x.png': strip3x,
    };
}
//# sourceMappingURL=wallet-strip.generator.js.map