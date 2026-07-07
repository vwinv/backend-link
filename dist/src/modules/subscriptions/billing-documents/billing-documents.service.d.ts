import { ConfigService } from '@nestjs/config';
import { OfferBillingType } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class BillingDocumentsService {
    private readonly prisma;
    private readonly configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    renderQuoteHtml(userId: string, offerSlug: string, billingType: OfferBillingType): Promise<string>;
    renderInvoiceHtml(userId: string): Promise<string>;
    getQuotePublicPath(offerSlug: string, billingType: OfferBillingType): string;
    getInvoicePublicPath(): string;
    private loadDocumentContext;
    private buildDocumentHtml;
    private toOfferSnapshot;
    private buildDocumentNumber;
}
