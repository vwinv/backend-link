import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WalletType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AppleWalletService } from './apple-wallet.service';
import { GoogleWalletService } from './google-wallet.service';
import { SaveToWalletDto } from './dto/save-to-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly appleWalletService: AppleWalletService,
    private readonly googleWalletService: GoogleWalletService,
  ) {}

  async addCardToWallet(userId: string, cardId: string, dto: SaveToWalletDto) {
    const card = await this.prisma.businessCard.findFirst({
      where: { id: cardId, ownerId: userId },
    });

    if (!card) {
      throw new NotFoundException('Carte introuvable');
    }

    if (dto.walletType === WalletType.APPLE_WALLET) {
      const passBuffer = await this.appleWalletService.generatePass(card);
      const passId = card.id;
      const savedCard = await this.upsertSavedCard(
        userId,
        cardId,
        WalletType.APPLE_WALLET,
        passId,
      );

      return {
        walletType: WalletType.APPLE_WALLET,
        savedCardId: savedCard.id,
        passBase64: passBuffer.toString('base64'),
      };
    }

    const saveUrl = this.googleWalletService.generateSaveUrl(card);
    const passId = this.googleWalletService.getPassId(card);
    const savedCard = await this.upsertSavedCard(
      userId,
      cardId,
      WalletType.GOOGLE_WALLET,
      passId,
    );

    return {
      walletType: WalletType.GOOGLE_WALLET,
      savedCardId: savedCard.id,
      saveUrl,
    };
  }

  async findAll(userId: string) {
    return this.prisma.savedCard.findMany({
      where: { userId },
      include: {
        card: {
          select: {
            id: true,
            slug: true,
            firstName: true,
            lastName: true,
            jobTitle: true,
            company: true,
          },
        },
      },
      orderBy: { savedAt: 'desc' },
    });
  }

  async remove(userId: string, id: string) {
    const savedCard = await this.prisma.savedCard.findFirst({
      where: { id, userId },
    });

    if (!savedCard) {
      throw new NotFoundException('Carte wallet introuvable');
    }

    await this.prisma.savedCard.delete({ where: { id } });
    return { message: 'Carte retirée du wallet' };
  }

  private upsertSavedCard(
    userId: string,
    cardId: string,
    walletType: WalletType,
    passId: string,
  ) {
    return this.prisma.savedCard.upsert({
      where: {
        userId_cardId_walletType: {
          userId,
          cardId,
          walletType,
        },
      },
      create: {
        userId,
        cardId,
        walletType,
        passId,
      },
      update: {
        passId,
        savedAt: new Date(),
      },
    });
  }
}
