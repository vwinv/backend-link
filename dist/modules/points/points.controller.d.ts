import { ApplyReferralCodeDto } from './dto/apply-referral-code.dto';
import { RedeemPointsDto } from './dto/redeem-points.dto';
import { PointsService } from './points.service';
import { PointsRedeemService } from './points-redeem.service';
export declare class PointsController {
    private readonly pointsService;
    private readonly pointsRedeemService;
    constructor(pointsService: PointsService, pointsRedeemService: PointsRedeemService);
    getMe(user: {
        userId: string;
    }): Promise<{
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
    applyCode(user: {
        userId: string;
    }, dto: ApplyReferralCodeDto): Promise<{
        ok: boolean;
        referralCode: string | null;
        message: string;
    }>;
    redeem(user: {
        userId: string;
    }, dto: RedeemPointsDto): Promise<{
        ok: boolean;
        productType: "SUBSCRIPTION";
        productRef: string;
        pointsSpent: number;
        amountFcfa: number;
        balancePoints: number;
        subscriptionId: string;
    }>;
}
