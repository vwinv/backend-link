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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUpdateService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const SINGLETON_ID = 'default';
let AppUpdateService = class AppUpdateService {
    prisma;
    config;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async getPublicConfig() {
        const row = await this.ensureRow();
        return this.toPublicDto(row);
    }
    async getAdminConfig() {
        const row = await this.ensureRow();
        return {
            ...this.toPublicDto(row),
            updatedAt: row.updatedAt.toISOString(),
        };
    }
    async updateConfig(dto) {
        const row = await this.prisma.appUpdateConfig.upsert({
            where: { id: SINGLETON_ID },
            create: {
                id: SINGLETON_ID,
                latestVersion: dto.latestVersion?.trim() ?? '',
                minVersion: dto.minVersion?.trim() ?? '',
                iosStoreUrl: dto.iosStoreUrl?.trim() ?? '',
                androidStoreUrl: dto.androidStoreUrl?.trim() ?? '',
                message: dto.message?.trim() ?? '',
            },
            update: {
                ...(dto.latestVersion !== undefined && {
                    latestVersion: dto.latestVersion.trim(),
                }),
                ...(dto.minVersion !== undefined && {
                    minVersion: dto.minVersion.trim(),
                }),
                ...(dto.iosStoreUrl !== undefined && {
                    iosStoreUrl: dto.iosStoreUrl.trim(),
                }),
                ...(dto.androidStoreUrl !== undefined && {
                    androidStoreUrl: dto.androidStoreUrl.trim(),
                }),
                ...(dto.message !== undefined && {
                    message: dto.message.trim(),
                }),
            },
        });
        return {
            ...this.toPublicDto(row),
            updatedAt: row.updatedAt.toISOString(),
        };
    }
    async ensureRow() {
        const existing = await this.prisma.appUpdateConfig.findUnique({
            where: { id: SINGLETON_ID },
        });
        if (existing)
            return existing;
        return this.prisma.appUpdateConfig.create({
            data: {
                id: SINGLETON_ID,
                latestVersion: this.config.get('appUpdate.latestVersion')?.trim() ?? '',
                minVersion: this.config.get('appUpdate.minVersion')?.trim() ?? '',
                iosStoreUrl: this.config.get('appUpdate.iosStoreUrl')?.trim() ?? '',
                androidStoreUrl: this.config.get('appUpdate.androidStoreUrl')?.trim() ?? '',
                message: this.config.get('appUpdate.message')?.trim() ?? '',
            },
        });
    }
    toPublicDto(row) {
        return {
            latestVersion: row.latestVersion,
            minVersion: row.minVersion,
            iosStoreUrl: row.iosStoreUrl,
            androidStoreUrl: row.androidStoreUrl,
            message: row.message,
        };
    }
};
exports.AppUpdateService = AppUpdateService;
exports.AppUpdateService = AppUpdateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AppUpdateService);
//# sourceMappingURL=app-update.service.js.map