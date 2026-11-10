import { OfferBillingType, PointsProductType } from '@prisma/client';
export declare class RedeemPointsDto {
    productType: PointsProductType;
    productRef: string;
    billingType?: OfferBillingType;
    teamId?: string;
    seats?: number;
}
