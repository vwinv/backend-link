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
var AppleIapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleIapService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const app_store_server_library_1 = require("@apple/app-store-server-library");
const apple_iap_products_1 = require("./apple-iap-products");
const apple_root_ca_g3_1 = require("./apple-root-ca-g3");
let AppleIapService = AppleIapService_1 = class AppleIapService {
    config;
    logger = new common_1.Logger(AppleIapService_1.name);
    productMap = (0, apple_iap_products_1.loadAppleIapProductMap)();
    rootCAs = [];
    bundleId = 'com.mega.dropone';
    constructor(config) {
        this.config = config;
    }
    onModuleInit() {
        this.productMap = (0, apple_iap_products_1.loadAppleIapProductMap)(this.config.get('appleIap.productsJson') ||
            this.config.get('APPLE_IAP_PRODUCTS'));
        this.bundleId =
            this.config.get('appleIap.bundleId')?.trim() ||
                this.config.get('APPLE_IAP_BUNDLE_ID')?.trim() ||
                this.config.get('APPLE_CLIENT_ID')?.trim() ||
                'com.mega.dropone';
        this.rootCAs = this.loadRootCertificates();
        if (this.rootCAs.length === 0) {
            this.logger.warn('Apple IAP : certificat racine manquant (APPLE_IAP_ROOT_CA_PATH). La vérif StoreKit échouera.');
        }
        else {
            this.logger.log(`Apple IAP prêt (bundle ${this.bundleId})`);
        }
        if (!this.parseAppAppleId()) {
            this.logger.warn('Apple IAP : APPLE_IAP_APP_APPLE_ID non défini — les reçus Production ne pourront pas être vérifiés.');
        }
    }
    productIdFor(offerSlug, billingType) {
        return (0, apple_iap_products_1.appleProductIdFor)(this.productMap, offerSlug, billingType);
    }
    refFromProductId(productId) {
        return (0, apple_iap_products_1.appleProductRefFromId)(this.productMap, productId);
    }
    async verifyTransaction(signedTransaction) {
        const jws = signedTransaction.trim();
        if (!jws || jws.split('.').length !== 3) {
            throw new common_1.BadRequestException('Transaction Apple invalide.');
        }
        if (this.rootCAs.length === 0) {
            throw new common_1.BadRequestException('Apple IAP n’est pas configuré côté serveur (certificat racine).');
        }
        const appAppleId = this.parseAppAppleId();
        let lastError;
        for (const environment of this.environmentsToTry()) {
            try {
                const verifier = new app_store_server_library_1.SignedDataVerifier(this.rootCAs, true, environment, this.bundleId, appAppleId);
                const payload = await verifier.verifyAndDecodeTransaction(jws);
                return this.toVerified(payload);
            }
            catch (error) {
                lastError = error;
            }
        }
        const message = lastError instanceof Error ? lastError.message : 'signature invalide';
        this.logger.warn(`Apple IAP: vérification JWS échouée (${message})`);
        throw new common_1.BadRequestException('Achat Apple refusé. Vérifiez le produit App Store Connect et réessayez.');
    }
    toVerified(payload) {
        if (payload.revocationDate) {
            throw new common_1.BadRequestException('Cet achat Apple a été annulé.');
        }
        const productId = payload.productId?.trim() ?? '';
        const bundleId = payload.bundleId?.trim() ?? '';
        const originalTransactionId = payload.originalTransactionId?.trim() ?? '';
        const transactionId = payload.transactionId?.trim() ?? '';
        if (!productId || !originalTransactionId || !transactionId) {
            throw new common_1.BadRequestException('Transaction Apple incomplète.');
        }
        if (bundleId && bundleId !== this.bundleId) {
            throw new common_1.BadRequestException('Cet achat n’appartient pas à DropOne.');
        }
        const ref = this.refFromProductId(productId);
        if (!ref) {
            throw new common_1.BadRequestException(`Produit Apple inconnu (${productId}). Vérifiez APPLE_IAP_PRODUCTS.`);
        }
        const expiresAt = typeof payload.expiresDate === 'number' && payload.expiresDate > 0
            ? new Date(payload.expiresDate)
            : null;
        if (ref.billingType !== client_1.OfferBillingType.LIFETIME &&
            expiresAt &&
            expiresAt.getTime() <= Date.now()) {
            throw new common_1.BadRequestException('Cet abonnement Apple a déjà expiré.');
        }
        return {
            productId,
            bundleId: bundleId || this.bundleId,
            originalTransactionId,
            transactionId,
            expiresAt,
            environment: String(payload.environment ?? ''),
            offerSlug: ref.offerSlug,
            billingType: ref.billingType,
        };
    }
    environmentsToTry() {
        const raw = (this.config.get('appleIap.environment') ||
            this.config.get('APPLE_IAP_ENVIRONMENT') ||
            '')
            .trim()
            .toLowerCase();
        if (raw === 'production') {
            return this.parseAppAppleId()
                ? [app_store_server_library_1.Environment.PRODUCTION]
                : [app_store_server_library_1.Environment.SANDBOX];
        }
        if (raw === 'sandbox')
            return [app_store_server_library_1.Environment.SANDBOX, app_store_server_library_1.Environment.XCODE];
        if (raw === 'xcode')
            return [app_store_server_library_1.Environment.XCODE];
        const list = [];
        if (this.parseAppAppleId())
            list.push(app_store_server_library_1.Environment.PRODUCTION);
        list.push(app_store_server_library_1.Environment.SANDBOX, app_store_server_library_1.Environment.XCODE);
        return list;
    }
    parseAppAppleId() {
        const raw = (this.config.get('appleIap.appAppleId') ||
            this.config.get('APPLE_IAP_APP_APPLE_ID') ||
            '').trim();
        if (!raw)
            return undefined;
        const id = Number(raw);
        return Number.isFinite(id) && id > 0 ? id : undefined;
    }
    loadRootCertificates() {
        const configured = (this.config.get('appleIap.rootCaPath') ||
            this.config.get('APPLE_IAP_ROOT_CA_PATH') ||
            '').trim();
        const candidates = [
            configured,
            './certs/AppleRootCA-G3.cer',
            './certs/AppleRootCA-G3.pem',
        ].filter((value) => Boolean(value));
        const certs = [];
        for (const filePath of candidates) {
            const resolved = (0, node_path_1.isAbsolute)(filePath)
                ? filePath
                : (0, node_path_1.resolve)(process.cwd(), filePath);
            if (!(0, node_fs_1.existsSync)(resolved))
                continue;
            try {
                certs.push((0, node_fs_1.readFileSync)(resolved));
                break;
            }
            catch {
                this.logger.warn(`Impossible de lire ${resolved}`);
            }
        }
        if (certs.length === 0) {
            certs.push(Buffer.from(apple_root_ca_g3_1.APPLE_ROOT_CA_G3_PEM, 'utf8'));
        }
        return certs;
    }
};
exports.AppleIapService = AppleIapService;
exports.AppleIapService = AppleIapService = AppleIapService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppleIapService);
//# sourceMappingURL=apple-iap.service.js.map