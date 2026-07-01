import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ShareEventModel = runtime.Types.Result.DefaultSelection<Prisma.$ShareEventPayload>;
export type AggregateShareEvent = {
    _count: ShareEventCountAggregateOutputType | null;
    _min: ShareEventMinAggregateOutputType | null;
    _max: ShareEventMaxAggregateOutputType | null;
};
export type ShareEventMinAggregateOutputType = {
    id: string | null;
    cardId: string | null;
    userId: string | null;
    method: $Enums.ShareMethod | null;
    createdAt: Date | null;
};
export type ShareEventMaxAggregateOutputType = {
    id: string | null;
    cardId: string | null;
    userId: string | null;
    method: $Enums.ShareMethod | null;
    createdAt: Date | null;
};
export type ShareEventCountAggregateOutputType = {
    id: number;
    cardId: number;
    userId: number;
    method: number;
    metadata: number;
    createdAt: number;
    _all: number;
};
export type ShareEventMinAggregateInputType = {
    id?: true;
    cardId?: true;
    userId?: true;
    method?: true;
    createdAt?: true;
};
export type ShareEventMaxAggregateInputType = {
    id?: true;
    cardId?: true;
    userId?: true;
    method?: true;
    createdAt?: true;
};
export type ShareEventCountAggregateInputType = {
    id?: true;
    cardId?: true;
    userId?: true;
    method?: true;
    metadata?: true;
    createdAt?: true;
    _all?: true;
};
export type ShareEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ShareEventWhereInput;
    orderBy?: Prisma.ShareEventOrderByWithRelationInput | Prisma.ShareEventOrderByWithRelationInput[];
    cursor?: Prisma.ShareEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ShareEventCountAggregateInputType;
    _min?: ShareEventMinAggregateInputType;
    _max?: ShareEventMaxAggregateInputType;
};
export type GetShareEventAggregateType<T extends ShareEventAggregateArgs> = {
    [P in keyof T & keyof AggregateShareEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateShareEvent[P]> : Prisma.GetScalarType<T[P], AggregateShareEvent[P]>;
};
export type ShareEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ShareEventWhereInput;
    orderBy?: Prisma.ShareEventOrderByWithAggregationInput | Prisma.ShareEventOrderByWithAggregationInput[];
    by: Prisma.ShareEventScalarFieldEnum[] | Prisma.ShareEventScalarFieldEnum;
    having?: Prisma.ShareEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ShareEventCountAggregateInputType | true;
    _min?: ShareEventMinAggregateInputType;
    _max?: ShareEventMaxAggregateInputType;
};
export type ShareEventGroupByOutputType = {
    id: string;
    cardId: string;
    userId: string | null;
    method: $Enums.ShareMethod;
    metadata: runtime.JsonValue;
    createdAt: Date;
    _count: ShareEventCountAggregateOutputType | null;
    _min: ShareEventMinAggregateOutputType | null;
    _max: ShareEventMaxAggregateOutputType | null;
};
export type GetShareEventGroupByPayload<T extends ShareEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ShareEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ShareEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ShareEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ShareEventGroupByOutputType[P]>;
}>>;
export type ShareEventWhereInput = {
    AND?: Prisma.ShareEventWhereInput | Prisma.ShareEventWhereInput[];
    OR?: Prisma.ShareEventWhereInput[];
    NOT?: Prisma.ShareEventWhereInput | Prisma.ShareEventWhereInput[];
    id?: Prisma.StringFilter<"ShareEvent"> | string;
    cardId?: Prisma.StringFilter<"ShareEvent"> | string;
    userId?: Prisma.StringNullableFilter<"ShareEvent"> | string | null;
    method?: Prisma.EnumShareMethodFilter<"ShareEvent"> | $Enums.ShareMethod;
    metadata?: Prisma.JsonFilter<"ShareEvent">;
    createdAt?: Prisma.DateTimeFilter<"ShareEvent"> | Date | string;
    card?: Prisma.XOR<Prisma.BusinessCardScalarRelationFilter, Prisma.BusinessCardWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type ShareEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    method?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    card?: Prisma.BusinessCardOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type ShareEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ShareEventWhereInput | Prisma.ShareEventWhereInput[];
    OR?: Prisma.ShareEventWhereInput[];
    NOT?: Prisma.ShareEventWhereInput | Prisma.ShareEventWhereInput[];
    cardId?: Prisma.StringFilter<"ShareEvent"> | string;
    userId?: Prisma.StringNullableFilter<"ShareEvent"> | string | null;
    method?: Prisma.EnumShareMethodFilter<"ShareEvent"> | $Enums.ShareMethod;
    metadata?: Prisma.JsonFilter<"ShareEvent">;
    createdAt?: Prisma.DateTimeFilter<"ShareEvent"> | Date | string;
    card?: Prisma.XOR<Prisma.BusinessCardScalarRelationFilter, Prisma.BusinessCardWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type ShareEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    method?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ShareEventCountOrderByAggregateInput;
    _max?: Prisma.ShareEventMaxOrderByAggregateInput;
    _min?: Prisma.ShareEventMinOrderByAggregateInput;
};
export type ShareEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.ShareEventScalarWhereWithAggregatesInput | Prisma.ShareEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.ShareEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ShareEventScalarWhereWithAggregatesInput | Prisma.ShareEventScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ShareEvent"> | string;
    cardId?: Prisma.StringWithAggregatesFilter<"ShareEvent"> | string;
    userId?: Prisma.StringNullableWithAggregatesFilter<"ShareEvent"> | string | null;
    method?: Prisma.EnumShareMethodWithAggregatesFilter<"ShareEvent"> | $Enums.ShareMethod;
    metadata?: Prisma.JsonWithAggregatesFilter<"ShareEvent">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ShareEvent"> | Date | string;
};
export type ShareEventCreateInput = {
    id?: string;
    method: $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    card: Prisma.BusinessCardCreateNestedOneWithoutShareEventsInput;
    user?: Prisma.UserCreateNestedOneWithoutShareEventsInput;
};
export type ShareEventUncheckedCreateInput = {
    id?: string;
    cardId: string;
    userId?: string | null;
    method: $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type ShareEventUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    method?: Prisma.EnumShareMethodFieldUpdateOperationsInput | $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    card?: Prisma.BusinessCardUpdateOneRequiredWithoutShareEventsNestedInput;
    user?: Prisma.UserUpdateOneWithoutShareEventsNestedInput;
};
export type ShareEventUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cardId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    method?: Prisma.EnumShareMethodFieldUpdateOperationsInput | $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ShareEventCreateManyInput = {
    id?: string;
    cardId: string;
    userId?: string | null;
    method: $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type ShareEventUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    method?: Prisma.EnumShareMethodFieldUpdateOperationsInput | $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ShareEventUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cardId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    method?: Prisma.EnumShareMethodFieldUpdateOperationsInput | $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ShareEventListRelationFilter = {
    every?: Prisma.ShareEventWhereInput;
    some?: Prisma.ShareEventWhereInput;
    none?: Prisma.ShareEventWhereInput;
};
export type ShareEventOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ShareEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ShareEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ShareEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ShareEventCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ShareEventCreateWithoutUserInput, Prisma.ShareEventUncheckedCreateWithoutUserInput> | Prisma.ShareEventCreateWithoutUserInput[] | Prisma.ShareEventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ShareEventCreateOrConnectWithoutUserInput | Prisma.ShareEventCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ShareEventCreateManyUserInputEnvelope;
    connect?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
};
export type ShareEventUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ShareEventCreateWithoutUserInput, Prisma.ShareEventUncheckedCreateWithoutUserInput> | Prisma.ShareEventCreateWithoutUserInput[] | Prisma.ShareEventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ShareEventCreateOrConnectWithoutUserInput | Prisma.ShareEventCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ShareEventCreateManyUserInputEnvelope;
    connect?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
};
export type ShareEventUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ShareEventCreateWithoutUserInput, Prisma.ShareEventUncheckedCreateWithoutUserInput> | Prisma.ShareEventCreateWithoutUserInput[] | Prisma.ShareEventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ShareEventCreateOrConnectWithoutUserInput | Prisma.ShareEventCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ShareEventUpsertWithWhereUniqueWithoutUserInput | Prisma.ShareEventUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ShareEventCreateManyUserInputEnvelope;
    set?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    disconnect?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    delete?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    connect?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    update?: Prisma.ShareEventUpdateWithWhereUniqueWithoutUserInput | Prisma.ShareEventUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ShareEventUpdateManyWithWhereWithoutUserInput | Prisma.ShareEventUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ShareEventScalarWhereInput | Prisma.ShareEventScalarWhereInput[];
};
export type ShareEventUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ShareEventCreateWithoutUserInput, Prisma.ShareEventUncheckedCreateWithoutUserInput> | Prisma.ShareEventCreateWithoutUserInput[] | Prisma.ShareEventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ShareEventCreateOrConnectWithoutUserInput | Prisma.ShareEventCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ShareEventUpsertWithWhereUniqueWithoutUserInput | Prisma.ShareEventUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ShareEventCreateManyUserInputEnvelope;
    set?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    disconnect?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    delete?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    connect?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    update?: Prisma.ShareEventUpdateWithWhereUniqueWithoutUserInput | Prisma.ShareEventUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ShareEventUpdateManyWithWhereWithoutUserInput | Prisma.ShareEventUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ShareEventScalarWhereInput | Prisma.ShareEventScalarWhereInput[];
};
export type ShareEventCreateNestedManyWithoutCardInput = {
    create?: Prisma.XOR<Prisma.ShareEventCreateWithoutCardInput, Prisma.ShareEventUncheckedCreateWithoutCardInput> | Prisma.ShareEventCreateWithoutCardInput[] | Prisma.ShareEventUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.ShareEventCreateOrConnectWithoutCardInput | Prisma.ShareEventCreateOrConnectWithoutCardInput[];
    createMany?: Prisma.ShareEventCreateManyCardInputEnvelope;
    connect?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
};
export type ShareEventUncheckedCreateNestedManyWithoutCardInput = {
    create?: Prisma.XOR<Prisma.ShareEventCreateWithoutCardInput, Prisma.ShareEventUncheckedCreateWithoutCardInput> | Prisma.ShareEventCreateWithoutCardInput[] | Prisma.ShareEventUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.ShareEventCreateOrConnectWithoutCardInput | Prisma.ShareEventCreateOrConnectWithoutCardInput[];
    createMany?: Prisma.ShareEventCreateManyCardInputEnvelope;
    connect?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
};
export type ShareEventUpdateManyWithoutCardNestedInput = {
    create?: Prisma.XOR<Prisma.ShareEventCreateWithoutCardInput, Prisma.ShareEventUncheckedCreateWithoutCardInput> | Prisma.ShareEventCreateWithoutCardInput[] | Prisma.ShareEventUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.ShareEventCreateOrConnectWithoutCardInput | Prisma.ShareEventCreateOrConnectWithoutCardInput[];
    upsert?: Prisma.ShareEventUpsertWithWhereUniqueWithoutCardInput | Prisma.ShareEventUpsertWithWhereUniqueWithoutCardInput[];
    createMany?: Prisma.ShareEventCreateManyCardInputEnvelope;
    set?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    disconnect?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    delete?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    connect?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    update?: Prisma.ShareEventUpdateWithWhereUniqueWithoutCardInput | Prisma.ShareEventUpdateWithWhereUniqueWithoutCardInput[];
    updateMany?: Prisma.ShareEventUpdateManyWithWhereWithoutCardInput | Prisma.ShareEventUpdateManyWithWhereWithoutCardInput[];
    deleteMany?: Prisma.ShareEventScalarWhereInput | Prisma.ShareEventScalarWhereInput[];
};
export type ShareEventUncheckedUpdateManyWithoutCardNestedInput = {
    create?: Prisma.XOR<Prisma.ShareEventCreateWithoutCardInput, Prisma.ShareEventUncheckedCreateWithoutCardInput> | Prisma.ShareEventCreateWithoutCardInput[] | Prisma.ShareEventUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.ShareEventCreateOrConnectWithoutCardInput | Prisma.ShareEventCreateOrConnectWithoutCardInput[];
    upsert?: Prisma.ShareEventUpsertWithWhereUniqueWithoutCardInput | Prisma.ShareEventUpsertWithWhereUniqueWithoutCardInput[];
    createMany?: Prisma.ShareEventCreateManyCardInputEnvelope;
    set?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    disconnect?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    delete?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    connect?: Prisma.ShareEventWhereUniqueInput | Prisma.ShareEventWhereUniqueInput[];
    update?: Prisma.ShareEventUpdateWithWhereUniqueWithoutCardInput | Prisma.ShareEventUpdateWithWhereUniqueWithoutCardInput[];
    updateMany?: Prisma.ShareEventUpdateManyWithWhereWithoutCardInput | Prisma.ShareEventUpdateManyWithWhereWithoutCardInput[];
    deleteMany?: Prisma.ShareEventScalarWhereInput | Prisma.ShareEventScalarWhereInput[];
};
export type EnumShareMethodFieldUpdateOperationsInput = {
    set?: $Enums.ShareMethod;
};
export type ShareEventCreateWithoutUserInput = {
    id?: string;
    method: $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    card: Prisma.BusinessCardCreateNestedOneWithoutShareEventsInput;
};
export type ShareEventUncheckedCreateWithoutUserInput = {
    id?: string;
    cardId: string;
    method: $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type ShareEventCreateOrConnectWithoutUserInput = {
    where: Prisma.ShareEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.ShareEventCreateWithoutUserInput, Prisma.ShareEventUncheckedCreateWithoutUserInput>;
};
export type ShareEventCreateManyUserInputEnvelope = {
    data: Prisma.ShareEventCreateManyUserInput | Prisma.ShareEventCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ShareEventUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ShareEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.ShareEventUpdateWithoutUserInput, Prisma.ShareEventUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ShareEventCreateWithoutUserInput, Prisma.ShareEventUncheckedCreateWithoutUserInput>;
};
export type ShareEventUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ShareEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.ShareEventUpdateWithoutUserInput, Prisma.ShareEventUncheckedUpdateWithoutUserInput>;
};
export type ShareEventUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ShareEventScalarWhereInput;
    data: Prisma.XOR<Prisma.ShareEventUpdateManyMutationInput, Prisma.ShareEventUncheckedUpdateManyWithoutUserInput>;
};
export type ShareEventScalarWhereInput = {
    AND?: Prisma.ShareEventScalarWhereInput | Prisma.ShareEventScalarWhereInput[];
    OR?: Prisma.ShareEventScalarWhereInput[];
    NOT?: Prisma.ShareEventScalarWhereInput | Prisma.ShareEventScalarWhereInput[];
    id?: Prisma.StringFilter<"ShareEvent"> | string;
    cardId?: Prisma.StringFilter<"ShareEvent"> | string;
    userId?: Prisma.StringNullableFilter<"ShareEvent"> | string | null;
    method?: Prisma.EnumShareMethodFilter<"ShareEvent"> | $Enums.ShareMethod;
    metadata?: Prisma.JsonFilter<"ShareEvent">;
    createdAt?: Prisma.DateTimeFilter<"ShareEvent"> | Date | string;
};
export type ShareEventCreateWithoutCardInput = {
    id?: string;
    method: $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    user?: Prisma.UserCreateNestedOneWithoutShareEventsInput;
};
export type ShareEventUncheckedCreateWithoutCardInput = {
    id?: string;
    userId?: string | null;
    method: $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type ShareEventCreateOrConnectWithoutCardInput = {
    where: Prisma.ShareEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.ShareEventCreateWithoutCardInput, Prisma.ShareEventUncheckedCreateWithoutCardInput>;
};
export type ShareEventCreateManyCardInputEnvelope = {
    data: Prisma.ShareEventCreateManyCardInput | Prisma.ShareEventCreateManyCardInput[];
    skipDuplicates?: boolean;
};
export type ShareEventUpsertWithWhereUniqueWithoutCardInput = {
    where: Prisma.ShareEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.ShareEventUpdateWithoutCardInput, Prisma.ShareEventUncheckedUpdateWithoutCardInput>;
    create: Prisma.XOR<Prisma.ShareEventCreateWithoutCardInput, Prisma.ShareEventUncheckedCreateWithoutCardInput>;
};
export type ShareEventUpdateWithWhereUniqueWithoutCardInput = {
    where: Prisma.ShareEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.ShareEventUpdateWithoutCardInput, Prisma.ShareEventUncheckedUpdateWithoutCardInput>;
};
export type ShareEventUpdateManyWithWhereWithoutCardInput = {
    where: Prisma.ShareEventScalarWhereInput;
    data: Prisma.XOR<Prisma.ShareEventUpdateManyMutationInput, Prisma.ShareEventUncheckedUpdateManyWithoutCardInput>;
};
export type ShareEventCreateManyUserInput = {
    id?: string;
    cardId: string;
    method: $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type ShareEventUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    method?: Prisma.EnumShareMethodFieldUpdateOperationsInput | $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    card?: Prisma.BusinessCardUpdateOneRequiredWithoutShareEventsNestedInput;
};
export type ShareEventUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cardId?: Prisma.StringFieldUpdateOperationsInput | string;
    method?: Prisma.EnumShareMethodFieldUpdateOperationsInput | $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ShareEventUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cardId?: Prisma.StringFieldUpdateOperationsInput | string;
    method?: Prisma.EnumShareMethodFieldUpdateOperationsInput | $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ShareEventCreateManyCardInput = {
    id?: string;
    userId?: string | null;
    method: $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type ShareEventUpdateWithoutCardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    method?: Prisma.EnumShareMethodFieldUpdateOperationsInput | $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneWithoutShareEventsNestedInput;
};
export type ShareEventUncheckedUpdateWithoutCardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    method?: Prisma.EnumShareMethodFieldUpdateOperationsInput | $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ShareEventUncheckedUpdateManyWithoutCardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    method?: Prisma.EnumShareMethodFieldUpdateOperationsInput | $Enums.ShareMethod;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ShareEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    cardId?: boolean;
    userId?: boolean;
    method?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.ShareEvent$userArgs<ExtArgs>;
}, ExtArgs["result"]["shareEvent"]>;
export type ShareEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    cardId?: boolean;
    userId?: boolean;
    method?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.ShareEvent$userArgs<ExtArgs>;
}, ExtArgs["result"]["shareEvent"]>;
export type ShareEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    cardId?: boolean;
    userId?: boolean;
    method?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.ShareEvent$userArgs<ExtArgs>;
}, ExtArgs["result"]["shareEvent"]>;
export type ShareEventSelectScalar = {
    id?: boolean;
    cardId?: boolean;
    userId?: boolean;
    method?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
};
export type ShareEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "cardId" | "userId" | "method" | "metadata" | "createdAt", ExtArgs["result"]["shareEvent"]>;
export type ShareEventInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.ShareEvent$userArgs<ExtArgs>;
};
export type ShareEventIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.ShareEvent$userArgs<ExtArgs>;
};
export type ShareEventIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.ShareEvent$userArgs<ExtArgs>;
};
export type $ShareEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ShareEvent";
    objects: {
        card: Prisma.$BusinessCardPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        cardId: string;
        userId: string | null;
        method: $Enums.ShareMethod;
        metadata: runtime.JsonValue;
        createdAt: Date;
    }, ExtArgs["result"]["shareEvent"]>;
    composites: {};
};
export type ShareEventGetPayload<S extends boolean | null | undefined | ShareEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ShareEventPayload, S>;
export type ShareEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ShareEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ShareEventCountAggregateInputType | true;
};
export interface ShareEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ShareEvent'];
        meta: {
            name: 'ShareEvent';
        };
    };
    findUnique<T extends ShareEventFindUniqueArgs>(args: Prisma.SelectSubset<T, ShareEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ShareEventClient<runtime.Types.Result.GetResult<Prisma.$ShareEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ShareEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ShareEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ShareEventClient<runtime.Types.Result.GetResult<Prisma.$ShareEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ShareEventFindFirstArgs>(args?: Prisma.SelectSubset<T, ShareEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__ShareEventClient<runtime.Types.Result.GetResult<Prisma.$ShareEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ShareEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ShareEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ShareEventClient<runtime.Types.Result.GetResult<Prisma.$ShareEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ShareEventFindManyArgs>(args?: Prisma.SelectSubset<T, ShareEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ShareEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ShareEventCreateArgs>(args: Prisma.SelectSubset<T, ShareEventCreateArgs<ExtArgs>>): Prisma.Prisma__ShareEventClient<runtime.Types.Result.GetResult<Prisma.$ShareEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ShareEventCreateManyArgs>(args?: Prisma.SelectSubset<T, ShareEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ShareEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ShareEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ShareEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ShareEventDeleteArgs>(args: Prisma.SelectSubset<T, ShareEventDeleteArgs<ExtArgs>>): Prisma.Prisma__ShareEventClient<runtime.Types.Result.GetResult<Prisma.$ShareEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ShareEventUpdateArgs>(args: Prisma.SelectSubset<T, ShareEventUpdateArgs<ExtArgs>>): Prisma.Prisma__ShareEventClient<runtime.Types.Result.GetResult<Prisma.$ShareEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ShareEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, ShareEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ShareEventUpdateManyArgs>(args: Prisma.SelectSubset<T, ShareEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ShareEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ShareEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ShareEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ShareEventUpsertArgs>(args: Prisma.SelectSubset<T, ShareEventUpsertArgs<ExtArgs>>): Prisma.Prisma__ShareEventClient<runtime.Types.Result.GetResult<Prisma.$ShareEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ShareEventCountArgs>(args?: Prisma.Subset<T, ShareEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ShareEventCountAggregateOutputType> : number>;
    aggregate<T extends ShareEventAggregateArgs>(args: Prisma.Subset<T, ShareEventAggregateArgs>): Prisma.PrismaPromise<GetShareEventAggregateType<T>>;
    groupBy<T extends ShareEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ShareEventGroupByArgs['orderBy'];
    } : {
        orderBy?: ShareEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ShareEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShareEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ShareEventFieldRefs;
}
export interface Prisma__ShareEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    card<T extends Prisma.BusinessCardDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BusinessCardDefaultArgs<ExtArgs>>): Prisma.Prisma__BusinessCardClient<runtime.Types.Result.GetResult<Prisma.$BusinessCardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.ShareEvent$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ShareEvent$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ShareEventFieldRefs {
    readonly id: Prisma.FieldRef<"ShareEvent", 'String'>;
    readonly cardId: Prisma.FieldRef<"ShareEvent", 'String'>;
    readonly userId: Prisma.FieldRef<"ShareEvent", 'String'>;
    readonly method: Prisma.FieldRef<"ShareEvent", 'ShareMethod'>;
    readonly metadata: Prisma.FieldRef<"ShareEvent", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"ShareEvent", 'DateTime'>;
}
export type ShareEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShareEventSelect<ExtArgs> | null;
    omit?: Prisma.ShareEventOmit<ExtArgs> | null;
    include?: Prisma.ShareEventInclude<ExtArgs> | null;
    where: Prisma.ShareEventWhereUniqueInput;
};
export type ShareEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShareEventSelect<ExtArgs> | null;
    omit?: Prisma.ShareEventOmit<ExtArgs> | null;
    include?: Prisma.ShareEventInclude<ExtArgs> | null;
    where: Prisma.ShareEventWhereUniqueInput;
};
export type ShareEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ShareEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ShareEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ShareEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShareEventSelect<ExtArgs> | null;
    omit?: Prisma.ShareEventOmit<ExtArgs> | null;
    include?: Prisma.ShareEventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ShareEventCreateInput, Prisma.ShareEventUncheckedCreateInput>;
};
export type ShareEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ShareEventCreateManyInput | Prisma.ShareEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ShareEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShareEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ShareEventOmit<ExtArgs> | null;
    data: Prisma.ShareEventCreateManyInput | Prisma.ShareEventCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ShareEventIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ShareEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShareEventSelect<ExtArgs> | null;
    omit?: Prisma.ShareEventOmit<ExtArgs> | null;
    include?: Prisma.ShareEventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ShareEventUpdateInput, Prisma.ShareEventUncheckedUpdateInput>;
    where: Prisma.ShareEventWhereUniqueInput;
};
export type ShareEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ShareEventUpdateManyMutationInput, Prisma.ShareEventUncheckedUpdateManyInput>;
    where?: Prisma.ShareEventWhereInput;
    limit?: number;
};
export type ShareEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShareEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ShareEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ShareEventUpdateManyMutationInput, Prisma.ShareEventUncheckedUpdateManyInput>;
    where?: Prisma.ShareEventWhereInput;
    limit?: number;
    include?: Prisma.ShareEventIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ShareEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShareEventSelect<ExtArgs> | null;
    omit?: Prisma.ShareEventOmit<ExtArgs> | null;
    include?: Prisma.ShareEventInclude<ExtArgs> | null;
    where: Prisma.ShareEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.ShareEventCreateInput, Prisma.ShareEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ShareEventUpdateInput, Prisma.ShareEventUncheckedUpdateInput>;
};
export type ShareEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShareEventSelect<ExtArgs> | null;
    omit?: Prisma.ShareEventOmit<ExtArgs> | null;
    include?: Prisma.ShareEventInclude<ExtArgs> | null;
    where: Prisma.ShareEventWhereUniqueInput;
};
export type ShareEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ShareEventWhereInput;
    limit?: number;
};
export type ShareEvent$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type ShareEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShareEventSelect<ExtArgs> | null;
    omit?: Prisma.ShareEventOmit<ExtArgs> | null;
    include?: Prisma.ShareEventInclude<ExtArgs> | null;
};
