import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OfferBillingType } from '@prisma/client';
import { type AppleIapProductRef } from './apple-iap-products';
export type VerifiedAppleTransaction = {
    productId: string;
    bundleId: string;
    originalTransactionId: string;
    transactionId: string;
    expiresAt: Date | null;
    environment: string;
    offerSlug: string;
    offerSlugs: string[];
    billingType: OfferBillingType;
};
export declare class AppleIapService implements OnModuleInit {
    private readonly config;
    private readonly logger;
    private productMap;
    private rootCAs;
    private bundleId;
    constructor(config: ConfigService);
    onModuleInit(): void;
    productIdFor(offerSlug: string, billingType: OfferBillingType): string | null;
    refFromProductId(productId: string): AppleIapProductRef | null;
    refsFromProductId(productId: string): AppleIapProductRef[];
    verifyTransaction(signedTransaction: string): Promise<VerifiedAppleTransaction>;
    private toVerified;
    private environmentsToTry;
    private parseAppAppleId;
    private loadRootCertificates;
}
