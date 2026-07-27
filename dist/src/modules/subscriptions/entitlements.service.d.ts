import { PrismaService } from '../../prisma/prisma.service';
import { AiScanQuota, TeamSeatsQuota, UserEntitlements } from './entitlements.types';
export declare class EntitlementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUserEntitlements(userId: string): Promise<UserEntitlements>;
    getEntitlementsForCard(userId: string, cardId: string): Promise<UserEntitlements>;
    assertCanCustomize(userId: string, cardId: string): Promise<void>;
    assertCanUseWallet(userId: string, cardId: string): Promise<void>;
    assertHasAnalytics(userId: string, cardId: string): Promise<void>;
    assertHasVisitorInsights(userId: string, cardId: string): Promise<void>;
    assertCanEditSocialLinks(userId: string, cardId: string): Promise<void>;
    assertHasPortfolio(userId: string): Promise<void>;
    assertHasTeamAccess(userId: string): Promise<void>;
    getTeamSeatsQuota(userId: string, teamId: string): Promise<TeamSeatsQuota>;
    assertCanAddTeamMember(userId: string, teamId: string): Promise<void>;
    getAiScanQuota(userId: string): Promise<AiScanQuota>;
    recordAiScan(userId: string): Promise<{
        scanId: string;
        quota: AiScanQuota;
    }>;
    private hasTeamAccess;
    private findActiveSubscription;
    private mapOfferToEntitlements;
    private getUsagePeriodStart;
    private assertTeamAccess;
    private assertOwnerOrAdmin;
}
