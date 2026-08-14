import { AuthResponseDto } from './dto/auth-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthAppleDto } from './dto/oauth-apple.dto';
import { OAuthGoogleDto } from './dto/oauth-google.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    loginAdmin(dto: LoginDto): Promise<AuthResponseDto>;
    loginAdminWithGoogle(dto: OAuthGoogleDto): Promise<AuthResponseDto>;
    getMe(user: {
        userId: string;
    }): Promise<{
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
    getAdminMe(user: {
        userId: string;
    }): Promise<{
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
    loginWithGoogle(dto: OAuthGoogleDto): Promise<AuthResponseDto>;
    loginWithApple(dto: OAuthAppleDto): Promise<AuthResponseDto>;
    refresh(): {
        message: string;
    };
    logout(): {
        message: string;
    };
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
