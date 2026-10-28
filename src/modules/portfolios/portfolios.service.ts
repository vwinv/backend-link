import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EntitlementsService } from '../subscriptions/entitlements.service';
import { SavePortfolioProfileDto } from './dto/save-portfolio-profile.dto';
import {
  PORTFOLIO_COLORS,
  PORTFOLIO_LAYOUTS,
  SavePortfolioStyleDto,
} from './dto/save-portfolio-style.dto';
import { buildBentoPortfolioHtml } from './public-portfolio-bento';
import { buildCartesPortfolioHtml } from './public-portfolio-cartes';
import { buildClassicPortfolioHtml } from './public-portfolio-classic';
import { buildEditorialPortfolioHtml } from './public-portfolio-editorial';
import { buildGalleryPortfolioHtml } from './public-portfolio-gallery';
import { buildMinimalPortfolioHtml } from './public-portfolio-minimal';
import { buildPortraitPortfolioHtml } from './public-portfolio-portrait';
import {
  buildCoverPortfolioHtml,
  coverAccent,
  type CoverPortfolioInput,
} from './public-portfolio-cover';
import {
  buildPublicPortfolioHtml,
  buildPublicPortfolioNotFoundHtml,
} from './public-portfolio-page';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class PortfoliosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly entitlementsService: EntitlementsService,
  ) { }

  private get appPublicUrl(): string {
    return this.configService.get<string>(
      'wallet.appPublicUrl',
      'https://api.dropone.pro',
    );
  }

  create(dto: CreatePortfolioDto) {
    return { message: 'create portfolio', dto };
  }

  async findOwnedByCard(userId: string, cardId: string) {
    await this.ownedCard(userId, cardId);
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { cardId },
    });
    if (!portfolio) return { exists: false };
    const theme = this.readTheme(portfolio.theme);
    return {
      exists: true,
      id: portfolio.id,
      title: portfolio.title,
      layout: theme.layout,
      color: theme.color,
    };
  }

  async saveStyle(userId: string, cardId: string, dto: SavePortfolioStyleDto) {
    const card = await this.ownedCard(userId, cardId);
    const existing = await this.prisma.portfolio.findUnique({
      where: { cardId },
    });

    if (existing) {
      const current = this.readTheme(existing.theme);
      const changing =
        current.layout !== dto.layout || current.color !== dto.color;
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

  async getEditor(userId: string, cardId: string) {
    const card = await this.ownedCard(userId, cardId);
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { cardId },
      include: { projects: { orderBy: { order: 'asc' } } },
    });
    if (!portfolio) return { exists: false };

    const content = this.readContent(portfolio.content);
    const cardFullName = `${card.firstName} ${card.lastName}`.trim();
    const storedTitle = portfolio.title?.trim() ?? '';
    const title =
      storedTitle && storedTitle !== cardFullName
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

  async saveProfile(
    userId: string,
    cardId: string,
    dto: SavePortfolioProfileDto,
  ) {
    await this.ownedCard(userId, cardId);
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { cardId },
      select: { id: true },
    });
    if (!portfolio) throw new NotFoundException('Portfolio introuvable');

    const blank = (value?: string | null) => {
      const trimmed = value?.trim() ?? '';
      return trimmed.length > 0 ? trimmed : null;
    };
    const chips = (values: string[]) =>
      values.map((value) => value.trim()).filter((value) => value.length > 0).slice(0, 24);

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
      const kept = new Set(
        dto.projects
          .map((project) => project.id)
          .filter((id): id is string => !!id && known.has(id)),
      );
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
        } else {
          await tx.portfolioProject.create({
            data: { portfolioId: portfolio.id, ...data },
          });
        }
      }
    });

    return this.getEditor(userId, cardId);
  }

  private readContent(value: Prisma.JsonValue): {
    experiences: { id: string; role: string; company: string; period: string; missions: string }[];
    teachings: { id: string; title: string; school: string; year: string; audience: string }[];
    skills: { id: string; name: string; level: number }[];
    competences: string[];
    strengths: string[];
    interests: string[];
  } {
    const empty = {
      experiences: [],
      teachings: [],
      skills: [],
      competences: [],
      strengths: [],
      interests: [],
    };
    if (!value || typeof value !== 'object' || Array.isArray(value)) return empty;
    const source = value as Record<string, unknown>;
    const text = (item: unknown) => (typeof item === 'string' ? item : '');
    const rows = (item: unknown) => (Array.isArray(item) ? item : []);
    return {
      experiences: rows(source.experiences).flatMap((item) => {
        if (!item || typeof item !== 'object') return [];
        const row = item as Record<string, unknown>;
        const role = text(row.role).trim();
        if (!role) return [];
        return [{
          id: text(row.id),
          role,
          company: text(row.company),
          period: text(row.period),
          missions: text(row.missions),
        }];
      }),
      teachings: rows(source.teachings).flatMap((item) => {
        if (!item || typeof item !== 'object') return [];
        const row = item as Record<string, unknown>;
        const title = text(row.title).trim();
        if (!title) return [];
        return [{
          id: text(row.id),
          title,
          school: text(row.school),
          year: text(row.year),
          audience: text(row.audience),
        }];
      }),
      skills: rows(source.skills).flatMap((item) => {
        if (!item || typeof item !== 'object') return [];
        const row = item as Record<string, unknown>;
        const name = text(row.name).trim();
        const level = typeof row.level === 'number' ? row.level : Number(row.level);
        if (!name || Number.isNaN(level)) return [];
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

  private async ownedCard(userId: string, cardId: string) {
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
    if (!card) throw new NotFoundException('Carte introuvable');
    return card;
  }

  private readTheme(value: Prisma.JsonValue): { layout: string; color: string } {
    const fallback = { layout: 'classique', color: 'neon' };
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return fallback;
    }
    const theme = value as Record<string, unknown>;
    return {
      layout: typeof theme.layout === 'string' ? theme.layout : fallback.layout,
      color: typeof theme.color === 'string' ? theme.color : fallback.color,
    };
  }

  private themePayload(
    dto: SavePortfolioStyleDto,
    previous?: Prisma.JsonValue,
  ): Prisma.InputJsonValue {
    const base =
      previous && typeof previous === 'object' && !Array.isArray(previous)
        ? { ...(previous as Record<string, unknown>) }
        : {};
    return { ...base, layout: dto.layout, color: dto.color };
  }

  async getStats(userId: string, cardId: string) {
    const card = await this.prisma.businessCard.findFirst({
      where: { id: cardId, ownerId: userId },
      select: { id: true },
    });
    if (!card) {
      throw new NotFoundException('Carte introuvable');
    }

    await this.entitlementsService.assertCanViewPortfolioStats(userId);

    const [siteVisits, portfolioClicks] = await Promise.all([
      this.prisma.portfolioVisitEvent.count({ where: { cardId } }),
      this.prisma.portfolioClickEvent.count({ where: { cardId } }),
    ]);

    return { siteVisits, portfolioClicks };
  }

  async recordClick(slug: string, viewerUserId?: string) {
    const card = await this.prisma.businessCard.findFirst({
      where: { slug, isPublic: true, isActive: true },
      select: { id: true, ownerId: true },
    });
    if (!card) {
      throw new NotFoundException('Carte introuvable');
    }

    if (viewerUserId && viewerUserId === card.ownerId) {
      return { ok: true, counted: false };
    }

    await this.prisma.portfolioClickEvent.create({
      data: { cardId: card.id },
    });

    return { ok: true, counted: true };
  }

  notFoundPage(): string {
    return buildPublicPortfolioNotFoundHtml();
  }

  async renderPublicPage(
    slug: string,
    viewerUserId?: string,
    embed = false,
    preview?: { layout?: string; color?: string },
  ): Promise<string | null> {
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
    if (!card) return null;

    const ownerPreview = embed && viewerUserId === card.ownerId;
    if (!ownerPreview) {
      const canShare =
        await this.entitlementsService.canPublishPortfolio(card.ownerId);
      if (!canShare) return null;
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
    const firstName =
      profile && portfolio?.displayFirstName
        ? portfolio.displayFirstName
        : card.firstName;
    const lastName =
      profile && portfolio?.displayLastName
        ? portfolio.displayLastName
        : card.lastName;
    const fullName = `${firstName} ${lastName}`.trim();
    const pageUrl = `${this.appPublicUrl}/portfolios/${card.slug}`;
    const photoUrl = this.resolveAssetUrl(
      (profile ? portfolio?.photoUrl : null) ||
        card.coverImageUrl ||
        card.avatarUrl,
    );
    const theme = this.readTheme(portfolio?.theme ?? null);
    if (
      preview?.layout &&
      (PORTFOLIO_LAYOUTS as readonly string[]).includes(preview.layout)
    ) {
      theme.layout = preview.layout;
    }
    if (
      preview?.color &&
      (PORTFOLIO_COLORS as readonly string[]).includes(preview.color)
    ) {
      theme.color = preview.color;
    }
    const storedTitle = profile ? portfolio?.title?.trim() ?? '' : '';
    const jobTitle =
      experiences[0]?.role ||
      (storedTitle && storedTitle !== fullName ? storedTitle : card.jobTitle);
    const company = experiences[0]?.company || card.company;
    const bio = profile
      ? portfolio?.description
      : card.bio || portfolio?.description;
    const phone = profile ? portfolio?.displayPhone : card.phone;
    const address =
      profile && portfolio?.hidePersonalDetails !== true
        ? portfolio?.displayAddress
        : null;

    const accent = coverAccent(theme.color);
    const prefix = this.configService
      .get<string>('apiPrefix', 'api/v1')
      .replace(/^\/+|\/+$/g, '');
    const pageInput: CoverPortfolioInput = {
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

    let html: string;
    if (theme.layout === 'couverture') {
      html = buildCoverPortfolioHtml(pageInput);
    } else if (theme.layout === 'classique') {
      html = buildClassicPortfolioHtml(pageInput);
    } else if (theme.layout === 'editorial') {
      html = buildEditorialPortfolioHtml(pageInput);
    } else if (theme.layout === 'galerie') {
      html = buildGalleryPortfolioHtml(pageInput);
    } else if (theme.layout === 'minimal') {
      html = buildMinimalPortfolioHtml(pageInput);
    } else if (theme.layout === 'bento') {
      html = buildBentoPortfolioHtml(pageInput);
    } else if (theme.layout === 'portrait') {
      html = buildPortraitPortfolioHtml(pageInput);
    } else if (theme.layout === 'cartes') {
      html = buildCartesPortfolioHtml(pageInput);
    } else {
      html = buildPublicPortfolioHtml({
        fullName,
        initials: this.initials(firstName, lastName),
        jobTitle,
        company,
        avatarUrl: photoUrl,
        pageUrl,
      });
    }

    return embed ? withEmbedPortfolioTopSpace(html) : html;
  }

  private initials(firstName: string, lastName: string): string {
    const first = firstName.trim();
    const last = lastName.trim();
    if (!first && !last) return '•';
    if (!last) return first[0]!.toUpperCase();
    return `${first[0]}${last[0]}`.toUpperCase();
  }

  private resolveAssetUrl(value?: string | null): string | null {
    const trimmed = value?.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${this.appPublicUrl}${path}`;
  }

  findOne(id: string) {
    return { message: 'findOne portfolio', id };
  }

  update(id: string, dto: UpdatePortfolioDto) {
    return { message: 'update portfolio', id, dto };
  }

  remove(id: string) {
    return { message: 'remove portfolio', id };
  }

  addProject(id: string, dto: CreateProjectDto) {
    return { message: 'addProject', id, dto };
  }

  updateProject(id: string, projectId: string, dto: UpdateProjectDto) {
    return { message: 'updateProject', id, projectId, dto };
  }

  removeProject(id: string, projectId: string) {
    return { message: 'removeProject', id, projectId };
  }
}

/** Espace au-dessus de la ligne « Me contacter » dans l’aperçu in-app. */
function withEmbedPortfolioTopSpace(html: string): string {
  const style = `<style>
    html.embed .top,
    html.embed .head { margin-top: 82px; }
    html.embed .hero-top { top: 104px; }
  </style>`;
  return html
    .replace('<html lang="fr">', '<html lang="fr" class="embed">')
    .replace('</head>', `${style}</head>`);
}
