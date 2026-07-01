import { PrismaService } from '../../prisma/prisma.service';
import { AiScanQuota, TeamSeatsQuota, UserEntitlements } from './entitlements.types';
export declare class EntitlementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUserEntitlements(userId: string): Promise<UserEntitlements>;
    getTeamSeatsQuota(userId: string, teamId: string): Promise<TeamSeatsQuota>;
    assertCanAddTeamMember(userId: string, teamId: string): Promise<void>;
    getAiScanQuota(userId: string): Promise<AiScanQuota>;
    recordAiScan(userId: string): Promise<{
        scanId: string;
        quota: AiScanQuota;
    }>;
    private findActiveSubscription;
    private mapOfferToEntitlements;
    private getUsagePeriodStart;
    private assertTeamAccess;
    private assertOwner;
}
