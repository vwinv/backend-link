import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '@prisma/client';
export type OAuthProfile = {
    provider: AuthProvider;
    providerId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
};
export declare class OAuthService {
    private readonly configService;
    private readonly googleClient;
    constructor(configService: ConfigService);
    verifyGoogleIdToken(idToken: string): Promise<OAuthProfile>;
    verifyAppleIdToken(idToken: string, firstName?: string, lastName?: string): Promise<OAuthProfile>;
}
