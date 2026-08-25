import type { SubscriptionSignupNoticePayload } from './mail.types';
export declare function buildSubscriptionSignupNoticeEmail(payload: SubscriptionSignupNoticePayload): {
    subject: string;
    text: string;
    html: string;
};
