import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateAppUpdateConfigDto } from './dto/update-app-update-config.dto';

const SINGLETON_ID = 'default';

export type AppUpdateConfigDto = {
  latestVersion: string;
  minVersion: string;
  iosStoreUrl: string;
  androidStoreUrl: string;
  message: string;
  updatedAt?: string;
};

@Injectable()
export class AppUpdateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** Payload public consommé par l’app mobile. */
  async getPublicConfig(): Promise<AppUpdateConfigDto> {
    const row = await this.ensureRow();
    return this.toPublicDto(row);
  }

  /** Payload admin (inclut updatedAt). */
  async getAdminConfig(): Promise<AppUpdateConfigDto> {
    const row = await this.ensureRow();
    return {
      ...this.toPublicDto(row),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async updateConfig(dto: UpdateAppUpdateConfigDto): Promise<AppUpdateConfigDto> {
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

  private async ensureRow() {
    const existing = await this.prisma.appUpdateConfig.findUnique({
      where: { id: SINGLETON_ID },
    });
    if (existing) return existing;

    return this.prisma.appUpdateConfig.create({
      data: {
        id: SINGLETON_ID,
        latestVersion:
          this.config.get<string>('appUpdate.latestVersion')?.trim() ?? '',
        minVersion:
          this.config.get<string>('appUpdate.minVersion')?.trim() ?? '',
        iosStoreUrl:
          this.config.get<string>('appUpdate.iosStoreUrl')?.trim() ?? '',
        androidStoreUrl:
          this.config.get<string>('appUpdate.androidStoreUrl')?.trim() ?? '',
        message: this.config.get<string>('appUpdate.message')?.trim() ?? '',
      },
    });
  }

  private toPublicDto(row: {
    latestVersion: string;
    minVersion: string;
    iosStoreUrl: string;
    androidStoreUrl: string;
    message: string;
  }): AppUpdateConfigDto {
    return {
      latestVersion: row.latestVersion,
      minVersion: row.minVersion,
      iosStoreUrl: row.iosStoreUrl,
      androidStoreUrl: row.androidStoreUrl,
      message: row.message,
    };
  }
}
