"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UploadsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const prisma_service_1 = require("../../prisma/prisma.service");
const upload_utils_1 = require("./upload.utils");
let UploadsService = UploadsService_1 = class UploadsService {
    configService;
    prisma;
    logger = new common_1.Logger(UploadsService_1.name);
    uploadsDir = (0, node_path_1.join)(process.cwd(), 'uploads');
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const cloudName = this.cloudName;
        const apiKey = this.apiKey;
        const apiSecret = this.apiSecret;
        if (cloudName && apiKey && apiSecret) {
            cloudinary_1.v2.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
                secure: true,
            });
        }
    }
    env(key, nested) {
        return (this.configService.get(nested)?.trim() ||
            process.env[key]?.trim() ||
            '');
    }
    get cloudName() {
        return this.env('CLOUDINARY_CLOUD_NAME', 'cloudinary.cloudName');
    }
    get apiKey() {
        return this.env('CLOUDINARY_API_KEY', 'cloudinary.apiKey');
    }
    get apiSecret() {
        return this.env('CLOUDINARY_API_SECRET', 'cloudinary.apiSecret');
    }
    get folder() {
        return this.env('CLOUDINARY_FOLDER', 'cloudinary.folder') || 'dropone';
    }
    isCloudinaryConfigured() {
        return Boolean(this.cloudName && this.apiKey && this.apiSecret);
    }
    async uploadImage(file) {
        if (this.isCloudinaryConfigured()) {
            return this.uploadToCloudinary(file);
        }
        if (this.configService.get('nodeEnv') === 'production') {
            throw new common_1.ServiceUnavailableException('Cloudinary n’est pas configuré. Ajoutez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET.');
        }
        return this.saveLocally(file);
    }
    async replaceImage(previousUrl, nextUrl) {
        const previous = previousUrl?.trim() || '';
        const next = nextUrl?.trim() || '';
        if (!previous || previous === next)
            return;
        try {
            const stillUsed = await this.countUsages(previous);
            if (stillUsed > 0)
                return;
            await this.deleteStoredImage(previous);
        }
        catch (error) {
            this.logger.warn(`Ancienne image non supprimée: ${error instanceof Error ? error.message : 'erreur inconnue'}`);
        }
    }
    async countUsages(url) {
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
    async deleteStoredImage(url) {
        const publicId = this.publicIdFromCloudinaryUrl(url);
        if (publicId && this.isCloudinaryConfigured()) {
            await cloudinary_1.v2.uploader.destroy(publicId, { invalidate: true });
            return;
        }
        const localName = this.localFilenameFromUrl(url);
        if (!localName)
            return;
        try {
            (0, node_fs_1.unlinkSync)((0, node_path_1.join)(this.uploadsDir, localName));
        }
        catch {
        }
    }
    publicIdFromCloudinaryUrl(url) {
        try {
            const parsed = new URL(url);
            if (!parsed.hostname.endsWith('cloudinary.com'))
                return null;
            const parts = parsed.pathname.split('/').filter(Boolean);
            const uploadIndex = parts.indexOf('upload');
            if (uploadIndex < 0)
                return null;
            let rest = parts.slice(uploadIndex + 1);
            if (rest[0]?.includes(','))
                rest = rest.slice(1);
            if (rest[0] && /^v\d+$/.test(rest[0]))
                rest = rest.slice(1);
            if (!rest.length)
                return null;
            const last = rest[rest.length - 1].replace(/\.[a-zA-Z0-9]+$/, '');
            const publicId = [...rest.slice(0, -1), last].join('/');
            const folder = this.folder;
            if (folder && !publicId.startsWith(`${folder}/`))
                return null;
            return publicId;
        }
        catch {
            return null;
        }
    }
    localFilenameFromUrl(url) {
        try {
            const path = url.startsWith('http') ? new URL(url).pathname : url;
            const marker = '/uploads/';
            const index = path.indexOf(marker);
            if (index < 0)
                return null;
            const filename = (0, node_path_1.basename)(path.slice(index + marker.length));
            if (!filename || filename.includes('..'))
                return null;
            return filename;
        }
        catch {
            return null;
        }
    }
    uploadToCloudinary(file) {
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({
                folder: this.folder,
                resource_type: 'image',
                overwrite: false,
            }, (error, result) => {
                if (error || !result?.secure_url) {
                    reject(new common_1.ServiceUnavailableException(error?.message
                        ? `Impossible d’envoyer l’image vers Cloudinary (${error.message})`
                        : 'Impossible d’envoyer l’image vers Cloudinary'));
                    return;
                }
                resolve({
                    url: result.secure_url,
                    filename: result.public_id,
                });
            });
            stream.end(file.buffer);
        });
    }
    saveLocally(file) {
        (0, node_fs_1.mkdirSync)(this.uploadsDir, { recursive: true });
        const filename = (0, upload_utils_1.buildUploadFilename)(file.originalname);
        (0, node_fs_1.writeFileSync)((0, node_path_1.join)(this.uploadsDir, filename), file.buffer);
        return {
            url: this.buildPublicUrl(filename),
            filename,
        };
    }
    buildPublicUrl(filename) {
        const baseUrl = (this.configService.get('wallet.appPublicUrl') ??
            'http://localhost:3000').replace(/\/$/, '');
        return `${baseUrl}/uploads/${filename}`;
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = UploadsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map