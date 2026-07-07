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
exports.GoogleWalletService = void 0;
const common_1 = require("@nestjs/common");
const jwt = __importStar(require("jsonwebtoken"));
const wallet_config_1 = require("./wallet.config");
let GoogleWalletService = class GoogleWalletService {
    walletConfig;
    constructor(walletConfig) {
        this.walletConfig = walletConfig;
    }
    generateSaveUrl(card) {
        if (!this.walletConfig.isGoogleConfigured()) {
            throw new common_1.BadRequestException('Google Wallet n’est pas configuré côté serveur. Consultez WALLET_SETUP.md.');
        }
        const account = this.walletConfig.loadGoogleServiceAccount();
        if (!account.client_email || !account.private_key) {
            throw new common_1.BadRequestException('Le compte de service Google Wallet est invalide.');
        }
        const issuerId = this.walletConfig.googleIssuerId;
        const classId = `${issuerId}.${this.walletConfig.googleClassSuffix}`;
        const objectId = `${issuerId}.card_${card.id}`;
        const fullName = `${card.firstName} ${card.lastName}`.trim();
        const subtitle = [card.jobTitle, card.company].filter(Boolean).join(' · ');
        const cardUrl = `${this.walletConfig.appPublicUrl}/cards/${card.slug}`;
        const genericObject = {
            id: objectId,
            classId,
            genericType: 'GENERIC_TYPE_UNSPECIFIED',
            hexBackgroundColor: '#0D0D0D',
            cardTitle: {
                defaultValue: {
                    language: 'fr',
                    value: 'DropOne',
                },
            },
            header: {
                defaultValue: {
                    language: 'fr',
                    value: fullName,
                },
            },
            ...(subtitle
                ? {
                    subheader: {
                        defaultValue: {
                            language: 'fr',
                            value: subtitle,
                        },
                    },
                }
                : {}),
            barcode: {
                type: 'QR_CODE',
                value: cardUrl,
            },
            textModulesData: [
                ...(card.email
                    ? [
                        {
                            id: 'email',
                            header: 'Email',
                            body: card.email,
                        },
                    ]
                    : []),
                ...(card.phone
                    ? [
                        {
                            id: 'phone',
                            header: 'Téléphone',
                            body: card.phone,
                        },
                    ]
                    : []),
            ],
        };
        try {
            const token = jwt.sign({
                iss: account.client_email,
                aud: 'google',
                origins: this.walletConfig.googleOrigins,
                typ: 'savetowallet',
                payload: {
                    genericObjects: [genericObject],
                },
            }, account.private_key, { algorithm: 'RS256' });
            return `https://pay.google.com/gp/v/save/${token}`;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue Google Wallet';
            throw new common_1.InternalServerErrorException(`Impossible de générer le lien Google Wallet : ${message}`);
        }
    }
    getPassId(card) {
        return `${this.walletConfig.googleIssuerId}.card_${card.id}`;
    }
};
exports.GoogleWalletService = GoogleWalletService;
exports.GoogleWalletService = GoogleWalletService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [wallet_config_1.WalletConfig])
], GoogleWalletService);
//# sourceMappingURL=google-wallet.service.js.map