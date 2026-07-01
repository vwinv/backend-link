import { CardKind } from '@prisma/client';
export declare class CreateCardDto {
    firstName: string;
    lastName: string;
    jobTitle?: string;
    company?: string;
    bio?: string;
    email?: string;
    phone?: string;
    teamId?: string;
    isPublic?: boolean;
    kind?: CardKind;
}
