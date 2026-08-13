"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSupportService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const mail_service_1 = require("../mail/mail.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const support_service_1 = require("../support/support.service");
let AdminSupportService = class AdminSupportService {
    prisma;
    mailService;
    supportService;
    constructor(prisma, mailService, supportService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.supportService = supportService;
    }
    async getStats() {
        const [open, replied, closed, total] = await Promise.all([
            this.prisma.supportTicket.count({
                where: { status: client_1.SupportTicketStatus.OPEN },
            }),
            this.prisma.supportTicket.count({
                where: { status: client_1.SupportTicketStatus.REPLIED },
            }),
            this.prisma.supportTicket.count({
                where: { status: client_1.SupportTicketStatus.CLOSED },
            }),
            this.prisma.supportTicket.count(),
        ]);
        return { open, replied, closed, total };
    }
    async list(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status)
            where.status = query.status;
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Ticket introuvable');
        }
        return this.toDetail(ticket);
    }
    async reply(id, dto, actorUserId) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id },
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket introuvable');
        }
        if (ticket.status === client_1.SupportTicketStatus.CLOSED) {
            throw new common_1.BadRequestException('Ce ticket est clôturé — aucune réponse possible');
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
            data: { status: client_1.SupportTicketStatus.REPLIED },
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
            status: client_1.SupportTicketStatus.REPLIED,
            emailedTo: ticket.email,
        };
    }
    toListItem(ticket) {
        return {
            id: ticket.id,
            firstName: ticket.firstName,
            lastName: ticket.lastName,
            fullName: `${ticket.firstName} ${ticket.lastName}`.trim(),
            email: ticket.email,
            phone: ticket.phone,
            messagePreview: ticket.message.length > 140
                ? `${ticket.message.slice(0, 137)}…`
                : ticket.message,
            status: ticket.status,
            repliesCount: ticket._count?.replies ?? 0,
            closedAt: ticket.closedAt?.toISOString() ?? null,
            createdAt: ticket.createdAt.toISOString(),
            updatedAt: ticket.updatedAt.toISOString(),
        };
    }
    toDetail(ticket) {
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
};
exports.AdminSupportService = AdminSupportService;
exports.AdminSupportService = AdminSupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        support_service_1.SupportService])
], AdminSupportService);
//# sourceMappingURL=admin-support.service.js.map