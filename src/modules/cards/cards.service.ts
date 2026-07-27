import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BusinessCard, CardKind, ContactSource, ShareMethod } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { SocialLinkItemDto } from './dto/social-link-item.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { UpdateCardThemeDto } from './dto/update-card-theme.dto';
import { normalizeCardThemeForStorage } from '../sharing/pro-design/card-theme.util';
import { ContactsService } from '../contacts/contacts.service';
import { EntitlementsService } from '../subscriptions/entitlements.service';

@Injectable()
export class CardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contactsService: ContactsService,
    private readonly entitlementsService: EntitlementsService,
  ) {}

  async create(userId: string, dto: CreateCardDto): Promise<BusinessCard> {
    const kind = dto.kind ?? CardKind.PERSONAL;

    if (kind === CardKind.PERSONAL || kind === CardKind.PROFESSIONAL) {
      const existing = await this.prisma.businessCard.findFirst({
        where: { ownerId: userId, kind },
      });
      if (existing) {
        throw new BadRequestException(
          kind === CardKind.PERSONAL
            ? 'Vous avez déjà une carte personnelle'
            : 'Vous avez déjà une carte professionnelle',
        );
      }
    }

    if (
      (kind === CardKind.PROFESSIONAL || kind === CardKind.MEMBER) &&
      !dto.teamId
    ) {
      throw new BadRequestException(
        kind === CardKind.MEMBER
          ? 'Une carte membre doit être liée à une équipe'
          : 'Une carte professionnelle doit être liée à une équipe',
      );
    }

    if (kind === CardKind.MEMBER && dto.teamId) {
      const existingMemberCard = await this.prisma.businessCard.findFirst({
        where: {
          ownerId: userId,
          kind: CardKind.MEMBER,
          teamId: dto.teamId,
        },
      });
      if (existingMemberCard) {
        throw new BadRequestException(
          'Vous avez déjà une carte membre pour cette équipe',
        );
      }
    }

    let theme: object = { cardBadge: 'personalTag' };

    let teamLogoUrl: string | null = null;

    if (
      (kind === CardKind.PROFESSIONAL || kind === CardKind.MEMBER) &&
      dto.teamId
    ) {
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
        throw new BadRequestException('Équipe introuvable');
      }
      if (kind === CardKind.PROFESSIONAL && team.ownerId !== userId) {
        throw new BadRequestException(
          'Seule le propriétaire peut créer une carte professionnelle pour cette équipe',
        );
      }
      if (kind === CardKind.MEMBER && team.ownerId === userId) {
        throw new BadRequestException(
          'Le propriétaire utilise une carte professionnelle, pas une carte membre',
        );
      }
      teamLogoUrl = team.logoUrl;

      if (kind === CardKind.MEMBER) {
        const professionalTemplate = await this.prisma.businessCard.findFirst({
          where: {
            teamId: dto.teamId,
            kind: CardKind.PROFESSIONAL,
            isActive: true,
          },
        });
        if (professionalTemplate) {
          theme = normalizeCardThemeForStorage(professionalTemplate.theme);
          teamLogoUrl = professionalTemplate.logoUrl ?? teamLogoUrl;
        }
      }
    }

    const slug = await this.generateUniqueSlug(
      dto.firstName,
      dto.lastName,
      kind,
    );

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

  async findAll(userId: string) {
    return this.prisma.businessCard.findMany({
      where: { ownerId: userId },
      orderBy: [{ kind: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(userId: string, id: string): Promise<BusinessCard> {
    const card = await this.prisma.businessCard.findFirst({
      where: { id, ownerId: userId },
    });

    if (!card) {
      throw new NotFoundException('Carte introuvable');
    }

    return card;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateCardDto,
  ): Promise<BusinessCard> {
    const card = await this.findOne(userId, id);

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

    if (
      card.kind === CardKind.PROFESSIONAL &&
      card.teamId &&
      dto.logoUrl !== undefined
    ) {
      await this.syncTeamMemberCardsVisuals(card.teamId, {
        logoUrl: updated.logoUrl,
      });
    }

    return updated;
  }

  async updateTheme(
    userId: string,
    id: string,
    dto: UpdateCardThemeDto,
  ): Promise<BusinessCard> {
    const card = await this.findOne(userId, id);
    await this.entitlementsService.assertCanCustomize(userId, id);

    const theme = normalizeCardThemeForStorage(dto.theme);

    const updated = await this.prisma.businessCard.update({
      where: { id },
      data: { theme },
    });

    // La personnalisation de la carte pro s’applique à toutes les cartes membres.
    if (card.kind === CardKind.PROFESSIONAL && card.teamId) {
      await this.syncTeamMemberCardsVisuals(card.teamId, {
        theme,
        logoUrl: card.logoUrl,
      });
    }

    return updated;
  }

  /**
   * Propage le design / logo de la carte professionnelle vers les cartes membres.
   */
  private async syncTeamMemberCardsVisuals(
    teamId: string,
    visuals: { theme?: object; logoUrl?: string | null },
  ): Promise<void> {
    const data: { theme?: object; logoUrl?: string | null } = {};
    if (visuals.theme !== undefined) {
      data.theme = visuals.theme;
    }
    if (visuals.logoUrl !== undefined) {
      data.logoUrl = visuals.logoUrl;
    }
    if (Object.keys(data).length === 0) return;

    await this.prisma.businessCard.updateMany({
      where: {
        teamId,
        kind: CardKind.MEMBER,
        isActive: true,
      },
      data,
    });
  }

  remove(id: string) {
    return { message: 'remove card', id };
  }

  async syncSocialLinks(
    userId: string,
    cardId: string,
    links: SocialLinkItemDto[],
  ) {
    await this.findOne(userId, cardId);

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
      await this.entitlementsService.assertCanEditSocialLinks(userId, cardId);
    }

    await this.prisma.socialLink.deleteMany({ where: { cardId } });

    if (sanitized.length > 0) {
      await this.prisma.socialLink.createMany({ data: sanitized });
    }

    return this.getSocialLinks(userId, cardId);
  }

  async getSocialLinks(userId: string, cardId: string) {
    await this.findOne(userId, cardId);

    return this.prisma.socialLink.findMany({
      where: { cardId },
      orderBy: { order: 'asc' },
    });
  }

  addSocialLink(id: string) {
    return { message: 'addSocialLink', id };
  }

  removeSocialLink(id: string, linkId: string) {
    return { message: 'removeSocialLink', id, linkId };
  }

  async getAnalytics(
    userId: string,
    id: string,
    options?: { days?: number; from?: string; to?: string },
  ) {
    await this.findOne(userId, id);
    await this.entitlementsService.assertHasAnalytics(userId, id);

    const countedShareMethods: ShareMethod[] = [
      ShareMethod.LINK,
      ShareMethod.EMAIL,
      ShareMethod.WHATSAPP,
      ShareMethod.AIRDROP,
    ];

    const { periodStart, periodEndExclusive, periodDays } =
      this.resolveAnalyticsPeriod(options);

    const previousStart = new Date(periodStart);
    previousStart.setDate(previousStart.getDate() - periodDays);

    const [
      views,
      shares,
      contactsSaved,
      publicSaves,
      uniqueGroups,
      guestViews,
      periodViews,
      previousPeriodViews,
      viewsInPeriod,
      sourcesRaw,
    ] = await Promise.all([
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
          source: ContactSource.EXCHANGE,
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

    let viewsChangePercent: number | null = null;
    if (previousPeriodViews > 0) {
      viewsChangePercent = Math.round(
        ((periodViews - previousPeriodViews) / previousPeriodViews) * 100,
      );
    } else if (periodViews > 0) {
      viewsChangePercent = 100;
    } else {
      viewsChangePercent = 0;
    }

    const dayKeys = Array.from({ length: periodDays }, (_, index) => {
      const day = new Date(periodStart);
      day.setDate(periodStart.getDate() + index);
      return day;
    });

    const countsByDay = new Map<string, number>();
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
        label:
          periodDays <= 7
            ? this.toWeekdayLabel(day)
            : this.toShortDateLabel(day),
        count: countsByDay.get(key) ?? 0,
      };
    });

    const sourceTotals = new Map<string, number>();
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

    const sourceOrder = ['qr', 'share', 'link', 'nfc', 'app', 'other'] as const;
    const sources = sourceOrder
      .map((key) => {
        const count = sourceTotals.get(key) ?? 0;
        return {
          key,
          count,
          percent:
            sourcesCounted > 0
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

  private resolveAnalyticsPeriod(options?: {
    days?: number;
    from?: string;
    to?: string;
  }): {
    periodStart: Date;
    periodEndExclusive: Date;
    periodDays: number;
  } {
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
        const periodDays = Math.max(
          1,
          Math.round(
            (periodEndExclusive.getTime() - periodStart.getTime()) /
              (24 * 60 * 60 * 1000),
          ),
        );
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

  private toDayKey(date: Date): string {
    const local = new Date(date);
    const year = local.getFullYear();
    const month = `${local.getMonth() + 1}`.padStart(2, '0');
    const day = `${local.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toWeekdayLabel(date: Date): string {
    const labels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return labels[date.getDay()] ?? '';
  }

  private toShortDateLabel(date: Date): string {
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    return `${day}/${month}`;
  }

  private normalizeAnalyticsSource(source?: string | null): string {
    const value = source?.trim().toLowerCase();
    if (!value) return 'link';
    if (['qr', 'nfc', 'share', 'link', 'app'].includes(value)) return value;
    return 'other';
  }

  async getVisitors(
    userId: string,
    id: string,
    filter: 'all' | 'dropone' | 'guest' = 'all',
  ) {
    await this.findOne(userId, id);
    await this.entitlementsService.assertHasVisitorInsights(userId, id);

    const countedShareMethods: ShareMethod[] = [
      ShareMethod.LINK,
      ShareMethod.EMAIL,
      ShareMethod.WHATSAPP,
      ShareMethod.AIRDROP,
    ];

    const viewWhere =
      filter === 'dropone'
        ? { cardId: id, viewerUserId: { not: null } }
        : filter === 'guest'
          ? { cardId: id, viewerUserId: null }
          : { cardId: id };

    const [
      views,
      dropOneCount,
      guestCount,
      registeredGroups,
      shares,
      contactsSaved,
      publicSaves,
      rawVisitors,
    ] = await Promise.all([
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
          source: ContactSource.EXCHANGE,
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
      ...new Set(
        rawVisitors
          .map((view) => view.viewerUserId)
          .filter((value): value is string => Boolean(value)),
      ),
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
              source: ContactSource.EXCHANGE,
            },
            select: { userId: true },
          }),
    ]);

    const savedViewerIds = new Set(
      [
        ...savesByViewer.map((row) => row.userId),
        ...contactsByViewer.map((row) => row.userId),
      ].filter((value): value is string => Boolean(value)),
    );

    const visitors = rawVisitors.map((view) => {
      const viewer = view.viewer;
      const profileCard = viewer?.businessCards[0];
      const firstName = viewer?.firstName?.trim() ?? '';
      const lastName = viewer?.lastName?.trim() ?? '';
      const displayName =
        viewer != null
          ? `${firstName} ${lastName}`.trim() || 'Membre DropOne'
          : 'Visiteur anonyme';
      const job = profileCard?.jobTitle?.trim() ?? '';
      const company = profileCard?.company?.trim() ?? '';
      const subtitle = [job, company].filter(Boolean).join(' · ');
      const initials =
        viewer != null
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
        durationSeconds: null as number | null,
        locationLabel: null as string | null,
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

  private parseDeviceLabel(userAgent?: string | null): string | null {
    if (!userAgent?.trim()) return null;
    const ua = userAgent;

    const isIPhone = /iPhone/i.test(ua);
    const isIPad = /iPad/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isMac = /Macintosh|Mac OS X/i.test(ua);
    const isWindows = /Windows/i.test(ua);

    if (isIPhone) return 'iPhone · iOS';
    if (isIPad) return 'iPad · iOS';
    if (isAndroid) return 'Android';
    if (isMac) return 'Mac · Safari';
    if (isWindows) return 'Windows';
    if (/Mobile/i.test(ua)) return 'Mobile';
    return 'Navigateur web';
  }

  findSharedWithMe(userId: string) {
    return this.contactsService.findExchangeContacts(userId);
  }

  private optionalString(value?: string | null): string | null {
    if (value == null) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private async generateUniqueSlug(
    firstName: string,
    lastName: string,
    kind: CardKind = CardKind.PERSONAL,
  ): Promise<string> {
    const base = `${firstName}-${lastName}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const safeBase = base.length > 0 ? base : 'carte';
    const kindSuffix =
      kind === CardKind.PROFESSIONAL
        ? '-pro'
        : kind === CardKind.MEMBER
          ? '-member'
          : '';
    let slug = `${safeBase}${kindSuffix}`;
    let counter = 1;

    while (await this.prisma.businessCard.findUnique({ where: { slug } })) {
      slug = `${safeBase}${kindSuffix}-${counter++}`;
    }

    return slug;
  }
}
