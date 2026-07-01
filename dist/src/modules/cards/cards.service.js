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
exports.CardsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const card_theme_util_1 = require("../sharing/pro-design/card-theme.util");
const contacts_service_1 = require("../contacts/contacts.service");
let CardsService = class CardsService {
    prisma;
    contactsService;
    constructor(prisma, contactsService) {
        this.prisma = prisma;
        this.contactsService = contactsService;
    }
    async create(userId, dto) {
        const kind = dto.kind ?? client_1.CardKind.PERSONAL;
        const existing = await this.prisma.businessCard.findFirst({
            where: { ownerId: userId, kind },
        });
        if (existing) {
            throw new common_1.BadRequestException(kind === client_1.CardKind.PERSONAL
                ? 'Vous avez déjà une carte personnelle'
                : 'Vous avez déjà une carte professionnelle');
        }
        if (kind === client_1.CardKind.PROFESSIONAL && !dto.teamId) {
            throw new common_1.BadRequestException('Une carte professionnelle doit être liée à une équipe');
        }
        let theme = { cardBadge: 'personalTag' };
        let teamLogoUrl = null;
        if (kind === client_1.CardKind.PROFESSIONAL && dto.teamId) {
            const team = await this.prisma.team.findFirst({
                where: {
                    id: dto.teamId,
                    isActive: true,
                    OR: [
                        { ownerId: userId },
                        { members: { some: { userId } } },
                    ],
                },
            });
            if (!team) {
                throw new common_1.BadRequestException('Équipe introuvable');
            }
            teamLogoUrl = team.logoUrl;
        }
        const slug = await this.generateUniqueSlug(dto.firstName, dto.lastName, kind);
        return this.prisma.businessCard.create({
            data: {
                slug,
                ownerId: userId,
                kind,
                firstName: dto.firstName.trim(),
                lastName: dto.lastName.trim(),
                jobTitle: this.optionalString(dto.jobTitle),
                company: this.optionalString(dto.company),
                email: this.optionalString(dto.email),
                phone: this.optionalString(dto.phone),
                teamId: dto.teamId ?? null,
                logoUrl: teamLogoUrl,
                isPublic: dto.isPublic ?? true,
                theme,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.businessCard.findMany({
            where: { ownerId: userId },
            orderBy: [{ kind: 'asc' }, { createdAt: 'desc' }],
        });
    }
    async findOne(userId, id) {
        const card = await this.prisma.businessCard.findFirst({
            where: { id, ownerId: userId },
        });
        if (!card) {
            throw new common_1.NotFoundException('Carte introuvable');
        }
        return card;
    }
    async update(userId, id, dto) {
        await this.findOne(userId, id);
        return this.prisma.businessCard.update({
            where: { id },
            data: {
                ...(dto.firstName !== undefined && {
                    firstName: dto.firstName.trim(),
                }),
                ...(dto.lastName !== undefined && { lastName: dto.lastName.trim() }),
                ...(dto.jobTitle !== undefined && {
                    jobTitle: this.optionalString(dto.jobTitle),
                }),
                ...(dto.company !== undefined && {
                    company: this.optionalString(dto.company),
                }),
                ...(dto.bio !== undefined && { bio: this.optionalString(dto.bio) }),
                ...(dto.email !== undefined && {
                    email: this.optionalString(dto.email),
                }),
                ...(dto.phone !== undefined && {
                    phone: this.optionalString(dto.phone),
                }),
                ...(dto.website !== undefined && {
                    website: this.optionalString(dto.website),
                }),
                ...(dto.avatarUrl !== undefined && {
                    avatarUrl: this.optionalString(dto.avatarUrl),
                }),
                ...(dto.coverImageUrl !== undefined && {
                    coverImageUrl: this.optionalString(dto.coverImageUrl),
                }),
                ...(dto.logoUrl !== undefined && {
                    logoUrl: this.optionalString(dto.logoUrl),
                }),
                ...(dto.isPublic !== undefined && { isPublic: dto.isPublic }),
            },
        });
    }
    async updateTheme(userId, id, dto) {
        await this.findOne(userId, id);
        const theme = (0, card_theme_util_1.normalizeCardThemeForStorage)(dto.theme);
        return this.prisma.businessCard.update({
            where: { id },
            data: { theme },
        });
    }
    remove(id) {
        return { message: 'remove card', id };
    }
    async syncSocialLinks(userId, cardId, links) {
        await this.findOne(userId, cardId);
        await this.prisma.socialLink.deleteMany({ where: { cardId } });
        const sanitized = links
            .map((link, index) => ({
            cardId,
            platform: link.platform,
            url: link.url.trim(),
            label: link.label?.trim() || null,
            order: link.order ?? index,
        }))
            .filter((link) => link.url.length > 0);
        if (sanitized.length > 0) {
            await this.prisma.socialLink.createMany({ data: sanitized });
        }
        return this.getSocialLinks(userId, cardId);
    }
    async getSocialLinks(userId, cardId) {
        await this.findOne(userId, cardId);
        return this.prisma.socialLink.findMany({
            where: { cardId },
            orderBy: { order: 'asc' },
        });
    }
    addSocialLink(id) {
        return { message: 'addSocialLink', id };
    }
    removeSocialLink(id, linkId) {
        return { message: 'removeSocialLink', id, linkId };
    }
    async getAnalytics(userId, id) {
        await this.findOne(userId, id);
        const countedShareMethods = [
            client_1.ShareMethod.LINK,
            client_1.ShareMethod.EMAIL,
            client_1.ShareMethod.WHATSAPP,
            client_1.ShareMethod.AIRDROP,
        ];
        const [views, shares, contactsSaved, publicSaves] = await Promise.all([
            this.prisma.cardView.count({ where: { cardId: id } }),
            this.prisma.shareEvent.count({
                where: {
                    cardId: id,
                    method: { in: countedShareMethods },
                },
            }),
            this.prisma.contact.count({ where: { linkedCardId: id } }),
            this.prisma.cardSaveEvent.count({ where: { cardId: id } }),
        ]);
        return { views, shares, saved: contactsSaved + publicSaves };
    }
    findSharedWithMe(userId) {
        return this.contactsService.findExchangeContacts(userId);
    }
    optionalString(value) {
        if (value == null)
            return null;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
    async generateUniqueSlug(firstName, lastName, kind = client_1.CardKind.PERSONAL) {
        const base = `${firstName}-${lastName}`
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        const safeBase = base.length > 0 ? base : 'carte';
        const kindSuffix = kind === client_1.CardKind.PROFESSIONAL ? '-pro' : '';
        let slug = `${safeBase}${kindSuffix}`;
        let counter = 1;
        while (await this.prisma.businessCard.findUnique({ where: { slug } })) {
            slug = `${safeBase}${kindSuffix}-${counter++}`;
        }
        return slug;
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        contacts_service_1.ContactsService])
], CardsService);
//# sourceMappingURL=cards.service.js.map