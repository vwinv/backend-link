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
exports.ScansService = void 0;
const common_1 = require("@nestjs/common");
const contacts_service_1 = require("../contacts/contacts.service");
const entitlements_service_1 = require("../subscriptions/entitlements.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let ScansService = class ScansService {
    entitlementsService;
    contactsService;
    prisma;
    constructor(entitlementsService, contactsService, prisma) {
        this.entitlementsService = entitlementsService;
        this.contactsService = contactsService;
        this.prisma = prisma;
    }
    getQuota(userId) {
        return this.entitlementsService.getAiScanQuota(userId);
    }
    async recordScan(userId, payload) {
        await this.assertNotScanningOwnCard(userId, payload);
        const result = await this.entitlementsService.recordAiScan(userId);
        const contact = await this.contactsService.createFromScan(userId, result.scanId, payload);
        return {
            scanId: result.scanId,
            contact,
            quota: result.quota,
        };
    }
    async assertNotScanningOwnCard(userId, payload) {
        const cardSlug = payload?.cardSlug?.trim().toLowerCase();
        if (!cardSlug) {
            return;
        }
        const ownCard = await this.prisma.businessCard.findFirst({
            where: {
                slug: cardSlug,
                ownerId: userId,
                isActive: true,
            },
            select: { id: true },
        });
        if (ownCard) {
            throw new common_1.BadRequestException('Vous ne pouvez pas scanner votre propre carte DropOne');
        }
    }
};
exports.ScansService = ScansService;
exports.ScansService = ScansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [entitlements_service_1.EntitlementsService,
        contacts_service_1.ContactsService,
        prisma_service_1.PrismaService])
], ScansService);
//# sourceMappingURL=scans.service.js.map