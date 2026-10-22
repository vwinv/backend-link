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
exports.PortfoliosService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const entitlements_service_1 = require("../subscriptions/entitlements.service");
const save_portfolio_style_dto_1 = require("./dto/save-portfolio-style.dto");
const public_portfolio_bento_1 = require("./public-portfolio-bento");
const public_portfolio_cartes_1 = require("./public-portfolio-cartes");
const public_portfolio_classic_1 = require("./public-portfolio-classic");
const public_portfolio_editorial_1 = require("./public-portfolio-editorial");
const public_portfolio_gallery_1 = require("./public-portfolio-gallery");
const public_portfolio_minimal_1 = require("./public-portfolio-minimal");
const public_portfolio_portrait_1 = require("./public-portfolio-portrait");
const public_portfolio_cover_1 = require("./public-portfolio-cover");
const public_portfolio_page_1 = require("./public-portfolio-page");
let PortfoliosService = class PortfoliosService {
    prisma;
    configService;
    entitlementsService;
    constructor(prisma, configService, entitlementsService) {
        this.prisma = prisma;
        this.configService = configService;
        this.entitlementsService = entitlementsService;
    }
    get appPublicUrl() {
        return this.configService.get('wallet.appPublicUrl', 'https://api.dropone.pro');
    }
    create(dto) {
        return { message: 'create portfolio', dto };
    }
    async findOwnedByCard(userId, cardId) {
        await this.ownedCard(userId, cardId);
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { cardId },
        });
        if (!portfolio)
            return { exists: false };
        const theme = this.readTheme(portfolio.theme);
        return {
            exists: true,
            id: portfolio.id,
            title: portfolio.title,
            layout: theme.layout,
            color: theme.color,
        };
    }
    async saveStyle(userId, cardId, dto) {
        const card = await this.ownedCard(userId, cardId);
        const existing = await this.prisma.portfolio.findUnique({
            where: { cardId },
        });
        if (existing) {
            const current = this.readTheme(existing.theme);
            const changing = current.layout !== dto.layout || current.color !== dto.color;
            if (changing) {
                await this.entitlementsService.assertCanCustomizePortfolio(userId);
            }
            const updated = await this.prisma.portfolio.update({
                where: { id: existing.id },
                data: { theme: this.themePayload(dto, existing.theme) },
            });
            return {
                exists: true,
                id: updated.id,
                title: updated.title,
                layout: dto.layout,
                color: dto.color,
            };
        }
        const fullName = `${card.firstName} ${card.lastName}`.trim();
        const created = await this.prisma.portfolio.create({
            data: {
                cardId,
                title: fullName || 'Portfolio',
                isPublic: true,
                theme: this.themePayload(dto),
            },
        });
        return {
            exists: true,
            id: created.id,
            title: created.title,
            layout: dto.layout,
            color: dto.color,
        };
    }
    async getEditor(userId, cardId) {
        const card = await this.ownedCard(userId, cardId);
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { cardId },
            include: { projects: { orderBy: { order: 'asc' } } },
        });
        if (!portfolio)
            return { exists: false };
        const content = this.readContent(portfolio.content);
        const cardFullName = `${card.firstName} ${card.lastName}`.trim();
        const storedTitle = portfolio.title?.trim() ?? '';
        const title = storedTitle && storedTitle !== cardFullName
            ? storedTitle
            : (card.jobTitle ?? '');
        return {
            exists: true,
            id: portfolio.id,
            photoUrl: portfolio.photoUrl ?? card.avatarUrl ?? card.coverImageUrl,
            firstName: portfolio.displayFirstName ?? card.firstName,
            lastName: portfolio.displayLastName ?? card.lastName,
            age: portfolio.age,
            phone: portfolio.displayPhone ?? card.phone ?? '',
            address: portfolio.displayAddress ?? card.address ?? '',
            hidePersonalDetails: portfolio.hidePersonalDetails,
            title,
            description: portfolio.description ?? card.bio ?? '',
            experiences: content.experiences,
            teachings: content.teachings,
            skills: content.skills,
            competences: content.competences,
            strengths: content.strengths,
            interests: content.interests,
            projects: portfolio.projects.map((project) => ({
                id: project.id,
                title: project.title,
                description: project.description ?? '',
                imageUrl: project.imageUrl,
                projectUrl: project.projectUrl,
            })),
        };
    }
    async saveProfile(userId, cardId, dto) {
        await this.ownedCard(userId, cardId);
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { cardId },
            select: { id: true },
        });
        if (!portfolio)
            throw new common_1.NotFoundException('Portfolio introuvable');
        const blank = (value) => {
            const trimmed = value?.trim() ?? '';
            return trimmed.length > 0 ? trimmed : null;
        };
        const chips = (values) => values.map((value) => value.trim()).filter((value) => value.length > 0).slice(0, 24);
        const content = {
            experiences: dto.experiences.map((item) => ({
                id: item.id,
                role: item.role.trim(),
                company: item.company?.trim() ?? '',
                period: item.period?.trim() ?? '',
                missions: item.missions?.trim() ?? '',
            })),
            teachings: dto.teachings.map((item) => ({
                id: item.id,
                title: item.title.trim(),
                school: item.school?.trim() ?? '',
                year: item.year?.trim() ?? '',
                audience: item.audience?.trim() ?? '',
            })),
            skills: dto.skills.map((item) => ({
                id: item.id,
                name: item.name.trim(),
                level: Math.max(0, Math.min(100, Math.round(item.level))),
            })),
            competences: chips(dto.competences),
            strengths: chips(dto.strengths),
            interests: chips(dto.interests),
        };
        await this.prisma.$transaction(async (tx) => {
            await tx.portfolio.update({
                where: { id: portfolio.id },
                data: {
                    photoUrl: blank(dto.photoUrl),
                    displayFirstName: dto.firstName.trim(),
                    displayLastName: dto.lastName.trim(),
                    age: dto.age ?? null,
                    displayPhone: blank(dto.phone),
                    displayAddress: blank(dto.address),
                    hidePersonalDetails: dto.hidePersonalDetails,
                    title: dto.title.trim() || `${dto.firstName} ${dto.lastName}`.trim(),
                    description: blank(dto.description),
                    profileCustomized: true,
                    isPublic: true,
                    content,
                },
            });
            const existing = await tx.portfolioProject.findMany({
                where: { portfolioId: portfolio.id },
                select: { id: true },
            });
            const known = new Set(existing.map((project) => project.id));
            const kept = new Set(dto.projects
                .map((project) => project.id)
                .filter((id) => !!id && known.has(id)));
            const removed = existing
                .map((project) => project.id)
                .filter((id) => !kept.has(id));
            if (removed.length > 0) {
                await tx.portfolioProject.deleteMany({
                    where: { id: { in: removed } },
                });
            }
            for (const [index, project] of dto.projects.entries()) {
                const data = {
                    title: project.title.trim(),
                    description: blank(project.description),
                    imageUrl: blank(project.imageUrl),
                    projectUrl: blank(project.projectUrl),
                    order: index,
                };
                if (project.id && known.has(project.id)) {
                    await tx.portfolioProject.update({
                        where: { id: project.id },
                        data,
                    });
                }
                else {
                    await tx.portfolioProject.create({
                        data: { portfolioId: portfolio.id, ...data },
                    });
                }
            }
        });
        return this.getEditor(userId, cardId);
    }
    readContent(value) {
        const empty = {
            experiences: [],
            teachings: [],
            skills: [],
            competences: [],
            strengths: [],
            interests: [],
        };
        if (!value || typeof value !== 'object' || Array.isArray(value))
            return empty;
        const source = value;
        const text = (item) => (typeof item === 'string' ? item : '');
        const rows = (item) => (Array.isArray(item) ? item : []);
        return {
            experiences: rows(source.experiences).flatMap((item) => {
                if (!item || typeof item !== 'object')
                    return [];
                const row = item;
                const role = text(row.role).trim();
                if (!role)
                    return [];
                return [{
                        id: text(row.id),
                        role,
                        company: text(row.company),
                        period: text(row.period),
                        missions: text(row.missions),
                    }];
            }),
            teachings: rows(source.teachings).flatMap((item) => {
                if (!item || typeof item !== 'object')
                    return [];
                const row = item;
                const title = text(row.title).trim();
                if (!title)
                    return [];
                return [{
                        id: text(row.id),
                        title,
                        school: text(row.school),
                        year: text(row.year),
                        audience: text(row.audience),
                    }];
            }),
            skills: rows(source.skills).flatMap((item) => {
                if (!item || typeof item !== 'object')
                    return [];
                const row = item;
                const name = text(row.name).trim();
                const level = typeof row.level === 'number' ? row.level : Number(row.level);
                if (!name || Number.isNaN(level))
                    return [];
                return [{
                        id: text(row.id),
                        name,
                        level: Math.max(0, Math.min(100, Math.round(level))),
                    }];
            }),
            competences: rows(source.competences).map(text).map((item) => item.trim()).filter(Boolean),
            strengths: rows(source.strengths).map(text).map((item) => item.trim()).filter(Boolean),
            interests: rows(source.interests).map(text).map((item) => item.trim()).filter(Boolean),
        };
    }
    async ownedCard(userId, cardId) {
        const card = await this.prisma.businessCard.findFirst({
            where: { id: cardId, ownerId: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                jobTitle: true,
                bio: true,
                phone: true,
                address: true,
                avatarUrl: true,
                coverImageUrl: true,
            },
        });
        if (!card)
            throw new common_1.NotFoundException('Carte introuvable');
        return card;
    }
    readTheme(value) {
        const fallback = { layout: 'classique', color: 'neon' };
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return fallback;
        }
        const theme = value;
        return {
            layout: typeof theme.layout === 'string' ? theme.layout : fallback.layout,
            color: typeof theme.color === 'string' ? theme.color : fallback.color,
        };
    }
    themePayload(dto, previous) {
        const base = previous && typeof previous === 'object' && !Array.isArray(previous)
            ? { ...previous }
            : {};
        return { ...base, layout: dto.layout, color: dto.color };
    }
    async getStats(userId, cardId) {
        const card = await this.prisma.businessCard.findFirst({
            where: { id: cardId, ownerId: userId },
            select: { id: true },
        });
        if (!card) {
            throw new common_1.NotFoundException('Carte introuvable');
        }
        await this.entitlementsService.assertCanViewPortfolioStats(userId);
        const [siteVisits, portfolioClicks] = await Promise.all([
            this.prisma.portfolioVisitEvent.count({ where: { cardId } }),
            this.prisma.portfolioClickEvent.count({ where: { cardId } }),
        ]);
        return { siteVisits, portfolioClicks };
    }
    async recordClick(slug, viewerUserId) {
        const card = await this.prisma.businessCard.findFirst({
            where: { slug, isPublic: true, isActive: true },
            select: { id: true, ownerId: true },
        });
        if (!card) {
            throw new common_1.NotFoundException('Carte introuvable');
        }
        if (viewerUserId && viewerUserId === card.ownerId) {
            return { ok: true, counted: false };
        }
        await this.prisma.portfolioClickEvent.create({
            data: { cardId: card.id },
        });
        return { ok: true, counted: true };
    }
    notFoundPage() {
        return (0, public_portfolio_page_1.buildPublicPortfolioNotFoundHtml)();
    }
    async renderPublicPage(slug, viewerUserId, embed = false, preview) {
        const card = await this.prisma.businessCard.findFirst({
            where: { slug, isPublic: true, isActive: true },
            select: {
                id: true,
                slug: true,
                ownerId: true,
                firstName: true,
                lastName: true,
                jobTitle: true,
                company: true,
                bio: true,
                email: true,
                phone: true,
                avatarUrl: true,
                coverImageUrl: true,
                socialLinks: {
                    select: { platform: true, url: true },
                    orderBy: { order: 'asc' },
                },
                portfolio: {
                    select: {
                        title: true,
                        description: true,
                        theme: true,
                        photoUrl: true,
                        displayFirstName: true,
                        displayLastName: true,
                        displayPhone: true,
                        displayAddress: true,
                        hidePersonalDetails: true,
                        profileCustomized: true,
                        content: true,
                        projects: {
                            orderBy: { order: 'asc' },
                            select: {
                                title: true,
                                description: true,
                                imageUrl: true,
                                projectUrl: true,
                            },
                        },
                    },
                },
            },
        });
        if (!card)
            return null;
        const ownerPreview = embed && viewerUserId === card.ownerId;
        if (!ownerPreview) {
            const canShare = await this.entitlementsService.canPublishPortfolio(card.ownerId);
            if (!canShare)
                return null;
        }
        if (!embed && (!viewerUserId || viewerUserId !== card.ownerId)) {
            await this.prisma.portfolioVisitEvent.create({
                data: { cardId: card.id },
            });
        }
        const portfolio = card.portfolio;
        const profile = portfolio?.profileCustomized === true;
        const content = this.readContent(portfolio?.content ?? null);
        const experiences = profile ? content.experiences : [];
        const firstName = profile && portfolio?.displayFirstName
            ? portfolio.displayFirstName
            : card.firstName;
        const lastName = profile && portfolio?.displayLastName
            ? portfolio.displayLastName
            : card.lastName;
        const fullName = `${firstName} ${lastName}`.trim();
        const pageUrl = `${this.appPublicUrl}/portfolios/${card.slug}`;
        const photoUrl = this.resolveAssetUrl((profile ? portfolio?.photoUrl : null) ||
            card.coverImageUrl ||
            card.avatarUrl);
        const theme = this.readTheme(portfolio?.theme ?? null);
        if (preview?.layout &&
            save_portfolio_style_dto_1.PORTFOLIO_LAYOUTS.includes(preview.layout)) {
            theme.layout = preview.layout;
        }
        if (preview?.color &&
            save_portfolio_style_dto_1.PORTFOLIO_COLORS.includes(preview.color)) {
            theme.color = preview.color;
        }
        const storedTitle = profile ? portfolio?.title?.trim() ?? '' : '';
        const jobTitle = experiences[0]?.role ||
            (storedTitle && storedTitle !== fullName ? storedTitle : card.jobTitle);
        const company = experiences[0]?.company || card.company;
        const bio = profile
            ? portfolio?.description
            : card.bio || portfolio?.description;
        const phone = profile ? portfolio?.displayPhone : card.phone;
        const address = profile && portfolio?.hidePersonalDetails !== true
            ? portfolio?.displayAddress
            : null;
        const accent = (0, public_portfolio_cover_1.coverAccent)(theme.color);
        const prefix = this.configService
            .get('apiPrefix', 'api/v1')
            .replace(/^\/+|\/+$/g, '');
        const pageInput = {
            firstName,
            lastName,
            jobTitle,
            company,
            bio,
            email: card.email,
            phone,
            address,
            photoUrl,
            pageUrl,
            vcardUrl: `${this.appPublicUrl}/${prefix}/sharing/public/${encodeURIComponent(card.slug)}/contact.vcf`,
            accentStart: accent.start,
            accentEnd: accent.end,
            colorId: theme.color,
            socialLinks: card.socialLinks.map((link) => ({
                platform: link.platform,
                url: link.url,
            })),
            projects: (portfolio?.projects ?? []).map((project) => ({
                title: project.title,
                description: project.description,
                imageUrl: this.resolveAssetUrl(project.imageUrl),
                projectUrl: project.projectUrl,
            })),
            experiences,
            teachings: profile ? content.teachings : [],
            skills: profile ? content.skills : [],
            competences: profile ? content.competences : [],
            strengths: profile ? content.strengths : [],
            interests: profile ? content.interests : [],
        };
        if (theme.layout === 'couverture') {
            return (0, public_portfolio_cover_1.buildCoverPortfolioHtml)(pageInput);
        }
        if (theme.layout === 'classique') {
            return (0, public_portfolio_classic_1.buildClassicPortfolioHtml)(pageInput);
        }
        if (theme.layout === 'editorial') {
            return (0, public_portfolio_editorial_1.buildEditorialPortfolioHtml)(pageInput);
        }
        if (theme.layout === 'galerie') {
            return (0, public_portfolio_gallery_1.buildGalleryPortfolioHtml)(pageInput);
        }
        if (theme.layout === 'minimal') {
            return (0, public_portfolio_minimal_1.buildMinimalPortfolioHtml)(pageInput);
        }
        if (theme.layout === 'bento') {
            return (0, public_portfolio_bento_1.buildBentoPortfolioHtml)(pageInput);
        }
        if (theme.layout === 'portrait') {
            return (0, public_portfolio_portrait_1.buildPortraitPortfolioHtml)(pageInput);
        }
        if (theme.layout === 'cartes') {
            return (0, public_portfolio_cartes_1.buildCartesPortfolioHtml)(pageInput);
        }
        return (0, public_portfolio_page_1.buildPublicPortfolioHtml)({
            fullName,
            initials: this.initials(firstName, lastName),
            jobTitle,
            company,
            avatarUrl: photoUrl,
            pageUrl,
        });
    }
    initials(firstName, lastName) {
        const first = firstName.trim();
        const last = lastName.trim();
        if (!first && !last)
            return '•';
        if (!last)
            return first[0].toUpperCase();
        return `${first[0]}${last[0]}`.toUpperCase();
    }
    resolveAssetUrl(value) {
        const trimmed = value?.trim();
        if (!trimmed)
            return null;
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            return trimmed;
        }
        const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
        return `${this.appPublicUrl}${path}`;
    }
    findOne(id) {
        return { message: 'findOne portfolio', id };
    }
    update(id, dto) {
        return { message: 'update portfolio', id, dto };
    }
    remove(id) {
        return { message: 'remove portfolio', id };
    }
    addProject(id, dto) {
        return { message: 'addProject', id, dto };
    }
    updateProject(id, projectId, dto) {
        return { message: 'updateProject', id, projectId, dto };
    }
    removeProject(id, projectId) {
        return { message: 'removeProject', id, projectId };
    }
};
exports.PortfoliosService = PortfoliosService;
exports.PortfoliosService = PortfoliosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        entitlements_service_1.EntitlementsService])
], PortfoliosService);
//# sourceMappingURL=portfolios.service.js.map