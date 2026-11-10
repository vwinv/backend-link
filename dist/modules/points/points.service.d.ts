import { PointsProductType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplyReferralCodeDto } from './dto/apply-referral-code.dto';
import { RedeemPointsDto } from './dto/redeem-points.dto';
export declare class PointsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOverview(userId: string): Promise<{
        referralCode: string | null;
        balancePoints: number;
        balanceTenths: number;
        balanceFcfa: number;
        fcfaPerPoint: number;
        referralCount: number;
        visitRewardPoints: number;
        referralSubscribeRewardPoints: number;
        ledger: {
            id: string;
            amountPoints: number;
            reason: import("@prisma/client").$Enums.PointsLedgerReason;
            productType: import("@prisma/client").$Enums.PointsProductType | null;
            productRef: string | null;
            createdAt: string;
        }[];
    }>;
    applyReferralCode(userId: string, dto: ApplyReferralCodeDto): Promise<{
        ok: boolean;
        referralCode: string | null;
        message: string;
    }>;
    creditCardVisit(input: {
        cardOwnerId: string;
        cardViewId: string;
        viewerUserId?: string | null;
        visitorKey?: string | null;
    }): Promise<{
        credited: boolean;
    }>;
    creditReferralOnSubscribe(input: {
        subscriberUserId: string;
        subscriptionId: string;
        offerSlug: string;
    }): Promise<{
        credited: boolean;
        sponsorId?: undefined;
    } | {
        credited: boolean;
        sponsorId: string;
    }>;
    quoteProduct(dto: RedeemPointsDto): Promise<{
        productType: "SUBSCRIPTION";
        productRef: string;
        billingType: import("@prisma/client").$Enums.OfferBillingType;
        fcfaPerPoint: number;
    }>;
    debitForPurchase(input: {
        userId: string;
        amountTenths: number;
        productType: PointsProductType;
        productRef: string;
        subscriptionId?: string;
        meta?: Record<string, unknown>;
    }): Promise<{
        balanceTenths: number;
        balancePoints: number;
        entryId: string;
    }>;
    fcfaToRequiredTenths(amountFcfa: number): number;
    creditAdjustment(input: {
        userId: string;
        amountTenths: number;
        meta?: Record<string, unknown>;
    }): Promise<void>;
    private credit;
    private ensureAccount;
    private ensureReferralCode;
    private generateCode;
}
