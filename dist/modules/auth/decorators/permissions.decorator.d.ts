import { AdminPermissionKey } from '../../admin/admin-permissions.catalog';
export declare const PERMISSIONS_KEY = "permissions";
export declare const RequirePermissions: (...permissions: AdminPermissionKey[]) => import("@nestjs/common").CustomDecorator<string>;
