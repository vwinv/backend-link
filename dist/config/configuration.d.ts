declare const _default: () => {
    port: number;
    nodeEnv: string;
    apiPrefix: string;
    database: {
        url: string | undefined;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    oauth: {
        google: {
            clientIds: string[];
        };
        apple: {
            clientId: string;
        };
    };
    mail: {
        enabled: boolean;
        host: string;
        port: number;
        secure: boolean;
        user: string;
        password: string;
        from: string;
    };
    wallet: {
        appPublicUrl: string;
        apple: {
            teamId: string;
            passTypeId: string;
            signerCertPath: string;
            signerKeyPath: string;
            signerKeyPassphrase: string;
            wwdrCertPath: string;
        };
        google: {
            issuerId: string;
            classSuffix: string;
            serviceAccountPath: string;
            serviceAccountJson: string;
            origins: string[];
        };
    };
    stripe: {
        enabled: boolean;
        secretKey: string;
        webhookSecret: string;
        successUrl: string;
        cancelUrl: string;
    };
    paydunya: {
        enabled: boolean;
        masterKey: string;
        privateKey: string;
        token: string;
        apiBaseUrl: string;
        storeName: string;
    };
    hideInAppPayments: boolean;
    appleIap: {
        productsJson: string;
        bundleId: string;
        environment: string;
        appAppleId: string;
        rootCaPath: string;
    };
    subscriptionRequestsNotifyEmail: string;
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
        folder: string;
    };
    freeMaxShares: number;
    landingPublicUrl: string;
    mobile: {
        appleTeamId: string;
        appleBundleId: string;
        androidPackageName: string;
        androidSha256Fingerprints: string[];
    };
};
export default _default;
