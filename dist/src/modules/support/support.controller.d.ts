import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { SupportService } from './support.service';
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    createTicket(dto: CreateSupportTicketDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SupportTicketStatus;
        createdAt: string;
        message: string;
    }>;
    closeTicket(token: string): Promise<{
        alreadyClosed: boolean;
        ticketId: string;
        closedAt: string | null;
    }>;
    closeTicketGet(token: string): Promise<{
        alreadyClosed: boolean;
        ticketId: string;
        closedAt: string | null;
    }>;
}
