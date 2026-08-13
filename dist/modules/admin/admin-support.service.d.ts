import { MailService } from '../mail/mail.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SupportService } from '../support/support.service';
import { AdminSupportTicketsQueryDto } from './dto/admin-support-tickets-query.dto';
import { ReplySupportTicketDto } from './dto/reply-support-ticket.dto';
export declare class AdminSupportService {
    private readonly prisma;
    private readonly mailService;
    private readonly supportService;
    constructor(prisma: PrismaService, mailService: MailService, supportService: SupportService);
    getStats(): Promise<{
        open: number;
        replied: number;
        closed: number;
        total: number;
    }>;
    list(query: AdminSupportTicketsQueryDto): Promise<{
        data: {
            id: string;
            firstName: string;
            lastName: string;
            fullName: string;
            email: string;
            phone: string | null;
            messagePreview: string;
            status: import("@prisma/client").$Enums.SupportTicketStatus;
            repliesCount: number;
            closedAt: string | null;
            createdAt: string;
            updatedAt: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        fullName: string;
        email: string;
        phone: string | null;
        message: string;
        status: import("@prisma/client").$Enums.SupportTicketStatus;
        closedAt: string | null;
        createdAt: string;
        updatedAt: string;
        replies: {
            id: string;
            body: string;
            createdAt: string;
            sentBy: {
                id: string;
                email: string;
                name: string;
            } | null;
        }[];
    }>;
    reply(id: string, dto: ReplySupportTicketDto, actorUserId: string): Promise<{
        replyId: string;
        ticketId: string;
        status: "REPLIED";
        emailedTo: string;
    }>;
    private toListItem;
    private toDetail;
}
