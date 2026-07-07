"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleWalletService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const passkit_generator_1 = require("passkit-generator");
const wallet_config_1 = require("./wallet.config");
let AppleWalletService = class AppleWalletService {
    walletConfig;
    constructor(walletConfig) {
        this.walletConfig = walletConfig;
    }
    async generatePass(card) {
        if (!this.walletConfig.isAppleConfigured()) {
            throw new common_1.BadRequestException('Apple Wallet n’est pas configuré côté serveur. Consultez WALLET_SETUP.md.');
        }
        const buffers = this.loadPassAssets();
        const certificates = {
            wwdr: fs.readFileSync(this.walletConfig.appleWwdrCertPath),
            signerCert: fs.readFileSync(this.walletConfig.appleSignerCertPath),
            signerKey: fs.readFileSync(this.walletConfig.appleSignerKeyPath),
            signerKeyPassphrase: this.walletConfig.appleSignerKeyPassphrase,
        };
        const fullName = `${card.firstName} ${card.lastName}`.trim();
        const subtitle = [card.jobTitle, card.company].filter(Boolean).join(' · ');
        const cardUrl = `${this.walletConfig.appPublicUrl}/cards/${card.slug}`;
        try {
            const pass = new passkit_generator_1.PKPass(buffers, certificates, {
                formatVersion: 1,
                passTypeIdentifier: this.walletConfig.applePassTypeId,
                teamIdentifier: this.walletConfig.appleTeamId,
                organizationName: 'DropOne',
                description: `Carte DropOne — ${fullName}`,
                serialNumber: card.id,
                logoText: 'DropOne',
                foregroundColor: 'rgb(255, 255, 255)',
                backgroundColor: 'rgb(13, 13, 13)',
                labelColor: 'rgb(154, 160, 172)',
            });
            pass.type = 'generic';
            pass.primaryFields.push({
                key: 'name',
                label: 'Nom',
                value: fullName,
            });
            if (subtitle) {
                pass.secondaryFields.push({
                    key: 'role',
                    label: 'Poste',
                    value: subtitle,
                });
            }
            if (card.email) {
                pass.auxiliaryFields.push({
                    key: 'email',
                    label: 'Email',
                    value: card.email,
                });
            }
            if (card.phone) {
                pass.auxiliaryFields.push({
                    key: 'phone',
                    label: 'Téléphone',
                    value: card.phone,
                });
            }
            pass.setBarcodes({
                format: 'PKBarcodeFormatQR',
                message: cardUrl,
                messageEncoding: 'iso-8859-1',
            });
            return pass.getAsBuffer();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue Apple Wallet';
            throw new common_1.InternalServerErrorException(`Impossible de générer le pass Apple Wallet : ${message}`);
        }
    }
    loadPassAssets() {
        const assetsDir = this.walletConfig.walletAssetsDir();
        const iconPath = path.join(assetsDir, 'icon.png');
        const logoPath = path.join(assetsDir, 'logo.png');
        if (!fs.existsSync(iconPath) || !fs.existsSync(logoPath)) {
            throw new common_1.BadRequestException('Images wallet manquantes dans backend-link/wallet-assets (icon.png, logo.png).');
        }
        return {
            'icon.png': fs.readFileSync(iconPath),
            'logo.png': fs.readFileSync(logoPath),
        };
    }
};
exports.AppleWalletService = AppleWalletService;
exports.AppleWalletService = AppleWalletService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [wallet_config_1.WalletConfig])
], AppleWalletService);
//# sourceMappingURL=apple-wallet.service.js.map