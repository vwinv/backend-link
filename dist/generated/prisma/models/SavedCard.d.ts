import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SavedCardModel = runtime.Types.Result.DefaultSelection<Prisma.$SavedCardPayload>;
export type AggregateSavedCard = {
    _count: SavedCardCountAggregateOutputType | null;
    _min: SavedCardMinAggregateOutputType | null;
    _max: SavedCardMaxAggregateOutputType | null;
};
export type SavedCardMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    cardId: string | null;
    walletType: $Enums.WalletType | null;
    passId: string | null;
    savedAt: Date | null;
};
export type SavedCardMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    cardId: string | null;
    walletType: $Enums.WalletType | null;
    passId: string | null;
    savedAt: Date | null;
};
export type SavedCardCountAggregateOutputType = {
    id: number;
    userId: number;
    cardId: number;
    walletType: number;
    passId: number;
    savedAt: number;
    _all: number;
};
export type SavedCardMinAggregateInputType = {
    id?: true;
    userId?: true;
    cardId?: true;
    walletType?: true;
    passId?: true;
    savedAt?: true;
};
export type SavedCardMaxAggregateInputType = {
    id?: true;
    userId?: true;
    cardId?: true;
    walletType?: true;
    passId?: true;
    savedAt?: true;
};
export type SavedCardCountAggregateInputType = {
    id?: true;
    userId?: true;
    cardId?: true;
    walletType?: true;
    passId?: true;
    savedAt?: true;
    _all?: true;
};
export type SavedCardAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SavedCardWhereInput;
    orderBy?: Prisma.SavedCardOrderByWithRelationInput | Prisma.SavedCardOrderByWithRelationInput[];
    cursor?: Prisma.SavedCardWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SavedCardCountAggregateInputType;
    _min?: SavedCardMinAggregateInputType;
    _max?: SavedCardMaxAggregateInputType;
};
export type GetSavedCardAggregateType<T extends SavedCardAggregateArgs> = {
    [P in keyof T & keyof AggregateSavedCard]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSavedCard[P]> : Prisma.GetScalarType<T[P], AggregateSavedCard[P]>;
};
export type SavedCardGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SavedCardWhereInput;
    orderBy?: Prisma.SavedCardOrderByWithAggregationInput | Prisma.SavedCardOrderByWithAggregationInput[];
    by: Prisma.SavedCardScalarFieldEnum[] | Prisma.SavedCardScalarFieldEnum;
    having?: Prisma.SavedCardScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SavedCardCountAggregateInputType | true;
    _min?: SavedCardMinAggregateInputType;
    _max?: SavedCardMaxAggregateInputType;
};
export type SavedCardGroupByOutputType = {
    id: string;
    userId: string;
    cardId: string;
    walletType: $Enums.WalletType;
    passId: string | null;
    savedAt: Date;
    _count: SavedCardCountAggregateOutputType | null;
    _min: SavedCardMinAggregateOutputType | null;
    _max: SavedCardMaxAggregateOutputType | null;
};
export type GetSavedCardGroupByPayload<T extends SavedCardGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SavedCardGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SavedCardGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SavedCardGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SavedCardGroupByOutputType[P]>;
}>>;
export type SavedCardWhereInput = {
    AND?: Prisma.SavedCardWhereInput | Prisma.SavedCardWhereInput[];
    OR?: Prisma.SavedCardWhereInput[];
    NOT?: Prisma.SavedCardWhereInput | Prisma.SavedCardWhereInput[];
    id?: Prisma.StringFilter<"SavedCard"> | string;
    userId?: Prisma.StringFilter<"SavedCard"> | string;
    cardId?: Prisma.StringFilter<"SavedCard"> | string;
    walletType?: Prisma.EnumWalletTypeFilter<"SavedCard"> | $Enums.WalletType;
    passId?: Prisma.StringNullableFilter<"SavedCard"> | string | null;
    savedAt?: Prisma.DateTimeFilter<"SavedCard"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    card?: Prisma.XOR<Prisma.BusinessCardScalarRelationFilter, Prisma.BusinessCardWhereInput>;
};
export type SavedCardOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    walletType?: Prisma.SortOrder;
    passId?: Prisma.SortOrderInput | Prisma.SortOrder;
    savedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    card?: Prisma.BusinessCardOrderByWithRelationInput;
};
export type SavedCardWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_cardId_walletType?: Prisma.SavedCardUserIdCardIdWalletTypeCompoundUniqueInput;
    AND?: Prisma.SavedCardWhereInput | Prisma.SavedCardWhereInput[];
    OR?: Prisma.SavedCardWhereInput[];
    NOT?: Prisma.SavedCardWhereInput | Prisma.SavedCardWhereInput[];
    userId?: Prisma.StringFilter<"SavedCard"> | string;
    cardId?: Prisma.StringFilter<"SavedCard"> | string;
    walletType?: Prisma.EnumWalletTypeFilter<"SavedCard"> | $Enums.WalletType;
    passId?: Prisma.StringNullableFilter<"SavedCard"> | string | null;
    savedAt?: Prisma.DateTimeFilter<"SavedCard"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    card?: Prisma.XOR<Prisma.BusinessCardScalarRelationFilter, Prisma.BusinessCardWhereInput>;
}, "id" | "userId_cardId_walletType">;
export type SavedCardOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    walletType?: Prisma.SortOrder;
    passId?: Prisma.SortOrderInput | Prisma.SortOrder;
    savedAt?: Prisma.SortOrder;
    _count?: Prisma.SavedCardCountOrderByAggregateInput;
    _max?: Prisma.SavedCardMaxOrderByAggregateInput;
    _min?: Prisma.SavedCardMinOrderByAggregateInput;
};
export type SavedCardScalarWhereWithAggregatesInput = {
    AND?: Prisma.SavedCardScalarWhereWithAggregatesInput | Prisma.SavedCardScalarWhereWithAggregatesInput[];
    OR?: Prisma.SavedCardScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SavedCardScalarWhereWithAggregatesInput | Prisma.SavedCardScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SavedCard"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"SavedCard"> | string;
    cardId?: Prisma.StringWithAggregatesFilter<"SavedCard"> | string;
    walletType?: Prisma.EnumWalletTypeWithAggregatesFilter<"SavedCard"> | $Enums.WalletType;
    passId?: Prisma.StringNullableWithAggregatesFilter<"SavedCard"> | string | null;
    savedAt?: Prisma.DateTimeWithAggregatesFilter<"SavedCard"> | Date | string;
};
export type SavedCardCreateInput = {
    id?: string;
    walletType: $Enums.WalletType;
    passId?: string | null;
    savedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSavedCardsInput;
    card: Prisma.BusinessCardCreateNestedOneWithoutSavedCardsInput;
};
export type SavedCardUncheckedCreateInput = {
    id?: string;
    userId: string;
    cardId: string;
    walletType: $Enums.WalletType;
    passId?: string | null;
    savedAt?: Date | string;
};
export type SavedCardUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    walletType?: Prisma.EnumWalletTypeFieldUpdateOperationsInput | $Enums.WalletType;
    passId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    savedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSavedCardsNestedInput;
    card?: Prisma.BusinessCardUpdateOneRequiredWithoutSavedCardsNestedInput;
};
export type SavedCardUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    cardId?: Prisma.StringFieldUpdateOperationsInput | string;
    walletType?: Prisma.EnumWalletTypeFieldUpdateOperationsInput | $Enums.WalletType;
    passId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    savedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedCardCreateManyInput = {
    id?: string;
    userId: string;
    cardId: string;
    walletType: $Enums.WalletType;
    passId?: string | null;
    savedAt?: Date | string;
};
export type SavedCardUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    walletType?: Prisma.EnumWalletTypeFieldUpdateOperationsInput | $Enums.WalletType;
    passId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    savedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedCardUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    cardId?: Prisma.StringFieldUpdateOperationsInput | string;
    walletType?: Prisma.EnumWalletTypeFieldUpdateOperationsInput | $Enums.WalletType;
    passId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    savedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedCardListRelationFilter = {
    every?: Prisma.SavedCardWhereInput;
    some?: Prisma.SavedCardWhereInput;
    none?: Prisma.SavedCardWhereInput;
};
export type SavedCardOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SavedCardUserIdCardIdWalletTypeCompoundUniqueInput = {
    userId: string;
    cardId: string;
    walletType: $Enums.WalletType;
};
export type SavedCardCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    walletType?: Prisma.SortOrder;
    passId?: Prisma.SortOrder;
    savedAt?: Prisma.SortOrder;
};
export type SavedCardMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    walletType?: Prisma.SortOrder;
    passId?: Prisma.SortOrder;
    savedAt?: Prisma.SortOrder;
};
export type SavedCardMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    walletType?: Prisma.SortOrder;
    passId?: Prisma.SortOrder;
    savedAt?: Prisma.SortOrder;
};
export type SavedCardCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SavedCardCreateWithoutUserInput, Prisma.SavedCardUncheckedCreateWithoutUserInput> | Prisma.SavedCardCreateWithoutUserInput[] | Prisma.SavedCardUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavedCardCreateOrConnectWithoutUserInput | Prisma.SavedCardCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SavedCardCreateManyUserInputEnvelope;
    connect?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
};
export type SavedCardUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SavedCardCreateWithoutUserInput, Prisma.SavedCardUncheckedCreateWithoutUserInput> | Prisma.SavedCardCreateWithoutUserInput[] | Prisma.SavedCardUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavedCardCreateOrConnectWithoutUserInput | Prisma.SavedCardCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SavedCardCreateManyUserInputEnvelope;
    connect?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
};
export type SavedCardUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SavedCardCreateWithoutUserInput, Prisma.SavedCardUncheckedCreateWithoutUserInput> | Prisma.SavedCardCreateWithoutUserInput[] | Prisma.SavedCardUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavedCardCreateOrConnectWithoutUserInput | Prisma.SavedCardCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SavedCardUpsertWithWhereUniqueWithoutUserInput | Prisma.SavedCardUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SavedCardCreateManyUserInputEnvelope;
    set?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    disconnect?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    delete?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    connect?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    update?: Prisma.SavedCardUpdateWithWhereUniqueWithoutUserInput | Prisma.SavedCardUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SavedCardUpdateManyWithWhereWithoutUserInput | Prisma.SavedCardUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SavedCardScalarWhereInput | Prisma.SavedCardScalarWhereInput[];
};
export type SavedCardUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SavedCardCreateWithoutUserInput, Prisma.SavedCardUncheckedCreateWithoutUserInput> | Prisma.SavedCardCreateWithoutUserInput[] | Prisma.SavedCardUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavedCardCreateOrConnectWithoutUserInput | Prisma.SavedCardCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SavedCardUpsertWithWhereUniqueWithoutUserInput | Prisma.SavedCardUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SavedCardCreateManyUserInputEnvelope;
    set?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    disconnect?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    delete?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    connect?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    update?: Prisma.SavedCardUpdateWithWhereUniqueWithoutUserInput | Prisma.SavedCardUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SavedCardUpdateManyWithWhereWithoutUserInput | Prisma.SavedCardUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SavedCardScalarWhereInput | Prisma.SavedCardScalarWhereInput[];
};
export type SavedCardCreateNestedManyWithoutCardInput = {
    create?: Prisma.XOR<Prisma.SavedCardCreateWithoutCardInput, Prisma.SavedCardUncheckedCreateWithoutCardInput> | Prisma.SavedCardCreateWithoutCardInput[] | Prisma.SavedCardUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.SavedCardCreateOrConnectWithoutCardInput | Prisma.SavedCardCreateOrConnectWithoutCardInput[];
    createMany?: Prisma.SavedCardCreateManyCardInputEnvelope;
    connect?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
};
export type SavedCardUncheckedCreateNestedManyWithoutCardInput = {
    create?: Prisma.XOR<Prisma.SavedCardCreateWithoutCardInput, Prisma.SavedCardUncheckedCreateWithoutCardInput> | Prisma.SavedCardCreateWithoutCardInput[] | Prisma.SavedCardUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.SavedCardCreateOrConnectWithoutCardInput | Prisma.SavedCardCreateOrConnectWithoutCardInput[];
    createMany?: Prisma.SavedCardCreateManyCardInputEnvelope;
    connect?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
};
export type SavedCardUpdateManyWithoutCardNestedInput = {
    create?: Prisma.XOR<Prisma.SavedCardCreateWithoutCardInput, Prisma.SavedCardUncheckedCreateWithoutCardInput> | Prisma.SavedCardCreateWithoutCardInput[] | Prisma.SavedCardUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.SavedCardCreateOrConnectWithoutCardInput | Prisma.SavedCardCreateOrConnectWithoutCardInput[];
    upsert?: Prisma.SavedCardUpsertWithWhereUniqueWithoutCardInput | Prisma.SavedCardUpsertWithWhereUniqueWithoutCardInput[];
    createMany?: Prisma.SavedCardCreateManyCardInputEnvelope;
    set?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    disconnect?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    delete?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    connect?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    update?: Prisma.SavedCardUpdateWithWhereUniqueWithoutCardInput | Prisma.SavedCardUpdateWithWhereUniqueWithoutCardInput[];
    updateMany?: Prisma.SavedCardUpdateManyWithWhereWithoutCardInput | Prisma.SavedCardUpdateManyWithWhereWithoutCardInput[];
    deleteMany?: Prisma.SavedCardScalarWhereInput | Prisma.SavedCardScalarWhereInput[];
};
export type SavedCardUncheckedUpdateManyWithoutCardNestedInput = {
    create?: Prisma.XOR<Prisma.SavedCardCreateWithoutCardInput, Prisma.SavedCardUncheckedCreateWithoutCardInput> | Prisma.SavedCardCreateWithoutCardInput[] | Prisma.SavedCardUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.SavedCardCreateOrConnectWithoutCardInput | Prisma.SavedCardCreateOrConnectWithoutCardInput[];
    upsert?: Prisma.SavedCardUpsertWithWhereUniqueWithoutCardInput | Prisma.SavedCardUpsertWithWhereUniqueWithoutCardInput[];
    createMany?: Prisma.SavedCardCreateManyCardInputEnvelope;
    set?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    disconnect?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    delete?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    connect?: Prisma.SavedCardWhereUniqueInput | Prisma.SavedCardWhereUniqueInput[];
    update?: Prisma.SavedCardUpdateWithWhereUniqueWithoutCardInput | Prisma.SavedCardUpdateWithWhereUniqueWithoutCardInput[];
    updateMany?: Prisma.SavedCardUpdateManyWithWhereWithoutCardInput | Prisma.SavedCardUpdateManyWithWhereWithoutCardInput[];
    deleteMany?: Prisma.SavedCardScalarWhereInput | Prisma.SavedCardScalarWhereInput[];
};
export type EnumWalletTypeFieldUpdateOperationsInput = {
    set?: $Enums.WalletType;
};
export type SavedCardCreateWithoutUserInput = {
    id?: string;
    walletType: $Enums.WalletType;
    passId?: string | null;
    savedAt?: Date | string;
    card: Prisma.BusinessCardCreateNestedOneWithoutSavedCardsInput;
};
export type SavedCardUncheckedCreateWithoutUserInput = {
    id?: string;
    cardId: string;
    walletType: $Enums.WalletType;
    passId?: string | null;
    savedAt?: Date | string;
};
export type SavedCardCreateOrConnectWithoutUserInput = {
    where: Prisma.SavedCardWhereUniqueInput;
    create: Prisma.XOR<Prisma.SavedCardCreateWithoutUserInput, Prisma.SavedCardUncheckedCreateWithoutUserInput>;
};
export type SavedCardCreateManyUserInputEnvelope = {
    data: Prisma.SavedCardCreateManyUserInput | Prisma.SavedCardCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type SavedCardUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.SavedCardWhereUniqueInput;
    update: Prisma.XOR<Prisma.SavedCardUpdateWithoutUserInput, Prisma.SavedCardUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.SavedCardCreateWithoutUserInput, Prisma.SavedCardUncheckedCreateWithoutUserInput>;
};
export type SavedCardUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.SavedCardWhereUniqueInput;
    data: Prisma.XOR<Prisma.SavedCardUpdateWithoutUserInput, Prisma.SavedCardUncheckedUpdateWithoutUserInput>;
};
export type SavedCardUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.SavedCardScalarWhereInput;
    data: Prisma.XOR<Prisma.SavedCardUpdateManyMutationInput, Prisma.SavedCardUncheckedUpdateManyWithoutUserInput>;
};
export type SavedCardScalarWhereInput = {
    AND?: Prisma.SavedCardScalarWhereInput | Prisma.SavedCardScalarWhereInput[];
    OR?: Prisma.SavedCardScalarWhereInput[];
    NOT?: Prisma.SavedCardScalarWhereInput | Prisma.SavedCardScalarWhereInput[];
    id?: Prisma.StringFilter<"SavedCard"> | string;
    userId?: Prisma.StringFilter<"SavedCard"> | string;
    cardId?: Prisma.StringFilter<"SavedCard"> | string;
    walletType?: Prisma.EnumWalletTypeFilter<"SavedCard"> | $Enums.WalletType;
    passId?: Prisma.StringNullableFilter<"SavedCard"> | string | null;
    savedAt?: Prisma.DateTimeFilter<"SavedCard"> | Date | string;
};
export type SavedCardCreateWithoutCardInput = {
    id?: string;
    walletType: $Enums.WalletType;
    passId?: string | null;
    savedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSavedCardsInput;
};
export type SavedCardUncheckedCreateWithoutCardInput = {
    id?: string;
    userId: string;
    walletType: $Enums.WalletType;
    passId?: string | null;
    savedAt?: Date | string;
};
export type SavedCardCreateOrConnectWithoutCardInput = {
    where: Prisma.SavedCardWhereUniqueInput;
    create: Prisma.XOR<Prisma.SavedCardCreateWithoutCardInput, Prisma.SavedCardUncheckedCreateWithoutCardInput>;
};
export type SavedCardCreateManyCardInputEnvelope = {
    data: Prisma.SavedCardCreateManyCardInput | Prisma.SavedCardCreateManyCardInput[];
    skipDuplicates?: boolean;
};
export type SavedCardUpsertWithWhereUniqueWithoutCardInput = {
    where: Prisma.SavedCardWhereUniqueInput;
    update: Prisma.XOR<Prisma.SavedCardUpdateWithoutCardInput, Prisma.SavedCardUncheckedUpdateWithoutCardInput>;
    create: Prisma.XOR<Prisma.SavedCardCreateWithoutCardInput, Prisma.SavedCardUncheckedCreateWithoutCardInput>;
};
export type SavedCardUpdateWithWhereUniqueWithoutCardInput = {
    where: Prisma.SavedCardWhereUniqueInput;
    data: Prisma.XOR<Prisma.SavedCardUpdateWithoutCardInput, Prisma.SavedCardUncheckedUpdateWithoutCardInput>;
};
export type SavedCardUpdateManyWithWhereWithoutCardInput = {
    where: Prisma.SavedCardScalarWhereInput;
    data: Prisma.XOR<Prisma.SavedCardUpdateManyMutationInput, Prisma.SavedCardUncheckedUpdateManyWithoutCardInput>;
};
export type SavedCardCreateManyUserInput = {
    id?: string;
    cardId: string;
    walletType: $Enums.WalletType;
    passId?: string | null;
    savedAt?: Date | string;
};
export type SavedCardUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    walletType?: Prisma.EnumWalletTypeFieldUpdateOperationsInput | $Enums.WalletType;
    passId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    savedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    card?: Prisma.BusinessCardUpdateOneRequiredWithoutSavedCardsNestedInput;
};
export type SavedCardUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cardId?: Prisma.StringFieldUpdateOperationsInput | string;
    walletType?: Prisma.EnumWalletTypeFieldUpdateOperationsInput | $Enums.WalletType;
    passId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    savedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedCardUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cardId?: Prisma.StringFieldUpdateOperationsInput | string;
    walletType?: Prisma.EnumWalletTypeFieldUpdateOperationsInput | $Enums.WalletType;
    passId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    savedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedCardCreateManyCardInput = {
    id?: string;
    userId: string;
    walletType: $Enums.WalletType;
    passId?: string | null;
    savedAt?: Date | string;
};
export type SavedCardUpdateWithoutCardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    walletType?: Prisma.EnumWalletTypeFieldUpdateOperationsInput | $Enums.WalletType;
    passId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    savedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSavedCardsNestedInput;
};
export type SavedCardUncheckedUpdateWithoutCardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    walletType?: Prisma.EnumWalletTypeFieldUpdateOperationsInput | $Enums.WalletType;
    passId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    savedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedCardUncheckedUpdateManyWithoutCardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    walletType?: Prisma.EnumWalletTypeFieldUpdateOperationsInput | $Enums.WalletType;
    passId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    savedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedCardSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    cardId?: boolean;
    walletType?: boolean;
    passId?: boolean;
    savedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["savedCard"]>;
export type SavedCardSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    cardId?: boolean;
    walletType?: boolean;
    passId?: boolean;
    savedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["savedCard"]>;
export type SavedCardSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    cardId?: boolean;
    walletType?: boolean;
    passId?: boolean;
    savedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["savedCard"]>;
export type SavedCardSelectScalar = {
    id?: boolean;
    userId?: boolean;
    cardId?: boolean;
    walletType?: boolean;
    passId?: boolean;
    savedAt?: boolean;
};
export type SavedCardOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "cardId" | "walletType" | "passId" | "savedAt", ExtArgs["result"]["savedCard"]>;
export type SavedCardInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
};
export type SavedCardIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
};
export type SavedCardIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
};
export type $SavedCardPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SavedCard";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        card: Prisma.$BusinessCardPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        cardId: string;
        walletType: $Enums.WalletType;
        passId: string | null;
        savedAt: Date;
    }, ExtArgs["result"]["savedCard"]>;
    composites: {};
};
export type SavedCardGetPayload<S extends boolean | null | undefined | SavedCardDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SavedCardPayload, S>;
export type SavedCardCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SavedCardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SavedCardCountAggregateInputType | true;
};
export interface SavedCardDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SavedCard'];
        meta: {
            name: 'SavedCard';
        };
    };
    findUnique<T extends SavedCardFindUniqueArgs>(args: Prisma.SelectSubset<T, SavedCardFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SavedCardClient<runtime.Types.Result.GetResult<Prisma.$SavedCardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SavedCardFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SavedCardFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SavedCardClient<runtime.Types.Result.GetResult<Prisma.$SavedCardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SavedCardFindFirstArgs>(args?: Prisma.SelectSubset<T, SavedCardFindFirstArgs<ExtArgs>>): Prisma.Prisma__SavedCardClient<runtime.Types.Result.GetResult<Prisma.$SavedCardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SavedCardFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SavedCardFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SavedCardClient<runtime.Types.Result.GetResult<Prisma.$SavedCardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SavedCardFindManyArgs>(args?: Prisma.SelectSubset<T, SavedCardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SavedCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SavedCardCreateArgs>(args: Prisma.SelectSubset<T, SavedCardCreateArgs<ExtArgs>>): Prisma.Prisma__SavedCardClient<runtime.Types.Result.GetResult<Prisma.$SavedCardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SavedCardCreateManyArgs>(args?: Prisma.SelectSubset<T, SavedCardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SavedCardCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SavedCardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SavedCardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SavedCardDeleteArgs>(args: Prisma.SelectSubset<T, SavedCardDeleteArgs<ExtArgs>>): Prisma.Prisma__SavedCardClient<runtime.Types.Result.GetResult<Prisma.$SavedCardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SavedCardUpdateArgs>(args: Prisma.SelectSubset<T, SavedCardUpdateArgs<ExtArgs>>): Prisma.Prisma__SavedCardClient<runtime.Types.Result.GetResult<Prisma.$SavedCardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SavedCardDeleteManyArgs>(args?: Prisma.SelectSubset<T, SavedCardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SavedCardUpdateManyArgs>(args: Prisma.SelectSubset<T, SavedCardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SavedCardUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SavedCardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SavedCardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SavedCardUpsertArgs>(args: Prisma.SelectSubset<T, SavedCardUpsertArgs<ExtArgs>>): Prisma.Prisma__SavedCardClient<runtime.Types.Result.GetResult<Prisma.$SavedCardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SavedCardCountArgs>(args?: Prisma.Subset<T, SavedCardCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SavedCardCountAggregateOutputType> : number>;
    aggregate<T extends SavedCardAggregateArgs>(args: Prisma.Subset<T, SavedCardAggregateArgs>): Prisma.PrismaPromise<GetSavedCardAggregateType<T>>;
    groupBy<T extends SavedCardGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SavedCardGroupByArgs['orderBy'];
    } : {
        orderBy?: SavedCardGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SavedCardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSavedCardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SavedCardFieldRefs;
}
export interface Prisma__SavedCardClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    card<T extends Prisma.BusinessCardDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BusinessCardDefaultArgs<ExtArgs>>): Prisma.Prisma__BusinessCardClient<runtime.Types.Result.GetResult<Prisma.$BusinessCardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SavedCardFieldRefs {
    readonly id: Prisma.FieldRef<"SavedCard", 'String'>;
    readonly userId: Prisma.FieldRef<"SavedCard", 'String'>;
    readonly cardId: Prisma.FieldRef<"SavedCard", 'String'>;
    readonly walletType: Prisma.FieldRef<"SavedCard", 'WalletType'>;
    readonly passId: Prisma.FieldRef<"SavedCard", 'String'>;
    readonly savedAt: Prisma.FieldRef<"SavedCard", 'DateTime'>;
}
export type SavedCardFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedCardSelect<ExtArgs> | null;
    omit?: Prisma.SavedCardOmit<ExtArgs> | null;
    include?: Prisma.SavedCardInclude<ExtArgs> | null;
    where: Prisma.SavedCardWhereUniqueInput;
};
export type SavedCardFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedCardSelect<ExtArgs> | null;
    omit?: Prisma.SavedCardOmit<ExtArgs> | null;
    include?: Prisma.SavedCardInclude<ExtArgs> | null;
    where: Prisma.SavedCardWhereUniqueInput;
};
export type SavedCardFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SavedCardFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SavedCardFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SavedCardCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedCardSelect<ExtArgs> | null;
    omit?: Prisma.SavedCardOmit<ExtArgs> | null;
    include?: Prisma.SavedCardInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SavedCardCreateInput, Prisma.SavedCardUncheckedCreateInput>;
};
export type SavedCardCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SavedCardCreateManyInput | Prisma.SavedCardCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SavedCardCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedCardSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SavedCardOmit<ExtArgs> | null;
    data: Prisma.SavedCardCreateManyInput | Prisma.SavedCardCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SavedCardIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SavedCardUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedCardSelect<ExtArgs> | null;
    omit?: Prisma.SavedCardOmit<ExtArgs> | null;
    include?: Prisma.SavedCardInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SavedCardUpdateInput, Prisma.SavedCardUncheckedUpdateInput>;
    where: Prisma.SavedCardWhereUniqueInput;
};
export type SavedCardUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SavedCardUpdateManyMutationInput, Prisma.SavedCardUncheckedUpdateManyInput>;
    where?: Prisma.SavedCardWhereInput;
    limit?: number;
};
export type SavedCardUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedCardSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SavedCardOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SavedCardUpdateManyMutationInput, Prisma.SavedCardUncheckedUpdateManyInput>;
    where?: Prisma.SavedCardWhereInput;
    limit?: number;
    include?: Prisma.SavedCardIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SavedCardUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedCardSelect<ExtArgs> | null;
    omit?: Prisma.SavedCardOmit<ExtArgs> | null;
    include?: Prisma.SavedCardInclude<ExtArgs> | null;
    where: Prisma.SavedCardWhereUniqueInput;
    create: Prisma.XOR<Prisma.SavedCardCreateInput, Prisma.SavedCardUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SavedCardUpdateInput, Prisma.SavedCardUncheckedUpdateInput>;
};
export type SavedCardDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedCardSelect<ExtArgs> | null;
    omit?: Prisma.SavedCardOmit<ExtArgs> | null;
    include?: Prisma.SavedCardInclude<ExtArgs> | null;
    where: Prisma.SavedCardWhereUniqueInput;
};
export type SavedCardDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SavedCardWhereInput;
    limit?: number;
};
export type SavedCardDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedCardSelect<ExtArgs> | null;
    omit?: Prisma.SavedCardOmit<ExtArgs> | null;
    include?: Prisma.SavedCardInclude<ExtArgs> | null;
};
