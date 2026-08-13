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
var FcmPushService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FcmPushService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const google_auth_library_1 = require("google-auth-library");
let FcmPushService = FcmPushService_1 = class FcmPushService {
    configService;
    logger = new common_1.Logger(FcmPushService_1.name);
    authClient = null;
    projectId = null;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.initialize();
    }
    get isConfigured() {
        return this.authClient != null && this.projectId != null;
    }
    initialize() {
        try {
            const jsonInline = this.configService
                .get('FIREBASE_SERVICE_ACCOUNT_JSON')
                ?.trim();
            const jsonPath = this.configService
                .get('FIREBASE_SERVICE_ACCOUNT_PATH')
                ?.trim();
            const projectOverride = this.configService
                .get('FIREBASE_PROJECT_ID')
                ?.trim();
            let credentials = null;
            if (jsonInline) {
                credentials = JSON.parse(jsonInline);
            }
            else if (jsonPath) {
                const resolved = (0, node_path_1.isAbsolute)(jsonPath)
                    ? jsonPath
                    : (0, node_path_1.resolve)(process.cwd(), jsonPath);
                if (!(0, node_fs_1.existsSync)(resolved)) {
                    this.logger.warn(`FCM: fichier introuvable (${resolved})`);
                    return;
                }
                credentials = JSON.parse((0, node_fs_1.readFileSync)(resolved, 'utf8'));
            }
            if (!credentials?.client_email || !credentials.private_key) {
                this.logger.warn('FCM non configuré (FIREBASE_SERVICE_ACCOUNT_JSON ou FIREBASE_SERVICE_ACCOUNT_PATH manquant)');
                return;
            }
            this.projectId =
                projectOverride || credentials.project_id?.trim() || null;
            if (!this.projectId) {
                this.logger.warn('FCM non configuré (FIREBASE_PROJECT_ID manquant)');
                return;
            }
            const client = new google_auth_library_1.JWT({
                email: credentials.client_email,
                key: credentials.private_key,
                scopes: [
                    'https://www.googleapis.com/auth/firebase.messaging',
                    'https://www.googleapis.com/auth/cloud-platform',
                ],
            });
            this.authClient = client;
            this.logger.log(`FCM prêt (projet ${this.projectId}) pour les notifications push`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Impossible d’initialiser FCM: ${message}`);
            this.authClient = null;
            this.projectId = null;
        }
    }
    async sendToTokens(input) {
        const tokens = [
            ...new Set(input.tokens.map((t) => t.trim()).filter(Boolean)),
        ];
        if (!this.isConfigured || !this.authClient || !this.projectId) {
            return {
                configured: false,
                attempted: tokens.length,
                success: 0,
                failure: 0,
                invalidTokens: [],
                lastError: 'FCM non configuré',
            };
        }
        if (tokens.length === 0) {
            return {
                configured: true,
                attempted: 0,
                success: 0,
                failure: 0,
                invalidTokens: [],
            };
        }
        const invalidTokens = [];
        let success = 0;
        let failure = 0;
        let lastError;
        const url = `https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`;
        for (const token of tokens) {
            try {
                const response = await this.authClient.request({
                    url,
                    method: 'POST',
                    data: {
                        message: {
                            token,
                            notification: {
                                title: input.title,
                                body: input.body,
                            },
                            data: {
                                title: input.title,
                                body: input.body,
                                ...(input.data ?? {}),
                            },
                            android: {
                                priority: 'HIGH',
                            },
                            apns: {
                                headers: {
                                    'apns-priority': '10',
                                },
                                payload: {
                                    aps: {
                                        sound: 'default',
                                        badge: 1,
                                    },
                                },
                            },
                        },
                    },
                });
                if (response.status >= 200 && response.status < 300) {
                    success += 1;
                }
                else {
                    failure += 1;
                    lastError = `HTTP ${response.status}`;
                }
            }
            catch (error) {
                failure += 1;
                const responseData = typeof error === 'object' && error != null && 'response' in error
                    ? error
                        .response
                    : null;
                const status = responseData?.status ?? null;
                const errCode = JSON.stringify(responseData?.data ?? '');
                lastError =
                    errCode && errCode !== '""'
                        ? `FCM ${status ?? 'erreur'}: ${errCode}`
                        : error instanceof Error
                            ? error.message
                            : 'Envoi FCM impossible';
                this.logger.warn(`FCM échec (${status ?? 'n/a'}): ${lastError}`);
                if (status === 404 ||
                    lastError.includes('UNREGISTERED') ||
                    lastError.includes('INVALID_ARGUMENT') ||
                    lastError.includes('NOT_FOUND')) {
                    invalidTokens.push(token);
                }
            }
        }
        return {
            configured: true,
            attempted: tokens.length,
            success,
            failure,
            invalidTokens,
            lastError,
        };
    }
};
exports.FcmPushService = FcmPushService;
exports.FcmPushService = FcmPushService = FcmPushService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FcmPushService);
//# sourceMappingURL=fcm-push.service.js.map