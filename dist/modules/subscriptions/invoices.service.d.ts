import { OfferAudience, OfferBillingType, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export type InvoiceLine = {
    label: string;
    amount: number;
    seats?: number | null;
    kind: 'offer' | 'extra_seats' | 'seat_upgrade';
};
export declare class InvoicesService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generateDueUpcomingInvoicesCron(): Promise<void>;
    generateDueUpcomingInvoices(): Promise<number>;
    ensureUpcomingForOwner(ownerId: string, teamId?: string | null): Promise<{
        number: string;
        id: string;
        description: string | null;
        provider: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        teamId: string | null;
        billingType: string | null;
        currency: string;
        offerSlug: string | null;
        seats: number | null;
        providerInvoiceId: string | null;
        subscriptionId: string | null;
        amount: Prisma.Decimal;
        lines: Prisma.JsonValue;
        dueAt: Date | null;
        paidAt: Date | null;
    } | null>;
    refreshPendingRenewal(subscriptionId: string): Promise<void>;
    buildRenewalBreakdown(input: {
        purchasedSeats: number | null;
        offer: {
            title: string;
            slug: string;
            audience: OfferAudience;
            maxTeamMembers: number;
            minSeats: number;
        };
        offerPrice: {
            billingType: OfferBillingType;
            priceAmount: {
                toNumber?: () => number;
            } | number;
            pricePerSeat: {
                toNumber?: () => number;
            } | number | null;
            currency: string;
        };
    }): {
        amount: number;
        seats: number;
        lines: InvoiceLine[];
        description: string;
    } | null;
    private maybeCreateUpcomingInvoice;
    toNumber(value: {
        toNumber?: () => number;
    } | number | null | undefined): number;
    generateInvoiceNumber(): string;
    settlePendingInvoices(input: {
        userId: string;
        teamId?: string | null;
        paidAmount?: number | null;
        paidProviderInvoiceId?: string | null;
    }): Promise<void>;
}
