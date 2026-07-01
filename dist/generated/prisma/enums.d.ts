export declare const UserRole: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const TeamMemberRole: {
    readonly OWNER: "OWNER";
    readonly ADMIN: "ADMIN";
    readonly MEMBER: "MEMBER";
};
export type TeamMemberRole = (typeof TeamMemberRole)[keyof typeof TeamMemberRole];
export declare const SubscriptionStatus: {
    readonly TRIAL: "TRIAL";
    readonly ACTIVE: "ACTIVE";
    readonly CANCELLED: "CANCELLED";
    readonly EXPIRED: "EXPIRED";
    readonly PAST_DUE: "PAST_DUE";
};
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];
export declare const BillingPeriod: {
    readonly MONTHLY: "MONTHLY";
    readonly YEARLY: "YEARLY";
};
export type BillingPeriod = (typeof BillingPeriod)[keyof typeof BillingPeriod];
export declare const ShareMethod: {
    readonly LINK: "LINK";
    readonly QR_CODE: "QR_CODE";
    readonly AIRDROP: "AIRDROP";
    readonly WHATSAPP: "WHATSAPP";
    readonly NFC: "NFC";
    readonly EMAIL: "EMAIL";
};
export type ShareMethod = (typeof ShareMethod)[keyof typeof ShareMethod];
export declare const WalletType: {
    readonly APPLE_WALLET: "APPLE_WALLET";
    readonly GOOGLE_WALLET: "GOOGLE_WALLET";
};
export type WalletType = (typeof WalletType)[keyof typeof WalletType];
export declare const SocialPlatform: {
    readonly LINKEDIN: "LINKEDIN";
    readonly TWITTER: "TWITTER";
    readonly INSTAGRAM: "INSTAGRAM";
    readonly FACEBOOK: "FACEBOOK";
    readonly GITHUB: "GITHUB";
    readonly WEBSITE: "WEBSITE";
    readonly YOUTUBE: "YOUTUBE";
    readonly TIKTOK: "TIKTOK";
    readonly WHATSAPP: "WHATSAPP";
    readonly CUSTOM: "CUSTOM";
};
export type SocialPlatform = (typeof SocialPlatform)[keyof typeof SocialPlatform];
