"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const express_1 = require("express");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const app_module_1 = require("./app.module");
const sharing_service_1 = require("./modules/sharing/sharing.service");
const teams_service_1 = require("./modules/teams/teams.service");
const auth_service_1 = require("./modules/auth/auth.service");
const premium_payment_page_1 = require("./modules/subscriptions/premium-payment-page");
const privacy_policy_page_1 = require("./modules/legal/privacy-policy-page");
const reset_password_page_1 = require("./modules/auth/reset-password-page");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
    });
    const configService = app.get(config_1.ConfigService);
    const uploadsDir = (0, node_path_1.join)(process.cwd(), 'uploads');
    if (!(0, node_fs_1.existsSync)(uploadsDir)) {
        (0, node_fs_1.mkdirSync)(uploadsDir, { recursive: true });
    }
    app.useStaticAssets((0, node_path_1.join)(process.cwd(), 'public'), { prefix: '/' });
    app.useStaticAssets(uploadsDir, { prefix: '/uploads/' });
    const apiPrefix = configService.get('apiPrefix', 'api/v1');
    app.setGlobalPrefix(apiPrefix);
    const sharingService = app.get(sharing_service_1.SharingService);
    const teamsService = app.get(teams_service_1.TeamsService);
    const authService = app.get(auth_service_1.AuthService);
    const jwtService = app.get(jwt_1.JwtService);
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use((0, express_1.urlencoded)({ extended: false }));
    const resolveViewerUserId = (req) => {
        const authorization = req.headers.authorization;
        if (!authorization?.startsWith('Bearer ')) {
            return undefined;
        }
        try {
            const payload = jwtService.verify(authorization.slice('Bearer '.length));
            return payload.sub;
        }
        catch {
            return undefined;
        }
    };
    const appleTeamId = configService.get('mobile.appleTeamId', '3G878MZ2JV');
    const appleBundleId = configService.get('mobile.appleBundleId', 'com.mega.dropone');
    const appleAppId = `${appleTeamId}.${appleBundleId}`;
    const androidPackageName = configService.get('mobile.androidPackageName', 'com.mega.dropone');
    const androidSha256Fingerprints = configService.get('mobile.androidSha256Fingerprints', []);
    const defaultAndroidFingerprint = 'B5:F8:5C:04:90:E6:3D:B2:F1:AB:DB:86:9D:7F:6E:9E:7E:02:07:BE:3D:1A:C5:FD:C6:23:F0:CC:D6:94:63:D9';
    const appleAppSiteAssociation = {
        applinks: {
            apps: [],
            details: [
                {
                    appIDs: [appleAppId],
                    paths: ['/cards/*'],
                },
            ],
        },
    };
    const androidAssetLinks = [
        {
            relation: ['delegate_permission/common.handle_all_urls'],
            target: {
                namespace: 'android_app',
                package_name: androidPackageName,
                sha256_cert_fingerprints: androidSha256Fingerprints.length > 0
                    ? androidSha256Fingerprints
                    : [defaultAndroidFingerprint],
            },
        },
    ];
    expressApp.get('/.well-known/apple-app-site-association', (_req, res) => {
        res.status(200).type('application/json').send(appleAppSiteAssociation);
    });
    expressApp.get('/.well-known/assetlinks.json', (_req, res) => {
        res.status(200).type('application/json').send(androidAssetLinks);
    });
    expressApp.get('/premium/success', (_req, res) => {
        res.status(200).type('text/html; charset=utf-8').send((0, premium_payment_page_1.buildPremiumSuccessPage)());
    });
    expressApp.get('/premium/cancel', (_req, res) => {
        res.status(200).type('text/html; charset=utf-8').send((0, premium_payment_page_1.buildPremiumCancelPage)());
    });
    expressApp.get('/privacy', (_req, res) => {
        res.status(200).type('text/html; charset=utf-8').send((0, privacy_policy_page_1.buildPrivacyPolicyPage)());
    });
    const sendResetPasswordPage = (res, status, state) => {
        res
            .status(status)
            .type('text/html; charset=utf-8')
            .send((0, reset_password_page_1.buildResetPasswordPage)(state));
    };
    expressApp.get('/reset-password', async (req, res) => {
        try {
            const token = typeof req.query.token === 'string' ? req.query.token : '';
            const record = await authService.getValidResetToken(token);
            if (!record) {
                sendResetPasswordPage(res, 400, { kind: 'invalid' });
                return;
            }
            sendResetPasswordPage(res, 200, { kind: 'form', token });
        }
        catch {
            sendResetPasswordPage(res, 500, { kind: 'invalid' });
        }
    });
    expressApp.post('/reset-password', async (req, res) => {
        const body = (req.body ?? {});
        const token = typeof body.token === 'string' ? body.token : '';
        const password = typeof body.password === 'string' ? body.password : '';
        const confirmPassword = typeof body.confirmPassword === 'string' ? body.confirmPassword : '';
        if (password !== confirmPassword) {
            sendResetPasswordPage(res, 400, {
                kind: 'form',
                token,
                error: 'Les deux mots de passe ne correspondent pas.',
            });
            return;
        }
        try {
            await authService.resetPassword({ token, password });
            sendResetPasswordPage(res, 200, { kind: 'success' });
        }
        catch (error) {
            const message = error instanceof common_1.HttpException
                ? String(typeof error.getResponse() === 'string'
                    ? error.getResponse()
                    : error.getResponse()
                        .message ?? error.message)
                : error instanceof Error
                    ? error.message
                    : 'Impossible de mettre à jour le mot de passe';
            sendResetPasswordPage(res, 400, {
                kind: 'form',
                token,
                error: message,
            });
        }
    });
    expressApp.get('/team-invites/:inviteId', async (req, res) => {
        const inviteId = String(req.params.inviteId);
        const html = await teamsService.renderTeamInvitePage(inviteId);
        res.status(200).type('text/html; charset=utf-8').send(html);
    });
    expressApp.get('/cards/:slug', async (req, res) => {
        const slug = String(req.params.slug);
        const embed = req.query.embed === '1' || req.query.embed === 'true';
        const viewerUserId = resolveViewerUserId(req);
        const source = typeof req.query.source === 'string' ? req.query.source : undefined;
        const userAgentHeader = req.headers['user-agent'];
        const html = await sharingService.renderPublicCardPage(slug, {
            embed,
            viewerUserId,
            source,
            userAgent: typeof userAgentHeader === 'string' ? userAgentHeader : undefined,
        });
        if (!html) {
            res
                .status(404)
                .type('text/html; charset=utf-8')
                .send(sharingService.renderPublicCardNotFoundPage());
            return;
        }
        res.status(200).type('text/html; charset=utf-8').send(html);
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors();
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('DropOne API')
        .setDescription('API backend pour les cartes de visite digitales DropOne')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = configService.get('port', 3000);
    await app.listen(port);
    console.log(`🚀 DropOne API running on http://localhost:${port}/${apiPrefix}`);
    console.log(`🃏 Public cards: http://localhost:${port}/cards/{slug}`);
    console.log(`🔒 Privacy policy: http://localhost:${port}/privacy`);
    console.log(`✉️ Team invites: http://localhost:${port}/team-invites/{inviteId}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map