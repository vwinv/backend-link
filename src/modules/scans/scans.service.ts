import { Injectable } from '@nestjs/common';
import { ContactsService } from '../contacts/contacts.service';
import { RecordScanContactDto } from '../contacts/dto/record-scan-contact.dto';
import { EntitlementsService } from '../subscriptions/entitlements.service';

@Injectable()
export class ScansService {
  constructor(
    private readonly entitlementsService: EntitlementsService,
    private readonly contactsService: ContactsService,
  ) {}

  getQuota(userId: string) {
    return this.entitlementsService.getAiScanQuota(userId);
  }

  async recordScan(userId: string, payload?: RecordScanContactDto) {
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
}
