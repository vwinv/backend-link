import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { AuthUserPayload } from '../decorators/current-user.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: AuthUserPayload;
    }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Accès refusé');
    }

    // Bootstrap legacy: UserRole.ADMIN sans rôle RBAC = tous droits
    if (user.role === UserRole.ADMIN && user.permissions.includes('*')) {
      return true;
    }

    const ok = required.every((permission) =>
      user.permissions.includes(permission) || user.permissions.includes('*'),
    );

    if (!ok) {
      throw new ForbiddenException(
        'Permission insuffisante pour cette action',
      );
    }

    return true;
  }
}
