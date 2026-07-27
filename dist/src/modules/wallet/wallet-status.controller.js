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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletStatusController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const apple_wallet_service_1 = require("./apple-wallet.service");
const wallet_config_1 = require("./wallet.config");
let WalletStatusController = class WalletStatusController {
    walletConfig;
    appleWalletService;
    constructor(walletConfig, appleWalletService) {
        this.walletConfig = walletConfig;
        this.appleWalletService = appleWalletService;
    }
    status() {
        return this.walletConfig.describe();
    }
    selfTest() {
        return this.appleWalletService.selfTest();
    }
    async selfTestPkpass(res) {
        const buffer = await this.appleWalletService.selfTestBuffer();
        res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
        res.setHeader('Content-Disposition', 'inline; filename="dropone-selftest.pkpass"');
        res.setHeader('Content-Length', buffer.length);
        res.send(buffer);
    }
};
exports.WalletStatusController = WalletStatusController;
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Diagnostic : état de configuration du wallet (aucun secret exposé)',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WalletStatusController.prototype, "status", null);
__decorate([
    (0, common_1.Get)('status/selftest'),
    (0, swagger_1.ApiOperation)({
        summary: 'Diagnostic : génère un pass Apple de test et renvoie sa taille/magic',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WalletStatusController.prototype, "selfTest", null);
__decorate([
    (0, common_1.Get)('status/selftest.pkpass'),
    (0, swagger_1.ApiOperation)({
        summary: 'Diagnostic : télécharge le pass Apple de test en binaire brut',
    }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletStatusController.prototype, "selfTestPkpass", null);
exports.WalletStatusController = WalletStatusController = __decorate([
    (0, swagger_1.ApiTags)('Wallet'),
    (0, common_1.Controller)('wallet'),
    __metadata("design:paramtypes", [wallet_config_1.WalletConfig,
        apple_wallet_service_1.AppleWalletService])
], WalletStatusController);
//# sourceMappingURL=wallet-status.controller.js.map