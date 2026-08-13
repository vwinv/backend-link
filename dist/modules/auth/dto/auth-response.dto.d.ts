import { UserRole } from '@prisma/client';
export declare class AdminRoleSummaryDto {
    id: string;
    name: string;
}
export declare class AuthUserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    avatarUrl: string | null;
    role: UserRole;
    adminRole?: AdminRoleSummaryDto | null;
    permissions?: string[];
}
export declare class AuthResponseDto {
    accessToken: string;
    user: AuthUserDto;
}
