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
exports.PointsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const free_offer_constants_1 = require("../subscriptions/free-offer.constants");
const points_constants_1 = require("./points.constants");
let PointsService = class PointsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview(userId) {
        const [user, account, ledger, referralCount] = await Promise.all([
            this.ensureReferralCode(userId),
            this.ensureAccount(userId),
            this.prisma.pointsLedgerEntry.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 30,
            }),
            this.prisma.user.count({ where: { referredByUserId: userId } }),
        ]);
        return {
            referralCode: user.referralCode,
            balancePoints: (0, points_constants_1.tenthsToPoints)(account.balanceTenths),
            balanceTenths: account.balanceTenths,
            balanceFcfa: (0, points_constants_1.tenthsToFcfa)(account.balanceTenths),
            fcfaPerPoint: points_constants_1.POINTS_FCFA_PER_POINT,
            referralCount,
            visitRewardPoints: (0, points_constants_1.tenthsToPoints)(points_constants_1.CARD_VISIT_REWARD_TENTHS),
            referralSubscribeRewardPoints: (0, points_constants_1.tenthsToPoints)(points_constants_1.REFERRAL_SUBSCRIBE_REWARD_TENTHS),
            ledger: ledger.map((row) => ({
                id: row.id,
                amountPoints: (0, points_constants_1.tenthsToPoints)(row.amountTenths),
                reason: row.reason,
                productType: row.productType,
                productRef: row.productRef,
                createdAt: row.createdAt.toISOString(),
            })),
        };
    }
    async applyReferralCode(userId, dto) {
        const code = dto.code.trim().toUpperCase();
        const me = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                referredByUserId: true,
                referralCode: true,
                createdAt: true,
            },
        });
        if (!me)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        if (me.referredByUserId) {
            throw new common_1.BadRequestException('Un code de parrainage est déjà enregistré');
        }
        const ageMs = Date.now() - me.createdAt.getTime();
        if (ageMs > 24 * 60 * 60 * 1000) {
            throw new common_1.BadRequestException('Le code de parrainage ne peut être saisi qu’à la création du compte');
        }
        if (me.referralCode && me.referralCode === code) {
            throw new common_1.BadRequestException('Vous ne pouvez pas utiliser votre propre code');
        }
        const sponsor = await this.prisma.user.findFirst({
            where: { referralCode: code, isActive: true },
            select: { id: true, referralCode: true },
        });
        if (!sponsor) {
            throw new common_1.NotFoundException('Code de parrainage invalide');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { referredByUserId: sponsor.id },
        });
        return {
            ok: true,
            referralCode: sponsor.referralCode,
            message: 'Code de parrainage enregistré',
        };
    }
    async creditCardVisit(input) {
        if (input.viewerUserId &&
            input.viewerUserId === input.cardOwnerId) {
            return { credited: false };
        }
        const existing = await this.prisma.pointsLedgerEntry.findUnique({
            where: { cardViewId: input.cardViewId },
            select: { id: true },
        });
        if (existing)
            return { credited: false };
        if (input.viewerUserId) {
            const alreadyForUser = await this.prisma.pointsLedgerEntry.findFirst({
                where: {
                    userId: input.cardOwnerId,
                    reason: client_1.PointsLedgerReason.CARD_VISIT,
                    relatedUserId: input.viewerUserId,
                },
                select: { id: true },
            });
            if (alreadyForUser)
                return { credited: false };
        }
        else if (input.visitorKey) {
            const alreadyForKey = await this.prisma.pointsLedgerEntry.findFirst({
                where: {
                    userId: input.cardOwnerId,
                    reason: client_1.PointsLedgerReason.CARD_VISIT,
                    relatedUserId: null,
                    meta: {
                        path: ['visitorKey'],
                        equals: input.visitorKey,
                    },
                },
                select: { id: true },
            });
            if (alreadyForKey)
                return { credited: false };
        }
        else {
            return { credited: false };
        }
        try {
            await this.credit({
                userId: input.cardOwnerId,
                amountTenths: points_constants_1.CARD_VISIT_REWARD_TENTHS,
                reason: client_1.PointsLedgerReason.CARD_VISIT,
                relatedUserId: input.viewerUserId ?? undefined,
                cardViewId: input.cardViewId,
                meta: {
                    viewerUserId: input.viewerUserId ?? null,
                    visitorKey: input.visitorKey ?? null,
                },
            });
            return { credited: true };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                return { credited: false };
            }
            throw error;
        }
    }
    async creditReferralOnSubscribe(input) {
        if (input.offerSlug === free_offer_constants_1.FREE_OFFER_SLUG) {
            return { credited: false };
        }
        const subscriber = await this.prisma.user.findUnique({
            where: { id: input.subscriberUserId },
            select: { referredByUserId: true },
        });
        const sponsorId = subscriber?.referredByUserId;
        if (!sponsorId)
            return { credited: false };
        const already = await this.prisma.pointsLedgerEntry.findFirst({
            where: {
                reason: client_1.PointsLedgerReason.REFERRAL_SUBSCRIBE,
                relatedUserId: input.subscriberUserId,
            },
            select: { id: true },
        });
        if (already)
            return { credited: false };
        const bySub = await this.prisma.pointsLedgerEntry.findUnique({
            where: { subscriptionId: input.subscriptionId },
            select: { id: true },
        });
        if (bySub)
            return { credited: false };
        try {
            await this.credit({
                userId: sponsorId,
                amountTenths: points_constants_1.REFERRAL_SUBSCRIBE_REWARD_TENTHS,
                reason: client_1.PointsLedgerReason.REFERRAL_SUBSCRIBE,
                relatedUserId: input.subscriberUserId,
                subscriptionId: input.subscriptionId,
                meta: { offerSlug: input.offerSlug },
            });
            return { credited: true, sponsorId };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                return { credited: false };
            }
            throw error;
        }
    }
    async quoteProduct(dto) {
        if (dto.productType === client_1.PointsProductType.CARD_THEME) {
            throw new common_1.BadRequestException('Les thèmes payants arriveront bientôt. Les points pourront les acheter.');
        }
        if (dto.productType !== client_1.PointsProductType.SUBSCRIPTION) {
            throw new common_1.BadRequestException('Produit non supporté');
        }
        if (!dto.billingType) {
            throw new common_1.BadRequestException('billingType requis pour un abonnement');
        }
        return {
            productType: dto.productType,
            productRef: dto.productRef,
            billingType: dto.billingType,
            fcfaPerPoint: points_constants_1.POINTS_FCFA_PER_POINT,
        };
    }
    async debitForPurchase(input) {
        if (input.amountTenths <= 0) {
            throw new common_1.BadRequestException('Montant points invalide');
        }
        await this.ensureAccount(input.userId);
        return this.prisma.$transaction(async (tx) => {
            const account = await tx.userPointsAccount.findUnique({
                where: { userId: input.userId },
            });
            if (!account || account.balanceTenths < input.amountTenths) {
                throw new common_1.ForbiddenException('Solde de points insuffisant');
            }
            const updated = await tx.userPointsAccount.update({
                where: { userId: input.userId },
                data: { balanceTenths: { decrement: input.amountTenths } },
            });
            const entry = await tx.pointsLedgerEntry.create({
                data: {
                    userId: input.userId,
                    amountTenths: -input.amountTenths,
                    reason: client_1.PointsLedgerReason.PURCHASE,
                    productType: input.productType,
                    productRef: input.productRef,
                    subscriptionId: input.subscriptionId ?? null,
                    meta: (input.meta ?? undefined),
                },
            });
            return {
                balanceTenths: updated.balanceTenths,
                balancePoints: (0, points_constants_1.tenthsToPoints)(updated.balanceTenths),
                entryId: entry.id,
            };
        });
    }
    fcfaToRequiredTenths(amountFcfa) {
        return (0, points_constants_1.fcfaToTenths)(amountFcfa);
    }
    async creditAdjustment(input) {
        await this.credit({
            userId: input.userId,
            amountTenths: input.amountTenths,
            reason: client_1.PointsLedgerReason.ADJUSTMENT,
            meta: input.meta,
        });
    }
    async credit(input) {
        if (input.amountTenths === 0)
            return;
        await this.ensureAccount(input.userId);
        await this.prisma.$transaction(async (tx) => {
            await tx.userPointsAccount.update({
                where: { userId: input.userId },
                data: { balanceTenths: { increment: input.amountTenths } },
            });
            await tx.pointsLedgerEntry.create({
                data: {
                    userId: input.userId,
                    amountTenths: input.amountTenths,
                    reason: input.reason,
                    productType: input.productType ?? null,
                    productRef: input.productRef ?? null,
                    relatedUserId: input.relatedUserId ?? null,
                    cardViewId: input.cardViewId ?? null,
                    subscriptionId: input.subscriptionId ?? null,
                    meta: (input.meta ?? undefined),
                },
            });
        });
    }
    async ensureAccount(userId) {
        return this.prisma.userPointsAccount.upsert({
            where: { userId },
            create: { userId, balanceTenths: 0 },
            update: {},
        });
    }
    async ensureReferralCode(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, referralCode: true, firstName: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        if (user.referralCode?.startsWith('DROP-'))
            return user;
        for (let attempt = 0; attempt < 8; attempt++) {
            const code = this.generateCode();
            try {
                return await this.prisma.user.update({
                    where: { id: userId },
                    data: { referralCode: code },
                    select: { id: true, referralCode: true, firstName: true },
                });
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                    error.code === 'P2002') {
                    continue;
                }
                throw error;
            }
        }
        throw new common_1.BadRequestException('Impossible de générer un code de parrainage');
    }
    generateCode() {
        const suffix = (0, crypto_1.randomBytes)(3).toString('hex').toUpperCase();
        return `DROP-${suffix}`;
    }
};
exports.PointsService = PointsService;
exports.PointsService = PointsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PointsService);
//# sourceMappingURL=points.service.js.map