import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    passwordHash: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    avatarUrl: string | null;
    role: $Enums.UserRole | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    passwordHash: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    avatarUrl: string | null;
    role: $Enums.UserRole | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    passwordHash: number;
    firstName: number;
    lastName: number;
    phone: number;
    avatarUrl: number;
    role: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    avatarUrl?: true;
    role?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    avatarUrl?: true;
    role?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    avatarUrl?: true;
    role?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCountAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    avatarUrl: string | null;
    role: $Enums.UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    firstName?: Prisma.StringFilter<"User"> | string;
    lastName?: Prisma.StringFilter<"User"> | string;
    phone?: Prisma.StringNullableFilter<"User"> | string | null;
    avatarUrl?: Prisma.StringNullableFilter<"User"> | string | null;
    role?: Prisma.EnumUserRoleFilter<"User"> | $Enums.UserRole;
    isActive?: Prisma.BoolFilter<"User"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    ownedTeams?: Prisma.TeamListRelationFilter;
    teamMemberships?: Prisma.TeamMemberListRelationFilter;
    businessCards?: Prisma.BusinessCardListRelationFilter;
    subscriptions?: Prisma.SubscriptionListRelationFilter;
    savedCards?: Prisma.SavedCardListRelationFilter;
    shareEvents?: Prisma.ShareEventListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    avatarUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    ownedTeams?: Prisma.TeamOrderByRelationAggregateInput;
    teamMemberships?: Prisma.TeamMemberOrderByRelationAggregateInput;
    businessCards?: Prisma.BusinessCardOrderByRelationAggregateInput;
    subscriptions?: Prisma.SubscriptionOrderByRelationAggregateInput;
    savedCards?: Prisma.SavedCardOrderByRelationAggregateInput;
    shareEvents?: Prisma.ShareEventOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    passwordHash?: Prisma.StringFilter<"User"> | string;
    firstName?: Prisma.StringFilter<"User"> | string;
    lastName?: Prisma.StringFilter<"User"> | string;
    phone?: Prisma.StringNullableFilter<"User"> | string | null;
    avatarUrl?: Prisma.StringNullableFilter<"User"> | string | null;
    role?: Prisma.EnumUserRoleFilter<"User"> | $Enums.UserRole;
    isActive?: Prisma.BoolFilter<"User"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    ownedTeams?: Prisma.TeamListRelationFilter;
    teamMemberships?: Prisma.TeamMemberListRelationFilter;
    businessCards?: Prisma.BusinessCardListRelationFilter;
    subscriptions?: Prisma.SubscriptionListRelationFilter;
    savedCards?: Prisma.SavedCardListRelationFilter;
    shareEvents?: Prisma.ShareEventListRelationFilter;
}, "id" | "email">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    avatarUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    passwordHash?: Prisma.StringWithAggregatesFilter<"User"> | string;
    firstName?: Prisma.StringWithAggregatesFilter<"User"> | string;
    lastName?: Prisma.StringWithAggregatesFilter<"User"> | string;
    phone?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    avatarUrl?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    role?: Prisma.EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole;
    isActive?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
};
export type UserCreateInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedTeams?: Prisma.TeamCreateNestedManyWithoutOwnerInput;
    teamMemberships?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    businessCards?: Prisma.BusinessCardCreateNestedManyWithoutOwnerInput;
    subscriptions?: Prisma.SubscriptionCreateNestedManyWithoutUserInput;
    savedCards?: Prisma.SavedCardCreateNestedManyWithoutUserInput;
    shareEvents?: Prisma.ShareEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedTeams?: Prisma.TeamUncheckedCreateNestedManyWithoutOwnerInput;
    teamMemberships?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    businessCards?: Prisma.BusinessCardUncheckedCreateNestedManyWithoutOwnerInput;
    subscriptions?: Prisma.SubscriptionUncheckedCreateNestedManyWithoutUserInput;
    savedCards?: Prisma.SavedCardUncheckedCreateNestedManyWithoutUserInput;
    shareEvents?: Prisma.ShareEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedTeams?: Prisma.TeamUpdateManyWithoutOwnerNestedInput;
    teamMemberships?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    businessCards?: Prisma.BusinessCardUpdateManyWithoutOwnerNestedInput;
    subscriptions?: Prisma.SubscriptionUpdateManyWithoutUserNestedInput;
    savedCards?: Prisma.SavedCardUpdateManyWithoutUserNestedInput;
    shareEvents?: Prisma.ShareEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedTeams?: Prisma.TeamUncheckedUpdateManyWithoutOwnerNestedInput;
    teamMemberships?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    businessCards?: Prisma.BusinessCardUncheckedUpdateManyWithoutOwnerNestedInput;
    subscriptions?: Prisma.SubscriptionUncheckedUpdateManyWithoutUserNestedInput;
    savedCards?: Prisma.SavedCardUncheckedUpdateManyWithoutUserNestedInput;
    shareEvents?: Prisma.ShareEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    avatarUrl?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    avatarUrl?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    avatarUrl?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type UserNullableScalarRelationFilter = {
    is?: Prisma.UserWhereInput | null;
    isNot?: Prisma.UserWhereInput | null;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type UserCreateNestedOneWithoutOwnedTeamsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOwnedTeamsInput, Prisma.UserUncheckedCreateWithoutOwnedTeamsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOwnedTeamsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutOwnedTeamsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOwnedTeamsInput, Prisma.UserUncheckedCreateWithoutOwnedTeamsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOwnedTeamsInput;
    upsert?: Prisma.UserUpsertWithoutOwnedTeamsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutOwnedTeamsInput, Prisma.UserUpdateWithoutOwnedTeamsInput>, Prisma.UserUncheckedUpdateWithoutOwnedTeamsInput>;
};
export type UserCreateNestedOneWithoutTeamMembershipsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTeamMembershipsInput, Prisma.UserUncheckedCreateWithoutTeamMembershipsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTeamMembershipsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutTeamMembershipsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTeamMembershipsInput, Prisma.UserUncheckedCreateWithoutTeamMembershipsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTeamMembershipsInput;
    upsert?: Prisma.UserUpsertWithoutTeamMembershipsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutTeamMembershipsInput, Prisma.UserUpdateWithoutTeamMembershipsInput>, Prisma.UserUncheckedUpdateWithoutTeamMembershipsInput>;
};
export type UserCreateNestedOneWithoutBusinessCardsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutBusinessCardsInput, Prisma.UserUncheckedCreateWithoutBusinessCardsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutBusinessCardsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutBusinessCardsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutBusinessCardsInput, Prisma.UserUncheckedCreateWithoutBusinessCardsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutBusinessCardsInput;
    upsert?: Prisma.UserUpsertWithoutBusinessCardsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutBusinessCardsInput, Prisma.UserUpdateWithoutBusinessCardsInput>, Prisma.UserUncheckedUpdateWithoutBusinessCardsInput>;
};
export type UserCreateNestedOneWithoutSubscriptionsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSubscriptionsInput, Prisma.UserUncheckedCreateWithoutSubscriptionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSubscriptionsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutSubscriptionsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSubscriptionsInput, Prisma.UserUncheckedCreateWithoutSubscriptionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSubscriptionsInput;
    upsert?: Prisma.UserUpsertWithoutSubscriptionsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutSubscriptionsInput, Prisma.UserUpdateWithoutSubscriptionsInput>, Prisma.UserUncheckedUpdateWithoutSubscriptionsInput>;
};
export type UserCreateNestedOneWithoutShareEventsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutShareEventsInput, Prisma.UserUncheckedCreateWithoutShareEventsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutShareEventsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutShareEventsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutShareEventsInput, Prisma.UserUncheckedCreateWithoutShareEventsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutShareEventsInput;
    upsert?: Prisma.UserUpsertWithoutShareEventsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutShareEventsInput, Prisma.UserUpdateWithoutShareEventsInput>, Prisma.UserUncheckedUpdateWithoutShareEventsInput>;
};
export type UserCreateNestedOneWithoutSavedCardsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSavedCardsInput, Prisma.UserUncheckedCreateWithoutSavedCardsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSavedCardsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutSavedCardsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSavedCardsInput, Prisma.UserUncheckedCreateWithoutSavedCardsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSavedCardsInput;
    upsert?: Prisma.UserUpsertWithoutSavedCardsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutSavedCardsInput, Prisma.UserUpdateWithoutSavedCardsInput>, Prisma.UserUncheckedUpdateWithoutSavedCardsInput>;
};
export type UserCreateWithoutOwnedTeamsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    teamMemberships?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    businessCards?: Prisma.BusinessCardCreateNestedManyWithoutOwnerInput;
    subscriptions?: Prisma.SubscriptionCreateNestedManyWithoutUserInput;
    savedCards?: Prisma.SavedCardCreateNestedManyWithoutUserInput;
    shareEvents?: Prisma.ShareEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutOwnedTeamsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    teamMemberships?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    businessCards?: Prisma.BusinessCardUncheckedCreateNestedManyWithoutOwnerInput;
    subscriptions?: Prisma.SubscriptionUncheckedCreateNestedManyWithoutUserInput;
    savedCards?: Prisma.SavedCardUncheckedCreateNestedManyWithoutUserInput;
    shareEvents?: Prisma.ShareEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutOwnedTeamsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutOwnedTeamsInput, Prisma.UserUncheckedCreateWithoutOwnedTeamsInput>;
};
export type UserUpsertWithoutOwnedTeamsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutOwnedTeamsInput, Prisma.UserUncheckedUpdateWithoutOwnedTeamsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutOwnedTeamsInput, Prisma.UserUncheckedCreateWithoutOwnedTeamsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutOwnedTeamsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutOwnedTeamsInput, Prisma.UserUncheckedUpdateWithoutOwnedTeamsInput>;
};
export type UserUpdateWithoutOwnedTeamsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    teamMemberships?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    businessCards?: Prisma.BusinessCardUpdateManyWithoutOwnerNestedInput;
    subscriptions?: Prisma.SubscriptionUpdateManyWithoutUserNestedInput;
    savedCards?: Prisma.SavedCardUpdateManyWithoutUserNestedInput;
    shareEvents?: Prisma.ShareEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutOwnedTeamsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    teamMemberships?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    businessCards?: Prisma.BusinessCardUncheckedUpdateManyWithoutOwnerNestedInput;
    subscriptions?: Prisma.SubscriptionUncheckedUpdateManyWithoutUserNestedInput;
    savedCards?: Prisma.SavedCardUncheckedUpdateManyWithoutUserNestedInput;
    shareEvents?: Prisma.ShareEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutTeamMembershipsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedTeams?: Prisma.TeamCreateNestedManyWithoutOwnerInput;
    businessCards?: Prisma.BusinessCardCreateNestedManyWithoutOwnerInput;
    subscriptions?: Prisma.SubscriptionCreateNestedManyWithoutUserInput;
    savedCards?: Prisma.SavedCardCreateNestedManyWithoutUserInput;
    shareEvents?: Prisma.ShareEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutTeamMembershipsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedTeams?: Prisma.TeamUncheckedCreateNestedManyWithoutOwnerInput;
    businessCards?: Prisma.BusinessCardUncheckedCreateNestedManyWithoutOwnerInput;
    subscriptions?: Prisma.SubscriptionUncheckedCreateNestedManyWithoutUserInput;
    savedCards?: Prisma.SavedCardUncheckedCreateNestedManyWithoutUserInput;
    shareEvents?: Prisma.ShareEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutTeamMembershipsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutTeamMembershipsInput, Prisma.UserUncheckedCreateWithoutTeamMembershipsInput>;
};
export type UserUpsertWithoutTeamMembershipsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutTeamMembershipsInput, Prisma.UserUncheckedUpdateWithoutTeamMembershipsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutTeamMembershipsInput, Prisma.UserUncheckedCreateWithoutTeamMembershipsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutTeamMembershipsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutTeamMembershipsInput, Prisma.UserUncheckedUpdateWithoutTeamMembershipsInput>;
};
export type UserUpdateWithoutTeamMembershipsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedTeams?: Prisma.TeamUpdateManyWithoutOwnerNestedInput;
    businessCards?: Prisma.BusinessCardUpdateManyWithoutOwnerNestedInput;
    subscriptions?: Prisma.SubscriptionUpdateManyWithoutUserNestedInput;
    savedCards?: Prisma.SavedCardUpdateManyWithoutUserNestedInput;
    shareEvents?: Prisma.ShareEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutTeamMembershipsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedTeams?: Prisma.TeamUncheckedUpdateManyWithoutOwnerNestedInput;
    businessCards?: Prisma.BusinessCardUncheckedUpdateManyWithoutOwnerNestedInput;
    subscriptions?: Prisma.SubscriptionUncheckedUpdateManyWithoutUserNestedInput;
    savedCards?: Prisma.SavedCardUncheckedUpdateManyWithoutUserNestedInput;
    shareEvents?: Prisma.ShareEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutBusinessCardsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedTeams?: Prisma.TeamCreateNestedManyWithoutOwnerInput;
    teamMemberships?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    subscriptions?: Prisma.SubscriptionCreateNestedManyWithoutUserInput;
    savedCards?: Prisma.SavedCardCreateNestedManyWithoutUserInput;
    shareEvents?: Prisma.ShareEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutBusinessCardsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedTeams?: Prisma.TeamUncheckedCreateNestedManyWithoutOwnerInput;
    teamMemberships?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    subscriptions?: Prisma.SubscriptionUncheckedCreateNestedManyWithoutUserInput;
    savedCards?: Prisma.SavedCardUncheckedCreateNestedManyWithoutUserInput;
    shareEvents?: Prisma.ShareEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutBusinessCardsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutBusinessCardsInput, Prisma.UserUncheckedCreateWithoutBusinessCardsInput>;
};
export type UserUpsertWithoutBusinessCardsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutBusinessCardsInput, Prisma.UserUncheckedUpdateWithoutBusinessCardsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutBusinessCardsInput, Prisma.UserUncheckedCreateWithoutBusinessCardsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutBusinessCardsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutBusinessCardsInput, Prisma.UserUncheckedUpdateWithoutBusinessCardsInput>;
};
export type UserUpdateWithoutBusinessCardsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedTeams?: Prisma.TeamUpdateManyWithoutOwnerNestedInput;
    teamMemberships?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    subscriptions?: Prisma.SubscriptionUpdateManyWithoutUserNestedInput;
    savedCards?: Prisma.SavedCardUpdateManyWithoutUserNestedInput;
    shareEvents?: Prisma.ShareEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutBusinessCardsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedTeams?: Prisma.TeamUncheckedUpdateManyWithoutOwnerNestedInput;
    teamMemberships?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    subscriptions?: Prisma.SubscriptionUncheckedUpdateManyWithoutUserNestedInput;
    savedCards?: Prisma.SavedCardUncheckedUpdateManyWithoutUserNestedInput;
    shareEvents?: Prisma.ShareEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutSubscriptionsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedTeams?: Prisma.TeamCreateNestedManyWithoutOwnerInput;
    teamMemberships?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    businessCards?: Prisma.BusinessCardCreateNestedManyWithoutOwnerInput;
    savedCards?: Prisma.SavedCardCreateNestedManyWithoutUserInput;
    shareEvents?: Prisma.ShareEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutSubscriptionsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedTeams?: Prisma.TeamUncheckedCreateNestedManyWithoutOwnerInput;
    teamMemberships?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    businessCards?: Prisma.BusinessCardUncheckedCreateNestedManyWithoutOwnerInput;
    savedCards?: Prisma.SavedCardUncheckedCreateNestedManyWithoutUserInput;
    shareEvents?: Prisma.ShareEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutSubscriptionsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutSubscriptionsInput, Prisma.UserUncheckedCreateWithoutSubscriptionsInput>;
};
export type UserUpsertWithoutSubscriptionsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutSubscriptionsInput, Prisma.UserUncheckedUpdateWithoutSubscriptionsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutSubscriptionsInput, Prisma.UserUncheckedCreateWithoutSubscriptionsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutSubscriptionsInput, Prisma.UserUncheckedUpdateWithoutSubscriptionsInput>;
};
export type UserUpdateWithoutSubscriptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedTeams?: Prisma.TeamUpdateManyWithoutOwnerNestedInput;
    teamMemberships?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    businessCards?: Prisma.BusinessCardUpdateManyWithoutOwnerNestedInput;
    savedCards?: Prisma.SavedCardUpdateManyWithoutUserNestedInput;
    shareEvents?: Prisma.ShareEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutSubscriptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedTeams?: Prisma.TeamUncheckedUpdateManyWithoutOwnerNestedInput;
    teamMemberships?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    businessCards?: Prisma.BusinessCardUncheckedUpdateManyWithoutOwnerNestedInput;
    savedCards?: Prisma.SavedCardUncheckedUpdateManyWithoutUserNestedInput;
    shareEvents?: Prisma.ShareEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutShareEventsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedTeams?: Prisma.TeamCreateNestedManyWithoutOwnerInput;
    teamMemberships?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    businessCards?: Prisma.BusinessCardCreateNestedManyWithoutOwnerInput;
    subscriptions?: Prisma.SubscriptionCreateNestedManyWithoutUserInput;
    savedCards?: Prisma.SavedCardCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutShareEventsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedTeams?: Prisma.TeamUncheckedCreateNestedManyWithoutOwnerInput;
    teamMemberships?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    businessCards?: Prisma.BusinessCardUncheckedCreateNestedManyWithoutOwnerInput;
    subscriptions?: Prisma.SubscriptionUncheckedCreateNestedManyWithoutUserInput;
    savedCards?: Prisma.SavedCardUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutShareEventsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutShareEventsInput, Prisma.UserUncheckedCreateWithoutShareEventsInput>;
};
export type UserUpsertWithoutShareEventsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutShareEventsInput, Prisma.UserUncheckedUpdateWithoutShareEventsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutShareEventsInput, Prisma.UserUncheckedCreateWithoutShareEventsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutShareEventsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutShareEventsInput, Prisma.UserUncheckedUpdateWithoutShareEventsInput>;
};
export type UserUpdateWithoutShareEventsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedTeams?: Prisma.TeamUpdateManyWithoutOwnerNestedInput;
    teamMemberships?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    businessCards?: Prisma.BusinessCardUpdateManyWithoutOwnerNestedInput;
    subscriptions?: Prisma.SubscriptionUpdateManyWithoutUserNestedInput;
    savedCards?: Prisma.SavedCardUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutShareEventsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedTeams?: Prisma.TeamUncheckedUpdateManyWithoutOwnerNestedInput;
    teamMemberships?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    businessCards?: Prisma.BusinessCardUncheckedUpdateManyWithoutOwnerNestedInput;
    subscriptions?: Prisma.SubscriptionUncheckedUpdateManyWithoutUserNestedInput;
    savedCards?: Prisma.SavedCardUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutSavedCardsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedTeams?: Prisma.TeamCreateNestedManyWithoutOwnerInput;
    teamMemberships?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    businessCards?: Prisma.BusinessCardCreateNestedManyWithoutOwnerInput;
    subscriptions?: Prisma.SubscriptionCreateNestedManyWithoutUserInput;
    shareEvents?: Prisma.ShareEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutSavedCardsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedTeams?: Prisma.TeamUncheckedCreateNestedManyWithoutOwnerInput;
    teamMemberships?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    businessCards?: Prisma.BusinessCardUncheckedCreateNestedManyWithoutOwnerInput;
    subscriptions?: Prisma.SubscriptionUncheckedCreateNestedManyWithoutUserInput;
    shareEvents?: Prisma.ShareEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutSavedCardsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutSavedCardsInput, Prisma.UserUncheckedCreateWithoutSavedCardsInput>;
};
export type UserUpsertWithoutSavedCardsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutSavedCardsInput, Prisma.UserUncheckedUpdateWithoutSavedCardsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutSavedCardsInput, Prisma.UserUncheckedCreateWithoutSavedCardsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutSavedCardsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutSavedCardsInput, Prisma.UserUncheckedUpdateWithoutSavedCardsInput>;
};
export type UserUpdateWithoutSavedCardsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedTeams?: Prisma.TeamUpdateManyWithoutOwnerNestedInput;
    teamMemberships?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    businessCards?: Prisma.BusinessCardUpdateManyWithoutOwnerNestedInput;
    subscriptions?: Prisma.SubscriptionUpdateManyWithoutUserNestedInput;
    shareEvents?: Prisma.ShareEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutSavedCardsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedTeams?: Prisma.TeamUncheckedUpdateManyWithoutOwnerNestedInput;
    teamMemberships?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    businessCards?: Prisma.BusinessCardUncheckedUpdateManyWithoutOwnerNestedInput;
    subscriptions?: Prisma.SubscriptionUncheckedUpdateManyWithoutUserNestedInput;
    shareEvents?: Prisma.ShareEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCountOutputType = {
    ownedTeams: number;
    teamMemberships: number;
    businessCards: number;
    subscriptions: number;
    savedCards: number;
    shareEvents: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ownedTeams?: boolean | UserCountOutputTypeCountOwnedTeamsArgs;
    teamMemberships?: boolean | UserCountOutputTypeCountTeamMembershipsArgs;
    businessCards?: boolean | UserCountOutputTypeCountBusinessCardsArgs;
    subscriptions?: boolean | UserCountOutputTypeCountSubscriptionsArgs;
    savedCards?: boolean | UserCountOutputTypeCountSavedCardsArgs;
    shareEvents?: boolean | UserCountOutputTypeCountShareEventsArgs;
};
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
export type UserCountOutputTypeCountOwnedTeamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamWhereInput;
};
export type UserCountOutputTypeCountTeamMembershipsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamMemberWhereInput;
};
export type UserCountOutputTypeCountBusinessCardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BusinessCardWhereInput;
};
export type UserCountOutputTypeCountSubscriptionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionWhereInput;
};
export type UserCountOutputTypeCountSavedCardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SavedCardWhereInput;
};
export type UserCountOutputTypeCountShareEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ShareEventWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    avatarUrl?: boolean;
    role?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    ownedTeams?: boolean | Prisma.User$ownedTeamsArgs<ExtArgs>;
    teamMemberships?: boolean | Prisma.User$teamMembershipsArgs<ExtArgs>;
    businessCards?: boolean | Prisma.User$businessCardsArgs<ExtArgs>;
    subscriptions?: boolean | Prisma.User$subscriptionsArgs<ExtArgs>;
    savedCards?: boolean | Prisma.User$savedCardsArgs<ExtArgs>;
    shareEvents?: boolean | Prisma.User$shareEventsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    avatarUrl?: boolean;
    role?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    avatarUrl?: boolean;
    role?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    avatarUrl?: boolean;
    role?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "email" | "passwordHash" | "firstName" | "lastName" | "phone" | "avatarUrl" | "role" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ownedTeams?: boolean | Prisma.User$ownedTeamsArgs<ExtArgs>;
    teamMemberships?: boolean | Prisma.User$teamMembershipsArgs<ExtArgs>;
    businessCards?: boolean | Prisma.User$businessCardsArgs<ExtArgs>;
    subscriptions?: boolean | Prisma.User$subscriptionsArgs<ExtArgs>;
    savedCards?: boolean | Prisma.User$savedCardsArgs<ExtArgs>;
    shareEvents?: boolean | Prisma.User$shareEventsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        ownedTeams: Prisma.$TeamPayload<ExtArgs>[];
        teamMemberships: Prisma.$TeamMemberPayload<ExtArgs>[];
        businessCards: Prisma.$BusinessCardPayload<ExtArgs>[];
        subscriptions: Prisma.$SubscriptionPayload<ExtArgs>[];
        savedCards: Prisma.$SavedCardPayload<ExtArgs>[];
        shareEvents: Prisma.$ShareEventPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        role: $Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFieldRefs;
}
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    ownedTeams<T extends Prisma.User$ownedTeamsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$ownedTeamsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    teamMemberships<T extends Prisma.User$teamMembershipsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$teamMembershipsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    businessCards<T extends Prisma.User$businessCardsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$businessCardsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BusinessCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    subscriptions<T extends Prisma.User$subscriptionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    savedCards<T extends Prisma.User$savedCardsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$savedCardsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SavedCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    shareEvents<T extends Prisma.User$shareEventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$shareEventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ShareEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly passwordHash: Prisma.FieldRef<"User", 'String'>;
    readonly firstName: Prisma.FieldRef<"User", 'String'>;
    readonly lastName: Prisma.FieldRef<"User", 'String'>;
    readonly phone: Prisma.FieldRef<"User", 'String'>;
    readonly avatarUrl: Prisma.FieldRef<"User", 'String'>;
    readonly role: Prisma.FieldRef<"User", 'UserRole'>;
    readonly isActive: Prisma.FieldRef<"User", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"User", 'DateTime'>;
}
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    where: Prisma.UserWhereUniqueInput;
};
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type User$ownedTeamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    cursor?: Prisma.TeamWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamScalarFieldEnum | Prisma.TeamScalarFieldEnum[];
};
export type User$teamMembershipsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamMemberSelect<ExtArgs> | null;
    omit?: Prisma.TeamMemberOmit<ExtArgs> | null;
    include?: Prisma.TeamMemberInclude<ExtArgs> | null;
    where?: Prisma.TeamMemberWhereInput;
    orderBy?: Prisma.TeamMemberOrderByWithRelationInput | Prisma.TeamMemberOrderByWithRelationInput[];
    cursor?: Prisma.TeamMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamMemberScalarFieldEnum | Prisma.TeamMemberScalarFieldEnum[];
};
export type User$businessCardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BusinessCardSelect<ExtArgs> | null;
    omit?: Prisma.BusinessCardOmit<ExtArgs> | null;
    include?: Prisma.BusinessCardInclude<ExtArgs> | null;
    where?: Prisma.BusinessCardWhereInput;
    orderBy?: Prisma.BusinessCardOrderByWithRelationInput | Prisma.BusinessCardOrderByWithRelationInput[];
    cursor?: Prisma.BusinessCardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BusinessCardScalarFieldEnum | Prisma.BusinessCardScalarFieldEnum[];
};
export type User$subscriptionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where?: Prisma.SubscriptionWhereInput;
    orderBy?: Prisma.SubscriptionOrderByWithRelationInput | Prisma.SubscriptionOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubscriptionScalarFieldEnum | Prisma.SubscriptionScalarFieldEnum[];
};
export type User$savedCardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedCardSelect<ExtArgs> | null;
    omit?: Prisma.SavedCardOmit<ExtArgs> | null;
    include?: Prisma.SavedCardInclude<ExtArgs> | null;
    where?: Prisma.SavedCardWhereInput;
    orderBy?: Prisma.SavedCardOrderByWithRelationInput | Prisma.SavedCardOrderByWithRelationInput[];
    cursor?: Prisma.SavedCardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SavedCardScalarFieldEnum | Prisma.SavedCardScalarFieldEnum[];
};
export type User$shareEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShareEventSelect<ExtArgs> | null;
    omit?: Prisma.ShareEventOmit<ExtArgs> | null;
    include?: Prisma.ShareEventInclude<ExtArgs> | null;
    where?: Prisma.ShareEventWhereInput;
    orderBy?: Prisma.ShareEventOrderByWithRelationInput | Prisma.ShareEventOrderByWithRelationInput[];
    cursor?: Prisma.ShareEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ShareEventScalarFieldEnum | Prisma.ShareEventScalarFieldEnum[];
};
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};
