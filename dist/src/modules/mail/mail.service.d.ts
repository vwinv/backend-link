import { ConfigService } from '@nestjs/config';
import type { TeamInviteEmailPayload } from './mail.types';
export declare class MailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    isConfigured(): boolean;
    sendTeamInviteEmail(payload: TeamInviteEmailPayload): Promise<void>;
    private getTransporter;
}
