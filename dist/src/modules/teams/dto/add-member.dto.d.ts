import { TeamMemberRole } from '@prisma/client';
export declare class AddMemberDto {
    email: string;
    role?: TeamMemberRole;
}
