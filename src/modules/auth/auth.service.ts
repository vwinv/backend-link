import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider, TeamInviteStatus, User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { ACCOUNT_DELETED_ERROR } from './auth.constants';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OAuthProfile, OAuthService } from './oauth/oauth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly oauthService: OAuthService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        authProvider: AuthProvider.LOCAL,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
      },
    });

    await this.linkPendingInvites(user.id, email);

    const full = await this.loadAdminUser(user.id);
    return this.buildAuthResponse(full!);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authenticateLocal(dto);
    const full = await this.loadAdminUser(user.id);
    return this.buildAuthResponse(full!);
  }

  /** Connexion backoffice : rôle backoffice ou ADMIN legacy. */
  async loginAdmin(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authenticateLocal(dto);
    const full = await this.loadAdminUser(user.id);
    if (!full || !this.canAccessBackoffice(full)) {
      throw new ForbiddenException(
        'Accès réservé aux utilisateurs du backoffice DropOne',
      );
    }
    return this.buildAuthResponse(full);
  }

  async loginWithGoogle(idToken: string): Promise<AuthResponseDto> {
    const profile = await this.oauthService.verifyGoogleIdToken(idToken);
    return this.authenticateWithOAuth(profile);
  }

  /** Connexion Google backoffice : aucun compte n’est créé. */
  async loginAdminWithGoogle(idToken: string): Promise<AuthResponseDto> {
    const profile = await this.oauthService.verifyGoogleIdToken(idToken);

    let user = await this.prisma.user.findFirst({
      where: {
        authProvider: AuthProvider.GOOGLE,
        providerId: profile.providerId,
      },
    });

    if (!user) {
      user = await this.prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (user) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            authProvider: AuthProvider.GOOGLE,
            providerId: profile.providerId,
            avatarUrl: user.avatarUrl ?? profile.avatarUrl,
          },
        });
      }
    } else if (profile.avatarUrl && !user.avatarUrl) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl: profile.avatarUrl },
      });
    }

    if (!user) {
      throw new ForbiddenException(
        'Aucun compte backoffice associé à cet email Google',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(ACCOUNT_DELETED_ERROR);
    }

    const full = await this.loadAdminUser(user.id);
    if (!full || !this.canAccessBackoffice(full)) {
      throw new ForbiddenException(
        'Accès réservé aux utilisateurs du backoffice DropOne',
      );
    }

    return this.buildAuthResponse(full);
  }

  async loginWithApple(
    idToken: string,
    firstName?: string,
    lastName?: string,
  ): Promise<AuthResponseDto> {
    const profile = await this.oauthService.verifyAppleIdToken(
      idToken,
      firstName,
      lastName,
    );
    return this.authenticateWithOAuth(profile);
  }

  async getMe(userId: string) {
    const user = await this.loadAdminUser(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        user && !user.isActive ? ACCOUNT_DELETED_ERROR : 'Session invalide',
      );
    }
    return this.toPublicUser(user);
  }

  async getAdminMe(userId: string) {
    const user = await this.loadAdminUser(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        user && !user.isActive ? ACCOUNT_DELETED_ERROR : 'Session invalide',
      );
    }
    if (!this.canAccessBackoffice(user)) {
      throw new ForbiddenException(
        'Accès réservé aux utilisateurs du backoffice DropOne',
      );
    }
    return this.toPublicUser(user);
  }

  refresh() {
    // TODO: implémenter le refresh token OAuth 2.0
    return { message: 'refresh' };
  }

  logout() {
    // TODO: implémenter la révocation de token
    return { message: 'logout' };
  }

  forgotPassword() {
    // TODO: implémenter forgot password
    return { message: 'forgot-password' };
  }

  resetPassword() {
    // TODO: implémenter reset password
    return { message: 'reset-password' };
  }

  private async authenticateLocal(dto: LoginDto): Promise<User> {
    const email = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(ACCOUNT_DELETED_ERROR);
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(this.oauthOnlyMessage(user.authProvider));
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    return user;
  }

  private async authenticateWithOAuth(
    profile: OAuthProfile,
  ): Promise<AuthResponseDto> {
    let user = await this.prisma.user.findFirst({
      where: {
        authProvider: profile.provider,
        providerId: profile.providerId,
      },
    });

    if (!user) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (existingEmail) {
        throw new ConflictException(
          'Un compte existe déjà avec cet email. Connectez-vous avec votre méthode habituelle.',
        );
      }

      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          authProvider: profile.provider,
          providerId: profile.providerId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.avatarUrl,
        },
      });

      await this.linkPendingInvites(user.id, profile.email);
    } else if (profile.avatarUrl && !user.avatarUrl) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl: profile.avatarUrl },
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException(ACCOUNT_DELETED_ERROR);
    }

    const full = await this.loadAdminUser(user.id);
    return this.buildAuthResponse(full!);
  }

  private async linkPendingInvites(userId: string, email: string) {
    await this.prisma.teamInvite.updateMany({
      where: {
        email,
        status: TeamInviteStatus.PENDING,
        inviteeUserId: null,
      },
      data: { inviteeUserId: userId },
    });
  }

  private async loadAdminUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        adminRole: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });
  }

  private canAccessBackoffice(
    user: {
      role: UserRole;
      adminRoleId: string | null;
      isActive: boolean;
    } | null,
  ): boolean {
    if (!user?.isActive) return false;
    return Boolean(user.adminRoleId) || user.role === UserRole.ADMIN;
  }

  private oauthOnlyMessage(provider: AuthProvider): string {
    switch (provider) {
      case AuthProvider.GOOGLE:
        return 'Ce compte utilise Google. Connectez-vous avec Google.';
      case AuthProvider.APPLE:
        return 'Ce compte utilise Apple. Connectez-vous avec Apple.';
      default:
        return 'Email ou mot de passe incorrect';
    }
  }

  private buildAuthResponse(
    user: NonNullable<Awaited<ReturnType<AuthService['loadAdminUser']>>>,
  ): AuthResponseDto {
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      {
        secret: this.configService.get<string>('jwt.secret', 'change-me'),
        expiresIn: this.configService.get('jwt.expiresIn', '7d'),
      },
    );

    return {
      accessToken,
      user: this.toPublicUser(user),
    };
  }

  private toPublicUser(
    user: NonNullable<Awaited<ReturnType<AuthService['loadAdminUser']>>> | User,
  ) {
    const adminRole =
      'adminRole' in user && user.adminRole
        ? { id: user.adminRole.id, name: user.adminRole.name }
        : null;

    let permissions: string[] = [];
    if ('adminRole' in user && user.adminRole) {
      permissions = user.adminRole.permissions.map(
        (item) => item.permission.key,
      );
    }
    if (user.role === UserRole.ADMIN && !('adminRoleId' in user ? user.adminRoleId : null)) {
      permissions = ['*'];
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role,
      adminRole,
      permissions,
    };
  }
}
