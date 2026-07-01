import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SubscriptionModel = runtime.Types.Result.DefaultSelection<Prisma.$SubscriptionPayload>;
export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null;
    _min: SubscriptionMinAggregateOutputType | null;
    _max: SubscriptionMaxAggregateOutputType | null;
};
export type SubscriptionMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    teamId: string | null;
    planId: string | null;
    status: $Enums.SubscriptionStatus | null;
    billingPeriod: $Enums.BillingPeriod | null;
    currentPeriodEnd: Date | null;
    cancelledAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SubscriptionMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    teamId: string | null;
    planId: string | null;
    status: $Enums.SubscriptionStatus | null;
    billingPeriod: $Enums.BillingPeriod | null;
    currentPeriodEnd: Date | null;
    cancelledAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SubscriptionCountAggregateOutputType = {
    id: number;
    userId: number;
    teamId: number;
    planId: number;
    status: number;
    billingPeriod: number;
    currentPeriodEnd: number;
    cancelledAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type SubscriptionMinAggregateInputType = {
    id?: true;
    userId?: true;
    teamId?: true;
    planId?: true;
    status?: true;
    billingPeriod?: true;
    currentPeriodEnd?: true;
    cancelledAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SubscriptionMaxAggregateInputType = {
    id?: true;
    userId?: true;
    teamId?: true;
    planId?: true;
    status?: true;
    billingPeriod?: true;
    currentPeriodEnd?: true;
    cancelledAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SubscriptionCountAggregateInputType = {
    id?: true;
    userId?: true;
    teamId?: true;
    planId?: true;
    status?: true;
    billingPeriod?: true;
    currentPeriodEnd?: true;
    cancelledAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type SubscriptionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionWhereInput;
    orderBy?: Prisma.SubscriptionOrderByWithRelationInput | Prisma.SubscriptionOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SubscriptionCountAggregateInputType;
    _min?: SubscriptionMinAggregateInputType;
    _max?: SubscriptionMaxAggregateInputType;
};
export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
    [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSubscription[P]> : Prisma.GetScalarType<T[P], AggregateSubscription[P]>;
};
export type SubscriptionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionWhereInput;
    orderBy?: Prisma.SubscriptionOrderByWithAggregationInput | Prisma.SubscriptionOrderByWithAggregationInput[];
    by: Prisma.SubscriptionScalarFieldEnum[] | Prisma.SubscriptionScalarFieldEnum;
    having?: Prisma.SubscriptionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SubscriptionCountAggregateInputType | true;
    _min?: SubscriptionMinAggregateInputType;
    _max?: SubscriptionMaxAggregateInputType;
};
export type SubscriptionGroupByOutputType = {
    id: string;
    userId: string | null;
    teamId: string | null;
    planId: string;
    status: $Enums.SubscriptionStatus;
    billingPeriod: $Enums.BillingPeriod;
    currentPeriodEnd: Date | null;
    cancelledAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: SubscriptionCountAggregateOutputType | null;
    _min: SubscriptionMinAggregateOutputType | null;
    _max: SubscriptionMaxAggregateOutputType | null;
};
export type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SubscriptionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SubscriptionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SubscriptionGroupByOutputType[P]>;
}>>;
export type SubscriptionWhereInput = {
    AND?: Prisma.SubscriptionWhereInput | Prisma.SubscriptionWhereInput[];
    OR?: Prisma.SubscriptionWhereInput[];
    NOT?: Prisma.SubscriptionWhereInput | Prisma.SubscriptionWhereInput[];
    id?: Prisma.StringFilter<"Subscription"> | string;
    userId?: Prisma.StringNullableFilter<"Subscription"> | string | null;
    teamId?: Prisma.StringNullableFilter<"Subscription"> | string | null;
    planId?: Prisma.StringFilter<"Subscription"> | string;
    status?: Prisma.EnumSubscriptionStatusFilter<"Subscription"> | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFilter<"Subscription"> | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    cancelledAt?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    team?: Prisma.XOR<Prisma.TeamNullableScalarRelationFilter, Prisma.TeamWhereInput> | null;
    plan?: Prisma.XOR<Prisma.PlanScalarRelationFilter, Prisma.PlanWhereInput>;
};
export type SubscriptionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    teamId?: Prisma.SortOrderInput | Prisma.SortOrder;
    planId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    billingPeriod?: Prisma.SortOrder;
    currentPeriodEnd?: Prisma.SortOrderInput | Prisma.SortOrder;
    cancelledAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    team?: Prisma.TeamOrderByWithRelationInput;
    plan?: Prisma.PlanOrderByWithRelationInput;
};
export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SubscriptionWhereInput | Prisma.SubscriptionWhereInput[];
    OR?: Prisma.SubscriptionWhereInput[];
    NOT?: Prisma.SubscriptionWhereInput | Prisma.SubscriptionWhereInput[];
    userId?: Prisma.StringNullableFilter<"Subscription"> | string | null;
    teamId?: Prisma.StringNullableFilter<"Subscription"> | string | null;
    planId?: Prisma.StringFilter<"Subscription"> | string;
    status?: Prisma.EnumSubscriptionStatusFilter<"Subscription"> | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFilter<"Subscription"> | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    cancelledAt?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    team?: Prisma.XOR<Prisma.TeamNullableScalarRelationFilter, Prisma.TeamWhereInput> | null;
    plan?: Prisma.XOR<Prisma.PlanScalarRelationFilter, Prisma.PlanWhereInput>;
}, "id">;
export type SubscriptionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    teamId?: Prisma.SortOrderInput | Prisma.SortOrder;
    planId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    billingPeriod?: Prisma.SortOrder;
    currentPeriodEnd?: Prisma.SortOrderInput | Prisma.SortOrder;
    cancelledAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.SubscriptionCountOrderByAggregateInput;
    _max?: Prisma.SubscriptionMaxOrderByAggregateInput;
    _min?: Prisma.SubscriptionMinOrderByAggregateInput;
};
export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: Prisma.SubscriptionScalarWhereWithAggregatesInput | Prisma.SubscriptionScalarWhereWithAggregatesInput[];
    OR?: Prisma.SubscriptionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SubscriptionScalarWhereWithAggregatesInput | Prisma.SubscriptionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Subscription"> | string;
    userId?: Prisma.StringNullableWithAggregatesFilter<"Subscription"> | string | null;
    teamId?: Prisma.StringNullableWithAggregatesFilter<"Subscription"> | string | null;
    planId?: Prisma.StringWithAggregatesFilter<"Subscription"> | string;
    status?: Prisma.EnumSubscriptionStatusWithAggregatesFilter<"Subscription"> | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodWithAggregatesFilter<"Subscription"> | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null;
    cancelledAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Subscription"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Subscription"> | Date | string;
};
export type SubscriptionCreateInput = {
    id?: string;
    status?: $Enums.SubscriptionStatus;
    billingPeriod?: $Enums.BillingPeriod;
    currentPeriodEnd?: Date | string | null;
    cancelledAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user?: Prisma.UserCreateNestedOneWithoutSubscriptionsInput;
    team?: Prisma.TeamCreateNestedOneWithoutSubscriptionsInput;
    plan: Prisma.PlanCreateNestedOneWithoutSubscriptionsInput;
};
export type SubscriptionUncheckedCreateInput = {
    id?: string;
    userId?: string | null;
    teamId?: string | null;
    planId: string;
    status?: $Enums.SubscriptionStatus;
    billingPeriod?: $Enums.BillingPeriod;
    currentPeriodEnd?: Date | string | null;
    cancelledAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubscriptionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFieldUpdateOperationsInput | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancelledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneWithoutSubscriptionsNestedInput;
    team?: Prisma.TeamUpdateOneWithoutSubscriptionsNestedInput;
    plan?: Prisma.PlanUpdateOneRequiredWithoutSubscriptionsNestedInput;
};
export type SubscriptionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    planId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFieldUpdateOperationsInput | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancelledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionCreateManyInput = {
    id?: string;
    userId?: string | null;
    teamId?: string | null;
    planId: string;
    status?: $Enums.SubscriptionStatus;
    billingPeriod?: $Enums.BillingPeriod;
    currentPeriodEnd?: Date | string | null;
    cancelledAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubscriptionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFieldUpdateOperationsInput | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancelledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    planId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFieldUpdateOperationsInput | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancelledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionListRelationFilter = {
    every?: Prisma.SubscriptionWhereInput;
    some?: Prisma.SubscriptionWhereInput;
    none?: Prisma.SubscriptionWhereInput;
};
export type SubscriptionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SubscriptionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    planId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    billingPeriod?: Prisma.SortOrder;
    currentPeriodEnd?: Prisma.SortOrder;
    cancelledAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubscriptionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    planId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    billingPeriod?: Prisma.SortOrder;
    currentPeriodEnd?: Prisma.SortOrder;
    cancelledAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubscriptionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    planId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    billingPeriod?: Prisma.SortOrder;
    currentPeriodEnd?: Prisma.SortOrder;
    cancelledAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubscriptionCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput> | Prisma.SubscriptionCreateWithoutUserInput[] | Prisma.SubscriptionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutUserInput | Prisma.SubscriptionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SubscriptionCreateManyUserInputEnvelope;
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
};
export type SubscriptionUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput> | Prisma.SubscriptionCreateWithoutUserInput[] | Prisma.SubscriptionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutUserInput | Prisma.SubscriptionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SubscriptionCreateManyUserInputEnvelope;
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
};
export type SubscriptionUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput> | Prisma.SubscriptionCreateWithoutUserInput[] | Prisma.SubscriptionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutUserInput | Prisma.SubscriptionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SubscriptionUpsertWithWhereUniqueWithoutUserInput | Prisma.SubscriptionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SubscriptionCreateManyUserInputEnvelope;
    set?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    disconnect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    delete?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    update?: Prisma.SubscriptionUpdateWithWhereUniqueWithoutUserInput | Prisma.SubscriptionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SubscriptionUpdateManyWithWhereWithoutUserInput | Prisma.SubscriptionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
};
export type SubscriptionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput> | Prisma.SubscriptionCreateWithoutUserInput[] | Prisma.SubscriptionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutUserInput | Prisma.SubscriptionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SubscriptionUpsertWithWhereUniqueWithoutUserInput | Prisma.SubscriptionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SubscriptionCreateManyUserInputEnvelope;
    set?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    disconnect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    delete?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    update?: Prisma.SubscriptionUpdateWithWhereUniqueWithoutUserInput | Prisma.SubscriptionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SubscriptionUpdateManyWithWhereWithoutUserInput | Prisma.SubscriptionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
};
export type SubscriptionCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutTeamInput, Prisma.SubscriptionUncheckedCreateWithoutTeamInput> | Prisma.SubscriptionCreateWithoutTeamInput[] | Prisma.SubscriptionUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutTeamInput | Prisma.SubscriptionCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.SubscriptionCreateManyTeamInputEnvelope;
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
};
export type SubscriptionUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutTeamInput, Prisma.SubscriptionUncheckedCreateWithoutTeamInput> | Prisma.SubscriptionCreateWithoutTeamInput[] | Prisma.SubscriptionUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutTeamInput | Prisma.SubscriptionCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.SubscriptionCreateManyTeamInputEnvelope;
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
};
export type SubscriptionUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutTeamInput, Prisma.SubscriptionUncheckedCreateWithoutTeamInput> | Prisma.SubscriptionCreateWithoutTeamInput[] | Prisma.SubscriptionUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutTeamInput | Prisma.SubscriptionCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.SubscriptionUpsertWithWhereUniqueWithoutTeamInput | Prisma.SubscriptionUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.SubscriptionCreateManyTeamInputEnvelope;
    set?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    disconnect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    delete?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    update?: Prisma.SubscriptionUpdateWithWhereUniqueWithoutTeamInput | Prisma.SubscriptionUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.SubscriptionUpdateManyWithWhereWithoutTeamInput | Prisma.SubscriptionUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
};
export type SubscriptionUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutTeamInput, Prisma.SubscriptionUncheckedCreateWithoutTeamInput> | Prisma.SubscriptionCreateWithoutTeamInput[] | Prisma.SubscriptionUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutTeamInput | Prisma.SubscriptionCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.SubscriptionUpsertWithWhereUniqueWithoutTeamInput | Prisma.SubscriptionUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.SubscriptionCreateManyTeamInputEnvelope;
    set?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    disconnect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    delete?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    update?: Prisma.SubscriptionUpdateWithWhereUniqueWithoutTeamInput | Prisma.SubscriptionUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.SubscriptionUpdateManyWithWhereWithoutTeamInput | Prisma.SubscriptionUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
};
export type SubscriptionCreateNestedManyWithoutPlanInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutPlanInput, Prisma.SubscriptionUncheckedCreateWithoutPlanInput> | Prisma.SubscriptionCreateWithoutPlanInput[] | Prisma.SubscriptionUncheckedCreateWithoutPlanInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutPlanInput | Prisma.SubscriptionCreateOrConnectWithoutPlanInput[];
    createMany?: Prisma.SubscriptionCreateManyPlanInputEnvelope;
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
};
export type SubscriptionUncheckedCreateNestedManyWithoutPlanInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutPlanInput, Prisma.SubscriptionUncheckedCreateWithoutPlanInput> | Prisma.SubscriptionCreateWithoutPlanInput[] | Prisma.SubscriptionUncheckedCreateWithoutPlanInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutPlanInput | Prisma.SubscriptionCreateOrConnectWithoutPlanInput[];
    createMany?: Prisma.SubscriptionCreateManyPlanInputEnvelope;
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
};
export type SubscriptionUpdateManyWithoutPlanNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutPlanInput, Prisma.SubscriptionUncheckedCreateWithoutPlanInput> | Prisma.SubscriptionCreateWithoutPlanInput[] | Prisma.SubscriptionUncheckedCreateWithoutPlanInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutPlanInput | Prisma.SubscriptionCreateOrConnectWithoutPlanInput[];
    upsert?: Prisma.SubscriptionUpsertWithWhereUniqueWithoutPlanInput | Prisma.SubscriptionUpsertWithWhereUniqueWithoutPlanInput[];
    createMany?: Prisma.SubscriptionCreateManyPlanInputEnvelope;
    set?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    disconnect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    delete?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    update?: Prisma.SubscriptionUpdateWithWhereUniqueWithoutPlanInput | Prisma.SubscriptionUpdateWithWhereUniqueWithoutPlanInput[];
    updateMany?: Prisma.SubscriptionUpdateManyWithWhereWithoutPlanInput | Prisma.SubscriptionUpdateManyWithWhereWithoutPlanInput[];
    deleteMany?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
};
export type SubscriptionUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutPlanInput, Prisma.SubscriptionUncheckedCreateWithoutPlanInput> | Prisma.SubscriptionCreateWithoutPlanInput[] | Prisma.SubscriptionUncheckedCreateWithoutPlanInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutPlanInput | Prisma.SubscriptionCreateOrConnectWithoutPlanInput[];
    upsert?: Prisma.SubscriptionUpsertWithWhereUniqueWithoutPlanInput | Prisma.SubscriptionUpsertWithWhereUniqueWithoutPlanInput[];
    createMany?: Prisma.SubscriptionCreateManyPlanInputEnvelope;
    set?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    disconnect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    delete?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    update?: Prisma.SubscriptionUpdateWithWhereUniqueWithoutPlanInput | Prisma.SubscriptionUpdateWithWhereUniqueWithoutPlanInput[];
    updateMany?: Prisma.SubscriptionUpdateManyWithWhereWithoutPlanInput | Prisma.SubscriptionUpdateManyWithWhereWithoutPlanInput[];
    deleteMany?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
};
export type EnumSubscriptionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionStatus;
};
export type EnumBillingPeriodFieldUpdateOperationsInput = {
    set?: $Enums.BillingPeriod;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type SubscriptionCreateWithoutUserInput = {
    id?: string;
    status?: $Enums.SubscriptionStatus;
    billingPeriod?: $Enums.BillingPeriod;
    currentPeriodEnd?: Date | string | null;
    cancelledAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    team?: Prisma.TeamCreateNestedOneWithoutSubscriptionsInput;
    plan: Prisma.PlanCreateNestedOneWithoutSubscriptionsInput;
};
export type SubscriptionUncheckedCreateWithoutUserInput = {
    id?: string;
    teamId?: string | null;
    planId: string;
    status?: $Enums.SubscriptionStatus;
    billingPeriod?: $Enums.BillingPeriod;
    currentPeriodEnd?: Date | string | null;
    cancelledAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubscriptionCreateOrConnectWithoutUserInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput>;
};
export type SubscriptionCreateManyUserInputEnvelope = {
    data: Prisma.SubscriptionCreateManyUserInput | Prisma.SubscriptionCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type SubscriptionUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    update: Prisma.XOR<Prisma.SubscriptionUpdateWithoutUserInput, Prisma.SubscriptionUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput>;
};
export type SubscriptionUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateWithoutUserInput, Prisma.SubscriptionUncheckedUpdateWithoutUserInput>;
};
export type SubscriptionUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.SubscriptionScalarWhereInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateManyMutationInput, Prisma.SubscriptionUncheckedUpdateManyWithoutUserInput>;
};
export type SubscriptionScalarWhereInput = {
    AND?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
    OR?: Prisma.SubscriptionScalarWhereInput[];
    NOT?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
    id?: Prisma.StringFilter<"Subscription"> | string;
    userId?: Prisma.StringNullableFilter<"Subscription"> | string | null;
    teamId?: Prisma.StringNullableFilter<"Subscription"> | string | null;
    planId?: Prisma.StringFilter<"Subscription"> | string;
    status?: Prisma.EnumSubscriptionStatusFilter<"Subscription"> | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFilter<"Subscription"> | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    cancelledAt?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
};
export type SubscriptionCreateWithoutTeamInput = {
    id?: string;
    status?: $Enums.SubscriptionStatus;
    billingPeriod?: $Enums.BillingPeriod;
    currentPeriodEnd?: Date | string | null;
    cancelledAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user?: Prisma.UserCreateNestedOneWithoutSubscriptionsInput;
    plan: Prisma.PlanCreateNestedOneWithoutSubscriptionsInput;
};
export type SubscriptionUncheckedCreateWithoutTeamInput = {
    id?: string;
    userId?: string | null;
    planId: string;
    status?: $Enums.SubscriptionStatus;
    billingPeriod?: $Enums.BillingPeriod;
    currentPeriodEnd?: Date | string | null;
    cancelledAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubscriptionCreateOrConnectWithoutTeamInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutTeamInput, Prisma.SubscriptionUncheckedCreateWithoutTeamInput>;
};
export type SubscriptionCreateManyTeamInputEnvelope = {
    data: Prisma.SubscriptionCreateManyTeamInput | Prisma.SubscriptionCreateManyTeamInput[];
    skipDuplicates?: boolean;
};
export type SubscriptionUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    update: Prisma.XOR<Prisma.SubscriptionUpdateWithoutTeamInput, Prisma.SubscriptionUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutTeamInput, Prisma.SubscriptionUncheckedCreateWithoutTeamInput>;
};
export type SubscriptionUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateWithoutTeamInput, Prisma.SubscriptionUncheckedUpdateWithoutTeamInput>;
};
export type SubscriptionUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.SubscriptionScalarWhereInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateManyMutationInput, Prisma.SubscriptionUncheckedUpdateManyWithoutTeamInput>;
};
export type SubscriptionCreateWithoutPlanInput = {
    id?: string;
    status?: $Enums.SubscriptionStatus;
    billingPeriod?: $Enums.BillingPeriod;
    currentPeriodEnd?: Date | string | null;
    cancelledAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user?: Prisma.UserCreateNestedOneWithoutSubscriptionsInput;
    team?: Prisma.TeamCreateNestedOneWithoutSubscriptionsInput;
};
export type SubscriptionUncheckedCreateWithoutPlanInput = {
    id?: string;
    userId?: string | null;
    teamId?: string | null;
    status?: $Enums.SubscriptionStatus;
    billingPeriod?: $Enums.BillingPeriod;
    currentPeriodEnd?: Date | string | null;
    cancelledAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubscriptionCreateOrConnectWithoutPlanInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutPlanInput, Prisma.SubscriptionUncheckedCreateWithoutPlanInput>;
};
export type SubscriptionCreateManyPlanInputEnvelope = {
    data: Prisma.SubscriptionCreateManyPlanInput | Prisma.SubscriptionCreateManyPlanInput[];
    skipDuplicates?: boolean;
};
export type SubscriptionUpsertWithWhereUniqueWithoutPlanInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    update: Prisma.XOR<Prisma.SubscriptionUpdateWithoutPlanInput, Prisma.SubscriptionUncheckedUpdateWithoutPlanInput>;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutPlanInput, Prisma.SubscriptionUncheckedCreateWithoutPlanInput>;
};
export type SubscriptionUpdateWithWhereUniqueWithoutPlanInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateWithoutPlanInput, Prisma.SubscriptionUncheckedUpdateWithoutPlanInput>;
};
export type SubscriptionUpdateManyWithWhereWithoutPlanInput = {
    where: Prisma.SubscriptionScalarWhereInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateManyMutationInput, Prisma.SubscriptionUncheckedUpdateManyWithoutPlanInput>;
};
export type SubscriptionCreateManyUserInput = {
    id?: string;
    teamId?: string | null;
    planId: string;
    status?: $Enums.SubscriptionStatus;
    billingPeriod?: $Enums.BillingPeriod;
    currentPeriodEnd?: Date | string | null;
    cancelledAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubscriptionUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFieldUpdateOperationsInput | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancelledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    team?: Prisma.TeamUpdateOneWithoutSubscriptionsNestedInput;
    plan?: Prisma.PlanUpdateOneRequiredWithoutSubscriptionsNestedInput;
};
export type SubscriptionUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    planId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFieldUpdateOperationsInput | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancelledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    planId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFieldUpdateOperationsInput | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancelledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionCreateManyTeamInput = {
    id?: string;
    userId?: string | null;
    planId: string;
    status?: $Enums.SubscriptionStatus;
    billingPeriod?: $Enums.BillingPeriod;
    currentPeriodEnd?: Date | string | null;
    cancelledAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubscriptionUpdateWithoutTeamInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFieldUpdateOperationsInput | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancelledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneWithoutSubscriptionsNestedInput;
    plan?: Prisma.PlanUpdateOneRequiredWithoutSubscriptionsNestedInput;
};
export type SubscriptionUncheckedUpdateWithoutTeamInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    planId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFieldUpdateOperationsInput | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancelledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionUncheckedUpdateManyWithoutTeamInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    planId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFieldUpdateOperationsInput | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancelledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionCreateManyPlanInput = {
    id?: string;
    userId?: string | null;
    teamId?: string | null;
    status?: $Enums.SubscriptionStatus;
    billingPeriod?: $Enums.BillingPeriod;
    currentPeriodEnd?: Date | string | null;
    cancelledAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubscriptionUpdateWithoutPlanInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFieldUpdateOperationsInput | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancelledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneWithoutSubscriptionsNestedInput;
    team?: Prisma.TeamUpdateOneWithoutSubscriptionsNestedInput;
};
export type SubscriptionUncheckedUpdateWithoutPlanInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFieldUpdateOperationsInput | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancelledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionUncheckedUpdateManyWithoutPlanInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    billingPeriod?: Prisma.EnumBillingPeriodFieldUpdateOperationsInput | $Enums.BillingPeriod;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancelledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    teamId?: boolean;
    planId?: boolean;
    status?: boolean;
    billingPeriod?: boolean;
    currentPeriodEnd?: boolean;
    cancelledAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.Subscription$userArgs<ExtArgs>;
    team?: boolean | Prisma.Subscription$teamArgs<ExtArgs>;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["subscription"]>;
export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    teamId?: boolean;
    planId?: boolean;
    status?: boolean;
    billingPeriod?: boolean;
    currentPeriodEnd?: boolean;
    cancelledAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.Subscription$userArgs<ExtArgs>;
    team?: boolean | Prisma.Subscription$teamArgs<ExtArgs>;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["subscription"]>;
export type SubscriptionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    teamId?: boolean;
    planId?: boolean;
    status?: boolean;
    billingPeriod?: boolean;
    currentPeriodEnd?: boolean;
    cancelledAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.Subscription$userArgs<ExtArgs>;
    team?: boolean | Prisma.Subscription$teamArgs<ExtArgs>;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["subscription"]>;
export type SubscriptionSelectScalar = {
    id?: boolean;
    userId?: boolean;
    teamId?: boolean;
    planId?: boolean;
    status?: boolean;
    billingPeriod?: boolean;
    currentPeriodEnd?: boolean;
    cancelledAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type SubscriptionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "teamId" | "planId" | "status" | "billingPeriod" | "currentPeriodEnd" | "cancelledAt" | "createdAt" | "updatedAt", ExtArgs["result"]["subscription"]>;
export type SubscriptionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.Subscription$userArgs<ExtArgs>;
    team?: boolean | Prisma.Subscription$teamArgs<ExtArgs>;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
};
export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.Subscription$userArgs<ExtArgs>;
    team?: boolean | Prisma.Subscription$teamArgs<ExtArgs>;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
};
export type SubscriptionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.Subscription$userArgs<ExtArgs>;
    team?: boolean | Prisma.Subscription$teamArgs<ExtArgs>;
    plan?: boolean | Prisma.PlanDefaultArgs<ExtArgs>;
};
export type $SubscriptionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Subscription";
    objects: {
        user: Prisma.$UserPayload<ExtArgs> | null;
        team: Prisma.$TeamPayload<ExtArgs> | null;
        plan: Prisma.$PlanPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string | null;
        teamId: string | null;
        planId: string;
        status: $Enums.SubscriptionStatus;
        billingPeriod: $Enums.BillingPeriod;
        currentPeriodEnd: Date | null;
        cancelledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["subscription"]>;
    composites: {};
};
export type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload, S>;
export type SubscriptionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SubscriptionCountAggregateInputType | true;
};
export interface SubscriptionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Subscription'];
        meta: {
            name: 'Subscription';
        };
    };
    findUnique<T extends SubscriptionFindUniqueArgs>(args: Prisma.SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SubscriptionFindFirstArgs>(args?: Prisma.SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SubscriptionFindManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SubscriptionCreateArgs>(args: Prisma.SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SubscriptionCreateManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SubscriptionDeleteArgs>(args: Prisma.SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SubscriptionUpdateArgs>(args: Prisma.SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SubscriptionUpdateManyArgs>(args: Prisma.SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SubscriptionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SubscriptionUpsertArgs>(args: Prisma.SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SubscriptionCountArgs>(args?: Prisma.Subset<T, SubscriptionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SubscriptionCountAggregateOutputType> : number>;
    aggregate<T extends SubscriptionAggregateArgs>(args: Prisma.Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>;
    groupBy<T extends SubscriptionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SubscriptionGroupByArgs['orderBy'];
    } : {
        orderBy?: SubscriptionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SubscriptionFieldRefs;
}
export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.Subscription$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Subscription$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    team<T extends Prisma.Subscription$teamArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Subscription$teamArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    plan<T extends Prisma.PlanDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PlanDefaultArgs<ExtArgs>>): Prisma.Prisma__PlanClient<runtime.Types.Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SubscriptionFieldRefs {
    readonly id: Prisma.FieldRef<"Subscription", 'String'>;
    readonly userId: Prisma.FieldRef<"Subscription", 'String'>;
    readonly teamId: Prisma.FieldRef<"Subscription", 'String'>;
    readonly planId: Prisma.FieldRef<"Subscription", 'String'>;
    readonly status: Prisma.FieldRef<"Subscription", 'SubscriptionStatus'>;
    readonly billingPeriod: Prisma.FieldRef<"Subscription", 'BillingPeriod'>;
    readonly currentPeriodEnd: Prisma.FieldRef<"Subscription", 'DateTime'>;
    readonly cancelledAt: Prisma.FieldRef<"Subscription", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Subscription", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Subscription", 'DateTime'>;
}
export type SubscriptionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SubscriptionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SubscriptionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionCreateInput, Prisma.SubscriptionUncheckedCreateInput>;
};
export type SubscriptionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SubscriptionCreateManyInput | Prisma.SubscriptionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    data: Prisma.SubscriptionCreateManyInput | Prisma.SubscriptionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SubscriptionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionUpdateInput, Prisma.SubscriptionUncheckedUpdateInput>;
    where: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SubscriptionUpdateManyMutationInput, Prisma.SubscriptionUncheckedUpdateManyInput>;
    where?: Prisma.SubscriptionWhereInput;
    limit?: number;
};
export type SubscriptionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionUpdateManyMutationInput, Prisma.SubscriptionUncheckedUpdateManyInput>;
    where?: Prisma.SubscriptionWhereInput;
    limit?: number;
    include?: Prisma.SubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SubscriptionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where: Prisma.SubscriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubscriptionCreateInput, Prisma.SubscriptionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SubscriptionUpdateInput, Prisma.SubscriptionUncheckedUpdateInput>;
};
export type SubscriptionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionWhereInput;
    limit?: number;
};
export type Subscription$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Subscription$teamArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where?: Prisma.TeamWhereInput;
};
export type SubscriptionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
};
