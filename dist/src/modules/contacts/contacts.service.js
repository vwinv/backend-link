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
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const contacts_util_1 = require("./contacts.util");
let ContactsService = class ContactsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        const contacts = await this.prisma.contact.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return contacts.map(contacts_util_1.toContactResponse);
    }
    async findExchangeContacts(userId) {
        const contacts = await this.prisma.contact.findMany({
            where: { userId, source: client_1.ContactSource.EXCHANGE },
            orderBy: { createdAt: 'desc' },
        });
        return contacts.map(contacts_util_1.toContactResponse);
    }
    async exchangeFromCardSlug(userId, cardSlug) {
        const card = await this.prisma.businessCard.findFirst({
            where: {
                slug: cardSlug.trim(),
                isActive: true,
                isPublic: true,
            },
        });
        if (!card) {
            throw new common_1.NotFoundException('Carte introuvable');
        }
        if (card.ownerId === userId) {
            throw new common_1.BadRequestException('Vous ne pouvez pas échanger votre propre carte');
        }
        const existing = await this.prisma.contact.findFirst({
            where: {
                userId,
                linkedCardId: card.id,
            },
        });
        if (existing) {
            return (0, contacts_util_1.toContactResponse)(existing);
        }
        const contact = await this.prisma.contact.create({
            data: {
                userId,
                source: client_1.ContactSource.EXCHANGE,
                firstName: card.firstName.trim(),
                lastName: card.lastName.trim(),
                email: card.email,
                phone: card.phone,
                jobTitle: card.jobTitle,
                company: card.company,
                linkedCardId: card.id,
                avatarColor: (0, contacts_util_1.resolveAvatarColor)(`${card.firstName}${card.lastName}`),
            },
        });
        return (0, contacts_util_1.toContactResponse)(contact);
    }
    async createFromScan(userId, scanEventId, payload) {
        const firstName = this.optionalString(payload?.firstName) ?? '';
        const lastName = this.optionalString(payload?.lastName) ?? '';
        const email = this.optionalString(payload?.email);
        const phone = this.optionalString(payload?.phone);
        const jobTitle = this.optionalString(payload?.jobTitle);
        const company = this.optionalString(payload?.company);
        const contact = await this.prisma.contact.create({
            data: {
                userId,
                source: client_1.ContactSource.AI_SCAN,
                firstName,
                lastName,
                email,
                phone,
                jobTitle,
                company,
                scanEventId,
                avatarColor: (0, contacts_util_1.resolveAvatarColor)(`${firstName}${lastName}${scanEventId}`),
            },
        });
        return (0, contacts_util_1.toContactResponse)(contact);
    }
    optionalString(value) {
        if (value == null)
            return null;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
};
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactsService);
//# sourceMappingURL=contacts.service.js.map