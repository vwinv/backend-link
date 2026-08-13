import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AuthUserPayload } from '../decorators/current-user.decorator';

/** Accès backoffice : rôle RBAC assigné ou ADMIN legacy. */
@Injectable()
export class AdminAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user?: AuthUserPayload;
    }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Accès refusé');
    }

    const allowed =
      Boolean(user.adminRoleId) ||
      user.role === UserRole.ADMIN ||
      user.permissions.includes('*');

    if (!allowed) {
      throw new ForbiddenException(
        'Accès réservé aux utilisateurs du backoffice DropOne',
      );
    }

    return true;
  }
}
