import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OfferAudience,
  OfferBillingType,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FREE_OFFER_SLUG } from '../subscriptions/free-offer.constants';
import { CreateAdminOfferDto } from './dto/create-admin-offer.dto';
import { CreateAdminOfferPriceDto } from './dto/create-admin-offer.dto';
import {
  UpdateAdminOfferDto,
  UpdateAdminOfferPriceDto,
} from './dto/update-admin-offer.dto';

@Injectable()
export class AdminOffersService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const offers = await this.prisma.premiumOffer.findMany({
      include: {
        prices: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
        _count: { select: { subscriptions: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return offers.map((offer) => this.toOfferResponse(offer));
  }

  async findOne(id: string) {
    const offer = await this.prisma.premiumOffer.findUnique({
      where: { id },
      include: {
        prices: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
        _count: { select: { subscriptions: true } },
      },
    });

    if (!offer) {
      throw new NotFoundException('Offre introuvable');
    }

    return this.toOfferResponse(offer);
  }

  async create(dto: CreateAdminOfferDto) {
    const slug = dto.slug.trim().toLowerCase();
    await this.assertSlugAvailable(slug);

    const offer = await this.prisma.premiumOffer.create({
      data: {
        title: dto.title.trim(),
        slug,
        subtitle: dto.subtitle?.trim() || null,
        audience: dto.audience,
        canCustomize: dto.canCustomize ?? false,
        maxTeamMembers: dto.maxTeamMembers ?? 0,
        minSeats: dto.minSeats ?? 1,
        hasPortfolio: dto.hasPortfolio ?? false,
        hasWallet: dto.hasWallet ?? false,
        hasAnalytics: dto.hasAnalytics ?? false,
        hasVisitorInsights: dto.hasVisitorInsights ?? false,
        hasSocialLinks: dto.hasSocialLinks ?? false,
        maxAiScans: dto.maxAiScans ?? 0,
        maxShares: dto.maxShares ?? 10,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
        listedInApp: dto.listedInApp ?? true,
        prices: dto.prices?.length
          ? {
              create: dto.prices.map((price, index) =>
                this.toPriceCreateData(price, index),
              ),
            }
          : undefined,
      },
      include: {
        prices: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
        _count: { select: { subscriptions: true } },
      },
    });

    return this.toOfferResponse(offer);
  }

  async update(id: string, dto: UpdateAdminOfferDto) {
    const existing = await this.prisma.premiumOffer.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Offre introuvable');
    }

    if (dto.slug != null) {
      const slug = dto.slug.trim().toLowerCase();
      if (existing.slug === FREE_OFFER_SLUG && slug !== FREE_OFFER_SLUG) {
        throw new BadRequestException(
          'Le slug de l’offre gratuite ne peut pas être modifié',
        );
      }
      await this.assertSlugAvailable(slug, id);
    }

    const offer = await this.prisma.premiumOffer.update({
      where: { id },
      data: {
        ...(dto.title != null ? { title: dto.title.trim() } : {}),
        ...(dto.slug != null ? { slug: dto.slug.trim().toLowerCase() } : {}),
        ...(dto.subtitle !== undefined
          ? { subtitle: dto.subtitle?.trim() || null }
          : {}),
        ...(dto.audience != null ? { audience: dto.audience } : {}),
        ...(dto.canCustomize != null ? { canCustomize: dto.canCustomize } : {}),
        ...(dto.maxTeamMembers != null
          ? { maxTeamMembers: dto.maxTeamMembers }
          : {}),
        ...(dto.minSeats != null ? { minSeats: dto.minSeats } : {}),
        ...(dto.hasPortfolio != null ? { hasPortfolio: dto.hasPortfolio } : {}),
        ...(dto.hasWallet != null ? { hasWallet: dto.hasWallet } : {}),
        ...(dto.hasAnalytics != null ? { hasAnalytics: dto.hasAnalytics } : {}),
        ...(dto.hasVisitorInsights != null
          ? { hasVisitorInsights: dto.hasVisitorInsights }
          : {}),
        ...(dto.hasSocialLinks != null
          ? { hasSocialLinks: dto.hasSocialLinks }
          : {}),
        ...(dto.maxAiScans != null ? { maxAiScans: dto.maxAiScans } : {}),
        ...(dto.maxShares != null ? { maxShares: dto.maxShares } : {}),
        ...(dto.sortOrder != null ? { sortOrder: dto.sortOrder } : {}),
        ...(dto.isActive != null ? { isActive: dto.isActive } : {}),
        ...(dto.listedInApp != null ? { listedInApp: dto.listedInApp } : {}),
      },
      include: {
        prices: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
        _count: { select: { subscriptions: true } },
      },
    });

    return this.toOfferResponse(offer);
  }

  async remove(id: string) {
    const existing = await this.prisma.premiumOffer.findUnique({
      where: { id },
      include: { _count: { select: { subscriptions: true } } },
    });
    if (!existing) {
      throw new NotFoundException('Offre introuvable');
    }

    if (existing.slug === FREE_OFFER_SLUG) {
      throw new BadRequestException(
        'L’offre gratuite ne peut pas être supprimée — désactivez-la ou modifiez ses quotas',
      );
    }

    if (existing._count.subscriptions > 0) {
      await this.prisma.premiumOffer.update({
        where: { id },
        data: { isActive: false, listedInApp: false },
      });
      return { id, softDeleted: true };
    }

    await this.prisma.premiumOffer.delete({ where: { id } });
    return { id, softDeleted: false };
  }

  async createPrice(offerId: string, dto: CreateAdminOfferPriceDto) {
    await this.assertOfferExists(offerId);
    await this.assertBillingTypeAvailable(offerId, dto.billingType);

    const price = await this.prisma.premiumOfferPrice.create({
      data: {
        offerId,
        ...this.toPriceCreateData(dto, dto.sortOrder ?? 0),
      },
    });

    return this.toPriceResponse(price);
  }

  async updatePrice(
    offerId: string,
    priceId: string,
    dto: UpdateAdminOfferPriceDto,
  ) {
    const price = await this.prisma.premiumOfferPrice.findFirst({
      where: { id: priceId, offerId },
    });
    if (!price) {
      throw new NotFoundException('Tarif introuvable');
    }

    if (dto.billingType && dto.billingType !== price.billingType) {
      await this.assertBillingTypeAvailable(offerId, dto.billingType, priceId);
    }

    const updated = await this.prisma.premiumOfferPrice.update({
      where: { id: priceId },
      data: {
        ...(dto.billingType != null ? { billingType: dto.billingType } : {}),
        ...(dto.priceAmount != null ? { priceAmount: dto.priceAmount } : {}),
        ...(dto.pricePerSeat !== undefined
          ? { pricePerSeat: dto.pricePerSeat }
          : {}),
        ...(dto.priceLabel !== undefined
          ? { priceLabel: dto.priceLabel?.trim() || null }
          : {}),
        ...(dto.currency != null ? { currency: dto.currency.trim() } : {}),
        ...(dto.discountPercent !== undefined
          ? { discountPercent: dto.discountPercent }
          : {}),
        ...(dto.badgeLabel !== undefined
          ? { badgeLabel: dto.badgeLabel?.trim() || null }
          : {}),
        ...(dto.isPopular != null ? { isPopular: dto.isPopular } : {}),
        ...(dto.sortOrder != null ? { sortOrder: dto.sortOrder } : {}),
        ...(dto.isActive != null ? { isActive: dto.isActive } : {}),
        ...(dto.stripePriceId !== undefined
          ? { stripePriceId: dto.stripePriceId?.trim() || null }
          : {}),
      },
    });

    return this.toPriceResponse(updated);
  }

  async removePrice(offerId: string, priceId: string) {
    const price = await this.prisma.premiumOfferPrice.findFirst({
      where: { id: priceId, offerId },
      include: { _count: { select: { subscriptions: true } } },
    });
    if (!price) {
      throw new NotFoundException('Tarif introuvable');
    }

    // Les abonnements liés passent offerPriceId à null (onDelete: SetNull).
    await this.prisma.premiumOfferPrice.delete({ where: { id: priceId } });
    return {
      id: priceId,
      deleted: true,
      detachedSubscriptions: price._count.subscriptions,
    };
  }

  private toPriceCreateData(
    dto: CreateAdminOfferPriceDto,
    fallbackSort: number,
  ): Prisma.PremiumOfferPriceCreateWithoutOfferInput {
    return {
      billingType: dto.billingType,
      priceAmount: dto.priceAmount,
      pricePerSeat: dto.pricePerSeat ?? null,
      priceLabel: dto.priceLabel?.trim() || null,
      currency: dto.currency?.trim() || 'FCFA',
      discountPercent: dto.discountPercent ?? null,
      badgeLabel: dto.badgeLabel?.trim() || null,
      isPopular: dto.isPopular ?? false,
      sortOrder: dto.sortOrder ?? fallbackSort,
      isActive: dto.isActive ?? true,
      stripePriceId: dto.stripePriceId?.trim() || null,
    };
  }

  private async assertOfferExists(id: string) {
    const offer = await this.prisma.premiumOffer.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!offer) {
      throw new NotFoundException('Offre introuvable');
    }
  }

  private async assertSlugAvailable(slug: string, excludeId?: string) {
    const existing = await this.prisma.premiumOffer.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Ce slug d’offre est déjà utilisé');
    }
  }

  private async assertBillingTypeAvailable(
    offerId: string,
    billingType: OfferBillingType,
    excludePriceId?: string,
  ) {
    const existing = await this.prisma.premiumOfferPrice.findUnique({
      where: {
        offerId_billingType: { offerId, billingType },
      },
      select: { id: true },
    });
    if (existing && existing.id !== excludePriceId) {
      throw new BadRequestException(
        `Un tarif ${billingType} existe déjà pour cette offre`,
      );
    }
  }

  private toNumber(
    value: { toNumber?: () => number } | number | null | undefined,
  ): number | null {
    if (value == null) return null;
    if (typeof value === 'number') return value;
    if (typeof value.toNumber === 'function') return value.toNumber();
    return Number(value);
  }

  private toPriceResponse(price: {
    id: string;
    billingType: OfferBillingType;
    priceLabel: string | null;
    priceAmount: { toNumber?: () => number } | number;
    pricePerSeat?: { toNumber?: () => number } | number | null;
    currency: string;
    discountPercent: number | null;
    badgeLabel: string | null;
    isPopular: boolean;
    sortOrder: number;
    isActive: boolean;
    stripePriceId: string | null;
  }) {
    return {
      id: price.id,
      billingType: price.billingType,
      priceLabel: price.priceLabel,
      priceAmount: this.toNumber(price.priceAmount) ?? 0,
      pricePerSeat: this.toNumber(price.pricePerSeat),
      currency: price.currency,
      discountPercent: price.discountPercent,
      badgeLabel: price.badgeLabel,
      isPopular: price.isPopular,
      sortOrder: price.sortOrder,
      isActive: price.isActive,
      stripePriceId: price.stripePriceId,
    };
  }

  private toOfferResponse(offer: {
    id: string;
    title: string;
    slug: string;
    subtitle: string | null;
    audience: OfferAudience;
    canCustomize: boolean;
    maxTeamMembers: number;
    minSeats: number;
    hasPortfolio: boolean;
    hasWallet: boolean;
    hasAnalytics: boolean;
    hasVisitorInsights: boolean;
    hasSocialLinks: boolean;
    maxAiScans: number;
    maxShares: number;
    sortOrder: number;
    isActive: boolean;
    listedInApp: boolean;
    createdAt: Date;
    updatedAt: Date;
    prices: Array<{
      id: string;
      billingType: OfferBillingType;
      priceLabel: string | null;
      priceAmount: { toNumber?: () => number } | number;
      pricePerSeat?: { toNumber?: () => number } | number | null;
      currency: string;
      discountPercent: number | null;
      badgeLabel: string | null;
      isPopular: boolean;
      sortOrder: number;
      isActive: boolean;
      stripePriceId: string | null;
    }>;
    _count?: { subscriptions: number };
  }) {
    return {
      id: offer.id,
      title: offer.title,
      slug: offer.slug,
      subtitle: offer.subtitle,
      audience: offer.audience,
      canCustomize: offer.canCustomize,
      maxTeamMembers: offer.maxTeamMembers,
      minSeats: offer.minSeats,
      hasPortfolio: offer.hasPortfolio,
      hasWallet: offer.hasWallet,
      hasAnalytics: offer.hasAnalytics,
      hasVisitorInsights: offer.hasVisitorInsights,
      hasSocialLinks: offer.hasSocialLinks,
      maxAiScans: offer.maxAiScans,
      maxShares: offer.maxShares,
      sortOrder: offer.sortOrder,
      isActive: offer.isActive,
      listedInApp: offer.listedInApp,
      isFreeOffer: offer.slug === FREE_OFFER_SLUG,
      subscriptionsCount: offer._count?.subscriptions ?? 0,
      createdAt: offer.createdAt.toISOString(),
      updatedAt: offer.updatedAt.toISOString(),
      prices: offer.prices.map((price) => this.toPriceResponse(price)),
    };
  }
}
