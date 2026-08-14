import { ConfigService } from '@nestjs/config';
import type { ResetPasswordEmailPayload, SupportTicketReplyEmailPayload, TeamInviteEmailPayload } from './mail.types';
export declare class MailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    isConfigured(): boolean;
    sendTeamInviteEmail(payload: TeamInviteEmailPayload): Promise<void>;
    sendSupportTicketReplyEmail(payload: SupportTicketReplyEmailPayload): Promise<void>;
    sendResetPasswordEmail(payload: ResetPasswordEmailPayload): Promise<void>;
    private send;
    private getTransporter;
}
