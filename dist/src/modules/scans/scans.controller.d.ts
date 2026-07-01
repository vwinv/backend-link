import { RecordScanContactDto } from '../contacts/dto/record-scan-contact.dto';
import { ScansService } from './scans.service';
export declare class ScansController {
    private readonly scansService;
    constructor(scansService: ScansService);
    getQuota(user: {
        userId: string;
    }): Promise<import("../subscriptions/entitlements.types").AiScanQuota>;
    recordScan(user: {
        userId: string;
    }, payload?: RecordScanContactDto): Promise<{
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
