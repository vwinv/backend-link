import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthAppleDto } from './dto/oauth-apple.dto';
import { OAuthGoogleDto } from './dto/oauth-google.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    getMe(user: {
        userId: string;
    }): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
    }>;
    loginWithGoogle(dto: OAuthGoogleDto): Promise<AuthResponseDto>;
    loginWithApple(dto: OAuthAppleDto): Promise<AuthResponseDto>;
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
}
