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
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let SupportService = class SupportService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async createTicket(dto) {
        const ticket = await this.prisma.supportTicket.create({
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email.toLowerCase(),
                phone: dto.phone?.trim() || null,
                message: dto.message,
                closeToken: (0, crypto_1.randomBytes)(24).toString('hex'),
                status: client_1.SupportTicketStatus.OPEN,
            },
        });
        return {
            id: ticket.id,
            status: ticket.status,
            createdAt: ticket.createdAt.toISOString(),
            message: 'Votre message a bien été envoyé. Nous vous répondrons par e-mail.',
        };
    }
    async closeByToken(token) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { closeToken: token },
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket introuvable');
        }
        if (ticket.status === client_1.SupportTicketStatus.CLOSED) {
            return {
                alreadyClosed: true,
                ticketId: ticket.id,
                closedAt: ticket.closedAt?.toISOString() ?? null,
            };
        }
        const closed = await this.prisma.supportTicket.update({
            where: { id: ticket.id },
            data: {
                status: client_1.SupportTicketStatus.CLOSED,
                closedAt: new Date(),
            },
        });
        return {
            alreadyClosed: false,
            ticketId: closed.id,
            closedAt: closed.closedAt?.toISOString() ?? null,
        };
    }
    getClosePageUrl(closeToken) {
        const landing = this.configService
            .get('landingPublicUrl', 'https://dropone.pro')
            .replace(/\/$/, '');
        return `${landing}/support/close/${closeToken}`;
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], SupportService);
//# sourceMappingURL=support.service.js.map