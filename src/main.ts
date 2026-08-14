import { HttpException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { urlencoded } from 'express';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { SharingService } from './modules/sharing/sharing.service';
import { TeamsService } from './modules/teams/teams.service';
import { AuthService } from './modules/auth/auth.service';
import {
  buildPremiumCancelPage,
  buildPremiumSuccessPage,
} from './modules/subscriptions/premium-payment-page';
import { buildPrivacyPolicyPage } from './modules/legal/privacy-policy-page';
import { buildResetPasswordPage } from './modules/auth/reset-password-page';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  const configService = app.get(ConfigService);

  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }
  app.useStaticAssets(join(process.cwd(), 'public'), { prefix: '/' });
  app.useStaticAssets(uploadsDir, { prefix: '/uploads/' });

  const apiPrefix = configService.get<string>('apiPrefix', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  const sharingService = app.get(SharingService);
  const teamsService = app.get(TeamsService);
  const authService = app.get(AuthService);
  const jwtService = app.get(JwtService);
  const expressApp = app.getHttpAdapter().getInstance() as import('express').Express;
  expressApp.use(urlencoded({ extended: false }));

  const resolveViewerUserId = (req: Request): string | undefined => {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      return undefined;
    }

    try {
      const payload = jwtService.verify<{ sub?: string }>(
        authorization.slice('Bearer '.length),
      );
      return payload.sub;
    } catch {
      return undefined;
    }
  };

  const appleTeamId = configService.get<string>('mobile.appleTeamId', '3G878MZ2JV');
  const appleBundleId = configService.get<string>(
    'mobile.appleBundleId',
    'com.mega.dropone',
  );
  const appleAppId = `${appleTeamId}.${appleBundleId}`;

  const androidPackageName = configService.get<string>(
    'mobile.androidPackageName',
    'com.mega.dropone',
  );
  const androidSha256Fingerprints = configService.get<string[]>(
    'mobile.androidSha256Fingerprints',
    [],
  );
  const defaultAndroidFingerprint =
    'B5:F8:5C:04:90:E6:3D:B2:F1:AB:DB:86:9D:7F:6E:9E:7E:02:07:BE:3D:1A:C5:FD:C6:23:F0:CC:D6:94:63:D9';

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
        sha256_cert_fingerprints:
          androidSha256Fingerprints.length > 0
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

  expressApp.get('/premium/success', (_req: Request, res: Response) => {
    res.status(200).type('text/html; charset=utf-8').send(buildPremiumSuccessPage());
  });

  expressApp.get('/premium/cancel', (_req: Request, res: Response) => {
    res.status(200).type('text/html; charset=utf-8').send(buildPremiumCancelPage());
  });

  expressApp.get('/privacy', (_req: Request, res: Response) => {
    res.status(200).type('text/html; charset=utf-8').send(buildPrivacyPolicyPage());
  });

  const sendResetPasswordPage = (
    res: Response,
    status: number,
    state: Parameters<typeof buildResetPasswordPage>[0],
  ) => {
    res
      .status(status)
      .type('text/html; charset=utf-8')
      .send(
        buildResetPasswordPage(state),
      );
  };

  expressApp.get('/reset-password', async (req: Request, res: Response) => {
    try {
      const token = typeof req.query.token === 'string' ? req.query.token : '';
      const record = await authService.getValidResetToken(token);
      if (!record) {
        sendResetPasswordPage(res, 400, { kind: 'invalid' });
        return;
      }
      sendResetPasswordPage(res, 200, { kind: 'form', token });
    } catch {
      sendResetPasswordPage(res, 500, { kind: 'invalid' });
    }
  });

  expressApp.post('/reset-password', async (req: Request, res: Response) => {
    const body = (req.body ?? {}) as {
      token?: string;
      password?: string;
      confirmPassword?: string;
    };
    const token = typeof body.token === 'string' ? body.token : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const confirmPassword =
      typeof body.confirmPassword === 'string' ? body.confirmPassword : '';

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
    } catch (error) {
      const message =
        error instanceof HttpException
          ? String(
              typeof error.getResponse() === 'string'
                ? error.getResponse()
                : (error.getResponse() as { message?: string | string[] })
                    .message ?? error.message,
            )
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

  expressApp.get('/team-invites/:inviteId', async (req: Request, res: Response) => {
    const inviteId = String(req.params.inviteId);
    const html = await teamsService.renderTeamInvitePage(inviteId);
    res.status(200).type('text/html; charset=utf-8').send(html);
  });

  expressApp.get('/cards/:slug', async (req: Request, res: Response) => {
    const slug = String(req.params.slug);
    const embed = req.query.embed === '1' || req.query.embed === 'true';
    const viewerUserId = resolveViewerUserId(req);
    const source =
      typeof req.query.source === 'string' ? req.query.source : undefined;
    const userAgentHeader = req.headers['user-agent'];
    const html = await sharingService.renderPublicCardPage(slug, {
      embed,
      viewerUserId,
      source,
      userAgent:
        typeof userAgentHeader === 'string' ? userAgentHeader : undefined,
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('DropOne API')
    .setDescription('API backend pour les cartes de visite digitales DropOne')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('port', 3000);
  await app.listen(port);

  console.log(`🚀 DropOne API running on http://localhost:${port}/${apiPrefix}`);
  console.log(`🃏 Public cards: http://localhost:${port}/cards/{slug}`);
  console.log(`🔒 Privacy policy: http://localhost:${port}/privacy`);
  console.log(`✉️ Team invites: http://localhost:${port}/team-invites/{inviteId}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
