import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
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
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "team" | "teamMember" | "businessCard" | "socialLink" | "portfolio" | "portfolioProject" | "plan" | "subscription" | "shareEvent" | "savedCard" | "cardView";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Team: {
            payload: Prisma.$TeamPayload<ExtArgs>;
            fields: Prisma.TeamFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TeamFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TeamFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                findFirst: {
                    args: Prisma.TeamFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TeamFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                findMany: {
                    args: Prisma.TeamFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>[];
                };
                create: {
                    args: Prisma.TeamCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                createMany: {
                    args: Prisma.TeamCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TeamCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>[];
                };
                delete: {
                    args: Prisma.TeamDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                update: {
                    args: Prisma.TeamUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                deleteMany: {
                    args: Prisma.TeamDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TeamUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TeamUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>[];
                };
                upsert: {
                    args: Prisma.TeamUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                aggregate: {
                    args: Prisma.TeamAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTeam>;
                };
                groupBy: {
                    args: Prisma.TeamGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TeamCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamCountAggregateOutputType> | number;
                };
            };
        };
        TeamMember: {
            payload: Prisma.$TeamMemberPayload<ExtArgs>;
            fields: Prisma.TeamMemberFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TeamMemberFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TeamMemberFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>;
                };
                findFirst: {
                    args: Prisma.TeamMemberFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TeamMemberFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>;
                };
                findMany: {
                    args: Prisma.TeamMemberFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>[];
                };
                create: {
                    args: Prisma.TeamMemberCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>;
                };
                createMany: {
                    args: Prisma.TeamMemberCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TeamMemberCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>[];
                };
                delete: {
                    args: Prisma.TeamMemberDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>;
                };
                update: {
                    args: Prisma.TeamMemberUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>;
                };
                deleteMany: {
                    args: Prisma.TeamMemberDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TeamMemberUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TeamMemberUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>[];
                };
                upsert: {
                    args: Prisma.TeamMemberUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>;
                };
                aggregate: {
                    args: Prisma.TeamMemberAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTeamMember>;
                };
                groupBy: {
                    args: Prisma.TeamMemberGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamMemberGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TeamMemberCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamMemberCountAggregateOutputType> | number;
                };
            };
        };
        BusinessCard: {
            payload: Prisma.$BusinessCardPayload<ExtArgs>;
            fields: Prisma.BusinessCardFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BusinessCardFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessCardPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BusinessCardFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessCardPayload>;
                };
                findFirst: {
                    args: Prisma.BusinessCardFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessCardPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BusinessCardFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessCardPayload>;
                };
                findMany: {
                    args: Prisma.BusinessCardFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessCardPayload>[];
                };
                create: {
                    args: Prisma.BusinessCardCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessCardPayload>;
                };
                createMany: {
                    args: Prisma.BusinessCardCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BusinessCardCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessCardPayload>[];
                };
                delete: {
                    args: Prisma.BusinessCardDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessCardPayload>;
                };
                update: {
                    args: Prisma.BusinessCardUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessCardPayload>;
                };
                deleteMany: {
                    args: Prisma.BusinessCardDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BusinessCardUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BusinessCardUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessCardPayload>[];
                };
                upsert: {
                    args: Prisma.BusinessCardUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessCardPayload>;
                };
                aggregate: {
                    args: Prisma.BusinessCardAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBusinessCard>;
                };
                groupBy: {
                    args: Prisma.BusinessCardGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BusinessCardGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BusinessCardCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BusinessCardCountAggregateOutputType> | number;
                };
            };
        };
        SocialLink: {
            payload: Prisma.$SocialLinkPayload<ExtArgs>;
            fields: Prisma.SocialLinkFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SocialLinkFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SocialLinkPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SocialLinkFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SocialLinkPayload>;
                };
                findFirst: {
                    args: Prisma.SocialLinkFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SocialLinkPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SocialLinkFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SocialLinkPayload>;
                };
                findMany: {
                    args: Prisma.SocialLinkFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SocialLinkPayload>[];
                };
                create: {
                    args: Prisma.SocialLinkCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SocialLinkPayload>;
                };
                createMany: {
                    args: Prisma.SocialLinkCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SocialLinkCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SocialLinkPayload>[];
                };
                delete: {
                    args: Prisma.SocialLinkDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SocialLinkPayload>;
                };
                update: {
                    args: Prisma.SocialLinkUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SocialLinkPayload>;
                };
                deleteMany: {
                    args: Prisma.SocialLinkDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SocialLinkUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SocialLinkUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SocialLinkPayload>[];
                };
                upsert: {
                    args: Prisma.SocialLinkUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SocialLinkPayload>;
                };
                aggregate: {
                    args: Prisma.SocialLinkAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSocialLink>;
                };
                groupBy: {
                    args: Prisma.SocialLinkGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SocialLinkGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SocialLinkCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SocialLinkCountAggregateOutputType> | number;
                };
            };
        };
        Portfolio: {
            payload: Prisma.$PortfolioPayload<ExtArgs>;
            fields: Prisma.PortfolioFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PortfolioFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PortfolioFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                findFirst: {
                    args: Prisma.PortfolioFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PortfolioFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                findMany: {
                    args: Prisma.PortfolioFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>[];
                };
                create: {
                    args: Prisma.PortfolioCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                createMany: {
                    args: Prisma.PortfolioCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PortfolioCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>[];
                };
                delete: {
                    args: Prisma.PortfolioDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                update: {
                    args: Prisma.PortfolioUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                deleteMany: {
                    args: Prisma.PortfolioDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PortfolioUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PortfolioUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>[];
                };
                upsert: {
                    args: Prisma.PortfolioUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                aggregate: {
                    args: Prisma.PortfolioAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePortfolio>;
                };
                groupBy: {
                    args: Prisma.PortfolioGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PortfolioGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PortfolioCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PortfolioCountAggregateOutputType> | number;
                };
            };
        };
        PortfolioProject: {
            payload: Prisma.$PortfolioProjectPayload<ExtArgs>;
            fields: Prisma.PortfolioProjectFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PortfolioProjectFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioProjectPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PortfolioProjectFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioProjectPayload>;
                };
                findFirst: {
                    args: Prisma.PortfolioProjectFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioProjectPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PortfolioProjectFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioProjectPayload>;
                };
                findMany: {
                    args: Prisma.PortfolioProjectFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioProjectPayload>[];
                };
                create: {
                    args: Prisma.PortfolioProjectCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioProjectPayload>;
                };
                createMany: {
                    args: Prisma.PortfolioProjectCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PortfolioProjectCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioProjectPayload>[];
                };
                delete: {
                    args: Prisma.PortfolioProjectDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioProjectPayload>;
                };
                update: {
                    args: Prisma.PortfolioProjectUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioProjectPayload>;
                };
                deleteMany: {
                    args: Prisma.PortfolioProjectDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PortfolioProjectUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PortfolioProjectUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioProjectPayload>[];
                };
                upsert: {
                    args: Prisma.PortfolioProjectUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioProjectPayload>;
                };
                aggregate: {
                    args: Prisma.PortfolioProjectAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePortfolioProject>;
                };
                groupBy: {
                    args: Prisma.PortfolioProjectGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PortfolioProjectGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PortfolioProjectCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PortfolioProjectCountAggregateOutputType> | number;
                };
            };
        };
        Plan: {
            payload: Prisma.$PlanPayload<ExtArgs>;
            fields: Prisma.PlanFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PlanFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PlanFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPayload>;
                };
                findFirst: {
                    args: Prisma.PlanFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PlanFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPayload>;
                };
                findMany: {
                    args: Prisma.PlanFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPayload>[];
                };
                create: {
                    args: Prisma.PlanCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPayload>;
                };
                createMany: {
                    args: Prisma.PlanCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PlanCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPayload>[];
                };
                delete: {
                    args: Prisma.PlanDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPayload>;
                };
                update: {
                    args: Prisma.PlanUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPayload>;
                };
                deleteMany: {
                    args: Prisma.PlanDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PlanUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PlanUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPayload>[];
                };
                upsert: {
                    args: Prisma.PlanUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPayload>;
                };
                aggregate: {
                    args: Prisma.PlanAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePlan>;
                };
                groupBy: {
                    args: Prisma.PlanGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PlanGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PlanCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PlanCountAggregateOutputType> | number;
                };
            };
        };
        Subscription: {
            payload: Prisma.$SubscriptionPayload<ExtArgs>;
            fields: Prisma.SubscriptionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
                };
                findFirst: {
                    args: Prisma.SubscriptionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
                };
                findMany: {
                    args: Prisma.SubscriptionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>[];
                };
                create: {
                    args: Prisma.SubscriptionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
                };
                createMany: {
                    args: Prisma.SubscriptionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>[];
                };
                delete: {
                    args: Prisma.SubscriptionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
                };
                update: {
                    args: Prisma.SubscriptionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
                };
                deleteMany: {
                    args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SubscriptionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>[];
                };
                upsert: {
                    args: Prisma.SubscriptionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
                };
                aggregate: {
                    args: Prisma.SubscriptionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSubscription>;
                };
                groupBy: {
                    args: Prisma.SubscriptionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubscriptionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SubscriptionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubscriptionCountAggregateOutputType> | number;
                };
            };
        };
        ShareEvent: {
            payload: Prisma.$ShareEventPayload<ExtArgs>;
            fields: Prisma.ShareEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ShareEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShareEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ShareEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShareEventPayload>;
                };
                findFirst: {
                    args: Prisma.ShareEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShareEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ShareEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShareEventPayload>;
                };
                findMany: {
                    args: Prisma.ShareEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShareEventPayload>[];
                };
                create: {
                    args: Prisma.ShareEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShareEventPayload>;
                };
                createMany: {
                    args: Prisma.ShareEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ShareEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShareEventPayload>[];
                };
                delete: {
                    args: Prisma.ShareEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShareEventPayload>;
                };
                update: {
                    args: Prisma.ShareEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShareEventPayload>;
                };
                deleteMany: {
                    args: Prisma.ShareEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ShareEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ShareEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShareEventPayload>[];
                };
                upsert: {
                    args: Prisma.ShareEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShareEventPayload>;
                };
                aggregate: {
                    args: Prisma.ShareEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateShareEvent>;
                };
                groupBy: {
                    args: Prisma.ShareEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ShareEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ShareEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ShareEventCountAggregateOutputType> | number;
                };
            };
        };
        SavedCard: {
            payload: Prisma.$SavedCardPayload<ExtArgs>;
            fields: Prisma.SavedCardFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SavedCardFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedCardPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SavedCardFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedCardPayload>;
                };
                findFirst: {
                    args: Prisma.SavedCardFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedCardPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SavedCardFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedCardPayload>;
                };
                findMany: {
                    args: Prisma.SavedCardFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedCardPayload>[];
                };
                create: {
                    args: Prisma.SavedCardCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedCardPayload>;
                };
                createMany: {
                    args: Prisma.SavedCardCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SavedCardCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedCardPayload>[];
                };
                delete: {
                    args: Prisma.SavedCardDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedCardPayload>;
                };
                update: {
                    args: Prisma.SavedCardUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedCardPayload>;
                };
                deleteMany: {
                    args: Prisma.SavedCardDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SavedCardUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SavedCardUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedCardPayload>[];
                };
                upsert: {
                    args: Prisma.SavedCardUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedCardPayload>;
                };
                aggregate: {
                    args: Prisma.SavedCardAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSavedCard>;
                };
                groupBy: {
                    args: Prisma.SavedCardGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SavedCardGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SavedCardCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SavedCardCountAggregateOutputType> | number;
                };
            };
        };
        CardView: {
            payload: Prisma.$CardViewPayload<ExtArgs>;
            fields: Prisma.CardViewFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CardViewFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardViewPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CardViewFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardViewPayload>;
                };
                findFirst: {
                    args: Prisma.CardViewFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardViewPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CardViewFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardViewPayload>;
                };
                findMany: {
                    args: Prisma.CardViewFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardViewPayload>[];
                };
                create: {
                    args: Prisma.CardViewCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardViewPayload>;
                };
                createMany: {
                    args: Prisma.CardViewCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CardViewCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardViewPayload>[];
                };
                delete: {
                    args: Prisma.CardViewDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardViewPayload>;
                };
                update: {
                    args: Prisma.CardViewUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardViewPayload>;
                };
                deleteMany: {
                    args: Prisma.CardViewDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CardViewUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CardViewUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardViewPayload>[];
                };
                upsert: {
                    args: Prisma.CardViewUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardViewPayload>;
                };
                aggregate: {
                    args: Prisma.CardViewAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCardView>;
                };
                groupBy: {
                    args: Prisma.CardViewGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CardViewGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CardViewCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CardViewCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
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
    readonly JsonNull: runtime.JsonNullClass;
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
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>;
export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type EnumTeamMemberRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TeamMemberRole'>;
export type ListEnumTeamMemberRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TeamMemberRole[]'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type EnumSocialPlatformFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SocialPlatform'>;
export type ListEnumSocialPlatformFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SocialPlatform[]'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>;
export type EnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus'>;
export type ListEnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus[]'>;
export type EnumBillingPeriodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingPeriod'>;
export type ListEnumBillingPeriodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingPeriod[]'>;
export type EnumShareMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShareMethod'>;
export type ListEnumShareMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShareMethod[]'>;
export type EnumWalletTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WalletType'>;
export type ListEnumWalletTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WalletType[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    accelerateUrl: string;
    adapter?: never;
}) & {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
    queryPlanCacheMaxSize?: number;
};
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    team?: Prisma.TeamOmit;
    teamMember?: Prisma.TeamMemberOmit;
    businessCard?: Prisma.BusinessCardOmit;
    socialLink?: Prisma.SocialLinkOmit;
    portfolio?: Prisma.PortfolioOmit;
    portfolioProject?: Prisma.PortfolioProjectOmit;
    plan?: Prisma.PlanOmit;
    subscription?: Prisma.SubscriptionOmit;
    shareEvent?: Prisma.ShareEventOmit;
    savedCard?: Prisma.SavedCardOmit;
    cardView?: Prisma.CardViewOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
