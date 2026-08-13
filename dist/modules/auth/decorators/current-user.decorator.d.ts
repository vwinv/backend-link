import { UserRole } from '@prisma/client';
export type AuthUserPayload = {
    userId: string;
    email: string;
    role: UserRole;
    adminRoleId: string | null;
    adminRoleName: string | null;
    permissions: string[];
};
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
