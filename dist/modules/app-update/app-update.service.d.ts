import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateAppUpdateConfigDto } from './dto/update-app-update-config.dto';
export type AppUpdateConfigDto = {
    latestVersion: string;
    minVersion: string;
    iosStoreUrl: string;
    androidStoreUrl: string;
    message: string;
    updatedAt?: string;
};
export declare class AppUpdateService {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaService, config: ConfigService);
    getPublicConfig(): Promise<AppUpdateConfigDto>;
    getAdminConfig(): Promise<AppUpdateConfigDto>;
    updateConfig(dto: UpdateAppUpdateConfigDto): Promise<AppUpdateConfigDto>;
    private ensureRow;
    private toPublicDto;
}
