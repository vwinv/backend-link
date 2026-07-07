type TeamInvitePageInput = {
    teamName: string;
    inviterName: string;
    inviteeEmail: string;
    inviteeFirstName?: string | null;
    isExpired: boolean;
    isUnavailable: boolean;
};
export declare function buildTeamInviteNotFoundPage(): string;
export declare function buildTeamInviteLandingPage(input: TeamInvitePageInput): string;
export {};
