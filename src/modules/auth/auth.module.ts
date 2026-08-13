import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { AdminAccessGuard } from './guards/admin-access.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { OAuthService } from './oauth/oauth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret', 'change-me'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn', '7d'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OAuthService,
    JwtStrategy,
    RolesGuard,
    AdminAccessGuard,
    PermissionsGuard,
  ],
  exports: [
    AuthService,
    JwtModule,
    RolesGuard,
    AdminAccessGuard,
    PermissionsGuard,
  ],
})
export class AuthModule {}
