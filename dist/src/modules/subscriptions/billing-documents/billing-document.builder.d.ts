import type { BillingDocumentInput, BillingFeatureBlock, BillingLineItem, BillingPriceRow, OfferSnapshot } from './billing-document.types';
import { OfferBillingType } from '@prisma/client';
export declare function buildOfferSnapshotContent(offer: OfferSnapshot, selectedBillingType: OfferBillingType): {
    lineItems: BillingLineItem[];
    featureBlocks: BillingFeatureBlock[];
    priceRows: BillingPriceRow[];
};
export declare function buildBillingDocumentHtml(input: BillingDocumentInput): string;
