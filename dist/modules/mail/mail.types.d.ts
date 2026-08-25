export type TeamInviteEmailPayload = {
    to: string;
    inviteeFirstName?: string | null;
    teamName: string;
    inviterName: string;
    inviteId: string;
    inviteUrl: string;
    temporaryPassword?: string;
};
export type SupportTicketReplyEmailPayload = {
    to: string;
    firstName: string;
    replyBody: string;
    ticketId: string;
    closeUrl: string;
};
export type ResetPasswordEmailPayload = {
    to: string;
    firstName: string;
    resetUrl: string;
};
export type SubscriptionSignupNoticePayload = {
    to: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    offerTitle: string;
    billingType: string;
    seats?: number | null;
};
