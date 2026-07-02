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
    wallet: {
        appPublicUrl: process.env.APP_PUBLIC_URL ??
            (process.env.NODE_ENV === 'production'
                ? 'https://backend-link-wt91.onrender.com'
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
});
//# sourceMappingURL=configuration.js.map