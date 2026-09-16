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
  expressApp.use(urlencoded({ extended: true }));

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

  const appleTeamId = configService.get<string>('mobile.appleTeamId', 'CMU6AB64K7');
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
  const defaultAndroidFingerprints = [
    // Keystore upload (build release local / sideload)
    '03:1D:B9:11:24:22:D0:7D:41:54:EA:4D:BF:34:A0:ED:22:3F:F0:5F:AB:45:06:33:65:15:2A:32:F1:29:5F:F4',
    // App signing key Google Play Console
    '80:66:3B:F7:B0:0D:45:4F:DA:EF:DD:B8:2A:1D:77:A5:D9:02:F3:63:71:EB:E3:73:64:F9:EF:B2:3E:79:DE:DD',
  ];

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
      relation: [
        'delegate_permission/common.handle_all_urls',
        'delegate_permission/common.get_login_creds',
      ],
      target: {
        namespace: 'android_app',
        package_name: androidPackageName,
        sha256_cert_fingerprints:
          androidSha256Fingerprints.length > 0
            ? androidSha256Fingerprints
            : defaultAndroidFingerprints,
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

  const nodeEnv = configService.get<string>('nodeEnv', 'development');
  const configuredCorsOrigins = configService.get<string[]>('cors.origins', []);
  const defaultProdOrigins = [
    'https://dropone.pro',
    'https://www.dropone.pro',
    'https://admin.dropone.pro',
    'https://api.dropone.pro',
  ];
  const corsOrigins =
    configuredCorsOrigins.length > 0
      ? configuredCorsOrigins
      : nodeEnv === 'production'
        ? defaultProdOrigins
        : true;

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  const swaggerEnabled = configService.get<boolean>('swagger.enabled', true);
  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('DropOne API')
      .setDescription('API backend pour les cartes de visite digitales DropOne')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const jwtSecret = configService.get<string>('jwt.secret', 'change-me');
  if (nodeEnv === 'production' && (!jwtSecret || jwtSecret === 'change-me')) {
    throw new Error(
      'JWT_SECRET doit être défini avec une valeur forte en production',
    );
  }

  const port = configService.get<number>('port', 3000);
  await app.listen(port);

  console.log(`🚀 DropOne API running on http://localhost:${port}/${apiPrefix}`);
  console.log(`🃏 Public cards: http://localhost:${port}/cards/{slug}`);
  console.log(`🔒 Privacy policy: http://localhost:${port}/privacy`);
  console.log(`✉️ Team invites: http://localhost:${port}/team-invites/{inviteId}`);
  if (swaggerEnabled) {
    console.log(`📚 Swagger docs: http://localhost:${port}/docs`);
  } else {
    console.log('📚 Swagger docs: disabled');
  }
}

bootstrap();
