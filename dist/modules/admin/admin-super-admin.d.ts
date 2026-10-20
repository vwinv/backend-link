import type { AuthUserPayload } from '../auth/decorators/current-user.decorator';
export declare function isSuperAdmin(actor: AuthUserPayload): boolean;
export declare function assertSuperAdmin(actor: AuthUserPayload): void;
