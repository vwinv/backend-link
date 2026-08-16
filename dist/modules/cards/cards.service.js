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
const pro_design_catalog_1 = require("../sharing/pro-design/pro-design-catalog");
const contacts_service_1 = require("../contacts/contacts.service");
const entitlements_service_1 = require("../subscriptions/entitlements.service");
const uploads_service_1 = require("../uploads/uploads.service");
let CardsService = class CardsService {
    prisma;
    contactsService;
    entitlementsService;
    uploadsService;
    constructor(prisma, contactsService, entitlementsService, uploadsService) {
        this.prisma = prisma;
        this.contactsService = contactsService;
        this.entitlementsService = entitlementsService;
        this.uploadsService = uploadsService;
    }
    async create(userId, dto) {
        const kind = dto.kind ?? client_1.CardKind.PERSONAL;
        if (kind === client_1.CardKind.PERSONAL || kind === client_1.CardKind.PROFESSIONAL) {
            const existing = await this.prisma.businessCard.findFirst({
                where: { ownerId: userId, kind },
            });
            if (existing) {
                throw new common_1.BadRequestException(kind === client_1.CardKind.PERSONAL
                    ? 'Vous avez déjà une carte personnelle'
                    : 'Vous avez déjà une carte professionnelle');
            }
        }
        if (kind === client_1.CardKind.PROFESSIONAL) {
            await this.entitlementsService.assertHasTeamAccess(userId);
        }
        if ((kind === client_1.CardKind.PROFESSIONAL || kind === client_1.CardKind.MEMBER) &&
            !dto.teamId) {
            throw new common_1.BadRequestException(kind === client_1.CardKind.MEMBER
                ? 'Une carte membre doit être liée à une équipe'
                : 'Une carte professionnelle doit être liée à une équipe');
        }
        if (kind === client_1.CardKind.MEMBER && dto.teamId) {
            const existingMemberCard = await this.prisma.businessCard.findFirst({
                where: {
                    ownerId: userId,
                    kind: client_1.CardKind.MEMBER,
                    teamId: dto.teamId,
                },
            });
            if (existingMemberCard) {
                throw new common_1.BadRequestException('Vous avez déjà une carte membre pour cette équipe');
            }
        }
        let theme = { cardBadge: 'personalTag' };
        let teamLogoUrl = null;
        if ((kind === client_1.CardKind.PROFESSIONAL || kind === client_1.CardKind.MEMBER) &&
            dto.teamId) {
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
            if (kind === client_1.CardKind.PROFESSIONAL && team.ownerId !== userId) {
                throw new common_1.BadRequestException('Seule le propriétaire peut créer une carte professionnelle pour cette équipe');
            }
            if (kind === client_1.CardKind.MEMBER && team.ownerId === userId) {
                throw new common_1.BadRequestException('Le propriétaire utilise une carte professionnelle, pas une carte membre');
            }
            teamLogoUrl = team.logoUrl;
            if (kind === client_1.CardKind.MEMBER) {
                const professionalTemplate = await this.prisma.businessCard.findFirst({
                    where: {
                        teamId: dto.teamId,
                        kind: client_1.CardKind.PROFESSIONAL,
                        isActive: true,
                    },
                });
                if (professionalTemplate) {
                    theme = (0, card_theme_util_1.normalizeCardThemeForStorage)(professionalTemplate.theme);
                    teamLogoUrl = professionalTemplate.logoUrl ?? teamLogoUrl;
                }
            }
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
                address: this.isTeamCardKind(kind)
                    ? this.optionalString(dto.address)
                    : null,
                website: this.isTeamCardKind(kind)
                    ? this.normalizeWebsiteUrl(dto.website)
                    : null,
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
        const card = await this.findOne(userId, id);
        if (dto.logoUrl !== undefined) {
            await this.assertCanEditTeamLogo(userId, card);
        }
        const updated = await this.prisma.businessCard.update({
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
                ...(dto.address !== undefined &&
                    this.isTeamCardKind(card.kind) && {
                    address: this.optionalString(dto.address),
                }),
                ...(dto.website !== undefined &&
                    this.isTeamCardKind(card.kind) && {
                    website: this.normalizeWebsiteUrl(dto.website),
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
        if (card.kind === client_1.CardKind.PROFESSIONAL &&
            card.teamId &&
            dto.logoUrl !== undefined) {
            await this.prisma.team.update({
                where: { id: card.teamId },
                data: { logoUrl: updated.logoUrl },
            });
            await this.applyTeamLogoToCards(card.teamId, updated.logoUrl);
        }
        if (dto.avatarUrl !== undefined) {
            await this.uploadsService.replaceImage(card.avatarUrl, updated.avatarUrl);
        }
        if (dto.coverImageUrl !== undefined) {
            await this.uploadsService.replaceImage(card.coverImageUrl, updated.coverImageUrl);
        }
        if (dto.logoUrl !== undefined) {
            await this.uploadsService.replaceImage(card.logoUrl, updated.logoUrl);
        }
        return updated;
    }
    async updateTheme(userId, id, dto) {
        const card = await this.findOne(userId, id);
        const theme = (0, card_theme_util_1.normalizeCardThemeForStorage)(dto.theme);
        const proDesignId = theme.proDesignId != null ? String(theme.proDesignId).trim() : '';
        const usesProDesign = proDesignId.length > 0 && proDesignId !== pro_design_catalog_1.DEFAULT_PRO_DESIGN_ID;
        if (usesProDesign) {
            await this.entitlementsService.assertCanCustomize(userId, id);
        }
        const updated = await this.prisma.businessCard.update({
            where: { id },
            data: { theme },
        });
        if (card.kind === client_1.CardKind.PROFESSIONAL && card.teamId) {
            await this.syncTeamMemberCardsVisuals(card.teamId, {
                theme,
                logoUrl: card.logoUrl,
            });
        }
        return updated;
    }
    async applyTeamLogoToCards(teamId, logoUrl) {
        await this.prisma.businessCard.updateMany({
            where: {
                teamId,
                isActive: true,
                kind: { in: [client_1.CardKind.PROFESSIONAL, client_1.CardKind.MEMBER] },
            },
            data: { logoUrl },
        });
    }
    async syncTeamMemberCardsVisuals(teamId, visuals) {
        const data = {};
        if (visuals.theme !== undefined) {
            data.theme = visuals.theme;
        }
        if (visuals.logoUrl !== undefined) {
            data.logoUrl = visuals.logoUrl;
        }
        if (Object.keys(data).length === 0)
            return;
        await this.prisma.businessCard.updateMany({
            where: {
                teamId,
                kind: client_1.CardKind.MEMBER,
                isActive: true,
            },
            data,
        });
    }
    remove(id) {
        return { message: 'remove card', id };
    }
    async syncSocialLinks(userId, cardId, links) {
        const card = await this.findOne(userId, cardId);
        const isTeamCard = this.isTeamCardKind(card.kind);
        const sanitized = links
            .map((link, index) => ({
            cardId,
            platform: link.platform,
            url: link.platform === client_1.SocialPlatform.WEBSITE
                ? this.normalizeWebsiteUrl(link.url) ?? ''
                : link.url.trim(),
            label: link.label?.trim() || null,
            order: link.order ?? index,
        }))
            .filter((link) => link.url.length > 0)
            .filter((link) => isTeamCard || link.platform !== client_1.SocialPlatform.WEBSITE);
        if (sanitized.length > 0) {
            await this.entitlementsService.assertCanEditSocialLinks(userId, cardId);
        }
        await this.prisma.socialLink.deleteMany({ where: { cardId } });
        if (sanitized.length > 0) {
            await this.prisma.socialLink.createMany({ data: sanitized });
        }
        if (isTeamCard) {
            const websiteLink = sanitized.find((link) => link.platform === client_1.SocialPlatform.WEBSITE);
            await this.prisma.businessCard.update({
                where: { id: cardId },
                data: { website: websiteLink?.url ?? null },
            });
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
    async getAnalytics(userId, id, options) {
        await this.findOne(userId, id);
        await this.entitlementsService.assertHasAnalytics(userId, id);
        const countedShareMethods = [
            client_1.ShareMethod.LINK,
            client_1.ShareMethod.EMAIL,
            client_1.ShareMethod.WHATSAPP,
            client_1.ShareMethod.AIRDROP,
        ];
        const { periodStart, periodEndExclusive, periodDays } = this.resolveAnalyticsPeriod(options);
        const previousStart = new Date(periodStart);
        previousStart.setDate(previousStart.getDate() - periodDays);
        const [views, shares, contactsSaved, publicSaves, uniqueGroups, guestViews, periodViews, previousPeriodViews, viewsInPeriod, sourcesRaw,] = await Promise.all([
            this.prisma.cardView.count({ where: { cardId: id } }),
            this.prisma.shareEvent.count({
                where: {
                    cardId: id,
                    method: { in: countedShareMethods },
                },
            }),
            this.prisma.contact.count({
                where: {
                    linkedCardId: id,
                    source: client_1.ContactSource.EXCHANGE,
                },
            }),
            this.prisma.cardSaveEvent.count({ where: { cardId: id } }),
            this.prisma.cardView.groupBy({
                by: ['viewerUserId'],
                where: { cardId: id, viewerUserId: { not: null } },
            }),
            this.prisma.cardView.count({
                where: { cardId: id, viewerUserId: null },
            }),
            this.prisma.cardView.count({
                where: {
                    cardId: id,
                    viewedAt: { gte: periodStart, lt: periodEndExclusive },
                },
            }),
            this.prisma.cardView.count({
                where: {
                    cardId: id,
                    viewedAt: { gte: previousStart, lt: periodStart },
                },
            }),
            this.prisma.cardView.findMany({
                where: {
                    cardId: id,
                    viewedAt: { gte: periodStart, lt: periodEndExclusive },
                },
                select: { viewedAt: true },
                orderBy: { viewedAt: 'asc' },
            }),
            this.prisma.cardView.groupBy({
                by: ['source'],
                where: { cardId: id },
                _count: { _all: true },
            }),
        ]);
        const uniqueVisitors = uniqueGroups.length + guestViews;
        const saved = contactsSaved + publicSaves;
        let viewsChangePercent = null;
        if (previousPeriodViews > 0) {
            viewsChangePercent = Math.round(((periodViews - previousPeriodViews) / previousPeriodViews) * 100);
        }
        else if (periodViews > 0) {
            viewsChangePercent = 100;
        }
        else {
            viewsChangePercent = 0;
        }
        const dayKeys = Array.from({ length: periodDays }, (_, index) => {
            const day = new Date(periodStart);
            day.setDate(periodStart.getDate() + index);
            return day;
        });
        const countsByDay = new Map();
        for (const day of dayKeys) {
            countsByDay.set(this.toDayKey(day), 0);
        }
        for (const view of viewsInPeriod) {
            const key = this.toDayKey(view.viewedAt);
            countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
        }
        const viewsSeries = dayKeys.map((day) => {
            const key = this.toDayKey(day);
            return {
                date: key,
                label: periodDays <= 7
                    ? this.toWeekdayLabel(day)
                    : this.toShortDateLabel(day),
                count: countsByDay.get(key) ?? 0,
            };
        });
        const sourceTotals = new Map();
        let sourcesCounted = 0;
        for (const row of sourcesRaw) {
            const key = this.normalizeAnalyticsSource(row.source);
            const count = row._count._all;
            sourceTotals.set(key, (sourceTotals.get(key) ?? 0) + count);
            sourcesCounted += count;
        }
        if (sourcesCounted === 0 && views > 0) {
            sourceTotals.set('link', views);
            sourcesCounted = views;
        }
        const sourceOrder = ['qr', 'share', 'link', 'nfc', 'app', 'other'];
        const sources = sourceOrder
            .map((key) => {
            const count = sourceTotals.get(key) ?? 0;
            return {
                key,
                count,
                percent: sourcesCounted > 0
                    ? Math.round((count / sourcesCounted) * 100)
                    : 0,
            };
        })
            .filter((item) => item.count > 0 || item.key === 'link');
        const sparkline = viewsSeries.map((point) => point.count);
        return {
            views,
            shares,
            saved,
            uniqueVisitors,
            periodDays: periodDays,
            periodViews,
            previousPeriodViews,
            viewsChangePercent,
            viewsSeries,
            sources,
            sparklines: {
                views: sparkline,
                uniqueVisitors: sparkline.map((v) => Math.max(0, Math.round(v * 0.4))),
                saved: sparkline.map((v) => Math.max(0, Math.round(v * 0.2))),
                shares: sparkline.map((v) => Math.max(0, Math.round(v * 0.15))),
            },
        };
    }
    resolveAnalyticsPeriod(options) {
        const fromRaw = options?.from?.trim();
        const toRaw = options?.to?.trim();
        if (fromRaw && toRaw) {
            const from = new Date(fromRaw);
            const to = new Date(toRaw);
            if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime())) {
                const periodStart = new Date(from);
                periodStart.setHours(0, 0, 0, 0);
                const periodEnd = new Date(to);
                periodEnd.setHours(0, 0, 0, 0);
                if (periodEnd < periodStart) {
                    const swap = new Date(periodStart);
                    periodStart.setTime(periodEnd.getTime());
                    periodEnd.setTime(swap.getTime());
                }
                const periodEndExclusive = new Date(periodEnd);
                periodEndExclusive.setDate(periodEndExclusive.getDate() + 1);
                const periodDays = Math.max(1, Math.round((periodEndExclusive.getTime() - periodStart.getTime()) /
                    (24 * 60 * 60 * 1000)));
                return {
                    periodStart,
                    periodEndExclusive,
                    periodDays: Math.min(periodDays, 90),
                };
            }
        }
        const periodDays = Math.min(Math.max(options?.days ?? 7, 1), 90);
        const periodEndExclusive = new Date();
        periodEndExclusive.setHours(0, 0, 0, 0);
        periodEndExclusive.setDate(periodEndExclusive.getDate() + 1);
        const periodStart = new Date(periodEndExclusive);
        periodStart.setDate(periodStart.getDate() - periodDays);
        return { periodStart, periodEndExclusive, periodDays };
    }
    toDayKey(date) {
        const local = new Date(date);
        const year = local.getFullYear();
        const month = `${local.getMonth() + 1}`.padStart(2, '0');
        const day = `${local.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    toWeekdayLabel(date) {
        const labels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        return labels[date.getDay()] ?? '';
    }
    toShortDateLabel(date) {
        const day = `${date.getDate()}`.padStart(2, '0');
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        return `${day}/${month}`;
    }
    normalizeAnalyticsSource(source) {
        const value = source?.trim().toLowerCase();
        if (!value)
            return 'link';
        if (['qr', 'nfc', 'share', 'link', 'app'].includes(value))
            return value;
        return 'other';
    }
    async getVisitors(userId, id, filter = 'all') {
        await this.findOne(userId, id);
        await this.entitlementsService.assertHasVisitorInsights(userId, id);
        const countedShareMethods = [
            client_1.ShareMethod.LINK,
            client_1.ShareMethod.EMAIL,
            client_1.ShareMethod.WHATSAPP,
            client_1.ShareMethod.AIRDROP,
        ];
        const viewWhere = filter === 'dropone'
            ? { cardId: id, viewerUserId: { not: null } }
            : filter === 'guest'
                ? { cardId: id, viewerUserId: null }
                : { cardId: id };
        const [views, dropOneCount, guestCount, registeredGroups, shares, contactsSaved, publicSaves, rawVisitors,] = await Promise.all([
            this.prisma.cardView.count({ where: { cardId: id } }),
            this.prisma.cardView.count({
                where: { cardId: id, viewerUserId: { not: null } },
            }),
            this.prisma.cardView.count({
                where: { cardId: id, viewerUserId: null },
            }),
            this.prisma.cardView.groupBy({
                by: ['viewerUserId'],
                where: { cardId: id, viewerUserId: { not: null } },
            }),
            this.prisma.shareEvent.count({
                where: {
                    cardId: id,
                    method: { in: countedShareMethods },
                },
            }),
            this.prisma.contact.count({
                where: {
                    linkedCardId: id,
                    source: client_1.ContactSource.EXCHANGE,
                },
            }),
            this.prisma.cardSaveEvent.count({ where: { cardId: id } }),
            this.prisma.cardView.findMany({
                where: viewWhere,
                orderBy: { viewedAt: 'desc' },
                take: 200,
                include: {
                    viewer: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatarUrl: true,
                            businessCards: {
                                where: { isActive: true },
                                orderBy: { kind: 'asc' },
                                take: 1,
                                select: {
                                    slug: true,
                                    jobTitle: true,
                                    company: true,
                                    avatarUrl: true,
                                },
                            },
                        },
                    },
                },
            }),
        ]);
        const uniqueVisitors = registeredGroups.length + guestCount;
        const viewerIds = [
            ...new Set(rawVisitors
                .map((view) => view.viewerUserId)
                .filter((value) => Boolean(value))),
        ];
        const [savesByViewer, contactsByViewer] = await Promise.all([
            viewerIds.length === 0
                ? Promise.resolve([])
                : this.prisma.cardSaveEvent.findMany({
                    where: { cardId: id, userId: { in: viewerIds } },
                    select: { userId: true },
                }),
            viewerIds.length === 0
                ? Promise.resolve([])
                : this.prisma.contact.findMany({
                    where: {
                        linkedCardId: id,
                        userId: { in: viewerIds },
                        source: client_1.ContactSource.EXCHANGE,
                    },
                    select: { userId: true },
                }),
        ]);
        const savedViewerIds = new Set([
            ...savesByViewer.map((row) => row.userId),
            ...contactsByViewer.map((row) => row.userId),
        ].filter((value) => Boolean(value)));
        const visitors = rawVisitors.map((view) => {
            const viewer = view.viewer;
            const profileCard = viewer?.businessCards[0];
            const firstName = viewer?.firstName?.trim() ?? '';
            const lastName = viewer?.lastName?.trim() ?? '';
            const displayName = viewer != null
                ? `${firstName} ${lastName}`.trim() || 'Membre DropOne'
                : 'Visiteur anonyme';
            const job = profileCard?.jobTitle?.trim() ?? '';
            const company = profileCard?.company?.trim() ?? '';
            const subtitle = [job, company].filter(Boolean).join(' - ');
            const initials = viewer != null
                ? `${firstName[0] ?? ''}${lastName[0] ?? firstName[1] ?? ''}`.toUpperCase() ||
                    'DO'
                : '?';
            return {
                id: view.id,
                viewedAt: view.viewedAt.toISOString(),
                isDropOneUser: viewer != null,
                source: view.source ?? 'link',
                displayName,
                subtitle,
                avatarUrl: profileCard?.avatarUrl ?? viewer?.avatarUrl ?? null,
                initials,
                viewerUserId: view.viewerUserId,
                viewerCardSlug: profileCard?.slug ?? null,
                hasSaved: view.viewerUserId
                    ? savedViewerIds.has(view.viewerUserId)
                    : false,
                hasShared: false,
                durationSeconds: null,
                locationLabel: null,
                deviceLabel: this.parseDeviceLabel(view.userAgent),
            };
        });
        return {
            summary: {
                views,
                uniqueVisitors,
                saved: contactsSaved + publicSaves,
                shares,
                dropOneCount,
                guestCount,
            },
            visitors,
        };
    }
    parseDeviceLabel(userAgent) {
        if (!userAgent?.trim())
            return null;
        const ua = userAgent;
        const isIPhone = /iPhone/i.test(ua);
        const isIPad = /iPad/i.test(ua);
        const isAndroid = /Android/i.test(ua);
        const isMac = /Macintosh|Mac OS X/i.test(ua);
        const isWindows = /Windows/i.test(ua);
        if (isIPhone)
            return 'iPhone - iOS';
        if (isIPad)
            return 'iPad - iOS';
        if (isAndroid)
            return 'Android';
        if (isMac)
            return 'Mac - Safari';
        if (isWindows)
            return 'Windows';
        if (/Mobile/i.test(ua))
            return 'Mobile';
        return 'Navigateur web';
    }
    findSharedWithMe(userId) {
        return this.contactsService.findExchangeContacts(userId);
    }
    isTeamCardKind(kind) {
        return kind === client_1.CardKind.PROFESSIONAL || kind === client_1.CardKind.MEMBER;
    }
    async assertCanEditTeamLogo(userId, card) {
        if (card.kind === client_1.CardKind.MEMBER) {
            throw new common_1.ForbiddenException('Le logo d’équipe ne peut être modifié que par un administrateur');
        }
        if (card.kind !== client_1.CardKind.PROFESSIONAL || !card.teamId) {
            throw new common_1.BadRequestException('Le logo d’équipe n’est disponible que sur la carte professionnelle');
        }
        const team = await this.prisma.team.findFirst({
            where: { id: card.teamId, isActive: true },
            select: { ownerId: true },
        });
        if (!team) {
            throw new common_1.BadRequestException('Équipe introuvable');
        }
        if (team.ownerId === userId)
            return;
        const membership = await this.prisma.teamMember.findUnique({
            where: { teamId_userId: { teamId: card.teamId, userId } },
            select: { role: true },
        });
        if (membership?.role !== client_1.TeamMemberRole.ADMIN &&
            membership?.role !== client_1.TeamMemberRole.OWNER) {
            throw new common_1.ForbiddenException('Le logo d’équipe ne peut être modifié que par un administrateur');
        }
    }
    optionalString(value) {
        if (value == null)
            return null;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
    normalizeWebsiteUrl(value) {
        const trimmed = this.optionalString(value);
        if (!trimmed)
            return null;
        if (/^https?:\/\//i.test(trimmed))
            return trimmed;
        return `https://${trimmed}`;
    }
    async generateUniqueSlug(firstName, lastName, kind = client_1.CardKind.PERSONAL) {
        const base = `${firstName}-${lastName}`
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        const safeBase = base.length > 0 ? base : 'carte';
        const kindSuffix = kind === client_1.CardKind.PROFESSIONAL
            ? '-pro'
            : kind === client_1.CardKind.MEMBER
                ? '-member'
                : '';
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
        contacts_service_1.ContactsService,
        entitlements_service_1.EntitlementsService,
        uploads_service_1.UploadsService])
], CardsService);
//# sourceMappingURL=cards.service.js.map