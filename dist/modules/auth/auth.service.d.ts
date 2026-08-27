import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OAuthService } from './oauth/oauth.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly oauthService;
    private readonly mailService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, oauthService: OAuthService, mailService: MailService);
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    loginAdmin(dto: LoginDto): Promise<AuthResponseDto>;
    loginWithGoogle(idToken: string): Promise<AuthResponseDto>;
    loginAdminWithGoogle(idToken: string): Promise<AuthResponseDto>;
    loginWithApple(idToken: string, firstName?: string, lastName?: string): Promise<AuthResponseDto>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        adminRole: {
            id: string;
            name: string;
        } | null;
        permissions: string[];
    }>;
    getAdminMe(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        adminRole: {
            id: string;
            name: string;
        } | null;
        permissions: string[];
    }>;
    refresh(): {
        message: string;
    };
    logout(): {
        message: string;
    };
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    getValidResetToken(rawToken: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        tokenHash: string;
        usedAt: Date | null;
    } | null>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private getResetPasswordUrl;
    private hashResetToken;
    private authenticateLocal;
    private authenticateWithOAuth;
    private linkPendingInvites;
    private loadAdminUser;
    private canAccessBackoffice;
    private oauthOnlyMessage;
    private buildAuthResponse;
    private toPublicUser;
}
