import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { JWT } from 'google-auth-library';

export type FcmSendResult = {
  configured: boolean;
  attempted: number;
  success: number;
  failure: number;
  invalidTokens: string[];
  lastError?: string;
};

type ServiceAccountJson = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
  [key: string]: unknown;
};

@Injectable()
export class FcmPushService implements OnModuleInit {
  private readonly logger = new Logger(FcmPushService.name);
  private authClient: JWT | null = null;
  private projectId: string | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initialize();
  }

  get isConfigured(): boolean {
    return this.authClient != null && this.projectId != null;
  }

  private initialize() {
    try {
      const jsonInline = this.configService
        .get<string>('FIREBASE_SERVICE_ACCOUNT_JSON')
        ?.trim();
      const jsonPath = this.configService
        .get<string>('FIREBASE_SERVICE_ACCOUNT_PATH')
        ?.trim();
      const projectOverride = this.configService
        .get<string>('FIREBASE_PROJECT_ID')
        ?.trim();

      let credentials: ServiceAccountJson | null = null;
      if (jsonInline) {
        credentials = JSON.parse(jsonInline) as ServiceAccountJson;
      } else if (jsonPath) {
        const resolved = isAbsolute(jsonPath)
          ? jsonPath
          : resolve(process.cwd(), jsonPath);
        if (!existsSync(resolved)) {
          this.logger.warn(`FCM: fichier introuvable (${resolved})`);
          return;
        }
        credentials = JSON.parse(
          readFileSync(resolved, 'utf8'),
        ) as ServiceAccountJson;
      }

      if (!credentials?.client_email || !credentials.private_key) {
        this.logger.warn(
          'FCM non configuré (FIREBASE_SERVICE_ACCOUNT_JSON ou FIREBASE_SERVICE_ACCOUNT_PATH manquant)',
        );
        return;
      }

      this.projectId =
        projectOverride || credentials.project_id?.trim() || null;
      if (!this.projectId) {
        this.logger.warn('FCM non configuré (FIREBASE_PROJECT_ID manquant)');
        return;
      }

      const client = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: [
          'https://www.googleapis.com/auth/firebase.messaging',
          'https://www.googleapis.com/auth/cloud-platform',
        ],
      });
      this.authClient = client;
      this.logger.log(
        `FCM prêt (projet ${this.projectId}) pour les notifications push`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Impossible d’initialiser FCM: ${message}`);
      this.authClient = null;
      this.projectId = null;
    }
  }

  async sendToTokens(input: {
    tokens: string[];
    title: string;
    body: string;
    data?: Record<string, string>;
  }): Promise<FcmSendResult> {
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

    const invalidTokens: string[] = [];
    let success = 0;
    let failure = 0;
    let lastError: string | undefined;
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
        } else {
          failure += 1;
          lastError = `HTTP ${response.status}`;
        }
      } catch (error: unknown) {
        failure += 1;
        const responseData =
          typeof error === 'object' && error != null && 'response' in error
            ? (error as { response?: { status?: number; data?: unknown } })
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

        if (
          status === 404 ||
          lastError.includes('UNREGISTERED') ||
          lastError.includes('INVALID_ARGUMENT') ||
          lastError.includes('NOT_FOUND')
        ) {
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
}
