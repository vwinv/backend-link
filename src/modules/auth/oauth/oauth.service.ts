import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '@prisma/client';
import appleSignin from 'apple-signin-auth';
import { OAuth2Client } from 'google-auth-library';

export type OAuthProfile = {
  provider: AuthProvider;
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
};

@Injectable()
export class OAuthService {
  private readonly googleClient: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.googleClient = new OAuth2Client();
  }

  async verifyGoogleIdToken(idToken: string): Promise<OAuthProfile> {
    const clientIds = this.configService.get<string[]>('oauth.google.clientIds', []);

    if (clientIds.length === 0) {
      throw new UnauthorizedException('Google OAuth non configuré');
    }

    const ticket = await this.googleClient
      .verifyIdToken({
        idToken,
        audience: clientIds,
      })
      .catch(() => {
        throw new UnauthorizedException('Token Google invalide');
      });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Token Google incomplet');
    }

    return {
      provider: AuthProvider.GOOGLE,
      providerId: payload.sub,
      email: payload.email.toLowerCase(),
      firstName: payload.given_name?.trim() || 'Utilisateur',
      lastName: payload.family_name?.trim() || 'User',
      avatarUrl: payload.picture ?? null,
    };
  }

  async verifyAppleIdToken(
    idToken: string,
    firstName?: string,
    lastName?: string,
  ): Promise<OAuthProfile> {
    const clientId = this.configService.get<string>('oauth.apple.clientId');

    if (!clientId) {
      throw new UnauthorizedException('Apple OAuth non configuré');
    }

    const payload = await appleSignin
      .verifyIdToken(idToken, {
        audience: clientId,
        ignoreExpiration: false,
      })
      .catch(() => {
        throw new UnauthorizedException('Token Apple invalide');
      });

    if (!payload.sub) {
      throw new UnauthorizedException('Token Apple incomplet');
    }

    const email =
      typeof payload.email === 'string'
        ? payload.email.toLowerCase()
        : `apple-${payload.sub}@privaterelay.link.local`;

    return {
      provider: AuthProvider.APPLE,
      providerId: payload.sub,
      email,
      firstName: firstName?.trim() || 'Utilisateur',
      lastName: lastName?.trim() || 'User',
      avatarUrl: null,
    };
  }
}
