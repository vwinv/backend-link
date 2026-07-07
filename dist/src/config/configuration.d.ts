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
};
export default _default;
