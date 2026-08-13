import type { SupportTicketReplyEmailPayload } from './mail.types';
export declare function buildSupportTicketReplyEmail(payload: SupportTicketReplyEmailPayload): {
    subject: string;
    text: string;
    html: string;
};
