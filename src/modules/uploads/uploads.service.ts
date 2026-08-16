import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { PrismaService } from '../../prisma/prisma.service';
import { buildUploadFilename } from './upload.utils';

export type UploadedImage = {
  url: string;
  filename: string;
};

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly uploadsDir = join(process.cwd(), 'uploads');

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const cloudName = this.cloudName;
    const apiKey = this.apiKey;
    const apiSecret = this.apiSecret;
    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
    }
  }

  private env(key: string, nested: string) {
    return (
      this.configService.get<string>(nested)?.trim() ||
      process.env[key]?.trim() ||
      ''
    );
  }

  private get cloudName() {
    return this.env('CLOUDINARY_CLOUD_NAME', 'cloudinary.cloudName');
  }

  private get apiKey() {
    return this.env('CLOUDINARY_API_KEY', 'cloudinary.apiKey');
  }

  private get apiSecret() {
    return this.env('CLOUDINARY_API_SECRET', 'cloudinary.apiSecret');
  }

  private get folder() {
    return this.env('CLOUDINARY_FOLDER', 'cloudinary.folder') || 'dropone';
  }

  isCloudinaryConfigured() {
    return Boolean(this.cloudName && this.apiKey && this.apiSecret);
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadedImage> {
    if (this.isCloudinaryConfigured()) {
      return this.uploadToCloudinary(file);
    }

    if (this.configService.get<string>('nodeEnv') === 'production') {
      throw new ServiceUnavailableException(
        'Cloudinary n’est pas configuré. Ajoutez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET.',
      );
    }

    return this.saveLocally(file);
  }

  /** Supprime l’ancienne image si plus aucune fiche ne la référence. */
  async replaceImage(
    previousUrl: string | null | undefined,
    nextUrl: string | null | undefined,
  ) {
    const previous = previousUrl?.trim() || '';
    const next = nextUrl?.trim() || '';
    if (!previous || previous === next) return;

    try {
      const stillUsed = await this.countUsages(previous);
      if (stillUsed > 0) return;
      await this.deleteStoredImage(previous);
    } catch (error) {
      this.logger.warn(
        `Ancienne image non supprimée: ${
          error instanceof Error ? error.message : 'erreur inconnue'
        }`,
      );
    }
  }

  private async countUsages(url: string) {
    const [cards, teams, users, invites] = await Promise.all([
      this.prisma.businessCard.count({
        where: {
          OR: [
            { avatarUrl: url },
            { logoUrl: url },
            { coverImageUrl: url },
          ],
        },
      }),
      this.prisma.team.count({ where: { logoUrl: url } }),
      this.prisma.user.count({ where: { avatarUrl: url } }),
      this.prisma.teamInvite.count({ where: { avatarUrl: url } }),
    ]);
    return cards + teams + users + invites;
  }

  private async deleteStoredImage(url: string) {
    const publicId = this.publicIdFromCloudinaryUrl(url);
    if (publicId && this.isCloudinaryConfigured()) {
      await cloudinary.uploader.destroy(publicId, { invalidate: true });
      return;
    }

    const localName = this.localFilenameFromUrl(url);
    if (!localName) return;
    try {
      unlinkSync(join(this.uploadsDir, localName));
    } catch {
      // Fichier déjà absent (disque Render, etc.)
    }
  }

  private publicIdFromCloudinaryUrl(url: string): string | null {
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.endsWith('cloudinary.com')) return null;

      const parts = parsed.pathname.split('/').filter(Boolean);
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex < 0) return null;

      let rest = parts.slice(uploadIndex + 1);
      if (rest[0]?.includes(',')) rest = rest.slice(1);
      if (rest[0] && /^v\d+$/.test(rest[0])) rest = rest.slice(1);
      if (!rest.length) return null;

      const last = rest[rest.length - 1].replace(/\.[a-zA-Z0-9]+$/, '');
      const publicId = [...rest.slice(0, -1), last].join('/');
      const folder = this.folder;
      if (folder && !publicId.startsWith(`${folder}/`)) return null;
      return publicId;
    } catch {
      return null;
    }
  }

  private localFilenameFromUrl(url: string): string | null {
    try {
      const path = url.startsWith('http') ? new URL(url).pathname : url;
      const marker = '/uploads/';
      const index = path.indexOf(marker);
      if (index < 0) return null;
      const filename = basename(path.slice(index + marker.length));
      if (!filename || filename.includes('..')) return null;
      return filename;
    } catch {
      return null;
    }
  }

  private uploadToCloudinary(file: Express.Multer.File): Promise<UploadedImage> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: this.folder,
          resource_type: 'image',
          overwrite: false,
        },
        (error, result) => {
          if (error || !result?.secure_url) {
            reject(
              new ServiceUnavailableException(
                error?.message
                  ? `Impossible d’envoyer l’image vers Cloudinary (${error.message})`
                  : 'Impossible d’envoyer l’image vers Cloudinary',
              ),
            );
            return;
          }
          resolve({
            url: result.secure_url,
            filename: result.public_id,
          });
        },
      );
      stream.end(file.buffer);
    });
  }

  private saveLocally(file: Express.Multer.File): UploadedImage {
    mkdirSync(this.uploadsDir, { recursive: true });
    const filename = buildUploadFilename(file.originalname);
    writeFileSync(join(this.uploadsDir, filename), file.buffer);
    return {
      url: this.buildPublicUrl(filename),
      filename,
    };
  }

  buildPublicUrl(filename: string): string {
    const baseUrl = (
      this.configService.get<string>('wallet.appPublicUrl') ??
      'http://localhost:3000'
    ).replace(/\/$/, '');

    return `${baseUrl}/uploads/${filename}`;
  }
}
