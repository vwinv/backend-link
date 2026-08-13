import { SupportTicketStatus } from '@prisma/client';
export declare class AdminSupportTicketsQueryDto {
    search?: string;
    status?: SupportTicketStatus;
    page?: number;
    limit?: number;
}
