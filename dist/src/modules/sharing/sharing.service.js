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
exports.SharingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const pro_design_resolver_1 = require("./pro-design/pro-design-resolver");
const public_card_body_1 = require("./public-card/public-card-body");
const public_card_page_1 = require("./public-card/public-card-page");
let SharingService = class SharingService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    get appPublicUrl() {
        return this.configService.get('wallet.appPublicUrl', 'https://backend-link-wt91.onrender.com');
    }
    async getPublicCard(slug) {
        const card = await this.findPublicCard(slug);
        if (!card) {
            throw new common_1.NotFoundException('Carte introuvable');
        }
        await this.recordCardView(card.id);
        return this.toPublicCardPayload(card);
    }
    renderPublicCardNotFoundPage() {
        return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Carte introuvable | Link</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0c0d10;color:#fff;font-family:system-ui,sans-serif;">
  <main style="text-align:center;padding:24px;">
    <h1 style="font-size:1.25rem;margin:0 0 8px;">Carte introuvable</h1>
    <p style="margin:0;opacity:0.75;">Ce lien n'existe pas ou la carte n'est plus publique.</p>
  </main>
</body>
</html>`;
    }
    async renderPublicCardPage(slug) {
        const card = await this.findPublicCard(slug);
        if (!card) {
            return null;
        }
        await this.recordCardView(card.id);
        const fullName = `${card.firstName} ${card.lastName}`.trim();
        const subtitle = this.buildSubtitle(card);
        const pageUrl = `${this.appPublicUrl}/cards/${card.slug}`;
        const design = (0, pro_design_resolver_1.resolveProDesign)(card.theme);
        return (0, public_card_page_1.buildPublicCardHtml)({
            fullName,
            initials: (0, public_card_body_1.buildCardInitials)({ fullName }),
            subtitle,
            email: card.email,
            phone: card.phone,
            avatarUrl: this.resolvePortraitUrl(card),
            pageUrl,
            ogImageUrl: this.getOgImageUrl(card, fullName),
            logoUrl: this.getBrandLogoUrl(),
            design,
            socialLinks: card.socialLinks.map((link) => ({
                platform: link.platform,
                url: link.url,
                label: link.label,
            })),
        });
    }
    async shareCard(userId, id, dto) {
        const card = await this.prisma.businessCard.findFirst({
            where: { id, ownerId: userId },
        });
        if (!card) {
            throw new common_1.NotFoundException('Carte introuvable');
        }
        return this.prisma.shareEvent.create({
            data: {
                cardId: card.id,
                userId,
                method: dto.method,
            },
        });
    }
    getQrCode(id) {
        return { message: 'getQrCode', id };
    }
    getShareLink(id) {
        return { message: 'getShareLink', id };
    }
    async recordCardView(cardId) {
        await this.prisma.cardView.create({
            data: { cardId },
        });
    }
    async recordCardSave(slug, userId) {
        const card = await this.findPublicCard(slug);
        if (!card) {
            throw new common_1.NotFoundException('Carte introuvable');
        }
        await this.prisma.cardSaveEvent.create({
            data: {
                cardId: card.id,
                userId,
            },
        });
        return { ok: true };
    }
    async findPublicCard(slug) {
        return this.prisma.businessCard.findFirst({
            where: {
                slug,
                isPublic: true,
                isActive: true,
            },
            include: {
                socialLinks: {
                    orderBy: { order: 'asc' },
                },
            },
        });
    }
    toPublicCardPayload(card) {
        const fullName = `${card.firstName} ${card.lastName}`.trim();
        const design = (0, pro_design_resolver_1.resolveProDesign)(card.theme);
        return {
            slug: card.slug,
            fullName,
            subtitle: this.buildSubtitle(card),
            email: card.email,
            phone: card.phone,
            avatarUrl: card.avatarUrl,
            coverImageUrl: card.coverImageUrl,
            proDesignId: design.id,
            proDesignName: design.name,
            publicUrl: `${this.appPublicUrl}/cards/${card.slug}`,
            ogTitle: `${fullName} | Link Cartes de visite digitales`,
            ogDescription: 'Découvrez ma carte de visite Link',
            ogImageUrl: this.getOgImageUrl(card, fullName),
        };
    }
    buildSubtitle(card) {
        const job = card.jobTitle?.trim() ?? '';
        const company = card.company?.trim() ?? '';
        if (job && company)
            return `${job} · ${company}`;
        return job || company;
    }
    resolvePortraitUrl(card) {
        const avatar = card.avatarUrl?.trim();
        if (avatar)
            return avatar;
        const logo = card.logoUrl?.trim();
        if (logo)
            return logo;
        return null;
    }
    getBrandLogoUrl() {
        return 'https://ui-avatars.com/api/?name=Link&size=128&background=1B4DFF&color=ffffff&bold=true&format=png';
    }
    getOgImageUrl(card, fullName) {
        if (card.avatarUrl?.trim())
            return card.avatarUrl.trim();
        if (card.coverImageUrl?.trim())
            return card.coverImageUrl.trim();
        const name = encodeURIComponent(fullName);
        return `https://ui-avatars.com/api/?name=${name}&size=1200&background=1B4DFF&color=ffffff&bold=true&format=png`;
    }
};
exports.SharingService = SharingService;
exports.SharingService = SharingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], SharingService);
//# sourceMappingURL=sharing.service.js.map