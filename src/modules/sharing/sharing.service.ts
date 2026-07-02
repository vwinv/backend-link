import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { BusinessCard } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { resolveProDesign } from './pro-design/pro-design-resolver';
import { buildCardInitials } from './public-card/public-card-body';
import { buildPublicCardHtml } from './public-card/public-card-page';
import { ShareCardDto } from './dto/share-card.dto';

@Injectable()
export class SharingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private get appPublicUrl(): string {
    return this.configService.get<string>(
      'wallet.appPublicUrl',
      'https://backend-link-wt91.onrender.com',
    );
  }

  async getPublicCard(slug: string) {
    const card = await this.findPublicCard(slug);
    if (!card) {
      throw new NotFoundException('Carte introuvable');
    }

    await this.recordCardView(card.id);

    return this.toPublicCardPayload(card);
  }

  renderPublicCardNotFoundPage(): string {
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

  async renderPublicCardPage(slug: string): Promise<string | null> {
    const card = await this.findPublicCard(slug);
    if (!card) {
      return null;
    }

    await this.recordCardView(card.id);

    const fullName = `${card.firstName} ${card.lastName}`.trim();
    const subtitle = this.buildSubtitle(card);
    const pageUrl = `${this.appPublicUrl}/cards/${card.slug}`;
    const design = resolveProDesign(card.theme);

    return buildPublicCardHtml({
      fullName,
      initials: buildCardInitials({ fullName }),
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

  async shareCard(userId: string, id: string, dto: ShareCardDto) {
    const card = await this.prisma.businessCard.findFirst({
      where: { id, ownerId: userId },
    });

    if (!card) {
      throw new NotFoundException('Carte introuvable');
    }

    return this.prisma.shareEvent.create({
      data: {
        cardId: card.id,
        userId,
        method: dto.method,
      },
    });
  }

  getQrCode(id: string) {
    return { message: 'getQrCode', id };
  }

  getShareLink(id: string) {
    return { message: 'getShareLink', id };
  }

  private async recordCardView(cardId: string) {
    await this.prisma.cardView.create({
      data: { cardId },
    });
  }

  async recordCardSave(slug: string, userId?: string) {
    const card = await this.findPublicCard(slug);
    if (!card) {
      throw new NotFoundException('Carte introuvable');
    }

    await this.prisma.cardSaveEvent.create({
      data: {
        cardId: card.id,
        userId,
      },
    });

    return { ok: true };
  }

  private async findPublicCard(slug: string) {
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

  private toPublicCardPayload(card: BusinessCard) {
    const fullName = `${card.firstName} ${card.lastName}`.trim();
    const design = resolveProDesign(card.theme);

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

  private buildSubtitle(card: BusinessCard): string {
    const job = card.jobTitle?.trim() ?? '';
    const company = card.company?.trim() ?? '';
    if (job && company) return `${job} · ${company}`;
    return job || company;
  }

  private resolvePortraitUrl(card: BusinessCard): string | null {
    const avatar = card.avatarUrl?.trim();
    if (avatar) return avatar;

    const logo = card.logoUrl?.trim();
    if (logo) return logo;

    return null;
  }

  private getBrandLogoUrl(): string {
    return 'https://ui-avatars.com/api/?name=Link&size=128&background=1B4DFF&color=ffffff&bold=true&format=png';
  }

  private getOgImageUrl(card: BusinessCard, fullName: string): string {
    if (card.avatarUrl?.trim()) return card.avatarUrl.trim();
    if (card.coverImageUrl?.trim()) return card.coverImageUrl.trim();

    const name = encodeURIComponent(fullName);
    return `https://ui-avatars.com/api/?name=${name}&size=1200&background=1B4DFF&color=ffffff&bold=true&format=png`;
  }
}
