import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
export declare class SupportService {
    private readonly prisma;
    private readonly configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    createTicket(dto: CreateSupportTicketDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SupportTicketStatus;
        createdAt: string;
        message: string;
    }>;
    closeByToken(token: string): Promise<{
        alreadyClosed: boolean;
        ticketId: string;
        closedAt: string | null;
    }>;
    getClosePageUrl(closeToken: string): string;
}
