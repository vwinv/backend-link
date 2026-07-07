export type TeamInviteEmailPayload = {
    to: string;
    inviteeFirstName?: string | null;
    teamName: string;
    inviterName: string;
    inviteId: string;
    inviteUrl: string;
};
