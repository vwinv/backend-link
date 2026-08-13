"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDropOneIconPath = resolveDropOneIconPath;
exports.generateWalletLeftLogoAssets = generateWalletLeftLogoAssets;
exports.generateWalletThumbnailAssets = generateWalletThumbnailAssets;
exports.generateWalletLogoAssets = generateWalletLogoAssets;
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
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
const LOGO_SIZES = [
    { name: 'logo.png', width: 160, height: 50 },
    { name: 'logo@2x.png', width: 320, height: 100 },
    { name: 'logo@3x.png', width: 480, height: 150 },
];
const THUMBNAIL_SIZES = [
    { name: 'thumbnail.png', size: 90 },
    { name: 'thumbnail@2x.png', size: 180 },
    { name: 'thumbnail@3x.png', size: 270 },
];
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
async function leftLogoImage(buffer, width, height) {
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
        .composite([{ input: fitted, gravity: 'west' }])
        .png()
        .toBuffer();
}
function resolveDropOneIconPath() {
    const candidates = [
        path.join(process.cwd(), 'wallet-assets', 'logo.png'),
        path.join(process.cwd(), '..', 'link', 'assets', 'icone.png'),
        path.join(process.cwd(), '..', 'link', 'assets', 'logo.png'),
    ];
    return candidates.find((filePath) => fs.existsSync(filePath)) ?? null;
}
async function generateWalletLeftLogoAssets(imageBuffer) {
    const result = {};
    if (!imageBuffer || imageBuffer.length === 0)
        return result;
    for (const spec of LOGO_SIZES) {
        try {
            result[spec.name] = await leftLogoImage(imageBuffer, spec.width, spec.height);
        }
        catch {
        }
    }
    return result;
}
async function generateWalletThumbnailAssets(input) {
    const result = {};
    const { imageBuffer, initials, accentHex, textHex } = input;
    for (const spec of THUMBNAIL_SIZES) {
        try {
            if (imageBuffer && imageBuffer.length > 0) {
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
async function generateWalletLogoAssets(input) {
    if (input.mode === 'company') {
        return generateWalletLeftLogoAssets(input.imageBuffer ?? null);
    }
    return generateWalletThumbnailAssets(input);
}
//# sourceMappingURL=wallet-logo.generator.js.map