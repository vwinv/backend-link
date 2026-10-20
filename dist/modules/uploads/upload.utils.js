"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAcceptedImageUpload = isAcceptedImageUpload;
exports.buildUploadFilename = buildUploadFilename;
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
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
function isAcceptedImageUpload(file) {
    const mime = file.mimetype?.toLowerCase() ?? '';
    const extension = (0, node_path_1.extname)(file.originalname).toLowerCase();
    if (blockedMimeTypes.has(mime) || extension === '.svg' || extension === '.html') {
        return false;
    }
    if (mime.startsWith('image/') && !mime.includes('svg')) {
        return true;
    }
    return imageExtensions.has(extension);
}
function buildUploadFilename(originalName) {
    const extension = (0, node_path_1.extname)(originalName).toLowerCase() || '.jpg';
    const safeExtension = imageExtensions.has(extension) ? extension : '.jpg';
    return `${(0, node_crypto_1.randomUUID)()}${safeExtension}`;
}
//# sourceMappingURL=upload.utils.js.map