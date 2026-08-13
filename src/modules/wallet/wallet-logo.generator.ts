import * as fs from 'node:fs';
import * as path from 'node:path';
import sharp from 'sharp';

export type WalletLogoMode = 'avatar' | 'company';

export type WalletLogoInput = {
  mode: WalletLogoMode;
  /** Image source (avatar ou logo entreprise). */
  imageBuffer?: Buffer | null;
  /** Initiales utilisées si pas d’image (cartes perso). */
  initials: string;
  accentHex: string;
  textHex: string;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncate(value: string, max: number): string {
  const t = value.trim();
  if (t.length <= max) return t;
  return t.slice(0, max);
}

/** Logo gauche PassKit (hauteur ~50 pt). */
const LOGO_SIZES = [
  { name: 'logo.png', width: 160, height: 50 },
  { name: 'logo@2x.png', width: 320, height: 100 },
  { name: 'logo@3x.png', width: 480, height: 150 },
] as const;

/** Thumbnail droite PassKit (90 pt) — photo plus grande que l’ancien logo 50 pt. */
const THUMBNAIL_SIZES = [
  { name: 'thumbnail.png', size: 90 },
  { name: 'thumbnail@2x.png', size: 180 },
  { name: 'thumbnail@3x.png', size: 270 },
] as const;

async function circleMask(size: number): Promise<Buffer> {
  const svg = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>
    </svg>`,
  );
  return sharp(svg).png().toBuffer();
}

async function initialsAvatar(
  size: number,
  initials: string,
  accentHex: string,
  textHex: string,
): Promise<Buffer> {
  const ini = escapeXml(truncate(initials || 'XX', 3));
  const fontSize = Math.round(size * 0.38);
  const svg = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${accentHex}"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}"
        font-weight="700" fill="${textHex}">${ini}</text>
    </svg>`,
  );
  return sharp(svg).png().toBuffer();
}

async function circularImage(buffer: Buffer, size: number): Promise<Buffer> {
  const resized = await sharp(buffer)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();
  const mask = await circleMask(size);
  return sharp(resized)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function leftLogoImage(
  buffer: Buffer,
  width: number,
  height: number,
): Promise<Buffer> {
  const fitted = await sharp(buffer)
    .resize(width, height, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp({
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

export function resolveDropOneIconPath(): string | null {
  const candidates = [
    path.join(process.cwd(), 'wallet-assets', 'logo.png'),
    path.join(process.cwd(), '..', 'link', 'assets', 'icone.png'),
    path.join(process.cwd(), '..', 'link', 'assets', 'logo.png'),
  ];
  return candidates.find((filePath) => fs.existsSync(filePath)) ?? null;
}

export async function generateWalletLeftLogoAssets(
  imageBuffer: Buffer | null,
): Promise<Record<string, Buffer>> {
  const result: Record<string, Buffer> = {};
  if (!imageBuffer || imageBuffer.length === 0) return result;

  for (const spec of LOGO_SIZES) {
    try {
      result[spec.name] = await leftLogoImage(
        imageBuffer,
        spec.width,
        spec.height,
      );
    } catch {
      // ignore cette résolution
    }
  }
  return result;
}

export async function generateWalletThumbnailAssets(input: {
  imageBuffer?: Buffer | null;
  initials: string;
  accentHex: string;
  textHex: string;
}): Promise<Record<string, Buffer>> {
  const result: Record<string, Buffer> = {};
  const { imageBuffer, initials, accentHex, textHex } = input;

  for (const spec of THUMBNAIL_SIZES) {
    try {
      if (imageBuffer && imageBuffer.length > 0) {
        result[spec.name] = await circularImage(imageBuffer, spec.size);
      } else {
        result[spec.name] = await initialsAvatar(
          spec.size,
          initials,
          accentHex,
          textHex,
        );
      }
    } catch {
      result[spec.name] = await initialsAvatar(
        spec.size,
        initials,
        accentHex,
        textHex,
      );
    }
  }
  return result;
}

/**
 * @deprecated Conservé pour les appels existants — préfère left logo + thumbnail.
 */
export async function generateWalletLogoAssets(
  input: WalletLogoInput,
): Promise<Record<string, Buffer>> {
  if (input.mode === 'company') {
    return generateWalletLeftLogoAssets(input.imageBuffer ?? null);
  }
  return generateWalletThumbnailAssets(input);
}
