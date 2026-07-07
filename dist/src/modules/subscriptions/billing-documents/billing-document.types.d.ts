import type { OfferAudience, OfferBillingType } from '@prisma/client';
export type BillingDocumentKind = 'devis' | 'facture';
export type BillingLineItem = {
    title: string;
    bullets: string[];
    duration: string;
    priceLabel: string;
    variant: 'light' | 'brand';
};
export type BillingFeatureBlock = {
    title: string;
    bullets: string[];
    variant: 'light' | 'brand';
};
export type BillingPriceRow = {
    label: string;
    amountLabel: string;
    variant: 'light' | 'brand';
    highlighted?: boolean;
};
export type BillingDocumentInput = {
    kind: BillingDocumentKind;
    documentNumber: string;
    projectTitle: string;
    issuedAt: Date;
    clientName: string;
    clientEmail?: string | null;
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    sectionTitle: string;
    lineItems: BillingLineItem[];
    featureBlocks: BillingFeatureBlock[];
    priceRows: BillingPriceRow[];
    paidAt?: Date | null;
};
export type OfferSnapshot = {
    title: string;
    subtitle?: string | null;
    audience: OfferAudience;
    canCustomize: boolean;
    maxTeamMembers: number;
    hasPortfolio: boolean;
    maxAiScans: number;
    prices: Array<{
        billingType: OfferBillingType;
        priceAmount: number;
        priceLabel?: string | null;
        currency: string;
    }>;
};
