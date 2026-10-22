import { ConfigService } from '@nestjs/config';
import type { ResetPasswordEmailPayload, SubscriptionSignupNoticePayload, SupportTicketReplyEmailPayload, TeamDashboardEmailPayload, TeamInviteEmailPayload } from './mail.types';
export declare class MailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    isConfigured(): boolean;
    sendTeamDashboardEmail(payload: TeamDashboardEmailPayload): Promise<void>;
    sendTeamInviteEmail(payload: TeamInviteEmailPayload): Promise<void>;
    sendSupportTicketReplyEmail(payload: SupportTicketReplyEmailPayload): Promise<void>;
    sendResetPasswordEmail(payload: ResetPasswordEmailPayload): Promise<void>;
    sendSubscriptionSignupNotice(payload: SubscriptionSignupNoticePayload): Promise<void>;
    private send;
    private getTransporter;
}
