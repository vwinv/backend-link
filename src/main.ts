import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { SharingService } from './modules/sharing/sharing.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }
  app.useStaticAssets(uploadsDir, { prefix: '/uploads/' });

  const apiPrefix = configService.get<string>('apiPrefix', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  const sharingService = app.get(SharingService);
  const expressApp = app.getHttpAdapter().getInstance() as import('express').Express;

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

  expressApp.get('/cards/:slug', async (req: Request, res: Response) => {
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Link API')
    .setDescription('API backend pour les cartes de visite digitales Link')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('port', 3000);
  await app.listen(port);

  console.log(`🚀 Link API running on http://localhost:${port}/${apiPrefix}`);
  console.log(`🃏 Public cards: http://localhost:${port}/cards/{slug}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
