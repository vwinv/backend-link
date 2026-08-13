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

/**
 * Tailles PassKit logo (hauteur max ~50 pt) :
 * 1x 50×50 / 2x 100×100 / 3x 150×150 pour un avatar carré.
 * Pour un logo entreprise large : 160×50 / 320×100 / 480×150.
 */
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
} as const;

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

async function companyLogoImage(
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

  // Cadre transparent aux dimensions PassKit pour un placement stable.
  return sharp({
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

/**
 * Remplace le logo DropOne du pass par la photo / le logo entreprise / les initiales.
 */
export async function generateWalletLogoAssets(
  input: WalletLogoInput,
): Promise<Record<string, Buffer>> {
  const { mode, imageBuffer, initials, accentHex, textHex } = input;
  const result: Record<string, Buffer> = {};

  if (mode === 'company' && imageBuffer && imageBuffer.length > 0) {
    for (const spec of SIZES.company) {
      try {
        result[spec.name] = await companyLogoImage(
          imageBuffer,
          spec.width,
          spec.height,
        );
      } catch {
        // ignore cette résolution
      }
    }
    if (Object.keys(result).length > 0) return result;

    // Repli : logo carré / circulaire si le format large échoue.
    for (const spec of SIZES.avatar) {
      try {
        result[spec.name] = await circularImage(imageBuffer, spec.size);
      } catch {
        // ignore
      }
    }
    if (Object.keys(result).length > 0) return result;
  }

  // Avatar photo, ou initiales (perso sans photo / pro sans logo).
  for (const spec of SIZES.avatar) {
    try {
      if (imageBuffer && imageBuffer.length > 0 && mode === 'avatar') {
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
