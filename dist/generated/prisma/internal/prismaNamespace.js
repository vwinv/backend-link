"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.JsonNullValueFilter = exports.NullsOrder = exports.QueryMode = exports.JsonNullValueInput = exports.SortOrder = exports.CardViewScalarFieldEnum = exports.SavedCardScalarFieldEnum = exports.ShareEventScalarFieldEnum = exports.SubscriptionScalarFieldEnum = exports.PlanScalarFieldEnum = exports.PortfolioProjectScalarFieldEnum = exports.PortfolioScalarFieldEnum = exports.SocialLinkScalarFieldEnum = exports.BusinessCardScalarFieldEnum = exports.TeamMemberScalarFieldEnum = exports.TeamScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.8.0",
    engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    Team: 'Team',
    TeamMember: 'TeamMember',
    BusinessCard: 'BusinessCard',
    SocialLink: 'SocialLink',
    Portfolio: 'Portfolio',
    PortfolioProject: 'PortfolioProject',
    Plan: 'Plan',
    Subscription: 'Subscription',
    ShareEvent: 'ShareEvent',
    SavedCard: 'SavedCard',
    CardView: 'CardView'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    avatarUrl: 'avatarUrl',
    role: 'role',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.TeamScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    logoUrl: 'logoUrl',
    ownerId: 'ownerId',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.TeamMemberScalarFieldEnum = {
    id: 'id',
    teamId: 'teamId',
    userId: 'userId',
    role: 'role',
    joinedAt: 'joinedAt',
    updatedAt: 'updatedAt'
};
exports.BusinessCardScalarFieldEnum = {
    id: 'id',
    slug: 'slug',
    ownerId: 'ownerId',
    teamId: 'teamId',
    firstName: 'firstName',
    lastName: 'lastName',
    jobTitle: 'jobTitle',
    company: 'company',
    bio: 'bio',
    email: 'email',
    phone: 'phone',
    website: 'website',
    avatarUrl: 'avatarUrl',
    coverImageUrl: 'coverImageUrl',
    logoUrl: 'logoUrl',
    theme: 'theme',
    isPublic: 'isPublic',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SocialLinkScalarFieldEnum = {
    id: 'id',
    cardId: 'cardId',
    platform: 'platform',
    label: 'label',
    url: 'url',
    order: 'order',
    createdAt: 'createdAt'
};
exports.PortfolioScalarFieldEnum = {
    id: 'id',
    cardId: 'cardId',
    title: 'title',
    description: 'description',
    isPublic: 'isPublic',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PortfolioProjectScalarFieldEnum = {
    id: 'id',
    portfolioId: 'portfolioId',
    title: 'title',
    description: 'description',
    imageUrl: 'imageUrl',
    projectUrl: 'projectUrl',
    tags: 'tags',
    order: 'order',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PlanScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    priceMonthly: 'priceMonthly',
    priceYearly: 'priceYearly',
    maxCards: 'maxCards',
    maxTeamMembers: 'maxTeamMembers',
    hasPortfolio: 'hasPortfolio',
    hasCustomDomain: 'hasCustomDomain',
    hasAnalytics: 'hasAnalytics',
    features: 'features',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SubscriptionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    teamId: 'teamId',
    planId: 'planId',
    status: 'status',
    billingPeriod: 'billingPeriod',
    currentPeriodEnd: 'currentPeriodEnd',
    cancelledAt: 'cancelledAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ShareEventScalarFieldEnum = {
    id: 'id',
    cardId: 'cardId',
    userId: 'userId',
    method: 'method',
    metadata: 'metadata',
    createdAt: 'createdAt'
};
exports.SavedCardScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    cardId: 'cardId',
    walletType: 'walletType',
    passId: 'passId',
    savedAt: 'savedAt'
};
exports.CardViewScalarFieldEnum = {
    id: 'id',
    cardId: 'cardId',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    referrer: 'referrer',
    viewedAt: 'viewedAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map