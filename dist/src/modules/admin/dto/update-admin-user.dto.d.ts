import { UserRole } from '@prisma/client';
export declare class UpdateAdminUserDto {
    role?: UserRole;
    isActive?: boolean;
}
