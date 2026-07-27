export type TeamInviteEmailPayload = {
  to: string;
  inviteeFirstName?: string | null;
  teamName: string;
  inviterName: string;
  inviteId: string;
  inviteUrl: string;
  /** Mot de passe temporaire généré si un compte vient d’être créé. */
  temporaryPassword?: string;
};
