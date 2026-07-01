import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PortfolioProjectModel = runtime.Types.Result.DefaultSelection<Prisma.$PortfolioProjectPayload>;
export type AggregatePortfolioProject = {
    _count: PortfolioProjectCountAggregateOutputType | null;
    _avg: PortfolioProjectAvgAggregateOutputType | null;
    _sum: PortfolioProjectSumAggregateOutputType | null;
    _min: PortfolioProjectMinAggregateOutputType | null;
    _max: PortfolioProjectMaxAggregateOutputType | null;
};
export type PortfolioProjectAvgAggregateOutputType = {
    order: number | null;
};
export type PortfolioProjectSumAggregateOutputType = {
    order: number | null;
};
export type PortfolioProjectMinAggregateOutputType = {
    id: string | null;
    portfolioId: string | null;
    title: string | null;
    description: string | null;
    imageUrl: string | null;
    projectUrl: string | null;
    order: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PortfolioProjectMaxAggregateOutputType = {
    id: string | null;
    portfolioId: string | null;
    title: string | null;
    description: string | null;
    imageUrl: string | null;
    projectUrl: string | null;
    order: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PortfolioProjectCountAggregateOutputType = {
    id: number;
    portfolioId: number;
    title: number;
    description: number;
    imageUrl: number;
    projectUrl: number;
    tags: number;
    order: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PortfolioProjectAvgAggregateInputType = {
    order?: true;
};
export type PortfolioProjectSumAggregateInputType = {
    order?: true;
};
export type PortfolioProjectMinAggregateInputType = {
    id?: true;
    portfolioId?: true;
    title?: true;
    description?: true;
    imageUrl?: true;
    projectUrl?: true;
    order?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PortfolioProjectMaxAggregateInputType = {
    id?: true;
    portfolioId?: true;
    title?: true;
    description?: true;
    imageUrl?: true;
    projectUrl?: true;
    order?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PortfolioProjectCountAggregateInputType = {
    id?: true;
    portfolioId?: true;
    title?: true;
    description?: true;
    imageUrl?: true;
    projectUrl?: true;
    tags?: true;
    order?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PortfolioProjectAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PortfolioProjectWhereInput;
    orderBy?: Prisma.PortfolioProjectOrderByWithRelationInput | Prisma.PortfolioProjectOrderByWithRelationInput[];
    cursor?: Prisma.PortfolioProjectWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PortfolioProjectCountAggregateInputType;
    _avg?: PortfolioProjectAvgAggregateInputType;
    _sum?: PortfolioProjectSumAggregateInputType;
    _min?: PortfolioProjectMinAggregateInputType;
    _max?: PortfolioProjectMaxAggregateInputType;
};
export type GetPortfolioProjectAggregateType<T extends PortfolioProjectAggregateArgs> = {
    [P in keyof T & keyof AggregatePortfolioProject]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePortfolioProject[P]> : Prisma.GetScalarType<T[P], AggregatePortfolioProject[P]>;
};
export type PortfolioProjectGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PortfolioProjectWhereInput;
    orderBy?: Prisma.PortfolioProjectOrderByWithAggregationInput | Prisma.PortfolioProjectOrderByWithAggregationInput[];
    by: Prisma.PortfolioProjectScalarFieldEnum[] | Prisma.PortfolioProjectScalarFieldEnum;
    having?: Prisma.PortfolioProjectScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PortfolioProjectCountAggregateInputType | true;
    _avg?: PortfolioProjectAvgAggregateInputType;
    _sum?: PortfolioProjectSumAggregateInputType;
    _min?: PortfolioProjectMinAggregateInputType;
    _max?: PortfolioProjectMaxAggregateInputType;
};
export type PortfolioProjectGroupByOutputType = {
    id: string;
    portfolioId: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    projectUrl: string | null;
    tags: string[];
    order: number;
    createdAt: Date;
    updatedAt: Date;
    _count: PortfolioProjectCountAggregateOutputType | null;
    _avg: PortfolioProjectAvgAggregateOutputType | null;
    _sum: PortfolioProjectSumAggregateOutputType | null;
    _min: PortfolioProjectMinAggregateOutputType | null;
    _max: PortfolioProjectMaxAggregateOutputType | null;
};
export type GetPortfolioProjectGroupByPayload<T extends PortfolioProjectGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PortfolioProjectGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PortfolioProjectGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PortfolioProjectGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PortfolioProjectGroupByOutputType[P]>;
}>>;
export type PortfolioProjectWhereInput = {
    AND?: Prisma.PortfolioProjectWhereInput | Prisma.PortfolioProjectWhereInput[];
    OR?: Prisma.PortfolioProjectWhereInput[];
    NOT?: Prisma.PortfolioProjectWhereInput | Prisma.PortfolioProjectWhereInput[];
    id?: Prisma.StringFilter<"PortfolioProject"> | string;
    portfolioId?: Prisma.StringFilter<"PortfolioProject"> | string;
    title?: Prisma.StringFilter<"PortfolioProject"> | string;
    description?: Prisma.StringNullableFilter<"PortfolioProject"> | string | null;
    imageUrl?: Prisma.StringNullableFilter<"PortfolioProject"> | string | null;
    projectUrl?: Prisma.StringNullableFilter<"PortfolioProject"> | string | null;
    tags?: Prisma.StringNullableListFilter<"PortfolioProject">;
    order?: Prisma.IntFilter<"PortfolioProject"> | number;
    createdAt?: Prisma.DateTimeFilter<"PortfolioProject"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PortfolioProject"> | Date | string;
    portfolio?: Prisma.XOR<Prisma.PortfolioScalarRelationFilter, Prisma.PortfolioWhereInput>;
};
export type PortfolioProjectOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    portfolioId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    imageUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    projectUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    tags?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    portfolio?: Prisma.PortfolioOrderByWithRelationInput;
};
export type PortfolioProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PortfolioProjectWhereInput | Prisma.PortfolioProjectWhereInput[];
    OR?: Prisma.PortfolioProjectWhereInput[];
    NOT?: Prisma.PortfolioProjectWhereInput | Prisma.PortfolioProjectWhereInput[];
    portfolioId?: Prisma.StringFilter<"PortfolioProject"> | string;
    title?: Prisma.StringFilter<"PortfolioProject"> | string;
    description?: Prisma.StringNullableFilter<"PortfolioProject"> | string | null;
    imageUrl?: Prisma.StringNullableFilter<"PortfolioProject"> | string | null;
    projectUrl?: Prisma.StringNullableFilter<"PortfolioProject"> | string | null;
    tags?: Prisma.StringNullableListFilter<"PortfolioProject">;
    order?: Prisma.IntFilter<"PortfolioProject"> | number;
    createdAt?: Prisma.DateTimeFilter<"PortfolioProject"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PortfolioProject"> | Date | string;
    portfolio?: Prisma.XOR<Prisma.PortfolioScalarRelationFilter, Prisma.PortfolioWhereInput>;
}, "id">;
export type PortfolioProjectOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    portfolioId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    imageUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    projectUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    tags?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PortfolioProjectCountOrderByAggregateInput;
    _avg?: Prisma.PortfolioProjectAvgOrderByAggregateInput;
    _max?: Prisma.PortfolioProjectMaxOrderByAggregateInput;
    _min?: Prisma.PortfolioProjectMinOrderByAggregateInput;
    _sum?: Prisma.PortfolioProjectSumOrderByAggregateInput;
};
export type PortfolioProjectScalarWhereWithAggregatesInput = {
    AND?: Prisma.PortfolioProjectScalarWhereWithAggregatesInput | Prisma.PortfolioProjectScalarWhereWithAggregatesInput[];
    OR?: Prisma.PortfolioProjectScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PortfolioProjectScalarWhereWithAggregatesInput | Prisma.PortfolioProjectScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PortfolioProject"> | string;
    portfolioId?: Prisma.StringWithAggregatesFilter<"PortfolioProject"> | string;
    title?: Prisma.StringWithAggregatesFilter<"PortfolioProject"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"PortfolioProject"> | string | null;
    imageUrl?: Prisma.StringNullableWithAggregatesFilter<"PortfolioProject"> | string | null;
    projectUrl?: Prisma.StringNullableWithAggregatesFilter<"PortfolioProject"> | string | null;
    tags?: Prisma.StringNullableListFilter<"PortfolioProject">;
    order?: Prisma.IntWithAggregatesFilter<"PortfolioProject"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PortfolioProject"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"PortfolioProject"> | Date | string;
};
export type PortfolioProjectCreateInput = {
    id?: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    projectUrl?: string | null;
    tags?: Prisma.PortfolioProjectCreatetagsInput | string[];
    order?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    portfolio: Prisma.PortfolioCreateNestedOneWithoutProjectsInput;
};
export type PortfolioProjectUncheckedCreateInput = {
    id?: string;
    portfolioId: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    projectUrl?: string | null;
    tags?: Prisma.PortfolioProjectCreatetagsInput | string[];
    order?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PortfolioProjectUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    projectUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tags?: Prisma.PortfolioProjectUpdatetagsInput | string[];
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    portfolio?: Prisma.PortfolioUpdateOneRequiredWithoutProjectsNestedInput;
};
export type PortfolioProjectUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    portfolioId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    projectUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tags?: Prisma.PortfolioProjectUpdatetagsInput | string[];
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PortfolioProjectCreateManyInput = {
    id?: string;
    portfolioId: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    projectUrl?: string | null;
    tags?: Prisma.PortfolioProjectCreatetagsInput | string[];
    order?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PortfolioProjectUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    projectUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tags?: Prisma.PortfolioProjectUpdatetagsInput | string[];
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PortfolioProjectUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    portfolioId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    projectUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tags?: Prisma.PortfolioProjectUpdatetagsInput | string[];
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PortfolioProjectListRelationFilter = {
    every?: Prisma.PortfolioProjectWhereInput;
    some?: Prisma.PortfolioProjectWhereInput;
    none?: Prisma.PortfolioProjectWhereInput;
};
export type PortfolioProjectOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
};
export type PortfolioProjectCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    portfolioId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    imageUrl?: Prisma.SortOrder;
    projectUrl?: Prisma.SortOrder;
    tags?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PortfolioProjectAvgOrderByAggregateInput = {
    order?: Prisma.SortOrder;
};
export type PortfolioProjectMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    portfolioId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    imageUrl?: Prisma.SortOrder;
    projectUrl?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PortfolioProjectMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    portfolioId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    imageUrl?: Prisma.SortOrder;
    projectUrl?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PortfolioProjectSumOrderByAggregateInput = {
    order?: Prisma.SortOrder;
};
export type PortfolioProjectCreateNestedManyWithoutPortfolioInput = {
    create?: Prisma.XOR<Prisma.PortfolioProjectCreateWithoutPortfolioInput, Prisma.PortfolioProjectUncheckedCreateWithoutPortfolioInput> | Prisma.PortfolioProjectCreateWithoutPortfolioInput[] | Prisma.PortfolioProjectUncheckedCreateWithoutPortfolioInput[];
    connectOrCreate?: Prisma.PortfolioProjectCreateOrConnectWithoutPortfolioInput | Prisma.PortfolioProjectCreateOrConnectWithoutPortfolioInput[];
    createMany?: Prisma.PortfolioProjectCreateManyPortfolioInputEnvelope;
    connect?: Prisma.PortfolioProjectWhereUniqueInput | Prisma.PortfolioProjectWhereUniqueInput[];
};
export type PortfolioProjectUncheckedCreateNestedManyWithoutPortfolioInput = {
    create?: Prisma.XOR<Prisma.PortfolioProjectCreateWithoutPortfolioInput, Prisma.PortfolioProjectUncheckedCreateWithoutPortfolioInput> | Prisma.PortfolioProjectCreateWithoutPortfolioInput[] | Prisma.PortfolioProjectUncheckedCreateWithoutPortfolioInput[];
    connectOrCreate?: Prisma.PortfolioProjectCreateOrConnectWithoutPortfolioInput | Prisma.PortfolioProjectCreateOrConnectWithoutPortfolioInput[];
    createMany?: Prisma.PortfolioProjectCreateManyPortfolioInputEnvelope;
    connect?: Prisma.PortfolioProjectWhereUniqueInput | Prisma.PortfolioProjectWhereUniqueInput[];
};
export type PortfolioProjectUpdateManyWithoutPortfolioNestedInput = {
    create?: Prisma.XOR<Prisma.PortfolioProjectCreateWithoutPortfolioInput, Prisma.PortfolioProjectUncheckedCreateWithoutPortfolioInput> | Prisma.PortfolioProjectCreateWithoutPortfolioInput[] | Prisma.PortfolioProjectUncheckedCreateWithoutPortfolioInput[];
    connectOrCreate?: Prisma.PortfolioProjectCreateOrConnectWithoutPortfolioInput | Prisma.PortfolioProjectCreateOrConnectWithoutPortfolioInput[];
    upsert?: Prisma.PortfolioProjectUpsertWithWhereUniqueWithoutPortfolioInput | Prisma.PortfolioProjectUpsertWithWhereUniqueWithoutPortfolioInput[];
    createMany?: Prisma.PortfolioProjectCreateManyPortfolioInputEnvelope;
    set?: Prisma.PortfolioProjectWhereUniqueInput | Prisma.PortfolioProjectWhereUniqueInput[];
    disconnect?: Prisma.PortfolioProjectWhereUniqueInput | Prisma.PortfolioProjectWhereUniqueInput[];
    delete?: Prisma.PortfolioProjectWhereUniqueInput | Prisma.PortfolioProjectWhereUniqueInput[];
    connect?: Prisma.PortfolioProjectWhereUniqueInput | Prisma.PortfolioProjectWhereUniqueInput[];
    update?: Prisma.PortfolioProjectUpdateWithWhereUniqueWithoutPortfolioInput | Prisma.PortfolioProjectUpdateWithWhereUniqueWithoutPortfolioInput[];
    updateMany?: Prisma.PortfolioProjectUpdateManyWithWhereWithoutPortfolioInput | Prisma.PortfolioProjectUpdateManyWithWhereWithoutPortfolioInput[];
    deleteMany?: Prisma.PortfolioProjectScalarWhereInput | Prisma.PortfolioProjectScalarWhereInput[];
};
export type PortfolioProjectUncheckedUpdateManyWithoutPortfolioNestedInput = {
    create?: Prisma.XOR<Prisma.PortfolioProjectCreateWithoutPortfolioInput, Prisma.PortfolioProjectUncheckedCreateWithoutPortfolioInput> | Prisma.PortfolioProjectCreateWithoutPortfolioInput[] | Prisma.PortfolioProjectUncheckedCreateWithoutPortfolioInput[];
    connectOrCreate?: Prisma.PortfolioProjectCreateOrConnectWithoutPortfolioInput | Prisma.PortfolioProjectCreateOrConnectWithoutPortfolioInput[];
    upsert?: Prisma.PortfolioProjectUpsertWithWhereUniqueWithoutPortfolioInput | Prisma.PortfolioProjectUpsertWithWhereUniqueWithoutPortfolioInput[];
    createMany?: Prisma.PortfolioProjectCreateManyPortfolioInputEnvelope;
    set?: Prisma.PortfolioProjectWhereUniqueInput | Prisma.PortfolioProjectWhereUniqueInput[];
    disconnect?: Prisma.PortfolioProjectWhereUniqueInput | Prisma.PortfolioProjectWhereUniqueInput[];
    delete?: Prisma.PortfolioProjectWhereUniqueInput | Prisma.PortfolioProjectWhereUniqueInput[];
    connect?: Prisma.PortfolioProjectWhereUniqueInput | Prisma.PortfolioProjectWhereUniqueInput[];
    update?: Prisma.PortfolioProjectUpdateWithWhereUniqueWithoutPortfolioInput | Prisma.PortfolioProjectUpdateWithWhereUniqueWithoutPortfolioInput[];
    updateMany?: Prisma.PortfolioProjectUpdateManyWithWhereWithoutPortfolioInput | Prisma.PortfolioProjectUpdateManyWithWhereWithoutPortfolioInput[];
    deleteMany?: Prisma.PortfolioProjectScalarWhereInput | Prisma.PortfolioProjectScalarWhereInput[];
};
export type PortfolioProjectCreatetagsInput = {
    set: string[];
};
export type PortfolioProjectUpdatetagsInput = {
    set?: string[];
    push?: string | string[];
};
export type PortfolioProjectCreateWithoutPortfolioInput = {
    id?: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    projectUrl?: string | null;
    tags?: Prisma.PortfolioProjectCreatetagsInput | string[];
    order?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PortfolioProjectUncheckedCreateWithoutPortfolioInput = {
    id?: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    projectUrl?: string | null;
    tags?: Prisma.PortfolioProjectCreatetagsInput | string[];
    order?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PortfolioProjectCreateOrConnectWithoutPortfolioInput = {
    where: Prisma.PortfolioProjectWhereUniqueInput;
    create: Prisma.XOR<Prisma.PortfolioProjectCreateWithoutPortfolioInput, Prisma.PortfolioProjectUncheckedCreateWithoutPortfolioInput>;
};
export type PortfolioProjectCreateManyPortfolioInputEnvelope = {
    data: Prisma.PortfolioProjectCreateManyPortfolioInput | Prisma.PortfolioProjectCreateManyPortfolioInput[];
    skipDuplicates?: boolean;
};
export type PortfolioProjectUpsertWithWhereUniqueWithoutPortfolioInput = {
    where: Prisma.PortfolioProjectWhereUniqueInput;
    update: Prisma.XOR<Prisma.PortfolioProjectUpdateWithoutPortfolioInput, Prisma.PortfolioProjectUncheckedUpdateWithoutPortfolioInput>;
    create: Prisma.XOR<Prisma.PortfolioProjectCreateWithoutPortfolioInput, Prisma.PortfolioProjectUncheckedCreateWithoutPortfolioInput>;
};
export type PortfolioProjectUpdateWithWhereUniqueWithoutPortfolioInput = {
    where: Prisma.PortfolioProjectWhereUniqueInput;
    data: Prisma.XOR<Prisma.PortfolioProjectUpdateWithoutPortfolioInput, Prisma.PortfolioProjectUncheckedUpdateWithoutPortfolioInput>;
};
export type PortfolioProjectUpdateManyWithWhereWithoutPortfolioInput = {
    where: Prisma.PortfolioProjectScalarWhereInput;
    data: Prisma.XOR<Prisma.PortfolioProjectUpdateManyMutationInput, Prisma.PortfolioProjectUncheckedUpdateManyWithoutPortfolioInput>;
};
export type PortfolioProjectScalarWhereInput = {
    AND?: Prisma.PortfolioProjectScalarWhereInput | Prisma.PortfolioProjectScalarWhereInput[];
    OR?: Prisma.PortfolioProjectScalarWhereInput[];
    NOT?: Prisma.PortfolioProjectScalarWhereInput | Prisma.PortfolioProjectScalarWhereInput[];
    id?: Prisma.StringFilter<"PortfolioProject"> | string;
    portfolioId?: Prisma.StringFilter<"PortfolioProject"> | string;
    title?: Prisma.StringFilter<"PortfolioProject"> | string;
    description?: Prisma.StringNullableFilter<"PortfolioProject"> | string | null;
    imageUrl?: Prisma.StringNullableFilter<"PortfolioProject"> | string | null;
    projectUrl?: Prisma.StringNullableFilter<"PortfolioProject"> | string | null;
    tags?: Prisma.StringNullableListFilter<"PortfolioProject">;
    order?: Prisma.IntFilter<"PortfolioProject"> | number;
    createdAt?: Prisma.DateTimeFilter<"PortfolioProject"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PortfolioProject"> | Date | string;
};
export type PortfolioProjectCreateManyPortfolioInput = {
    id?: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    projectUrl?: string | null;
    tags?: Prisma.PortfolioProjectCreatetagsInput | string[];
    order?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PortfolioProjectUpdateWithoutPortfolioInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    projectUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tags?: Prisma.PortfolioProjectUpdatetagsInput | string[];
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PortfolioProjectUncheckedUpdateWithoutPortfolioInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    projectUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tags?: Prisma.PortfolioProjectUpdatetagsInput | string[];
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PortfolioProjectUncheckedUpdateManyWithoutPortfolioInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    projectUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tags?: Prisma.PortfolioProjectUpdatetagsInput | string[];
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PortfolioProjectSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    portfolioId?: boolean;
    title?: boolean;
    description?: boolean;
    imageUrl?: boolean;
    projectUrl?: boolean;
    tags?: boolean;
    order?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    portfolio?: boolean | Prisma.PortfolioDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["portfolioProject"]>;
export type PortfolioProjectSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    portfolioId?: boolean;
    title?: boolean;
    description?: boolean;
    imageUrl?: boolean;
    projectUrl?: boolean;
    tags?: boolean;
    order?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    portfolio?: boolean | Prisma.PortfolioDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["portfolioProject"]>;
export type PortfolioProjectSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    portfolioId?: boolean;
    title?: boolean;
    description?: boolean;
    imageUrl?: boolean;
    projectUrl?: boolean;
    tags?: boolean;
    order?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    portfolio?: boolean | Prisma.PortfolioDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["portfolioProject"]>;
export type PortfolioProjectSelectScalar = {
    id?: boolean;
    portfolioId?: boolean;
    title?: boolean;
    description?: boolean;
    imageUrl?: boolean;
    projectUrl?: boolean;
    tags?: boolean;
    order?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PortfolioProjectOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "portfolioId" | "title" | "description" | "imageUrl" | "projectUrl" | "tags" | "order" | "createdAt" | "updatedAt", ExtArgs["result"]["portfolioProject"]>;
export type PortfolioProjectInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    portfolio?: boolean | Prisma.PortfolioDefaultArgs<ExtArgs>;
};
export type PortfolioProjectIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    portfolio?: boolean | Prisma.PortfolioDefaultArgs<ExtArgs>;
};
export type PortfolioProjectIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    portfolio?: boolean | Prisma.PortfolioDefaultArgs<ExtArgs>;
};
export type $PortfolioProjectPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PortfolioProject";
    objects: {
        portfolio: Prisma.$PortfolioPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        portfolioId: string;
        title: string;
        description: string | null;
        imageUrl: string | null;
        projectUrl: string | null;
        tags: string[];
        order: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["portfolioProject"]>;
    composites: {};
};
export type PortfolioProjectGetPayload<S extends boolean | null | undefined | PortfolioProjectDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PortfolioProjectPayload, S>;
export type PortfolioProjectCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PortfolioProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PortfolioProjectCountAggregateInputType | true;
};
export interface PortfolioProjectDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PortfolioProject'];
        meta: {
            name: 'PortfolioProject';
        };
    };
    findUnique<T extends PortfolioProjectFindUniqueArgs>(args: Prisma.SelectSubset<T, PortfolioProjectFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PortfolioProjectClient<runtime.Types.Result.GetResult<Prisma.$PortfolioProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PortfolioProjectFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PortfolioProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PortfolioProjectClient<runtime.Types.Result.GetResult<Prisma.$PortfolioProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PortfolioProjectFindFirstArgs>(args?: Prisma.SelectSubset<T, PortfolioProjectFindFirstArgs<ExtArgs>>): Prisma.Prisma__PortfolioProjectClient<runtime.Types.Result.GetResult<Prisma.$PortfolioProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PortfolioProjectFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PortfolioProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PortfolioProjectClient<runtime.Types.Result.GetResult<Prisma.$PortfolioProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PortfolioProjectFindManyArgs>(args?: Prisma.SelectSubset<T, PortfolioProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PortfolioProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PortfolioProjectCreateArgs>(args: Prisma.SelectSubset<T, PortfolioProjectCreateArgs<ExtArgs>>): Prisma.Prisma__PortfolioProjectClient<runtime.Types.Result.GetResult<Prisma.$PortfolioProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PortfolioProjectCreateManyArgs>(args?: Prisma.SelectSubset<T, PortfolioProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PortfolioProjectCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PortfolioProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PortfolioProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PortfolioProjectDeleteArgs>(args: Prisma.SelectSubset<T, PortfolioProjectDeleteArgs<ExtArgs>>): Prisma.Prisma__PortfolioProjectClient<runtime.Types.Result.GetResult<Prisma.$PortfolioProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PortfolioProjectUpdateArgs>(args: Prisma.SelectSubset<T, PortfolioProjectUpdateArgs<ExtArgs>>): Prisma.Prisma__PortfolioProjectClient<runtime.Types.Result.GetResult<Prisma.$PortfolioProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PortfolioProjectDeleteManyArgs>(args?: Prisma.SelectSubset<T, PortfolioProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PortfolioProjectUpdateManyArgs>(args: Prisma.SelectSubset<T, PortfolioProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PortfolioProjectUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PortfolioProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PortfolioProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PortfolioProjectUpsertArgs>(args: Prisma.SelectSubset<T, PortfolioProjectUpsertArgs<ExtArgs>>): Prisma.Prisma__PortfolioProjectClient<runtime.Types.Result.GetResult<Prisma.$PortfolioProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PortfolioProjectCountArgs>(args?: Prisma.Subset<T, PortfolioProjectCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PortfolioProjectCountAggregateOutputType> : number>;
    aggregate<T extends PortfolioProjectAggregateArgs>(args: Prisma.Subset<T, PortfolioProjectAggregateArgs>): Prisma.PrismaPromise<GetPortfolioProjectAggregateType<T>>;
    groupBy<T extends PortfolioProjectGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PortfolioProjectGroupByArgs['orderBy'];
    } : {
        orderBy?: PortfolioProjectGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PortfolioProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPortfolioProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PortfolioProjectFieldRefs;
}
export interface Prisma__PortfolioProjectClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    portfolio<T extends Prisma.PortfolioDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PortfolioDefaultArgs<ExtArgs>>): Prisma.Prisma__PortfolioClient<runtime.Types.Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PortfolioProjectFieldRefs {
    readonly id: Prisma.FieldRef<"PortfolioProject", 'String'>;
    readonly portfolioId: Prisma.FieldRef<"PortfolioProject", 'String'>;
    readonly title: Prisma.FieldRef<"PortfolioProject", 'String'>;
    readonly description: Prisma.FieldRef<"PortfolioProject", 'String'>;
    readonly imageUrl: Prisma.FieldRef<"PortfolioProject", 'String'>;
    readonly projectUrl: Prisma.FieldRef<"PortfolioProject", 'String'>;
    readonly tags: Prisma.FieldRef<"PortfolioProject", 'String[]'>;
    readonly order: Prisma.FieldRef<"PortfolioProject", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"PortfolioProject", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"PortfolioProject", 'DateTime'>;
}
export type PortfolioProjectFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioProjectSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioProjectOmit<ExtArgs> | null;
    include?: Prisma.PortfolioProjectInclude<ExtArgs> | null;
    where: Prisma.PortfolioProjectWhereUniqueInput;
};
export type PortfolioProjectFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioProjectSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioProjectOmit<ExtArgs> | null;
    include?: Prisma.PortfolioProjectInclude<ExtArgs> | null;
    where: Prisma.PortfolioProjectWhereUniqueInput;
};
export type PortfolioProjectFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioProjectSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioProjectOmit<ExtArgs> | null;
    include?: Prisma.PortfolioProjectInclude<ExtArgs> | null;
    where?: Prisma.PortfolioProjectWhereInput;
    orderBy?: Prisma.PortfolioProjectOrderByWithRelationInput | Prisma.PortfolioProjectOrderByWithRelationInput[];
    cursor?: Prisma.PortfolioProjectWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PortfolioProjectScalarFieldEnum | Prisma.PortfolioProjectScalarFieldEnum[];
};
export type PortfolioProjectFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioProjectSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioProjectOmit<ExtArgs> | null;
    include?: Prisma.PortfolioProjectInclude<ExtArgs> | null;
    where?: Prisma.PortfolioProjectWhereInput;
    orderBy?: Prisma.PortfolioProjectOrderByWithRelationInput | Prisma.PortfolioProjectOrderByWithRelationInput[];
    cursor?: Prisma.PortfolioProjectWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PortfolioProjectScalarFieldEnum | Prisma.PortfolioProjectScalarFieldEnum[];
};
export type PortfolioProjectFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioProjectSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioProjectOmit<ExtArgs> | null;
    include?: Prisma.PortfolioProjectInclude<ExtArgs> | null;
    where?: Prisma.PortfolioProjectWhereInput;
    orderBy?: Prisma.PortfolioProjectOrderByWithRelationInput | Prisma.PortfolioProjectOrderByWithRelationInput[];
    cursor?: Prisma.PortfolioProjectWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PortfolioProjectScalarFieldEnum | Prisma.PortfolioProjectScalarFieldEnum[];
};
export type PortfolioProjectCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioProjectSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioProjectOmit<ExtArgs> | null;
    include?: Prisma.PortfolioProjectInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PortfolioProjectCreateInput, Prisma.PortfolioProjectUncheckedCreateInput>;
};
export type PortfolioProjectCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PortfolioProjectCreateManyInput | Prisma.PortfolioProjectCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PortfolioProjectCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioProjectSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PortfolioProjectOmit<ExtArgs> | null;
    data: Prisma.PortfolioProjectCreateManyInput | Prisma.PortfolioProjectCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PortfolioProjectIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PortfolioProjectUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioProjectSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioProjectOmit<ExtArgs> | null;
    include?: Prisma.PortfolioProjectInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PortfolioProjectUpdateInput, Prisma.PortfolioProjectUncheckedUpdateInput>;
    where: Prisma.PortfolioProjectWhereUniqueInput;
};
export type PortfolioProjectUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PortfolioProjectUpdateManyMutationInput, Prisma.PortfolioProjectUncheckedUpdateManyInput>;
    where?: Prisma.PortfolioProjectWhereInput;
    limit?: number;
};
export type PortfolioProjectUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioProjectSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PortfolioProjectOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PortfolioProjectUpdateManyMutationInput, Prisma.PortfolioProjectUncheckedUpdateManyInput>;
    where?: Prisma.PortfolioProjectWhereInput;
    limit?: number;
    include?: Prisma.PortfolioProjectIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PortfolioProjectUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioProjectSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioProjectOmit<ExtArgs> | null;
    include?: Prisma.PortfolioProjectInclude<ExtArgs> | null;
    where: Prisma.PortfolioProjectWhereUniqueInput;
    create: Prisma.XOR<Prisma.PortfolioProjectCreateInput, Prisma.PortfolioProjectUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PortfolioProjectUpdateInput, Prisma.PortfolioProjectUncheckedUpdateInput>;
};
export type PortfolioProjectDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioProjectSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioProjectOmit<ExtArgs> | null;
    include?: Prisma.PortfolioProjectInclude<ExtArgs> | null;
    where: Prisma.PortfolioProjectWhereUniqueInput;
};
export type PortfolioProjectDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PortfolioProjectWhereInput;
    limit?: number;
};
export type PortfolioProjectDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioProjectSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioProjectOmit<ExtArgs> | null;
    include?: Prisma.PortfolioProjectInclude<ExtArgs> | null;
};
