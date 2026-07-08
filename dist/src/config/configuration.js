"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    apiPrefix: process.env.API_PREFIX ?? 'api/v1',
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET ?? 'change-me',
        expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    },
    oauth: {
        google: {
            clientIds: (process.env.GOOGLE_CLIENT_IDS ?? '')
                .split(',')
                .map((id) => id.trim())
                .filter(Boolean),
        },
        apple: {
            clientId: process.env.APPLE_CLIENT_ID ?? '',
        },
    },
    mail: {
        enabled: process.env.SMTP_ENABLED !== 'false',
        host: process.env.SMTP_HOST ?? '',
        port: parseInt(process.env.SMTP_PORT ?? '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER ?? '',
        password: process.env.SMTP_PASSWORD ?? '',
        from: process.env.MAIL_FROM ?? 'DropOne <noreply@dropone.pro>',
    },
    wallet: {
        appPublicUrl: process.env.APP_PUBLIC_URL ??
            (process.env.NODE_ENV === 'production'
                ? 'https://dropone.pro'
                : 'http://localhost:3000'),
        apple: {
            teamId: process.env.APPLE_TEAM_ID ?? '',
            passTypeId: process.env.APPLE_PASS_TYPE_ID ?? '',
            signerCertPath: process.env.APPLE_PASS_SIGNER_CERT_PATH ?? '',
            signerKeyPath: process.env.APPLE_PASS_SIGNER_KEY_PATH ?? '',
            signerKeyPassphrase: process.env.APPLE_PASS_SIGNER_KEY_PASSPHRASE ?? '',
            wwdrCertPath: process.env.APPLE_WWDR_CERT_PATH ?? '',
        },
        google: {
            issuerId: process.env.GOOGLE_WALLET_ISSUER_ID ?? '',
            classSuffix: process.env.GOOGLE_WALLET_CLASS_SUFFIX ?? 'link_business_card',
            serviceAccountPath: process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_PATH ?? '',
            origins: (process.env.GOOGLE_WALLET_ORIGINS ?? '')
                .split(',')
                .map((origin) => origin.trim())
                .filter(Boolean),
        },
    },
    stripe: {
        enabled: process.env.STRIPE_ENABLED === 'true',
        secretKey: process.env.STRIPE_SECRET_KEY ?? '',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
        successUrl: process.env.STRIPE_SUCCESS_URL ??
            `${process.env.APP_PUBLIC_URL ?? 'http://localhost:3000'}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: process.env.STRIPE_CANCEL_URL ??
            `${process.env.APP_PUBLIC_URL ?? 'http://localhost:3000'}/premium/cancel`,
    },
    mobile: {
        appleTeamId: process.env.APPLE_TEAM_ID ?? '3G878MZ2JV',
        appleBundleId: process.env.APPLE_CLIENT_ID ?? 'com.mega.dropone',
        androidPackageName: process.env.ANDROID_APP_PACKAGE ?? 'com.mega.dropone',
        androidSha256Fingerprints: (process.env.ANDROID_APP_SHA256_CERT ?? '')
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean),
    },
});
//# sourceMappingURL=configuration.js.map