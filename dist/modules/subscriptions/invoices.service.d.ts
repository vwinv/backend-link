import { OnModuleInit } from '@nestjs/common';
import { OfferAudience, OfferBillingType, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export type InvoiceLine = {
    label: string;
    amount: number;
    seats?: number | null;
    kind: 'offer' | 'extra_seats' | 'seat_upgrade';
};
export declare class InvoicesService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    generateDueUpcomingInvoicesCron(): Promise<void>;
    expireOverdueSubscriptionsCron(): Promise<void>;
    expireOverdueSubscriptions(): Promise<number>;
    generateDueUpcomingInvoices(): Promise<number>;
    ensureUpcomingForOwner(ownerId: string, teamId?: string | null): Promise<{
        number: string;
        id: string;
        userId: string;
        teamId: string | null;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        createdAt: Date;
        updatedAt: Date;
        billingType: string | null;
        currency: string;
        providerInvoiceId: string | null;
        subscriptionId: string | null;
        amount: Prisma.Decimal;
        description: string | null;
        offerSlug: string | null;
        seats: number | null;
        provider: string | null;
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
