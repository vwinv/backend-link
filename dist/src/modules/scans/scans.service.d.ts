import { ContactsService } from '../contacts/contacts.service';
import { RecordScanContactDto } from '../contacts/dto/record-scan-contact.dto';
import { EntitlementsService } from '../subscriptions/entitlements.service';
export declare class ScansService {
    private readonly entitlementsService;
    private readonly contactsService;
    constructor(entitlementsService: EntitlementsService, contactsService: ContactsService);
    getQuota(userId: string): Promise<import("../subscriptions/entitlements.types").AiScanQuota>;
    recordScan(userId: string, payload?: RecordScanContactDto): Promise<{
        scanId: string;
        contact: {
            id: string;
            source: import(".prisma/client").$Enums.ContactSource;
            fullName: string;
            initials: string;
            subtitle: string;
            email: string | null;
            phone: string | null;
            jobTitle: string | null;
            company: string | null;
            linkedCardId: string | null;
            avatarColor: number;
            addedAgo: string;
            sharedAgo: string;
            createdAt: string;
        };
        quota: import("../subscriptions/entitlements.types").AiScanQuota;
    }>;
}
