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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const apple_wallet_service_1 = require("./apple-wallet.service");
const google_wallet_service_1 = require("./google-wallet.service");
let WalletService = class WalletService {
    prisma;
    appleWalletService;
    googleWalletService;
    constructor(prisma, appleWalletService, googleWalletService) {
        this.prisma = prisma;
        this.appleWalletService = appleWalletService;
        this.googleWalletService = googleWalletService;
    }
    async addCardToWallet(userId, cardId, dto) {
        const card = await this.prisma.businessCard.findFirst({
            where: { id: cardId, ownerId: userId },
        });
        if (!card) {
            throw new common_1.NotFoundException('Carte introuvable');
        }
        if (dto.walletType === client_1.WalletType.APPLE_WALLET) {
            const passBuffer = await this.appleWalletService.generatePass(card);
            const passId = card.id;
            const savedCard = await this.upsertSavedCard(userId, cardId, client_1.WalletType.APPLE_WALLET, passId);
            return {
                walletType: client_1.WalletType.APPLE_WALLET,
                savedCardId: savedCard.id,
                passBase64: passBuffer.toString('base64'),
            };
        }
        const saveUrl = this.googleWalletService.generateSaveUrl(card);
        const passId = this.googleWalletService.getPassId(card);
        const savedCard = await this.upsertSavedCard(userId, cardId, client_1.WalletType.GOOGLE_WALLET, passId);
        return {
            walletType: client_1.WalletType.GOOGLE_WALLET,
            savedCardId: savedCard.id,
            saveUrl,
        };
    }
    async findAll(userId) {
        return this.prisma.savedCard.findMany({
            where: { userId },
            include: {
                card: {
                    select: {
                        id: true,
                        slug: true,
                        firstName: true,
                        lastName: true,
                        jobTitle: true,
                        company: true,
                    },
                },
            },
            orderBy: { savedAt: 'desc' },
        });
    }
    async remove(userId, id) {
        const savedCard = await this.prisma.savedCard.findFirst({
            where: { id, userId },
        });
        if (!savedCard) {
            throw new common_1.NotFoundException('Carte wallet introuvable');
        }
        await this.prisma.savedCard.delete({ where: { id } });
        return { message: 'Carte retirée du wallet' };
    }
    upsertSavedCard(userId, cardId, walletType, passId) {
        return this.prisma.savedCard.upsert({
            where: {
                userId_cardId_walletType: {
                    userId,
                    cardId,
                    walletType,
                },
            },
            create: {
                userId,
                cardId,
                walletType,
                passId,
            },
            update: {
                passId,
                savedAt: new Date(),
            },
        });
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        apple_wallet_service_1.AppleWalletService,
        google_wallet_service_1.GoogleWalletService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map