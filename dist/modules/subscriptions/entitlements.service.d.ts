import { ConfigService } from '@nestjs/config';
import { CardKind } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AiScanQuota, ShareQuota, TeamSeatsQuota, UserEntitlements } from './entitlements.types';
export declare class EntitlementsService {
    private readonly prisma;
    private readonly configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    private get freeMaxSharesFallback();
    private isAppleReviewFullAccessEnabled;
    getUserEntitlements(userId: string): Promise<UserEntitlements>;
    private getFreeEntitlements;
    getEntitlementsForCard(userId: string, cardId: string): Promise<UserEntitlements>;
    private requireTeamOffer;
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
    getShareQuota(userId: string): Promise<ShareQuota>;
    assertCanShare(userId: string): Promise<ShareQuota>;
    assertCanShareCard(userId: string, cardId: string): Promise<ShareQuota>;
    hasTeamAccess(entitlements: UserEntitlements): boolean;
    isTeamCardCoveredByValidOffer(card: {
        kind: CardKind;
        teamId: string | null;
    }): Promise<boolean>;
    isOfferCardUnlocked(userId: string, cardId: string): Promise<boolean>;
    private findActiveSubscription;
    private mapOfferToEntitlements;
    private getCurrentMonthStart;
    private assertTeamAccess;
    private assertOwnerOrAdmin;
}
