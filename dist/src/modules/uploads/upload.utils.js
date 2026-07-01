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
function isAcceptedImageUpload(file) {
    const mime = file.mimetype?.toLowerCase() ?? '';
    if (mime.startsWith('image/'))
        return true;
    const extension = (0, node_path_1.extname)(file.originalname).toLowerCase();
    return imageExtensions.has(extension);
}
function buildUploadFilename(originalName) {
    const extension = (0, node_path_1.extname)(originalName).toLowerCase() || '.jpg';
    return `${(0, node_crypto_1.randomUUID)()}${extension}`;
}
//# sourceMappingURL=upload.utils.js.map