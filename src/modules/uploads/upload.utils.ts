import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';

const imageExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.heic',
  '.heif',
  '.bmp',
]);

export function isAcceptedImageUpload(file: Express.Multer.File): boolean {
  const mime = file.mimetype?.toLowerCase() ?? '';
  if (mime.startsWith('image/')) return true;

  const extension = extname(file.originalname).toLowerCase();
  return imageExtensions.has(extension);
}

export function buildUploadFilename(originalName: string): string {
  const extension = extname(originalName).toLowerCase() || '.jpg';
  return `${randomUUID()}${extension}`;
}
