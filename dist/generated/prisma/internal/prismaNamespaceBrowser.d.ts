import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Team: "Team";
    readonly TeamMember: "TeamMember";
    readonly BusinessCard: "BusinessCard";
    readonly SocialLink: "SocialLink";
    readonly Portfolio: "Portfolio";
    readonly PortfolioProject: "PortfolioProject";
    readonly Plan: "Plan";
    readonly Subscription: "Subscription";
    readonly ShareEvent: "ShareEvent";
    readonly SavedCard: "SavedCard";
    readonly CardView: "CardView";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly phone: "phone";
    readonly avatarUrl: "avatarUrl";
    readonly role: "role";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const TeamScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly slug: "slug";
    readonly description: "description";
    readonly logoUrl: "logoUrl";
    readonly ownerId: "ownerId";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum];
export declare const TeamMemberScalarFieldEnum: {
    readonly id: "id";
    readonly teamId: "teamId";
    readonly userId: "userId";
    readonly role: "role";
    readonly joinedAt: "joinedAt";
    readonly updatedAt: "updatedAt";
};
export type TeamMemberScalarFieldEnum = (typeof TeamMemberScalarFieldEnum)[keyof typeof TeamMemberScalarFieldEnum];
export declare const BusinessCardScalarFieldEnum: {
    readonly id: "id";
    readonly slug: "slug";
    readonly ownerId: "ownerId";
    readonly teamId: "teamId";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly jobTitle: "jobTitle";
    readonly company: "company";
    readonly bio: "bio";
    readonly email: "email";
    readonly phone: "phone";
    readonly website: "website";
    readonly avatarUrl: "avatarUrl";
    readonly coverImageUrl: "coverImageUrl";
    readonly logoUrl: "logoUrl";
    readonly theme: "theme";
    readonly isPublic: "isPublic";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BusinessCardScalarFieldEnum = (typeof BusinessCardScalarFieldEnum)[keyof typeof BusinessCardScalarFieldEnum];
export declare const SocialLinkScalarFieldEnum: {
    readonly id: "id";
    readonly cardId: "cardId";
    readonly platform: "platform";
    readonly label: "label";
    readonly url: "url";
    readonly order: "order";
    readonly createdAt: "createdAt";
};
export type SocialLinkScalarFieldEnum = (typeof SocialLinkScalarFieldEnum)[keyof typeof SocialLinkScalarFieldEnum];
export declare const PortfolioScalarFieldEnum: {
    readonly id: "id";
    readonly cardId: "cardId";
    readonly title: "title";
    readonly description: "description";
    readonly isPublic: "isPublic";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PortfolioScalarFieldEnum = (typeof PortfolioScalarFieldEnum)[keyof typeof PortfolioScalarFieldEnum];
export declare const PortfolioProjectScalarFieldEnum: {
    readonly id: "id";
    readonly portfolioId: "portfolioId";
    readonly title: "title";
    readonly description: "description";
    readonly imageUrl: "imageUrl";
    readonly projectUrl: "projectUrl";
    readonly tags: "tags";
    readonly order: "order";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PortfolioProjectScalarFieldEnum = (typeof PortfolioProjectScalarFieldEnum)[keyof typeof PortfolioProjectScalarFieldEnum];
export declare const PlanScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly slug: "slug";
    readonly description: "description";
    readonly priceMonthly: "priceMonthly";
    readonly priceYearly: "priceYearly";
    readonly maxCards: "maxCards";
    readonly maxTeamMembers: "maxTeamMembers";
    readonly hasPortfolio: "hasPortfolio";
    readonly hasCustomDomain: "hasCustomDomain";
    readonly hasAnalytics: "hasAnalytics";
    readonly features: "features";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PlanScalarFieldEnum = (typeof PlanScalarFieldEnum)[keyof typeof PlanScalarFieldEnum];
export declare const SubscriptionScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly teamId: "teamId";
    readonly planId: "planId";
    readonly status: "status";
    readonly billingPeriod: "billingPeriod";
    readonly currentPeriodEnd: "currentPeriodEnd";
    readonly cancelledAt: "cancelledAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum];
export declare const ShareEventScalarFieldEnum: {
    readonly id: "id";
    readonly cardId: "cardId";
    readonly userId: "userId";
    readonly method: "method";
    readonly metadata: "metadata";
    readonly createdAt: "createdAt";
};
export type ShareEventScalarFieldEnum = (typeof ShareEventScalarFieldEnum)[keyof typeof ShareEventScalarFieldEnum];
export declare const SavedCardScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly cardId: "cardId";
    readonly walletType: "walletType";
    readonly passId: "passId";
    readonly savedAt: "savedAt";
};
export type SavedCardScalarFieldEnum = (typeof SavedCardScalarFieldEnum)[keyof typeof SavedCardScalarFieldEnum];
export declare const CardViewScalarFieldEnum: {
    readonly id: "id";
    readonly cardId: "cardId";
    readonly ipAddress: "ipAddress";
    readonly userAgent: "userAgent";
    readonly referrer: "referrer";
    readonly viewedAt: "viewedAt";
};
export type CardViewScalarFieldEnum = (typeof CardViewScalarFieldEnum)[keyof typeof CardViewScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
