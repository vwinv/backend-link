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

const blockedMimeTypes = new Set([
  'image/svg+xml',
  'image/svg',
  'text/html',
  'application/javascript',
]);

export function isAcceptedImageUpload(file: Express.Multer.File): boolean {
  const mime = file.mimetype?.toLowerCase() ?? '';
  const extension = extname(file.originalname).toLowerCase();

  if (blockedMimeTypes.has(mime) || extension === '.svg' || extension === '.html') {
    return false;
  }

  if (mime.startsWith('image/') && !mime.includes('svg')) {
    return true;
  }

  return imageExtensions.has(extension);
}

export function buildUploadFilename(originalName: string): string {
  const extension = extname(originalName).toLowerCase() || '.jpg';
  const safeExtension = imageExtensions.has(extension) ? extension : '.jpg';
  return `${randomUUID()}${safeExtension}`;
}
