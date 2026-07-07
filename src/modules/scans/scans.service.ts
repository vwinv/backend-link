import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ContactsService } from '../contacts/contacts.service';
import { RecordScanContactDto } from '../contacts/dto/record-scan-contact.dto';
import { EntitlementsService } from '../subscriptions/entitlements.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ScansService {
  constructor(
    private readonly entitlementsService: EntitlementsService,
    private readonly contactsService: ContactsService,
    private readonly prisma: PrismaService,
  ) {}

  getQuota(userId: string) {
    return this.entitlementsService.getAiScanQuota(userId);
  }

  async recordScan(userId: string, payload?: RecordScanContactDto) {
    await this.assertNotScanningOwnCard(userId, payload);

    const result = await this.entitlementsService.recordAiScan(userId);
    const contact = await this.contactsService.createFromScan(
      userId,
      result.scanId,
      payload,
    );

    return {
      scanId: result.scanId,
      contact,
      quota: result.quota,
    };
  }

  private async assertNotScanningOwnCard(
    userId: string,
    payload?: RecordScanContactDto,
  ) {
    const cardSlug = payload?.cardSlug?.trim().toLowerCase();
    if (!cardSlug) {
      return;
    }

    const ownCard = await this.prisma.businessCard.findFirst({
      where: {
        slug: cardSlug,
        ownerId: userId,
        isActive: true,
      },
      select: { id: true },
    });

    if (ownCard) {
      throw new BadRequestException(
        'Vous ne pouvez pas scanner votre propre carte DropOne',
      );
    }
  }
}
