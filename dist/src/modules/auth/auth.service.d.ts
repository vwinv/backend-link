import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OAuthService } from './oauth/oauth.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly oauthService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, oauthService: OAuthService);
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    loginWithGoogle(idToken: string): Promise<AuthResponseDto>;
    loginWithApple(idToken: string, firstName?: string, lastName?: string): Promise<AuthResponseDto>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
    }>;
    refresh(): {
        message: string;
    };
    logout(): {
        message: string;
    };
    forgotPassword(): {
        message: string;
    };
    resetPassword(): {
        message: string;
    };
    private authenticateWithOAuth;
    private oauthOnlyMessage;
    private buildAuthResponse;
    private toPublicUser;
}
