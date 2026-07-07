import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContactSource } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RecordScanContactDto } from './dto/record-scan-contact.dto';
import {
  resolveAvatarColor,
  toContactResponse,
} from './contacts.util';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const contacts = await this.prisma.contact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return contacts.map(toContactResponse);
  }

  async findExchangeContacts(userId: string) {
    const contacts = await this.prisma.contact.findMany({
      where: { userId, source: ContactSource.EXCHANGE },
      orderBy: { createdAt: 'desc' },
    });

    return contacts.map(toContactResponse);
  }

  async exchangeFromCardSlug(userId: string, cardSlug: string) {
    const card = await this.prisma.businessCard.findFirst({
      where: {
        slug: cardSlug.trim(),
        isActive: true,
        isPublic: true,
      },
    });

    if (!card) {
      throw new NotFoundException('Carte introuvable');
    }

    if (card.ownerId === userId) {
      throw new BadRequestException(
        'Vous ne pouvez pas échanger votre propre carte',
      );
    }

    const existing = await this.prisma.contact.findFirst({
      where: {
        userId,
        linkedCardId: card.id,
      },
    });

    if (existing) {
      return toContactResponse(existing);
    }

    const contact = await this.prisma.contact.create({
      data: {
        userId,
        source: ContactSource.EXCHANGE,
        firstName: card.firstName.trim(),
        lastName: card.lastName.trim(),
        email: card.email,
        phone: card.phone,
        jobTitle: card.jobTitle,
        company: card.company,
        linkedCardId: card.id,
        avatarColor: resolveAvatarColor(`${card.firstName}${card.lastName}`),
      },
    });

    return toContactResponse(contact);
  }

  async createFromScan(
    userId: string,
    scanEventId: string,
    payload?: RecordScanContactDto,
  ) {
    // On ne force aucun placeholder : si l'OCR n'a pas trouvé le nom, on
    // laisse le champ vide plutôt que d'inscrire un texte factice.
    const firstName = this.optionalString(payload?.firstName) ?? '';
    const lastName = this.optionalString(payload?.lastName) ?? '';
    const email = this.optionalString(payload?.email);
    const phone = this.optionalString(payload?.phone);
    const jobTitle = this.optionalString(payload?.jobTitle);
    const company = this.optionalString(payload?.company);

    const contact = await this.prisma.contact.create({
      data: {
        userId,
        source: ContactSource.AI_SCAN,
        firstName,
        lastName,
        email,
        phone,
        jobTitle,
        company,
        scanEventId,
        avatarColor: resolveAvatarColor(`${firstName}${lastName}${scanEventId}`),
      },
    });

    return toContactResponse(contact);
  }

  private optionalString(value?: string | null): string | null {
    if (value == null) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
}
