import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthResponseDto, AuthUserDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthAppleDto } from './dto/oauth-apple.dto';
import { OAuthGoogleDto } from './dto/oauth-google.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Créer un compte utilisateur' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur (email / mot de passe)' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil de l\'utilisateur connecté (validation session)' })
  @ApiResponse({ status: 200, type: AuthUserDto })
  getMe(@CurrentUser() user: { userId: string }) {
    return this.authService.getMe(user.userId);
  }

  @Post('oauth/google')
  @ApiOperation({
    summary: 'Connexion / inscription via OAuth 2.0 Google (OpenID Connect)',
  })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  loginWithGoogle(@Body() dto: OAuthGoogleDto) {
    return this.authService.loginWithGoogle(dto.idToken);
  }

  @Post('oauth/apple')
  @ApiOperation({
    summary: 'Connexion / inscription via OAuth 2.0 Apple (Sign in with Apple)',
  })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  loginWithApple(@Body() dto: OAuthAppleDto) {
    return this.authService.loginWithApple(
      dto.idToken,
      dto.firstName,
      dto.lastName,
    );
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Rafraîchir le token JWT' })
  refresh() {
    return this.authService.refresh();
  }

  @Post('logout')
  @ApiOperation({ summary: 'Déconnexion utilisateur' })
  logout() {
    return this.authService.logout();
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Demande de réinitialisation du mot de passe' })
  forgotPassword() {
    return this.authService.forgotPassword();
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Réinitialiser le mot de passe' })
  resetPassword() {
    return this.authService.resetPassword();
  }
}
