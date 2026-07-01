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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const apple_signin_auth_1 = __importDefault(require("apple-signin-auth"));
const google_auth_library_1 = require("google-auth-library");
let OAuthService = class OAuthService {
    configService;
    googleClient;
    constructor(configService) {
        this.configService = configService;
        this.googleClient = new google_auth_library_1.OAuth2Client();
    }
    async verifyGoogleIdToken(idToken) {
        const clientIds = this.configService.get('oauth.google.clientIds', []);
        if (clientIds.length === 0) {
            throw new common_1.UnauthorizedException('Google OAuth non configuré');
        }
        const ticket = await this.googleClient
            .verifyIdToken({
            idToken,
            audience: clientIds,
        })
            .catch(() => {
            throw new common_1.UnauthorizedException('Token Google invalide');
        });
        const payload = ticket.getPayload();
        if (!payload?.sub || !payload.email) {
            throw new common_1.UnauthorizedException('Token Google incomplet');
        }
        return {
            provider: client_1.AuthProvider.GOOGLE,
            providerId: payload.sub,
            email: payload.email.toLowerCase(),
            firstName: payload.given_name?.trim() || 'Utilisateur',
            lastName: payload.family_name?.trim() || 'Link',
            avatarUrl: payload.picture ?? null,
        };
    }
    async verifyAppleIdToken(idToken, firstName, lastName) {
        const clientId = this.configService.get('oauth.apple.clientId');
        if (!clientId) {
            throw new common_1.UnauthorizedException('Apple OAuth non configuré');
        }
        const payload = await apple_signin_auth_1.default
            .verifyIdToken(idToken, {
            audience: clientId,
            ignoreExpiration: false,
        })
            .catch(() => {
            throw new common_1.UnauthorizedException('Token Apple invalide');
        });
        if (!payload.sub) {
            throw new common_1.UnauthorizedException('Token Apple incomplet');
        }
        const email = typeof payload.email === 'string'
            ? payload.email.toLowerCase()
            : `apple-${payload.sub}@privaterelay.link.local`;
        return {
            provider: client_1.AuthProvider.APPLE,
            providerId: payload.sub,
            email,
            firstName: firstName?.trim() || 'Utilisateur',
            lastName: lastName?.trim() || 'Link',
            avatarUrl: null,
        };
    }
};
exports.OAuthService = OAuthService;
exports.OAuthService = OAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OAuthService);
//# sourceMappingURL=oauth.service.js.map