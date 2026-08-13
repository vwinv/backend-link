import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export type FcmSendResult = {
    configured: boolean;
    attempted: number;
    success: number;
    failure: number;
    invalidTokens: string[];
    lastError?: string;
};
export declare class FcmPushService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private authClient;
    private projectId;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    get isConfigured(): boolean;
    private initialize;
    sendToTokens(input: {
        tokens: string[];
        title: string;
        body: string;
        data?: Record<string, string>;
    }): Promise<FcmSendResult>;
}
