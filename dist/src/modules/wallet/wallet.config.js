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
exports.WalletConfig = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
let WalletConfig = class WalletConfig {
    config;
    constructor(config) {
        this.config = config;
    }
    get appPublicUrl() {
        return (this.config.get('wallet.appPublicUrl') ?? 'https://dropone.pro').replace(/\/$/, '');
    }
    get appleTeamId() {
        return this.config.get('wallet.apple.teamId') ?? '';
    }
    get applePassTypeId() {
        return this.config.get('wallet.apple.passTypeId') ?? '';
    }
    get appleSignerCertPath() {
        return this.config.get('wallet.apple.signerCertPath') ?? '';
    }
    get appleSignerKeyPath() {
        return this.config.get('wallet.apple.signerKeyPath') ?? '';
    }
    get appleSignerKeyPassphrase() {
        const value = this.config.get('wallet.apple.signerKeyPassphrase');
        return value?.trim() ? value : undefined;
    }
    get appleWwdrCertPath() {
        return this.config.get('wallet.apple.wwdrCertPath') ?? '';
    }
    get googleIssuerId() {
        return this.config.get('wallet.google.issuerId') ?? '';
    }
    get googleClassSuffix() {
        return this.config.get('wallet.google.classSuffix') ?? 'link_business_card';
    }
    get googleServiceAccountPath() {
        return this.config.get('wallet.google.serviceAccountPath') ?? '';
    }
    get googleOrigins() {
        return this.config.get('wallet.google.origins') ?? [];
    }
    isAppleConfigured() {
        return Boolean(this.appleTeamId &&
            this.applePassTypeId &&
            this.appleSignerCertPath &&
            this.appleSignerKeyPath &&
            this.appleWwdrCertPath &&
            this.fileExists(this.appleSignerCertPath) &&
            this.fileExists(this.appleSignerKeyPath) &&
            this.fileExists(this.appleWwdrCertPath));
    }
    isGoogleConfigured() {
        return Boolean(this.googleIssuerId &&
            this.googleServiceAccountPath &&
            this.fileExists(this.googleServiceAccountPath));
    }
    loadGoogleServiceAccount() {
        const raw = fs.readFileSync(this.googleServiceAccountPath, 'utf8');
        return JSON.parse(raw);
    }
    walletAssetsDir() {
        return path.join(process.cwd(), 'wallet-assets');
    }
    fileExists(filePath) {
        if (!filePath)
            return false;
        try {
            return fs.existsSync(filePath);
        }
        catch {
            return false;
        }
    }
};
exports.WalletConfig = WalletConfig;
exports.WalletConfig = WalletConfig = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WalletConfig);
//# sourceMappingURL=wallet.config.js.map