import { ConfigService } from '@nestjs/config';
export declare class UploadsService {
    private readonly configService;
    constructor(configService: ConfigService);
    buildPublicUrl(filename: string): string;
}
