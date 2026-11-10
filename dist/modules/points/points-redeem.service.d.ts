import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { RedeemPointsDto } from './dto/redeem-points.dto';
import { PointsService } from './points.service';
export declare class PointsRedeemService {
    private readonly pointsService;
    private readonly subscriptionsService;
    constructor(pointsService: PointsService, subscriptionsService: SubscriptionsService);
    redeem(userId: string, dto: RedeemPointsDto): Promise<{
        ok: boolean;
        productType: "SUBSCRIPTION";
        productRef: string;
        pointsSpent: number;
        amountFcfa: number;
        balancePoints: number;
        subscriptionId: string;
    }>;
}
