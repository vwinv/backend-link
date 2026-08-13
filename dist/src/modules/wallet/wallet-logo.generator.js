"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWalletLogoAssets = generateWalletLogoAssets;
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
    return t.slice(0, max);
}
const SIZES = {
    avatar: [
        { name: 'logo.png', size: 50 },
        { name: 'logo@2x.png', size: 100 },
        { name: 'logo@3x.png', size: 150 },
    ],
    company: [
        { name: 'logo.png', width: 160, height: 50 },
        { name: 'logo@2x.png', width: 320, height: 100 },
        { name: 'logo@3x.png', width: 480, height: 150 },
    ],
};
async function circleMask(size) {
    const svg = Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>
    </svg>`);
    return (0, sharp_1.default)(svg).png().toBuffer();
}
async function initialsAvatar(size, initials, accentHex, textHex) {
    const ini = escapeXml(truncate(initials || 'XX', 3));
    const fontSize = Math.round(size * 0.38);
    const svg = Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${accentHex}"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}"
        font-weight="700" fill="${textHex}">${ini}</text>
    </svg>`);
    return (0, sharp_1.default)(svg).png().toBuffer();
}
async function circularImage(buffer, size) {
    const resized = await (0, sharp_1.default)(buffer)
        .resize(size, size, { fit: 'cover', position: 'centre' })
        .png()
        .toBuffer();
    const mask = await circleMask(size);
    return (0, sharp_1.default)(resized)
        .composite([{ input: mask, blend: 'dest-in' }])
        .png()
        .toBuffer();
}
async function companyLogoImage(buffer, width, height) {
    const fitted = await (0, sharp_1.default)(buffer)
        .resize(width, height, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
        .png()
        .toBuffer();
    return (0, sharp_1.default)({
        create: {
            width,
            height,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
    })
        .composite([{ input: fitted, gravity: 'centre' }])
        .png()
        .toBuffer();
}
async function generateWalletLogoAssets(input) {
    const { mode, imageBuffer, initials, accentHex, textHex } = input;
    const result = {};
    if (mode === 'company' && imageBuffer && imageBuffer.length > 0) {
        for (const spec of SIZES.company) {
            try {
                result[spec.name] = await companyLogoImage(imageBuffer, spec.width, spec.height);
            }
            catch {
            }
        }
        if (Object.keys(result).length > 0)
            return result;
        for (const spec of SIZES.avatar) {
            try {
                result[spec.name] = await circularImage(imageBuffer, spec.size);
            }
            catch {
            }
        }
        if (Object.keys(result).length > 0)
            return result;
    }
    for (const spec of SIZES.avatar) {
        try {
            if (imageBuffer && imageBuffer.length > 0 && mode === 'avatar') {
                result[spec.name] = await circularImage(imageBuffer, spec.size);
            }
            else {
                result[spec.name] = await initialsAvatar(spec.size, initials, accentHex, textHex);
            }
        }
        catch {
            result[spec.name] = await initialsAvatar(spec.size, initials, accentHex, textHex);
        }
    }
    return result;
}
//# sourceMappingURL=wallet-logo.generator.js.map