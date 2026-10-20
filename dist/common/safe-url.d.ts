export declare function sanitizePublicHttpUrl(raw: string | null | undefined, options?: {
    allowHttp?: boolean;
}): string | null;
export declare function assertSafePublicHttpUrl(raw: string, fieldLabel?: string): string;
export declare function assertSafeRemoteImageUrl(raw: string, allowedOrigins?: string[]): Promise<string>;
export declare function maskEmail(email: string): string;
