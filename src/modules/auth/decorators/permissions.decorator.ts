import { SetMetadata } from '@nestjs/common';
import { AdminPermissionKey } from '../../admin/admin-permissions.catalog';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: AdminPermissionKey[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
