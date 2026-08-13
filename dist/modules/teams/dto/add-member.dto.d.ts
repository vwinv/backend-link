import { TeamMemberRole } from '@prisma/client';
export declare class AddMemberDto {
    email: string;
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    avatarUrl?: string;
    role?: TeamMemberRole;
}
