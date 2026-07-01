import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PortfolioModel = runtime.Types.Result.DefaultSelection<Prisma.$PortfolioPayload>;
export type AggregatePortfolio = {
    _count: PortfolioCountAggregateOutputType | null;
    _min: PortfolioMinAggregateOutputType | null;
    _max: PortfolioMaxAggregateOutputType | null;
};
export type PortfolioMinAggregateOutputType = {
    id: string | null;
    cardId: string | null;
    title: string | null;
    description: string | null;
    isPublic: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PortfolioMaxAggregateOutputType = {
    id: string | null;
    cardId: string | null;
    title: string | null;
    description: string | null;
    isPublic: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PortfolioCountAggregateOutputType = {
    id: number;
    cardId: number;
    title: number;
    description: number;
    isPublic: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PortfolioMinAggregateInputType = {
    id?: true;
    cardId?: true;
    title?: true;
    description?: true;
    isPublic?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PortfolioMaxAggregateInputType = {
    id?: true;
    cardId?: true;
    title?: true;
    description?: true;
    isPublic?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PortfolioCountAggregateInputType = {
    id?: true;
    cardId?: true;
    title?: true;
    description?: true;
    isPublic?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PortfolioAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PortfolioWhereInput;
    orderBy?: Prisma.PortfolioOrderByWithRelationInput | Prisma.PortfolioOrderByWithRelationInput[];
    cursor?: Prisma.PortfolioWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PortfolioCountAggregateInputType;
    _min?: PortfolioMinAggregateInputType;
    _max?: PortfolioMaxAggregateInputType;
};
export type GetPortfolioAggregateType<T extends PortfolioAggregateArgs> = {
    [P in keyof T & keyof AggregatePortfolio]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePortfolio[P]> : Prisma.GetScalarType<T[P], AggregatePortfolio[P]>;
};
export type PortfolioGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PortfolioWhereInput;
    orderBy?: Prisma.PortfolioOrderByWithAggregationInput | Prisma.PortfolioOrderByWithAggregationInput[];
    by: Prisma.PortfolioScalarFieldEnum[] | Prisma.PortfolioScalarFieldEnum;
    having?: Prisma.PortfolioScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PortfolioCountAggregateInputType | true;
    _min?: PortfolioMinAggregateInputType;
    _max?: PortfolioMaxAggregateInputType;
};
export type PortfolioGroupByOutputType = {
    id: string;
    cardId: string;
    title: string;
    description: string | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: PortfolioCountAggregateOutputType | null;
    _min: PortfolioMinAggregateOutputType | null;
    _max: PortfolioMaxAggregateOutputType | null;
};
export type GetPortfolioGroupByPayload<T extends PortfolioGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PortfolioGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PortfolioGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PortfolioGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PortfolioGroupByOutputType[P]>;
}>>;
export type PortfolioWhereInput = {
    AND?: Prisma.PortfolioWhereInput | Prisma.PortfolioWhereInput[];
    OR?: Prisma.PortfolioWhereInput[];
    NOT?: Prisma.PortfolioWhereInput | Prisma.PortfolioWhereInput[];
    id?: Prisma.StringFilter<"Portfolio"> | string;
    cardId?: Prisma.StringFilter<"Portfolio"> | string;
    title?: Prisma.StringFilter<"Portfolio"> | string;
    description?: Prisma.StringNullableFilter<"Portfolio"> | string | null;
    isPublic?: Prisma.BoolFilter<"Portfolio"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Portfolio"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Portfolio"> | Date | string;
    card?: Prisma.XOR<Prisma.BusinessCardScalarRelationFilter, Prisma.BusinessCardWhereInput>;
    projects?: Prisma.PortfolioProjectListRelationFilter;
};
export type PortfolioOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    isPublic?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    card?: Prisma.BusinessCardOrderByWithRelationInput;
    projects?: Prisma.PortfolioProjectOrderByRelationAggregateInput;
};
export type PortfolioWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    cardId?: string;
    AND?: Prisma.PortfolioWhereInput | Prisma.PortfolioWhereInput[];
    OR?: Prisma.PortfolioWhereInput[];
    NOT?: Prisma.PortfolioWhereInput | Prisma.PortfolioWhereInput[];
    title?: Prisma.StringFilter<"Portfolio"> | string;
    description?: Prisma.StringNullableFilter<"Portfolio"> | string | null;
    isPublic?: Prisma.BoolFilter<"Portfolio"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Portfolio"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Portfolio"> | Date | string;
    card?: Prisma.XOR<Prisma.BusinessCardScalarRelationFilter, Prisma.BusinessCardWhereInput>;
    projects?: Prisma.PortfolioProjectListRelationFilter;
}, "id" | "cardId">;
export type PortfolioOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    isPublic?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PortfolioCountOrderByAggregateInput;
    _max?: Prisma.PortfolioMaxOrderByAggregateInput;
    _min?: Prisma.PortfolioMinOrderByAggregateInput;
};
export type PortfolioScalarWhereWithAggregatesInput = {
    AND?: Prisma.PortfolioScalarWhereWithAggregatesInput | Prisma.PortfolioScalarWhereWithAggregatesInput[];
    OR?: Prisma.PortfolioScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PortfolioScalarWhereWithAggregatesInput | Prisma.PortfolioScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Portfolio"> | string;
    cardId?: Prisma.StringWithAggregatesFilter<"Portfolio"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Portfolio"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Portfolio"> | string | null;
    isPublic?: Prisma.BoolWithAggregatesFilter<"Portfolio"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Portfolio"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Portfolio"> | Date | string;
};
export type PortfolioCreateInput = {
    id?: string;
    title: string;
    description?: string | null;
    isPublic?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    card: Prisma.BusinessCardCreateNestedOneWithoutPortfolioInput;
    projects?: Prisma.PortfolioProjectCreateNestedManyWithoutPortfolioInput;
};
export type PortfolioUncheckedCreateInput = {
    id?: string;
    cardId: string;
    title: string;
    description?: string | null;
    isPublic?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: Prisma.PortfolioProjectUncheckedCreateNestedManyWithoutPortfolioInput;
};
export type PortfolioUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    card?: Prisma.BusinessCardUpdateOneRequiredWithoutPortfolioNestedInput;
    projects?: Prisma.PortfolioProjectUpdateManyWithoutPortfolioNestedInput;
};
export type PortfolioUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cardId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: Prisma.PortfolioProjectUncheckedUpdateManyWithoutPortfolioNestedInput;
};
export type PortfolioCreateManyInput = {
    id?: string;
    cardId: string;
    title: string;
    description?: string | null;
    isPublic?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PortfolioUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PortfolioUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cardId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PortfolioNullableScalarRelationFilter = {
    is?: Prisma.PortfolioWhereInput | null;
    isNot?: Prisma.PortfolioWhereInput | null;
};
export type PortfolioCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isPublic?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PortfolioMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isPublic?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PortfolioMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isPublic?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PortfolioScalarRelationFilter = {
    is?: Prisma.PortfolioWhereInput;
    isNot?: Prisma.PortfolioWhereInput;
};
export type PortfolioCreateNestedOneWithoutCardInput = {
    create?: Prisma.XOR<Prisma.PortfolioCreateWithoutCardInput, Prisma.PortfolioUncheckedCreateWithoutCardInput>;
    connectOrCreate?: Prisma.PortfolioCreateOrConnectWithoutCardInput;
    connect?: Prisma.PortfolioWhereUniqueInput;
};
export type PortfolioUncheckedCreateNestedOneWithoutCardInput = {
    create?: Prisma.XOR<Prisma.PortfolioCreateWithoutCardInput, Prisma.PortfolioUncheckedCreateWithoutCardInput>;
    connectOrCreate?: Prisma.PortfolioCreateOrConnectWithoutCardInput;
    connect?: Prisma.PortfolioWhereUniqueInput;
};
export type PortfolioUpdateOneWithoutCardNestedInput = {
    create?: Prisma.XOR<Prisma.PortfolioCreateWithoutCardInput, Prisma.PortfolioUncheckedCreateWithoutCardInput>;
    connectOrCreate?: Prisma.PortfolioCreateOrConnectWithoutCardInput;
    upsert?: Prisma.PortfolioUpsertWithoutCardInput;
    disconnect?: Prisma.PortfolioWhereInput | boolean;
    delete?: Prisma.PortfolioWhereInput | boolean;
    connect?: Prisma.PortfolioWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PortfolioUpdateToOneWithWhereWithoutCardInput, Prisma.PortfolioUpdateWithoutCardInput>, Prisma.PortfolioUncheckedUpdateWithoutCardInput>;
};
export type PortfolioUncheckedUpdateOneWithoutCardNestedInput = {
    create?: Prisma.XOR<Prisma.PortfolioCreateWithoutCardInput, Prisma.PortfolioUncheckedCreateWithoutCardInput>;
    connectOrCreate?: Prisma.PortfolioCreateOrConnectWithoutCardInput;
    upsert?: Prisma.PortfolioUpsertWithoutCardInput;
    disconnect?: Prisma.PortfolioWhereInput | boolean;
    delete?: Prisma.PortfolioWhereInput | boolean;
    connect?: Prisma.PortfolioWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PortfolioUpdateToOneWithWhereWithoutCardInput, Prisma.PortfolioUpdateWithoutCardInput>, Prisma.PortfolioUncheckedUpdateWithoutCardInput>;
};
export type PortfolioCreateNestedOneWithoutProjectsInput = {
    create?: Prisma.XOR<Prisma.PortfolioCreateWithoutProjectsInput, Prisma.PortfolioUncheckedCreateWithoutProjectsInput>;
    connectOrCreate?: Prisma.PortfolioCreateOrConnectWithoutProjectsInput;
    connect?: Prisma.PortfolioWhereUniqueInput;
};
export type PortfolioUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: Prisma.XOR<Prisma.PortfolioCreateWithoutProjectsInput, Prisma.PortfolioUncheckedCreateWithoutProjectsInput>;
    connectOrCreate?: Prisma.PortfolioCreateOrConnectWithoutProjectsInput;
    upsert?: Prisma.PortfolioUpsertWithoutProjectsInput;
    connect?: Prisma.PortfolioWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PortfolioUpdateToOneWithWhereWithoutProjectsInput, Prisma.PortfolioUpdateWithoutProjectsInput>, Prisma.PortfolioUncheckedUpdateWithoutProjectsInput>;
};
export type PortfolioCreateWithoutCardInput = {
    id?: string;
    title: string;
    description?: string | null;
    isPublic?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: Prisma.PortfolioProjectCreateNestedManyWithoutPortfolioInput;
};
export type PortfolioUncheckedCreateWithoutCardInput = {
    id?: string;
    title: string;
    description?: string | null;
    isPublic?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: Prisma.PortfolioProjectUncheckedCreateNestedManyWithoutPortfolioInput;
};
export type PortfolioCreateOrConnectWithoutCardInput = {
    where: Prisma.PortfolioWhereUniqueInput;
    create: Prisma.XOR<Prisma.PortfolioCreateWithoutCardInput, Prisma.PortfolioUncheckedCreateWithoutCardInput>;
};
export type PortfolioUpsertWithoutCardInput = {
    update: Prisma.XOR<Prisma.PortfolioUpdateWithoutCardInput, Prisma.PortfolioUncheckedUpdateWithoutCardInput>;
    create: Prisma.XOR<Prisma.PortfolioCreateWithoutCardInput, Prisma.PortfolioUncheckedCreateWithoutCardInput>;
    where?: Prisma.PortfolioWhereInput;
};
export type PortfolioUpdateToOneWithWhereWithoutCardInput = {
    where?: Prisma.PortfolioWhereInput;
    data: Prisma.XOR<Prisma.PortfolioUpdateWithoutCardInput, Prisma.PortfolioUncheckedUpdateWithoutCardInput>;
};
export type PortfolioUpdateWithoutCardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: Prisma.PortfolioProjectUpdateManyWithoutPortfolioNestedInput;
};
export type PortfolioUncheckedUpdateWithoutCardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: Prisma.PortfolioProjectUncheckedUpdateManyWithoutPortfolioNestedInput;
};
export type PortfolioCreateWithoutProjectsInput = {
    id?: string;
    title: string;
    description?: string | null;
    isPublic?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    card: Prisma.BusinessCardCreateNestedOneWithoutPortfolioInput;
};
export type PortfolioUncheckedCreateWithoutProjectsInput = {
    id?: string;
    cardId: string;
    title: string;
    description?: string | null;
    isPublic?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PortfolioCreateOrConnectWithoutProjectsInput = {
    where: Prisma.PortfolioWhereUniqueInput;
    create: Prisma.XOR<Prisma.PortfolioCreateWithoutProjectsInput, Prisma.PortfolioUncheckedCreateWithoutProjectsInput>;
};
export type PortfolioUpsertWithoutProjectsInput = {
    update: Prisma.XOR<Prisma.PortfolioUpdateWithoutProjectsInput, Prisma.PortfolioUncheckedUpdateWithoutProjectsInput>;
    create: Prisma.XOR<Prisma.PortfolioCreateWithoutProjectsInput, Prisma.PortfolioUncheckedCreateWithoutProjectsInput>;
    where?: Prisma.PortfolioWhereInput;
};
export type PortfolioUpdateToOneWithWhereWithoutProjectsInput = {
    where?: Prisma.PortfolioWhereInput;
    data: Prisma.XOR<Prisma.PortfolioUpdateWithoutProjectsInput, Prisma.PortfolioUncheckedUpdateWithoutProjectsInput>;
};
export type PortfolioUpdateWithoutProjectsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    card?: Prisma.BusinessCardUpdateOneRequiredWithoutPortfolioNestedInput;
};
export type PortfolioUncheckedUpdateWithoutProjectsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cardId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PortfolioCountOutputType = {
    projects: number;
};
export type PortfolioCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    projects?: boolean | PortfolioCountOutputTypeCountProjectsArgs;
};
export type PortfolioCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioCountOutputTypeSelect<ExtArgs> | null;
};
export type PortfolioCountOutputTypeCountProjectsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PortfolioProjectWhereInput;
};
export type PortfolioSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    cardId?: boolean;
    title?: boolean;
    description?: boolean;
    isPublic?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
    projects?: boolean | Prisma.Portfolio$projectsArgs<ExtArgs>;
    _count?: boolean | Prisma.PortfolioCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["portfolio"]>;
export type PortfolioSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    cardId?: boolean;
    title?: boolean;
    description?: boolean;
    isPublic?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["portfolio"]>;
export type PortfolioSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    cardId?: boolean;
    title?: boolean;
    description?: boolean;
    isPublic?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["portfolio"]>;
export type PortfolioSelectScalar = {
    id?: boolean;
    cardId?: boolean;
    title?: boolean;
    description?: boolean;
    isPublic?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PortfolioOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "cardId" | "title" | "description" | "isPublic" | "createdAt" | "updatedAt", ExtArgs["result"]["portfolio"]>;
export type PortfolioInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
    projects?: boolean | Prisma.Portfolio$projectsArgs<ExtArgs>;
    _count?: boolean | Prisma.PortfolioCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PortfolioIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
};
export type PortfolioIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
};
export type $PortfolioPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Portfolio";
    objects: {
        card: Prisma.$BusinessCardPayload<ExtArgs>;
        projects: Prisma.$PortfolioProjectPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        cardId: string;
        title: string;
        description: string | null;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["portfolio"]>;
    composites: {};
};
export type PortfolioGetPayload<S extends boolean | null | undefined | PortfolioDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PortfolioPayload, S>;
export type PortfolioCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PortfolioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PortfolioCountAggregateInputType | true;
};
export interface PortfolioDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Portfolio'];
        meta: {
            name: 'Portfolio';
        };
    };
    findUnique<T extends PortfolioFindUniqueArgs>(args: Prisma.SelectSubset<T, PortfolioFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PortfolioClient<runtime.Types.Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PortfolioFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PortfolioFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PortfolioClient<runtime.Types.Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PortfolioFindFirstArgs>(args?: Prisma.SelectSubset<T, PortfolioFindFirstArgs<ExtArgs>>): Prisma.Prisma__PortfolioClient<runtime.Types.Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PortfolioFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PortfolioFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PortfolioClient<runtime.Types.Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PortfolioFindManyArgs>(args?: Prisma.SelectSubset<T, PortfolioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PortfolioCreateArgs>(args: Prisma.SelectSubset<T, PortfolioCreateArgs<ExtArgs>>): Prisma.Prisma__PortfolioClient<runtime.Types.Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PortfolioCreateManyArgs>(args?: Prisma.SelectSubset<T, PortfolioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PortfolioCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PortfolioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PortfolioDeleteArgs>(args: Prisma.SelectSubset<T, PortfolioDeleteArgs<ExtArgs>>): Prisma.Prisma__PortfolioClient<runtime.Types.Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PortfolioUpdateArgs>(args: Prisma.SelectSubset<T, PortfolioUpdateArgs<ExtArgs>>): Prisma.Prisma__PortfolioClient<runtime.Types.Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PortfolioDeleteManyArgs>(args?: Prisma.SelectSubset<T, PortfolioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PortfolioUpdateManyArgs>(args: Prisma.SelectSubset<T, PortfolioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PortfolioUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PortfolioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PortfolioUpsertArgs>(args: Prisma.SelectSubset<T, PortfolioUpsertArgs<ExtArgs>>): Prisma.Prisma__PortfolioClient<runtime.Types.Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PortfolioCountArgs>(args?: Prisma.Subset<T, PortfolioCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PortfolioCountAggregateOutputType> : number>;
    aggregate<T extends PortfolioAggregateArgs>(args: Prisma.Subset<T, PortfolioAggregateArgs>): Prisma.PrismaPromise<GetPortfolioAggregateType<T>>;
    groupBy<T extends PortfolioGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PortfolioGroupByArgs['orderBy'];
    } : {
        orderBy?: PortfolioGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PortfolioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPortfolioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PortfolioFieldRefs;
}
export interface Prisma__PortfolioClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    card<T extends Prisma.BusinessCardDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BusinessCardDefaultArgs<ExtArgs>>): Prisma.Prisma__BusinessCardClient<runtime.Types.Result.GetResult<Prisma.$BusinessCardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    projects<T extends Prisma.Portfolio$projectsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Portfolio$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PortfolioProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PortfolioFieldRefs {
    readonly id: Prisma.FieldRef<"Portfolio", 'String'>;
    readonly cardId: Prisma.FieldRef<"Portfolio", 'String'>;
    readonly title: Prisma.FieldRef<"Portfolio", 'String'>;
    readonly description: Prisma.FieldRef<"Portfolio", 'String'>;
    readonly isPublic: Prisma.FieldRef<"Portfolio", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Portfolio", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Portfolio", 'DateTime'>;
}
export type PortfolioFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioOmit<ExtArgs> | null;
    include?: Prisma.PortfolioInclude<ExtArgs> | null;
    where: Prisma.PortfolioWhereUniqueInput;
};
export type PortfolioFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioOmit<ExtArgs> | null;
    include?: Prisma.PortfolioInclude<ExtArgs> | null;
    where: Prisma.PortfolioWhereUniqueInput;
};
export type PortfolioFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioOmit<ExtArgs> | null;
    include?: Prisma.PortfolioInclude<ExtArgs> | null;
    where?: Prisma.PortfolioWhereInput;
    orderBy?: Prisma.PortfolioOrderByWithRelationInput | Prisma.PortfolioOrderByWithRelationInput[];
    cursor?: Prisma.PortfolioWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PortfolioScalarFieldEnum | Prisma.PortfolioScalarFieldEnum[];
};
export type PortfolioFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioOmit<ExtArgs> | null;
    include?: Prisma.PortfolioInclude<ExtArgs> | null;
    where?: Prisma.PortfolioWhereInput;
    orderBy?: Prisma.PortfolioOrderByWithRelationInput | Prisma.PortfolioOrderByWithRelationInput[];
    cursor?: Prisma.PortfolioWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PortfolioScalarFieldEnum | Prisma.PortfolioScalarFieldEnum[];
};
export type PortfolioFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioOmit<ExtArgs> | null;
    include?: Prisma.PortfolioInclude<ExtArgs> | null;
    where?: Prisma.PortfolioWhereInput;
    orderBy?: Prisma.PortfolioOrderByWithRelationInput | Prisma.PortfolioOrderByWithRelationInput[];
    cursor?: Prisma.PortfolioWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PortfolioScalarFieldEnum | Prisma.PortfolioScalarFieldEnum[];
};
export type PortfolioCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioOmit<ExtArgs> | null;
    include?: Prisma.PortfolioInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PortfolioCreateInput, Prisma.PortfolioUncheckedCreateInput>;
};
export type PortfolioCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PortfolioCreateManyInput | Prisma.PortfolioCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PortfolioCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PortfolioOmit<ExtArgs> | null;
    data: Prisma.PortfolioCreateManyInput | Prisma.PortfolioCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PortfolioIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PortfolioUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioOmit<ExtArgs> | null;
    include?: Prisma.PortfolioInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PortfolioUpdateInput, Prisma.PortfolioUncheckedUpdateInput>;
    where: Prisma.PortfolioWhereUniqueInput;
};
export type PortfolioUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PortfolioUpdateManyMutationInput, Prisma.PortfolioUncheckedUpdateManyInput>;
    where?: Prisma.PortfolioWhereInput;
    limit?: number;
};
export type PortfolioUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PortfolioOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PortfolioUpdateManyMutationInput, Prisma.PortfolioUncheckedUpdateManyInput>;
    where?: Prisma.PortfolioWhereInput;
    limit?: number;
    include?: Prisma.PortfolioIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PortfolioUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioOmit<ExtArgs> | null;
    include?: Prisma.PortfolioInclude<ExtArgs> | null;
    where: Prisma.PortfolioWhereUniqueInput;
    create: Prisma.XOR<Prisma.PortfolioCreateInput, Prisma.PortfolioUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PortfolioUpdateInput, Prisma.PortfolioUncheckedUpdateInput>;
};
export type PortfolioDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioOmit<ExtArgs> | null;
    include?: Prisma.PortfolioInclude<ExtArgs> | null;
    where: Prisma.PortfolioWhereUniqueInput;
};
export type PortfolioDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PortfolioWhereInput;
    limit?: number;
};
export type Portfolio$projectsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type PortfolioDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PortfolioSelect<ExtArgs> | null;
    omit?: Prisma.PortfolioOmit<ExtArgs> | null;
    include?: Prisma.PortfolioInclude<ExtArgs> | null;
};
