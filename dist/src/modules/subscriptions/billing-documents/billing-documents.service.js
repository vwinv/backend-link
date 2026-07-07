"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingDocumentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../prisma/prisma.service");
const billing_document_builder_1 = require("./billing-document.builder");
let BillingDocumentsService = class BillingDocumentsService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async renderQuoteHtml(userId, offerSlug, billingType) {
        const { user, offer, selectedBillingType } = await this.loadDocumentContext(userId, offerSlug, billingType);
        return this.buildDocumentHtml({
            kind: 'devis',
            documentNumber: this.buildDocumentNumber('DEV', userId),
            projectTitle: offer.title,
            issuedAt: new Date(),
            clientName: `${user.firstName} ${user.lastName}`.trim(),
            clientEmail: user.email,
            offer,
            selectedBillingType,
        });
    }
    async renderInvoiceHtml(userId) {
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                userId,
                status: {
                    in: [
                        client_1.SubscriptionStatus.TRIAL,
                        client_1.SubscriptionStatus.ACTIVE,
                        client_1.SubscriptionStatus.PAST_DUE,
                    ],
                },
            },
            include: {
                user: true,
                offer: {
                    include: {
                        prices: {
                            where: { isActive: true },
                            orderBy: [{ sortOrder: 'asc' }],
                        },
                    },
                },
                offerPrice: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!subscription?.user || !subscription.offer || !subscription.offerPrice) {
            throw new common_1.NotFoundException('Aucun abonnement actif pour générer une facture');
        }
        const offer = this.toOfferSnapshot(subscription.offer);
        const selectedBillingType = subscription.offerPrice.billingType;
        return this.buildDocumentHtml({
            kind: 'facture',
            documentNumber: this.buildDocumentNumber('FAC', subscription.id),
            projectTitle: subscription.offer.title,
            issuedAt: subscription.createdAt,
            paidAt: subscription.createdAt,
            clientName: `${subscription.user.firstName} ${subscription.user.lastName}`.trim(),
            clientEmail: subscription.user.email,
            offer,
            selectedBillingType,
        });
    }
    getQuotePublicPath(offerSlug, billingType) {
        return `/documents/devis/${offerSlug}/${billingType.toLowerCase()}`;
    }
    getInvoicePublicPath() {
        return '/documents/facture';
    }
    async loadDocumentContext(userId, offerSlug, billingType) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        const offerRecord = await this.prisma.premiumOffer.findFirst({
            where: { slug: offerSlug, isActive: true },
            include: {
                prices: {
                    where: { isActive: true },
                    orderBy: [{ sortOrder: 'asc' }],
                },
            },
        });
        if (!offerRecord) {
            throw new common_1.NotFoundException('Offre Premium introuvable');
        }
        const selectedBillingType = offerRecord.prices.find((price) => price.billingType === billingType)
            ?.billingType ?? billingType;
        return {
            user,
            offer: this.toOfferSnapshot(offerRecord),
            selectedBillingType,
        };
    }
    buildDocumentHtml(params) {
        const { lineItems, featureBlocks, priceRows } = (0, billing_document_builder_1.buildOfferSnapshotContent)(params.offer, params.selectedBillingType);
        const input = {
            kind: params.kind,
            documentNumber: params.documentNumber,
            projectTitle: params.projectTitle,
            issuedAt: params.issuedAt,
            paidAt: params.paidAt,
            clientName: params.clientName,
            clientEmail: params.clientEmail,
            companyName: this.configService.get('billing.companyName', 'DropOne'),
            companyEmail: this.configService.get('billing.companyEmail', 'contact@dropone.pro'),
            companyPhone: this.configService.get('billing.companyPhone', '+221 78 000 00 00'),
            sectionTitle: '1-Abonnement DropOne Premium',
            lineItems,
            featureBlocks,
            priceRows,
        };
        return (0, billing_document_builder_1.buildBillingDocumentHtml)(input);
    }
    toOfferSnapshot(offer) {
        return {
            title: offer.title,
            subtitle: offer.subtitle,
            audience: offer.audience,
            canCustomize: offer.canCustomize,
            maxTeamMembers: offer.maxTeamMembers,
            hasPortfolio: offer.hasPortfolio,
            maxAiScans: offer.maxAiScans,
            prices: offer.prices.map((price) => ({
                billingType: price.billingType,
                priceAmount: typeof price.priceAmount === 'number'
                    ? price.priceAmount
                    : Number(price.priceAmount),
                priceLabel: price.priceLabel,
                currency: price.currency,
            })),
        };
    }
    buildDocumentNumber(prefix, seed) {
        const numeric = [...seed]
            .map((char) => char.charCodeAt(0))
            .reduce((sum, code) => sum + code, 0);
        return `${String(numeric % 10000).padStart(4, '0')}`;
    }
};
exports.BillingDocumentsService = BillingDocumentsService;
exports.BillingDocumentsService = BillingDocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], BillingDocumentsService);
//# sourceMappingURL=billing-documents.service.js.map