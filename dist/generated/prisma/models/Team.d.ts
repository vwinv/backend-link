import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TeamModel = runtime.Types.Result.DefaultSelection<Prisma.$TeamPayload>;
export type AggregateTeam = {
    _count: TeamCountAggregateOutputType | null;
    _min: TeamMinAggregateOutputType | null;
    _max: TeamMaxAggregateOutputType | null;
};
export type TeamMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    slug: string | null;
    description: string | null;
    logoUrl: string | null;
    ownerId: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TeamMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    slug: string | null;
    description: string | null;
    logoUrl: string | null;
    ownerId: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TeamCountAggregateOutputType = {
    id: number;
    name: number;
    slug: number;
    description: number;
    logoUrl: number;
    ownerId: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type TeamMinAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    description?: true;
    logoUrl?: true;
    ownerId?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TeamMaxAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    description?: true;
    logoUrl?: true;
    ownerId?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TeamCountAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    description?: true;
    logoUrl?: true;
    ownerId?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type TeamAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    cursor?: Prisma.TeamWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TeamCountAggregateInputType;
    _min?: TeamMinAggregateInputType;
    _max?: TeamMaxAggregateInputType;
};
export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
    [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTeam[P]> : Prisma.GetScalarType<T[P], AggregateTeam[P]>;
};
export type TeamGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithAggregationInput | Prisma.TeamOrderByWithAggregationInput[];
    by: Prisma.TeamScalarFieldEnum[] | Prisma.TeamScalarFieldEnum;
    having?: Prisma.TeamScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TeamCountAggregateInputType | true;
    _min?: TeamMinAggregateInputType;
    _max?: TeamMaxAggregateInputType;
};
export type TeamGroupByOutputType = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
    ownerId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: TeamCountAggregateOutputType | null;
    _min: TeamMinAggregateOutputType | null;
    _max: TeamMaxAggregateOutputType | null;
};
export type GetTeamGroupByPayload<T extends TeamGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TeamGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TeamGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TeamGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TeamGroupByOutputType[P]>;
}>>;
export type TeamWhereInput = {
    AND?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    OR?: Prisma.TeamWhereInput[];
    NOT?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    id?: Prisma.StringFilter<"Team"> | string;
    name?: Prisma.StringFilter<"Team"> | string;
    slug?: Prisma.StringFilter<"Team"> | string;
    description?: Prisma.StringNullableFilter<"Team"> | string | null;
    logoUrl?: Prisma.StringNullableFilter<"Team"> | string | null;
    ownerId?: Prisma.StringFilter<"Team"> | string;
    isActive?: Prisma.BoolFilter<"Team"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Team"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Team"> | Date | string;
    owner?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    members?: Prisma.TeamMemberListRelationFilter;
    businessCards?: Prisma.BusinessCardListRelationFilter;
    subscriptions?: Prisma.SubscriptionListRelationFilter;
};
export type TeamOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    logoUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    owner?: Prisma.UserOrderByWithRelationInput;
    members?: Prisma.TeamMemberOrderByRelationAggregateInput;
    businessCards?: Prisma.BusinessCardOrderByRelationAggregateInput;
    subscriptions?: Prisma.SubscriptionOrderByRelationAggregateInput;
};
export type TeamWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    slug?: string;
    AND?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    OR?: Prisma.TeamWhereInput[];
    NOT?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    name?: Prisma.StringFilter<"Team"> | string;
    description?: Prisma.StringNullableFilter<"Team"> | string | null;
    logoUrl?: Prisma.StringNullableFilter<"Team"> | string | null;
    ownerId?: Prisma.StringFilter<"Team"> | string;
    isActive?: Prisma.BoolFilter<"Team"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Team"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Team"> | Date | string;
    owner?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    members?: Prisma.TeamMemberListRelationFilter;
    businessCards?: Prisma.BusinessCardListRelationFilter;
    subscriptions?: Prisma.SubscriptionListRelationFilter;
}, "id" | "slug">;
export type TeamOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    logoUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.TeamCountOrderByAggregateInput;
    _max?: Prisma.TeamMaxOrderByAggregateInput;
    _min?: Prisma.TeamMinOrderByAggregateInput;
};
export type TeamScalarWhereWithAggregatesInput = {
    AND?: Prisma.TeamScalarWhereWithAggregatesInput | Prisma.TeamScalarWhereWithAggregatesInput[];
    OR?: Prisma.TeamScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TeamScalarWhereWithAggregatesInput | Prisma.TeamScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Team"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Team"> | string;
    slug?: Prisma.StringWithAggregatesFilter<"Team"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Team"> | string | null;
    logoUrl?: Prisma.StringNullableWithAggregatesFilter<"Team"> | string | null;
    ownerId?: Prisma.StringWithAggregatesFilter<"Team"> | string;
    isActive?: Prisma.BoolWithAggregatesFilter<"Team"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Team"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Team"> | Date | string;
};
export type TeamCreateInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    logoUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: Prisma.UserCreateNestedOneWithoutOwnedTeamsInput;
    members?: Prisma.TeamMemberCreateNestedManyWithoutTeamInput;
    businessCards?: Prisma.BusinessCardCreateNestedManyWithoutTeamInput;
    subscriptions?: Prisma.SubscriptionCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    logoUrl?: string | null;
    ownerId: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutTeamInput;
    businessCards?: Prisma.BusinessCardUncheckedCreateNestedManyWithoutTeamInput;
    subscriptions?: Prisma.SubscriptionUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneRequiredWithoutOwnedTeamsNestedInput;
    members?: Prisma.TeamMemberUpdateManyWithoutTeamNestedInput;
    businessCards?: Prisma.BusinessCardUpdateManyWithoutTeamNestedInput;
    subscriptions?: Prisma.SubscriptionUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.TeamMemberUncheckedUpdateManyWithoutTeamNestedInput;
    businessCards?: Prisma.BusinessCardUncheckedUpdateManyWithoutTeamNestedInput;
    subscriptions?: Prisma.SubscriptionUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateManyInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    logoUrl?: string | null;
    ownerId: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeamUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeamUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeamListRelationFilter = {
    every?: Prisma.TeamWhereInput;
    some?: Prisma.TeamWhereInput;
    none?: Prisma.TeamWhereInput;
};
export type TeamOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TeamCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    logoUrl?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TeamMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    logoUrl?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TeamMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    logoUrl?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TeamScalarRelationFilter = {
    is?: Prisma.TeamWhereInput;
    isNot?: Prisma.TeamWhereInput;
};
export type TeamNullableScalarRelationFilter = {
    is?: Prisma.TeamWhereInput | null;
    isNot?: Prisma.TeamWhereInput | null;
};
export type TeamCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutOwnerInput, Prisma.TeamUncheckedCreateWithoutOwnerInput> | Prisma.TeamCreateWithoutOwnerInput[] | Prisma.TeamUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutOwnerInput | Prisma.TeamCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.TeamCreateManyOwnerInputEnvelope;
    connect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
};
export type TeamUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutOwnerInput, Prisma.TeamUncheckedCreateWithoutOwnerInput> | Prisma.TeamCreateWithoutOwnerInput[] | Prisma.TeamUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutOwnerInput | Prisma.TeamCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.TeamCreateManyOwnerInputEnvelope;
    connect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
};
export type TeamUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutOwnerInput, Prisma.TeamUncheckedCreateWithoutOwnerInput> | Prisma.TeamCreateWithoutOwnerInput[] | Prisma.TeamUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutOwnerInput | Prisma.TeamCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.TeamUpsertWithWhereUniqueWithoutOwnerInput | Prisma.TeamUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.TeamCreateManyOwnerInputEnvelope;
    set?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    disconnect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    delete?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    connect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    update?: Prisma.TeamUpdateWithWhereUniqueWithoutOwnerInput | Prisma.TeamUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.TeamUpdateManyWithWhereWithoutOwnerInput | Prisma.TeamUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.TeamScalarWhereInput | Prisma.TeamScalarWhereInput[];
};
export type TeamUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutOwnerInput, Prisma.TeamUncheckedCreateWithoutOwnerInput> | Prisma.TeamCreateWithoutOwnerInput[] | Prisma.TeamUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutOwnerInput | Prisma.TeamCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.TeamUpsertWithWhereUniqueWithoutOwnerInput | Prisma.TeamUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.TeamCreateManyOwnerInputEnvelope;
    set?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    disconnect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    delete?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    connect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    update?: Prisma.TeamUpdateWithWhereUniqueWithoutOwnerInput | Prisma.TeamUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.TeamUpdateManyWithWhereWithoutOwnerInput | Prisma.TeamUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.TeamScalarWhereInput | Prisma.TeamScalarWhereInput[];
};
export type TeamCreateNestedOneWithoutMembersInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMembersInput, Prisma.TeamUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMembersInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutMembersNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMembersInput, Prisma.TeamUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMembersInput;
    upsert?: Prisma.TeamUpsertWithoutMembersInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutMembersInput, Prisma.TeamUpdateWithoutMembersInput>, Prisma.TeamUncheckedUpdateWithoutMembersInput>;
};
export type TeamCreateNestedOneWithoutBusinessCardsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutBusinessCardsInput, Prisma.TeamUncheckedCreateWithoutBusinessCardsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutBusinessCardsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneWithoutBusinessCardsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutBusinessCardsInput, Prisma.TeamUncheckedCreateWithoutBusinessCardsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutBusinessCardsInput;
    upsert?: Prisma.TeamUpsertWithoutBusinessCardsInput;
    disconnect?: Prisma.TeamWhereInput | boolean;
    delete?: Prisma.TeamWhereInput | boolean;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutBusinessCardsInput, Prisma.TeamUpdateWithoutBusinessCardsInput>, Prisma.TeamUncheckedUpdateWithoutBusinessCardsInput>;
};
export type TeamCreateNestedOneWithoutSubscriptionsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutSubscriptionsInput, Prisma.TeamUncheckedCreateWithoutSubscriptionsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutSubscriptionsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneWithoutSubscriptionsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutSubscriptionsInput, Prisma.TeamUncheckedCreateWithoutSubscriptionsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutSubscriptionsInput;
    upsert?: Prisma.TeamUpsertWithoutSubscriptionsInput;
    disconnect?: Prisma.TeamWhereInput | boolean;
    delete?: Prisma.TeamWhereInput | boolean;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutSubscriptionsInput, Prisma.TeamUpdateWithoutSubscriptionsInput>, Prisma.TeamUncheckedUpdateWithoutSubscriptionsInput>;
};
export type TeamCreateWithoutOwnerInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    logoUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.TeamMemberCreateNestedManyWithoutTeamInput;
    businessCards?: Prisma.BusinessCardCreateNestedManyWithoutTeamInput;
    subscriptions?: Prisma.SubscriptionCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutOwnerInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    logoUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutTeamInput;
    businessCards?: Prisma.BusinessCardUncheckedCreateNestedManyWithoutTeamInput;
    subscriptions?: Prisma.SubscriptionUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutOwnerInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutOwnerInput, Prisma.TeamUncheckedCreateWithoutOwnerInput>;
};
export type TeamCreateManyOwnerInputEnvelope = {
    data: Prisma.TeamCreateManyOwnerInput | Prisma.TeamCreateManyOwnerInput[];
    skipDuplicates?: boolean;
};
export type TeamUpsertWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.TeamWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamUpdateWithoutOwnerInput, Prisma.TeamUncheckedUpdateWithoutOwnerInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutOwnerInput, Prisma.TeamUncheckedCreateWithoutOwnerInput>;
};
export type TeamUpdateWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.TeamWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutOwnerInput, Prisma.TeamUncheckedUpdateWithoutOwnerInput>;
};
export type TeamUpdateManyWithWhereWithoutOwnerInput = {
    where: Prisma.TeamScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateManyMutationInput, Prisma.TeamUncheckedUpdateManyWithoutOwnerInput>;
};
export type TeamScalarWhereInput = {
    AND?: Prisma.TeamScalarWhereInput | Prisma.TeamScalarWhereInput[];
    OR?: Prisma.TeamScalarWhereInput[];
    NOT?: Prisma.TeamScalarWhereInput | Prisma.TeamScalarWhereInput[];
    id?: Prisma.StringFilter<"Team"> | string;
    name?: Prisma.StringFilter<"Team"> | string;
    slug?: Prisma.StringFilter<"Team"> | string;
    description?: Prisma.StringNullableFilter<"Team"> | string | null;
    logoUrl?: Prisma.StringNullableFilter<"Team"> | string | null;
    ownerId?: Prisma.StringFilter<"Team"> | string;
    isActive?: Prisma.BoolFilter<"Team"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Team"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Team"> | Date | string;
};
export type TeamCreateWithoutMembersInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    logoUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: Prisma.UserCreateNestedOneWithoutOwnedTeamsInput;
    businessCards?: Prisma.BusinessCardCreateNestedManyWithoutTeamInput;
    subscriptions?: Prisma.SubscriptionCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutMembersInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    logoUrl?: string | null;
    ownerId: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    businessCards?: Prisma.BusinessCardUncheckedCreateNestedManyWithoutTeamInput;
    subscriptions?: Prisma.SubscriptionUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutMembersInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMembersInput, Prisma.TeamUncheckedCreateWithoutMembersInput>;
};
export type TeamUpsertWithoutMembersInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutMembersInput, Prisma.TeamUncheckedUpdateWithoutMembersInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMembersInput, Prisma.TeamUncheckedCreateWithoutMembersInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutMembersInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutMembersInput, Prisma.TeamUncheckedUpdateWithoutMembersInput>;
};
export type TeamUpdateWithoutMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneRequiredWithoutOwnedTeamsNestedInput;
    businessCards?: Prisma.BusinessCardUpdateManyWithoutTeamNestedInput;
    subscriptions?: Prisma.SubscriptionUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    businessCards?: Prisma.BusinessCardUncheckedUpdateManyWithoutTeamNestedInput;
    subscriptions?: Prisma.SubscriptionUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutBusinessCardsInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    logoUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: Prisma.UserCreateNestedOneWithoutOwnedTeamsInput;
    members?: Prisma.TeamMemberCreateNestedManyWithoutTeamInput;
    subscriptions?: Prisma.SubscriptionCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutBusinessCardsInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    logoUrl?: string | null;
    ownerId: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutTeamInput;
    subscriptions?: Prisma.SubscriptionUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutBusinessCardsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutBusinessCardsInput, Prisma.TeamUncheckedCreateWithoutBusinessCardsInput>;
};
export type TeamUpsertWithoutBusinessCardsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutBusinessCardsInput, Prisma.TeamUncheckedUpdateWithoutBusinessCardsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutBusinessCardsInput, Prisma.TeamUncheckedCreateWithoutBusinessCardsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutBusinessCardsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutBusinessCardsInput, Prisma.TeamUncheckedUpdateWithoutBusinessCardsInput>;
};
export type TeamUpdateWithoutBusinessCardsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneRequiredWithoutOwnedTeamsNestedInput;
    members?: Prisma.TeamMemberUpdateManyWithoutTeamNestedInput;
    subscriptions?: Prisma.SubscriptionUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutBusinessCardsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.TeamMemberUncheckedUpdateManyWithoutTeamNestedInput;
    subscriptions?: Prisma.SubscriptionUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutSubscriptionsInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    logoUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: Prisma.UserCreateNestedOneWithoutOwnedTeamsInput;
    members?: Prisma.TeamMemberCreateNestedManyWithoutTeamInput;
    businessCards?: Prisma.BusinessCardCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutSubscriptionsInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    logoUrl?: string | null;
    ownerId: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutTeamInput;
    businessCards?: Prisma.BusinessCardUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutSubscriptionsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutSubscriptionsInput, Prisma.TeamUncheckedCreateWithoutSubscriptionsInput>;
};
export type TeamUpsertWithoutSubscriptionsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutSubscriptionsInput, Prisma.TeamUncheckedUpdateWithoutSubscriptionsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutSubscriptionsInput, Prisma.TeamUncheckedCreateWithoutSubscriptionsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutSubscriptionsInput, Prisma.TeamUncheckedUpdateWithoutSubscriptionsInput>;
};
export type TeamUpdateWithoutSubscriptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneRequiredWithoutOwnedTeamsNestedInput;
    members?: Prisma.TeamMemberUpdateManyWithoutTeamNestedInput;
    businessCards?: Prisma.BusinessCardUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutSubscriptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.TeamMemberUncheckedUpdateManyWithoutTeamNestedInput;
    businessCards?: Prisma.BusinessCardUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateManyOwnerInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    logoUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeamUpdateWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.TeamMemberUpdateManyWithoutTeamNestedInput;
    businessCards?: Prisma.BusinessCardUpdateManyWithoutTeamNestedInput;
    subscriptions?: Prisma.SubscriptionUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.TeamMemberUncheckedUpdateManyWithoutTeamNestedInput;
    businessCards?: Prisma.BusinessCardUncheckedUpdateManyWithoutTeamNestedInput;
    subscriptions?: Prisma.SubscriptionUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateManyWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeamCountOutputType = {
    members: number;
    businessCards: number;
    subscriptions: number;
};
export type TeamCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    members?: boolean | TeamCountOutputTypeCountMembersArgs;
    businessCards?: boolean | TeamCountOutputTypeCountBusinessCardsArgs;
    subscriptions?: boolean | TeamCountOutputTypeCountSubscriptionsArgs;
};
export type TeamCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamCountOutputTypeSelect<ExtArgs> | null;
};
export type TeamCountOutputTypeCountMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamMemberWhereInput;
};
export type TeamCountOutputTypeCountBusinessCardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BusinessCardWhereInput;
};
export type TeamCountOutputTypeCountSubscriptionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionWhereInput;
};
export type TeamSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    description?: boolean;
    logoUrl?: boolean;
    ownerId?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    members?: boolean | Prisma.Team$membersArgs<ExtArgs>;
    businessCards?: boolean | Prisma.Team$businessCardsArgs<ExtArgs>;
    subscriptions?: boolean | Prisma.Team$subscriptionsArgs<ExtArgs>;
    _count?: boolean | Prisma.TeamCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["team"]>;
export type TeamSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    description?: boolean;
    logoUrl?: boolean;
    ownerId?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["team"]>;
export type TeamSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    description?: boolean;
    logoUrl?: boolean;
    ownerId?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["team"]>;
export type TeamSelectScalar = {
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    description?: boolean;
    logoUrl?: boolean;
    ownerId?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type TeamOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "slug" | "description" | "logoUrl" | "ownerId" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["team"]>;
export type TeamInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    members?: boolean | Prisma.Team$membersArgs<ExtArgs>;
    businessCards?: boolean | Prisma.Team$businessCardsArgs<ExtArgs>;
    subscriptions?: boolean | Prisma.Team$subscriptionsArgs<ExtArgs>;
    _count?: boolean | Prisma.TeamCountOutputTypeDefaultArgs<ExtArgs>;
};
export type TeamIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TeamIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $TeamPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Team";
    objects: {
        owner: Prisma.$UserPayload<ExtArgs>;
        members: Prisma.$TeamMemberPayload<ExtArgs>[];
        businessCards: Prisma.$BusinessCardPayload<ExtArgs>[];
        subscriptions: Prisma.$SubscriptionPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        ownerId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["team"]>;
    composites: {};
};
export type TeamGetPayload<S extends boolean | null | undefined | TeamDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TeamPayload, S>;
export type TeamCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TeamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TeamCountAggregateInputType | true;
};
export interface TeamDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Team'];
        meta: {
            name: 'Team';
        };
    };
    findUnique<T extends TeamFindUniqueArgs>(args: Prisma.SelectSubset<T, TeamFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TeamFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TeamFindFirstArgs>(args?: Prisma.SelectSubset<T, TeamFindFirstArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TeamFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TeamFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TeamFindManyArgs>(args?: Prisma.SelectSubset<T, TeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TeamCreateArgs>(args: Prisma.SelectSubset<T, TeamCreateArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TeamCreateManyArgs>(args?: Prisma.SelectSubset<T, TeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TeamCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TeamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TeamDeleteArgs>(args: Prisma.SelectSubset<T, TeamDeleteArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TeamUpdateArgs>(args: Prisma.SelectSubset<T, TeamUpdateArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TeamDeleteManyArgs>(args?: Prisma.SelectSubset<T, TeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TeamUpdateManyArgs>(args: Prisma.SelectSubset<T, TeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TeamUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TeamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TeamUpsertArgs>(args: Prisma.SelectSubset<T, TeamUpsertArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TeamCountArgs>(args?: Prisma.Subset<T, TeamCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TeamCountAggregateOutputType> : number>;
    aggregate<T extends TeamAggregateArgs>(args: Prisma.Subset<T, TeamAggregateArgs>): Prisma.PrismaPromise<GetTeamAggregateType<T>>;
    groupBy<T extends TeamGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TeamGroupByArgs['orderBy'];
    } : {
        orderBy?: TeamGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TeamFieldRefs;
}
export interface Prisma__TeamClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    owner<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    members<T extends Prisma.Team$membersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$membersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    businessCards<T extends Prisma.Team$businessCardsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$businessCardsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BusinessCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    subscriptions<T extends Prisma.Team$subscriptionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TeamFieldRefs {
    readonly id: Prisma.FieldRef<"Team", 'String'>;
    readonly name: Prisma.FieldRef<"Team", 'String'>;
    readonly slug: Prisma.FieldRef<"Team", 'String'>;
    readonly description: Prisma.FieldRef<"Team", 'String'>;
    readonly logoUrl: Prisma.FieldRef<"Team", 'String'>;
    readonly ownerId: Prisma.FieldRef<"Team", 'String'>;
    readonly isActive: Prisma.FieldRef<"Team", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Team", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Team", 'DateTime'>;
}
export type TeamFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where: Prisma.TeamWhereUniqueInput;
};
export type TeamFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where: Prisma.TeamWhereUniqueInput;
};
export type TeamFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TeamFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TeamFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TeamCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeamCreateInput, Prisma.TeamUncheckedCreateInput>;
};
export type TeamCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TeamCreateManyInput | Prisma.TeamCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TeamCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    data: Prisma.TeamCreateManyInput | Prisma.TeamCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TeamIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TeamUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeamUpdateInput, Prisma.TeamUncheckedUpdateInput>;
    where: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TeamUpdateManyMutationInput, Prisma.TeamUncheckedUpdateManyInput>;
    where?: Prisma.TeamWhereInput;
    limit?: number;
};
export type TeamUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeamUpdateManyMutationInput, Prisma.TeamUncheckedUpdateManyInput>;
    where?: Prisma.TeamWhereInput;
    limit?: number;
    include?: Prisma.TeamIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TeamUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateInput, Prisma.TeamUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TeamUpdateInput, Prisma.TeamUncheckedUpdateInput>;
};
export type TeamDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where: Prisma.TeamWhereUniqueInput;
};
export type TeamDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamWhereInput;
    limit?: number;
};
export type Team$membersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Team$businessCardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Team$subscriptionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TeamDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
};
