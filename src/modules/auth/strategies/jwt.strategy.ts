import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';

export type JwtPayload = {
  sub: string;
  email: string;
  role?: UserRole;
  sv?: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secret = configService.get<string>('jwt.secret', 'change-me');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
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

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Session invalide');
    }

    const tokenSessionVersion = payload.sv ?? 0;
    if (tokenSessionVersion !== user.sessionVersion) {
      throw new UnauthorizedException('Session expirée, reconnectez-vous');
    }

    const permissions =
      user.adminRole?.permissions.map((item) => item.permission.key) ?? [];

    // Legacy platform ADMIN without RBAC role: full backoffice access
    if (user.role === UserRole.ADMIN && !user.adminRoleId) {
      permissions.push('*');
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      adminRoleId: user.adminRoleId,
      adminRoleName: user.adminRole?.name ?? null,
      permissions,
      sessionVersion: user.sessionVersion,
    };
  }
}
