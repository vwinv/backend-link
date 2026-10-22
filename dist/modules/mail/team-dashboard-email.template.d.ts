import type { TeamDashboardEmailPayload } from './mail.types';
export declare function buildTeamDashboardEmail(payload: TeamDashboardEmailPayload): {
    subject: string;
    text: string;
    html: string;
};
