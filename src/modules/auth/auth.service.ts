import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider, TeamInviteStatus, User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { ACCOUNT_DELETED_ERROR } from './auth.constants';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OAuthProfile, OAuthService } from './oauth/oauth.service';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly oauthService: OAuthService,
    private readonly mailService: MailService,
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

  async logout(userId?: string) {
    if (userId) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { sessionVersion: { increment: 1 } },
      });
    }
    return { message: 'logout' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.trim().toLowerCase();
    const genericResponse = {
      message:
        'Si un compte existe pour cet e-mail, un lien de réinitialisation a été envoyé',
    };

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive || !user.passwordHash) {
      return genericResponse;
    }

    try {
      await this.prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, usedAt: null },
      });

      const token = randomBytes(32).toString('hex');
      const tokenHash = this.hashResetToken(token);
      await this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      });

      await this.mailService.sendResetPasswordEmail({
        to: user.email,
        firstName: user.firstName,
        resetUrl: this.getResetPasswordUrl(token),
      });
    } catch (error) {
      this.logger.error('forgotPassword failed', error);
      // Réponse identique pour éviter l’énumération / fuite d’état SMTP.
      return genericResponse;
    }

    return genericResponse;
  }

  async getValidResetToken(rawToken: string) {
    const token = rawToken.trim();
    if (!token) return null;

    try {
      const record = await this.prisma.passwordResetToken.findUnique({
        where: { tokenHash: this.hashResetToken(token) },
      });

      if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
        return null;
      }

      return record;
    } catch (error) {
      this.logger.error('getValidResetToken failed', error);
      return null;
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.getValidResetToken(dto.token);
    if (!record) {
      throw new BadRequestException(
        'Ce lien de réinitialisation est invalide ou a expiré',
      );
    }

    const password = dto.password.trim();
    if (password.length < 8) {
      throw new BadRequestException(
        'Le mot de passe doit contenir au moins 8 caractères',
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: {
          passwordHash,
          sessionVersion: { increment: 1 },
        },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.passwordResetToken.deleteMany({
        where: {
          userId: record.userId,
          id: { not: record.id },
          usedAt: null,
        },
      }),
    ]);

    return { message: 'Mot de passe mis à jour' };
  }

  private getResetPasswordUrl(token: string): string {
    const base = this.configService
      .get<string>('wallet.appPublicUrl', 'https://api.dropone.pro')
      .replace(/\/$/, '');
    return `${base}/reset-password?token=${encodeURIComponent(token)}`;
  }

  private hashResetToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
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
    const secret = this.configService.get<string>('jwt.secret', 'change-me');
    const expiresIn =
      this.configService.get<string>('jwt.expiresIn', '24h') ?? '24h';
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        sv: user.sessionVersion ?? 0,
      },
      {
        secret,
        expiresIn: expiresIn as `${number}${'s' | 'm' | 'h' | 'd'}`,
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
