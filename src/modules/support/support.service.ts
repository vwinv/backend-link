import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupportTicketStatus } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';

@Injectable()
export class SupportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createTicket(dto: CreateSupportTicketDto) {
    const ticket = await this.prisma.supportTicket.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email.toLowerCase(),
        phone: dto.phone?.trim() || null,
        message: dto.message,
        closeToken: randomBytes(24).toString('hex'),
        status: SupportTicketStatus.OPEN,
      },
    });

    return {
      id: ticket.id,
      status: ticket.status,
      createdAt: ticket.createdAt.toISOString(),
      message: 'Votre message a bien été envoyé. Nous vous répondrons par e-mail.',
    };
  }

  async closeByToken(token: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { closeToken: token },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket introuvable');
    }

    if (ticket.status === SupportTicketStatus.CLOSED) {
      return {
        alreadyClosed: true,
        ticketId: ticket.id,
        closedAt: ticket.closedAt?.toISOString() ?? null,
      };
    }

    const closed = await this.prisma.supportTicket.update({
      where: { id: ticket.id },
      data: {
        status: SupportTicketStatus.CLOSED,
        closedAt: new Date(),
      },
    });

    return {
      alreadyClosed: false,
      ticketId: closed.id,
      closedAt: closed.closedAt?.toISOString() ?? null,
    };
  }

  getClosePageUrl(closeToken: string): string {
    const landing = this.configService
      .get<string>('landingPublicUrl', 'https://dropone.pro')
      .replace(/\/$/, '');
    return `${landing}/support/close/${closeToken}`;
  }
}
