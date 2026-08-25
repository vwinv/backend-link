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
var GoogleWalletService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleWalletService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const google_auth_library_1 = require("google-auth-library");
const jwt = __importStar(require("jsonwebtoken"));
const wallet_config_1 = require("./wallet.config");
let GoogleWalletService = GoogleWalletService_1 = class GoogleWalletService {
    walletConfig;
    logger = new common_1.Logger(GoogleWalletService_1.name);
    accessTokenCache = null;
    constructor(walletConfig) {
        this.walletConfig = walletConfig;
    }
    onModuleInit() {
        if (this.walletConfig.isGoogleConfigured()) {
            this.logger.log('Google Wallet configuré');
            return;
        }
        const status = this.walletConfig.describe().google;
        this.logger.warn(`Google Wallet non configuré (issuerId=${status.issuerIdSet ? 'ok' : 'manquant'}, compte de service=${status.serviceAccountJsonSet || status.serviceAccountExists ? 'ok' : 'manquant'})`);
    }
    get classSuffix() {
        const suffix = this.walletConfig.googleClassSuffix?.trim();
        if (!suffix || suffix === 'link_business_card') {
            return 'dropone_card_v2';
        }
        return suffix;
    }
    async generateSaveUrl(card) {
        if (!this.walletConfig.isGoogleConfigured()) {
            const google = this.walletConfig.describe().google;
            const missing = [];
            if (!google.issuerIdSet)
                missing.push('GOOGLE_WALLET_ISSUER_ID');
            if (!google.serviceAccountJsonSet && !google.serviceAccountExists) {
                missing.push('GOOGLE_WALLET_SERVICE_ACCOUNT_PATH ou GOOGLE_WALLET_SERVICE_ACCOUNT_JSON');
            }
            throw new common_1.BadRequestException(`Google Wallet n’est pas configuré côté serveur (${missing.join(', ')}). Consultez WALLET_SETUP.md.`);
        }
        const account = this.walletConfig.loadGoogleServiceAccount();
        if (!account.client_email || !account.private_key) {
            throw new common_1.BadRequestException('Le compte de service Google Wallet est invalide.');
        }
        const issuerId = this.walletConfig.googleIssuerId.trim();
        if (!/^\d+$/.test(issuerId)) {
            throw new common_1.BadRequestException('GOOGLE_WALLET_ISSUER_ID est invalide (attendu : identifiant numérique de la Wallet Console).');
        }
        const classId = `${issuerId}.${this.classSuffix}`;
        const objectId = `${issuerId}.card_${this.safeId(card.id)}`;
        const genericObject = this.buildGenericObject(card, classId, objectId);
        await this.ensureGenericClass(account, classId);
        const objectReady = await this.upsertGenericObject(account, objectId, genericObject);
        try {
            const token = jwt.sign({
                iss: account.client_email,
                aud: 'google',
                typ: 'savetowallet',
                iat: Math.floor(Date.now() / 1000),
                origins: this.resolveOrigins(),
                payload: objectReady
                    ? { genericObjects: [{ id: objectId, classId }] }
                    : {
                        genericClasses: [{ id: classId }],
                        genericObjects: [genericObject],
                    },
            }, account.private_key, { algorithm: 'RS256' });
            return {
                saveJwt: token,
                saveUrl: `https://pay.google.com/gp/v/save/${token}`,
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue Google Wallet';
            throw new common_1.InternalServerErrorException(`Impossible de générer le lien Google Wallet : ${message}`);
        }
    }
    getPassId(card) {
        return `${this.walletConfig.googleIssuerId.trim()}.card_${this.safeId(card.id)}`;
    }
    buildGenericObject(card, classId, objectId) {
        const fullName = this.clip(`${card.firstName} ${card.lastName}`.trim(), 32);
        const subtitle = this.clip([card.jobTitle, card.company].filter(Boolean).join(' - '), 32);
        const cardUrl = `${this.walletConfig.appPublicUrl}/cards/${card.slug}`;
        const textModulesData = this.buildTextModules(card, fullName);
        const genericObject = {
            id: objectId,
            classId,
            state: 'ACTIVE',
            hexBackgroundColor: '#0D0D0D',
            cardTitle: {
                defaultValue: { language: 'fr', value: 'DropOne' },
            },
            header: {
                defaultValue: { language: 'fr', value: fullName || 'DropOne' },
            },
            barcode: {
                type: 'QR_CODE',
                value: cardUrl,
            },
            linksModuleData: {
                uris: [
                    {
                        uri: cardUrl,
                        description: 'Voir la carte',
                        id: 'card',
                    },
                ],
            },
            textModulesData,
        };
        if (subtitle) {
            genericObject.subheader = {
                defaultValue: { language: 'fr', value: subtitle },
            };
        }
        return genericObject;
    }
    buildTextModules(card, fullName) {
        const modules = [
            {
                id: 'name',
                header: 'Nom',
                body: fullName || 'DropOne',
            },
        ];
        if (card.email?.trim()) {
            modules.push({ id: 'email', header: 'Email', body: card.email.trim() });
        }
        if (card.phone?.trim()) {
            modules.push({
                id: 'phone',
                header: 'Telephone',
                body: card.phone.trim(),
            });
        }
        if (card.kind !== client_1.CardKind.PERSONAL && card.address?.trim()) {
            modules.push({
                id: 'address',
                header: 'Adresse',
                body: card.address.trim(),
            });
        }
        return modules;
    }
    resolveOrigins() {
        const origins = new Set();
        for (const value of [
            ...this.walletConfig.googleOrigins,
            this.walletConfig.appPublicUrl,
            'https://dropone.pro',
            'https://api.dropone.pro',
        ]) {
            try {
                const url = new URL(value.includes('://') ? value : `https://${value}`);
                if (url.protocol === 'http:' || url.protocol === 'https:') {
                    origins.add(url.origin);
                }
            }
            catch {
            }
        }
        return [...origins];
    }
    clip(value, max) {
        const trimmed = value.trim();
        if (trimmed.length <= max)
            return trimmed;
        return `${trimmed.slice(0, max - 1).trimEnd()}...`;
    }
    safeId(value) {
        return value.replace(/[^A-Za-z0-9._-]/g, '_');
    }
    async ensureGenericClass(account, classId) {
        const existing = await this.walletRequest(account, 'GET', `/genericClass/${classId}`);
        if (existing.status === 200)
            return;
        if (existing.status !== 404) {
            this.throwWalletApiError('lecture de la classe', existing);
        }
        const created = await this.walletRequest(account, 'POST', '/genericClass', { id: classId });
        if (created.status !== 200 && created.status !== 201) {
            this.throwWalletApiError('création de la classe', created);
        }
    }
    async upsertGenericObject(account, objectId, genericObject) {
        try {
            const existing = await this.walletRequest(account, 'GET', `/genericObject/${objectId}`);
            if (existing.status === 200) {
                const updated = await this.walletRequest(account, 'PUT', `/genericObject/${objectId}`, genericObject);
                if (updated.status !== 200) {
                    this.logger.warn(`Mise à jour objet Google Wallet ${updated.status}: ${updated.body.slice(0, 300)}`);
                }
                return updated.status === 200;
            }
            if (existing.status !== 404) {
                this.throwWalletApiError('lecture de l’objet', existing);
            }
            const created = await this.walletRequest(account, 'POST', '/genericObject', genericObject);
            if (created.status !== 200 && created.status !== 201) {
                this.throwWalletApiError('création de l’objet', created);
            }
            return true;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            this.logger.warn(`Objet Google Wallet non préparé (${error instanceof Error ? error.message : 'erreur inconnue'}). JWT complet en secours.`);
            return false;
        }
    }
    async walletRequest(account, method, path, body) {
        const token = await this.getAccessToken(account);
        const response = await fetch(`https://walletobjects.googleapis.com/walletobjects/v1${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        return {
            status: response.status,
            body: await response.text(),
        };
    }
    async getAccessToken(account) {
        if (this.accessTokenCache &&
            this.accessTokenCache.expiresAt > Date.now() + 60_000) {
            return this.accessTokenCache.token;
        }
        const client = new google_auth_library_1.JWT({
            email: account.client_email,
            key: account.private_key,
            scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
        });
        const { token } = await client.getAccessToken();
        if (!token) {
            throw new common_1.BadRequestException('Impossible d’obtenir un jeton Google Wallet. Vérifiez le compte de service.');
        }
        this.accessTokenCache = {
            token,
            expiresAt: Date.now() + 50 * 60 * 1000,
        };
        return token;
    }
    throwWalletApiError(action, result) {
        const snippet = result.body.replace(/\s+/g, ' ').slice(0, 280);
        this.logger.error(`Google Wallet ${action} ${result.status}: ${snippet}`);
        if (result.status === 403) {
            throw new common_1.BadRequestException('Le compte de service n’a pas accès à Google Wallet. Dans la Wallet Console, ajoutez l’email du compte de service (Utilisateurs) avec le rôle Développeur ou Admin, puis réessayez.');
        }
        if (result.status === 401) {
            throw new common_1.BadRequestException('Authentification Google Wallet refusée. Vérifiez le JSON du compte de service sur le serveur.');
        }
        throw new common_1.BadRequestException(`Google Wallet a refusé ${action} (HTTP ${result.status}). ${snippet || 'Sans détail.'}`);
    }
};
exports.GoogleWalletService = GoogleWalletService;
exports.GoogleWalletService = GoogleWalletService = GoogleWalletService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [wallet_config_1.WalletConfig])
], GoogleWalletService);
//# sourceMappingURL=google-wallet.service.js.map