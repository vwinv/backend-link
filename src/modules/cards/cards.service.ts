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

@Injectable()
export class CardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contactsService: ContactsService,
  ) {}

  async create(userId: string, dto: CreateCardDto): Promise<BusinessCard> {
    const kind = dto.kind ?? CardKind.PERSONAL;

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

    if (kind === CardKind.PROFESSIONAL && !dto.teamId) {
      throw new BadRequestException(
        'Une carte professionnelle doit être liée à une équipe',
      );
    }

    let theme: Record<string, string> = { cardBadge: 'personalTag' };

    let teamLogoUrl: string | null = null;

    if (kind === CardKind.PROFESSIONAL && dto.teamId) {
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
      teamLogoUrl = team.logoUrl;
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

  async updateTheme(
    userId: string,
    id: string,
    dto: UpdateCardThemeDto,
  ): Promise<BusinessCard> {
    await this.findOne(userId, id);

    const theme = normalizeCardThemeForStorage(dto.theme);

    return this.prisma.businessCard.update({
      where: { id },
      data: { theme },
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

  async getAnalytics(userId: string, id: string) {
    await this.findOne(userId, id);

    const countedShareMethods: ShareMethod[] = [
      ShareMethod.LINK,
      ShareMethod.EMAIL,
      ShareMethod.WHATSAPP,
      ShareMethod.AIRDROP,
    ];

    const [views, shares, contactsSaved, publicSaves] = await Promise.all([
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
    ]);

    return { views, shares, saved: contactsSaved + publicSaves };
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
    const kindSuffix = kind === CardKind.PROFESSIONAL ? '-pro' : '';
    let slug = `${safeBase}${kindSuffix}`;
    let counter = 1;

    while (await this.prisma.businessCard.findUnique({ where: { slug } })) {
      slug = `${safeBase}${kindSuffix}-${counter++}`;
    }

    return slug;
  }
}
