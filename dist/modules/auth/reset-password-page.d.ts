export type ResetPasswordPageState = {
    kind: 'form';
    token: string;
    error?: string;
} | {
    kind: 'invalid';
} | {
    kind: 'success';
};
export declare function buildResetPasswordPage(state: ResetPasswordPageState): string;
