import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, SupportTicketStatus } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SupportService } from '../support/support.service';
import { AdminSupportTicketsQueryDto } from './dto/admin-support-tickets-query.dto';
import { ReplySupportTicketDto } from './dto/reply-support-ticket.dto';

@Injectable()
export class AdminSupportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly supportService: SupportService,
  ) {}

  async getStats() {
    const [open, replied, closed, total] = await Promise.all([
      this.prisma.supportTicket.count({
        where: { status: SupportTicketStatus.OPEN },
      }),
      this.prisma.supportTicket.count({
        where: { status: SupportTicketStatus.REPLIED },
      }),
      this.prisma.supportTicket.count({
        where: { status: SupportTicketStatus.CLOSED },
      }),
      this.prisma.supportTicket.count(),
    ]);

    return { open, replied, closed, total };
  }

  async list(query: AdminSupportTicketsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.SupportTicketWhereInput = {};
    if (query.status) where.status = query.status;

    const search = query.search?.trim();
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, rows] = await Promise.all([
      this.prisma.supportTicket.count({ where }),
      this.prisma.supportTicket.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          _count: { select: { replies: true } },
        },
      }),
    ]);

    return {
      data: rows.map((ticket) => this.toListItem(ticket)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOne(id: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            sentBy: {
              select: { id: true, email: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket introuvable');
    }

    return this.toDetail(ticket);
  }

  async reply(id: string, dto: ReplySupportTicketDto, actorUserId: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
    });
    if (!ticket) {
      throw new NotFoundException('Ticket introuvable');
    }
    if (ticket.status === SupportTicketStatus.CLOSED) {
      throw new BadRequestException(
        'Ce ticket est clôturé — aucune réponse possible',
      );
    }

    const reply = await this.prisma.supportTicketReply.create({
      data: {
        ticketId: ticket.id,
        body: dto.body,
        sentByUserId: actorUserId,
      },
    });

    await this.prisma.supportTicket.update({
      where: { id: ticket.id },
      data: { status: SupportTicketStatus.REPLIED },
    });

    const closeUrl = this.supportService.getClosePageUrl(ticket.closeToken);

    await this.mailService.sendSupportTicketReplyEmail({
      to: ticket.email,
      firstName: ticket.firstName,
      replyBody: dto.body,
      ticketId: ticket.id,
      closeUrl,
    });

    return {
      replyId: reply.id,
      ticketId: ticket.id,
      status: SupportTicketStatus.REPLIED,
      emailedTo: ticket.email,
    };
  }

  private toListItem(ticket: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    message: string;
    status: SupportTicketStatus;
    closedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count?: { replies: number };
  }) {
    return {
      id: ticket.id,
      firstName: ticket.firstName,
      lastName: ticket.lastName,
      fullName: `${ticket.firstName} ${ticket.lastName}`.trim(),
      email: ticket.email,
      phone: ticket.phone,
      messagePreview:
        ticket.message.length > 140
          ? `${ticket.message.slice(0, 137)}…`
          : ticket.message,
      status: ticket.status,
      repliesCount: ticket._count?.replies ?? 0,
      closedAt: ticket.closedAt?.toISOString() ?? null,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
    };
  }

  private toDetail(ticket: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    message: string;
    status: SupportTicketStatus;
    closedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    replies: Array<{
      id: string;
      body: string;
      createdAt: Date;
      sentBy: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
      } | null;
    }>;
  }) {
    return {
      id: ticket.id,
      firstName: ticket.firstName,
      lastName: ticket.lastName,
      fullName: `${ticket.firstName} ${ticket.lastName}`.trim(),
      email: ticket.email,
      phone: ticket.phone,
      message: ticket.message,
      status: ticket.status,
      closedAt: ticket.closedAt?.toISOString() ?? null,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      replies: ticket.replies.map((reply) => ({
        id: reply.id,
        body: reply.body,
        createdAt: reply.createdAt.toISOString(),
        sentBy: reply.sentBy
          ? {
              id: reply.sentBy.id,
              email: reply.sentBy.email,
              name: `${reply.sentBy.firstName} ${reply.sentBy.lastName}`.trim(),
            }
          : null,
      })),
    };
  }
}
