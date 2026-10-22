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
const client_1 = require("@prisma/client");
const safe_url_1 = require("../../common/safe-url");
const prisma_service_1 = require("../../prisma/prisma.service");
const entitlements_service_1 = require("../subscriptions/entitlements.service");
const pro_design_resolver_1 = require("./pro-design/pro-design-resolver");
const public_card_body_1 = require("./public-card/public-card-body");
const public_card_page_1 = require("./public-card/public-card-page");
let SharingService = class SharingService {
    prisma;
    configService;
    entitlementsService;
    constructor(prisma, configService, entitlementsService) {
        this.prisma = prisma;
        this.configService = configService;
        this.entitlementsService = entitlementsService;
    }
    getShareQuota(userId) {
        return this.entitlementsService.getShareQuota(userId);
    }
    async getPortfolioShareAccess(userId) {
        const quota = await this.entitlementsService.getPortfolioShareQuota(userId);
        const active = await this.entitlementsService.hasActivePortfolioPlan(userId);
        return {
            allowed: quota.canShare,
            canShare: quota.canShare,
            canCustomize: active,
            hasAnalytics: active,
            quota,
        };
    }
    get appPublicUrl() {
        return this.configService.get('wallet.appPublicUrl', 'https://api.dropone.pro');
    }
    async getPublicCard(slug, viewerUserId, meta) {
        const card = await this.findPublicCard(slug);
        if (!card) {
            throw new common_1.NotFoundException('Carte introuvable');
        }
        await this.recordCardView(card.id, viewerUserId, meta);
        return this.toPublicCardPayload(card);
    }
    renderPublicCardNotFoundPage() {
        return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Carte introuvable | DropOne</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0c0d10;color:#fff;font-family:system-ui,sans-serif;">
  <main style="text-align:center;padding:24px;">
    <h1 style="font-size:1.25rem;margin:0 0 8px;">Carte introuvable</h1>
    <p style="margin:0;opacity:0.75;">Ce lien n'existe pas ou la carte n'est plus publique.</p>
  </main>
</body>
</html>`;
    }
    async renderPublicCardPage(slug, options) {
        const card = await this.findPublicCard(slug);
        if (!card) {
            return null;
        }
        if (!options?.embed) {
            await this.recordCardView(card.id, options?.viewerUserId, {
                source: options?.source,
                userAgent: options?.userAgent,
            });
        }
        const fullName = `${card.firstName} ${card.lastName}`.trim();
        const isTeamCard = card.kind === client_1.CardKind.PROFESSIONAL || card.kind === client_1.CardKind.MEMBER;
        const companyName = isTeamCard
            ? card.company?.trim() || card.team?.name?.trim() || ''
            : '';
        const subtitle = isTeamCard
            ? card.jobTitle?.trim() || ''
            : this.buildSubtitle(card);
        const pageUrl = `${this.appPublicUrl}/cards/${card.slug}`;
        const design = (0, pro_design_resolver_1.resolveProDesign)(card.theme);
        const teamLogoSource = card.logoUrl?.trim() || card.team?.logoUrl?.trim();
        const socialLinks = this.toPublicSocialLinks(card);
        const embed = options?.embed === true;
        const showPortfolioLink = await this.entitlementsService.canPublishPortfolio(card.ownerId);
        return (0, public_card_page_1.buildPublicCardHtml)({
            fullName,
            initials: (0, public_card_body_1.buildCardInitials)({ fullName }),
            subtitle,
            companyName: companyName || null,
            teamLogoUrl: isTeamCard && teamLogoSource
                ? this.resolvePublicAssetUrl(teamLogoSource)
                : null,
            email: card.email,
            phone: card.phone,
            address: isTeamCard ? card.address : null,
            avatarUrl: this.resolvePortraitUrl(card),
            pageUrl,
            ogImageUrl: this.getOgImageUrl(card, fullName),
            logoUrl: this.getBrandLogoUrl(),
            design,
            socialLinks,
            embed,
            vcardUrl: this.vcardUrl(card.slug),
            downloadUrl: embed ? null : this.resolveDownloadUrl(options?.userAgent),
            appleAppId: embed ? null : this.appleAppStoreId(),
            showPortfolioLink,
        });
    }
    async renderPublicVCard(slug) {
        const card = await this.findPublicCard(slug);
        if (!card)
            return null;
        const fullName = `${card.firstName} ${card.lastName}`.trim();
        const isTeamCard = card.kind === client_1.CardKind.PROFESSIONAL || card.kind === client_1.CardKind.MEMBER;
        const subtitle = isTeamCard
            ? card.jobTitle?.trim() || ''
            : this.buildSubtitle(card);
        const website = this.toPublicSocialLinks(card).find((link) => link.platform === 'WEBSITE')?.url;
        return (0, public_card_body_1.buildVCard)({
            fullName,
            email: card.email,
            phone: card.phone,
            address: isTeamCard ? card.address : null,
            subtitle,
            pageUrl: `${this.appPublicUrl}/cards/${card.slug}`,
            website,
        });
    }
    vcardUrl(slug) {
        const prefix = this.configService
            .get('apiPrefix', 'api/v1')
            .replace(/^\/+|\/+$/g, '');
        return `${this.appPublicUrl}/${prefix}/sharing/public/${encodeURIComponent(slug)}/contact.vcf`;
    }
    resolveDownloadUrl(userAgent) {
        const ios = this.configService.get('appUpdate.iosStoreUrl', 'https://apps.apple.com/us/app/drop-one/id6807993018');
        const android = this.configService.get('appUpdate.androidStoreUrl', '').trim() ||
            'https://play.google.com/store/apps/details?id=com.mega.dropone';
        const ua = userAgent?.toLowerCase() ?? '';
        return ua.includes('android') ? android : ios;
    }
    appleAppStoreId() {
        const ios = this.configService.get('appUpdate.iosStoreUrl', 'https://apps.apple.com/us/app/drop-one/id6807993018');
        return ios.match(/id(\d{6,})/)?.[1] ?? '6807993018';
    }
    async shareCard(userId, id, dto) {
        const card = await this.prisma.businessCard.findFirst({
            where: { id, ownerId: userId },
        });
        if (!card) {
            throw new common_1.NotFoundException('Carte introuvable');
        }
        if (dto.scope === 'portfolio') {
            await this.entitlementsService.assertCanSharePortfolio(userId);
        }
        else {
            await this.entitlementsService.assertCanShareCard(userId, card.id);
        }
        const event = await this.prisma.shareEvent.create({
            data: {
                cardId: card.id,
                userId,
                method: dto.method,
            },
        });
        const quota = dto.scope === 'portfolio'
            ? await this.entitlementsService.getPortfolioShareQuota(userId)
            : await this.entitlementsService.getShareQuota(userId);
        return {
            id: event.id,
            cardId: event.cardId,
            method: event.method,
            createdAt: event.createdAt,
            quota,
        };
    }
    getQrCode(id) {
        return { message: 'getQrCode', id };
    }
    getShareLink(id) {
        return { message: 'getShareLink', id };
    }
    normalizeViewSource(source) {
        const value = source?.trim().toLowerCase();
        if (!value)
            return null;
        if (['qr', 'nfc', 'share', 'link', 'app'].includes(value)) {
            return value;
        }
        return 'link';
    }
    async recordCardView(cardId, viewerUserId, meta) {
        if (viewerUserId) {
            const ownCard = await this.prisma.businessCard.findFirst({
                where: { id: cardId, ownerId: viewerUserId },
                select: { id: true },
            });
            if (ownCard) {
                return;
            }
        }
        await this.prisma.cardView.create({
            data: {
                cardId,
                viewerUserId: viewerUserId || null,
                source: this.normalizeViewSource(meta?.source),
                userAgent: meta?.userAgent?.slice(0, 512) || null,
            },
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
                team: {
                    select: { name: true, logoUrl: true },
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
            address: card.address,
            website: card.website,
            avatarUrl: card.avatarUrl,
            coverImageUrl: card.coverImageUrl,
            proDesignId: design.id,
            proDesignName: design.name,
            publicUrl: `${this.appPublicUrl}/cards/${card.slug}`,
            ogTitle: `${fullName} | DropOne Cartes de visite digitales`,
            ogDescription: 'Découvrez ma carte de visite DropOne',
            ogImageUrl: this.getOgImageUrl(card, fullName),
        };
    }
    toPublicSocialLinks(card) {
        const isTeamCard = card.kind === client_1.CardKind.PROFESSIONAL || card.kind === client_1.CardKind.MEMBER;
        const links = card.socialLinks
            .map((link) => ({
            platform: link.platform,
            url: this.normalizeWebsiteUrl(link.url) ?? '',
            label: link.label,
        }))
            .filter((link) => link.url.length > 0);
        if (!isTeamCard) {
            return links.filter((link) => link.platform !== 'WEBSITE');
        }
        const website = this.normalizeWebsiteUrl(card.website);
        if (!website || links.some((link) => link.platform === 'WEBSITE')) {
            return links;
        }
        return [
            ...links,
            {
                platform: 'WEBSITE',
                url: website,
                label: 'www',
            },
        ];
    }
    normalizeWebsiteUrl(value) {
        return (0, safe_url_1.sanitizePublicHttpUrl)(value, { allowHttp: false });
    }
    buildSubtitle(card) {
        const job = card.jobTitle?.trim() ?? '';
        const company = card.company?.trim() ?? '';
        if (job && company)
            return `${job} - ${company}`;
        return job || company;
    }
    resolvePortraitUrl(card) {
        const avatar = card.avatarUrl?.trim();
        if (avatar)
            return this.resolvePublicAssetUrl(avatar);
        return null;
    }
    resolvePublicAssetUrl(value) {
        const trimmed = value.trim();
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            try {
                const url = new URL(trimmed);
                if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
                    const publicOrigin = new URL(this.appPublicUrl);
                    return `${publicOrigin.origin}${url.pathname}${url.search}`;
                }
            }
            catch {
                return trimmed;
            }
            return trimmed;
        }
        const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
        return `${this.appPublicUrl}${path}`;
    }
    getBrandLogoUrl() {
        return 'https://ui-avatars.com/api/?name=DropOne&size=128&background=1B4DFF&color=ffffff&bold=true&format=png';
    }
    getOgImageUrl(card, fullName) {
        const avatar = card.avatarUrl?.trim();
        if (avatar)
            return this.resolvePublicAssetUrl(avatar);
        const cover = card.coverImageUrl?.trim();
        if (cover)
            return this.resolvePublicAssetUrl(cover);
        const name = encodeURIComponent(fullName);
        return `https://ui-avatars.com/api/?name=${name}&size=1200&background=1B4DFF&color=ffffff&bold=true&format=png`;
    }
};
exports.SharingService = SharingService;
exports.SharingService = SharingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        entitlements_service_1.EntitlementsService])
], SharingService);
//# sourceMappingURL=sharing.service.js.map