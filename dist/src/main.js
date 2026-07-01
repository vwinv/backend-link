"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const app_module_1 = require("./app.module");
const sharing_service_1 = require("./modules/sharing/sharing.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const uploadsDir = (0, node_path_1.join)(process.cwd(), 'uploads');
    if (!(0, node_fs_1.existsSync)(uploadsDir)) {
        (0, node_fs_1.mkdirSync)(uploadsDir, { recursive: true });
    }
    app.useStaticAssets(uploadsDir, { prefix: '/uploads/' });
    const apiPrefix = configService.get('apiPrefix', 'api/v1');
    app.setGlobalPrefix(apiPrefix);
    const sharingService = app.get(sharing_service_1.SharingService);
    const expressApp = app.getHttpAdapter().getInstance();
    const appleAppSiteAssociation = {
        applinks: {
            apps: [],
            details: [
                {
                    appID: 'CMU6AB64K7.com.example.linkflutter',
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
                package_name: 'com.example.linkflutter',
                sha256_cert_fingerprints: [
                    'REPLACE_WITH_RELEASE_SHA256_FINGERPRINT',
                ],
            },
        },
    ];
    expressApp.get('/.well-known/apple-app-site-association', (_req, res) => {
        res.status(200).type('application/json').send(appleAppSiteAssociation);
    });
    expressApp.get('/.well-known/assetlinks.json', (_req, res) => {
        res.status(200).type('application/json').send(androidAssetLinks);
    });
    expressApp.get('/cards/:slug', async (req, res) => {
        const slug = String(req.params.slug);
        const html = await sharingService.renderPublicCardPage(slug);
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
        .setTitle('Link API')
        .setDescription('API backend pour les cartes de visite digitales Link')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = configService.get('port', 3000);
    await app.listen(port);
    console.log(`🚀 Link API running on http://localhost:${port}/${apiPrefix}`);
    console.log(`🃏 Public cards: http://localhost:${port}/cards/{slug}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map