export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  apiPrefix: process.env.API_PREFIX ?? 'api/v1',
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
  },
  cors: {
    origins: (process.env.CORS_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  },
  swagger: {
    enabled:
      process.env.SWAGGER_ENABLED === 'true' ||
      (process.env.NODE_ENV !== 'production' &&
        process.env.SWAGGER_ENABLED !== 'false'),
  },
  throttle: {
    ttlMs: parseInt(process.env.THROTTLE_TTL_MS ?? '60000', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '120', 10),
    authLimit: parseInt(process.env.THROTTLE_AUTH_LIMIT ?? '10', 10),
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
    appPublicUrl:
      process.env.APP_PUBLIC_URL ??
      (process.env.NODE_ENV === 'production'
        ? 'https://api.dropone.pro'
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
      classSuffix: process.env.GOOGLE_WALLET_CLASS_SUFFIX ?? 'dropone_card_v2',
      serviceAccountPath: process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_PATH ?? '',
      serviceAccountJson: process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON ?? '',
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
    successUrl:
      process.env.STRIPE_SUCCESS_URL ??
      `${process.env.APP_PUBLIC_URL ?? 'http://localhost:3000'}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl:
      process.env.STRIPE_CANCEL_URL ??
      `${process.env.APP_PUBLIC_URL ?? 'http://localhost:3000'}/premium/cancel`,
  },
  paydunya: {
    enabled: process.env.PAYDUNYA_ENABLED !== 'false',
    masterKey: process.env.PAYDUNYA_MASTER_KEY ?? '',
    privateKey: process.env.PAYDUNYA_PRIVATE_KEY ?? '',
    token: process.env.PAYDUNYA_TOKEN ?? '',
    apiBaseUrl:
      process.env.PAYDUNYA_API_BASE_URL ?? 'https://app.paydunya.com',
    storeName: process.env.PAYDUNYA_STORE_NAME ?? 'Drop One',
  },
  /** true = iOS : Apple IAP. Android / web : PayDunya inchangé. */
  hideInAppPayments: process.env.HIDE_IN_APP_PAYMENTS === 'true',
  appleIap: {
    productsJson: process.env.APPLE_IAP_PRODUCTS ?? '',
    bundleId:
      process.env.APPLE_IAP_BUNDLE_ID ||
      process.env.APPLE_CLIENT_ID ||
      'com.mega.dropone',
    environment: process.env.APPLE_IAP_ENVIRONMENT ?? 'auto',
    appAppleId:
      process.env.APPLE_IAP_APP_APPLE_ID ||
      (/^\d{6,12}$/.test(process.env.APPLE_IAP_SHARED_SECRET ?? '')
        ? process.env.APPLE_IAP_SHARED_SECRET
        : '') ||
      '',
    rootCaPath: process.env.APPLE_IAP_ROOT_CA_PATH ?? './certs/AppleRootCA-G3.cer',
  },
  subscriptionRequestsNotifyEmail:
    process.env.SUBSCRIPTION_REQUESTS_NOTIFY_EMAIL ??
    'contact@mega-sn.com',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    apiKey: process.env.CLOUDINARY_API_KEY ?? '',
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
    folder: process.env.CLOUDINARY_FOLDER ?? 'dropone',
  },
  /** Quota de partages sur l’offre gratuite (lifetime). */
  freeMaxShares: Number(process.env.FREE_MAX_SHARES ?? 10),
  /** URL du site / landing (liens cloture tickets, etc.). */
  landingPublicUrl:
    process.env.APP_LANDING_URL ??
    (process.env.NODE_ENV === 'production'
      ? 'https://dropone.pro'
      : 'http://localhost:3001'),
  mobile: {
    appleTeamId: process.env.APPLE_TEAM_ID ?? 'CMU6AB64K7',
    appleBundleId: process.env.APPLE_CLIENT_ID ?? 'com.mega.dropone',
    androidPackageName: process.env.ANDROID_APP_PACKAGE ?? 'com.mega.dropone',
    androidSha256Fingerprints: (process.env.ANDROID_APP_SHA256_CERT ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  },
  /** Versions mobiles pour le prompt de mise à jour in-app. */
  appUpdate: {
    latestVersion: (process.env.APP_LATEST_VERSION ?? '').trim(),
    minVersion: (process.env.APP_MIN_VERSION ?? '').trim(),
    iosStoreUrl: (
      process.env.APP_IOS_STORE_URL ??
      'https://apps.apple.com/us/app/drop-one/id6807993018'
    ).trim(),
    androidStoreUrl: (process.env.APP_ANDROID_STORE_URL ?? '').trim(),
    message: (process.env.APP_UPDATE_MESSAGE ?? '').trim(),
  },
});
