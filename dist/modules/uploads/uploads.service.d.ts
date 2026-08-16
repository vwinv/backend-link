import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export type UploadedImage = {
    url: string;
    filename: string;
};
export declare class UploadsService {
    private readonly configService;
    private readonly prisma;
    private readonly logger;
    private readonly uploadsDir;
    constructor(configService: ConfigService, prisma: PrismaService);
    private env;
    private get cloudName();
    private get apiKey();
    private get apiSecret();
    private get folder();
    isCloudinaryConfigured(): boolean;
    uploadImage(file: Express.Multer.File): Promise<UploadedImage>;
    replaceImage(previousUrl: string | null | undefined, nextUrl: string | null | undefined): Promise<void>;
    private countUsages;
    private deleteStoredImage;
    private publicIdFromCloudinaryUrl;
    private localFilenameFromUrl;
    private uploadToCloudinary;
    private saveLocally;
    buildPublicUrl(filename: string): string;
}
