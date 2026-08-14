import type { ResetPasswordEmailPayload } from './mail.types';
export declare function buildResetPasswordEmail(payload: ResetPasswordEmailPayload): {
    subject: string;
    text: string;
    html: string;
};
