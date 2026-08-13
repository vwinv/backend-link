import type { TeamInviteEmailPayload } from './mail.types';
export declare function buildTeamInviteEmail(payload: TeamInviteEmailPayload): {
    subject: string;
    text: string;
    html: string;
};
