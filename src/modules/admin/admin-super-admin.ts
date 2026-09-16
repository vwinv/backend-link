import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import type { AuthUserPayload } from '../auth/decorators/current-user.decorator';
import { SUPER_ADMIN_ROLE_NAME } from './admin-permissions.catalog';

/** Super Admin RBAC, ou ADMIN legacy sans rôle (accès complet). */
export function isSuperAdmin(actor: AuthUserPayload): boolean {
  if (actor.adminRoleName === SUPER_ADMIN_ROLE_NAME) return true;
  if (actor.permissions.includes('*')) return true;
  return actor.role === UserRole.ADMIN && !actor.adminRoleId;
}

export function assertSuperAdmin(actor: AuthUserPayload): void {
  if (!isSuperAdmin(actor)) {
    throw new ForbiddenException(
      'Action réservée au Super Admin',
    );
  }
}
