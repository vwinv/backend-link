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
};
export default _default;
