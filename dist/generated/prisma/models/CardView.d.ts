import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CardViewModel = runtime.Types.Result.DefaultSelection<Prisma.$CardViewPayload>;
export type AggregateCardView = {
    _count: CardViewCountAggregateOutputType | null;
    _min: CardViewMinAggregateOutputType | null;
    _max: CardViewMaxAggregateOutputType | null;
};
export type CardViewMinAggregateOutputType = {
    id: string | null;
    cardId: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    referrer: string | null;
    viewedAt: Date | null;
};
export type CardViewMaxAggregateOutputType = {
    id: string | null;
    cardId: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    referrer: string | null;
    viewedAt: Date | null;
};
export type CardViewCountAggregateOutputType = {
    id: number;
    cardId: number;
    ipAddress: number;
    userAgent: number;
    referrer: number;
    viewedAt: number;
    _all: number;
};
export type CardViewMinAggregateInputType = {
    id?: true;
    cardId?: true;
    ipAddress?: true;
    userAgent?: true;
    referrer?: true;
    viewedAt?: true;
};
export type CardViewMaxAggregateInputType = {
    id?: true;
    cardId?: true;
    ipAddress?: true;
    userAgent?: true;
    referrer?: true;
    viewedAt?: true;
};
export type CardViewCountAggregateInputType = {
    id?: true;
    cardId?: true;
    ipAddress?: true;
    userAgent?: true;
    referrer?: true;
    viewedAt?: true;
    _all?: true;
};
export type CardViewAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CardViewWhereInput;
    orderBy?: Prisma.CardViewOrderByWithRelationInput | Prisma.CardViewOrderByWithRelationInput[];
    cursor?: Prisma.CardViewWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CardViewCountAggregateInputType;
    _min?: CardViewMinAggregateInputType;
    _max?: CardViewMaxAggregateInputType;
};
export type GetCardViewAggregateType<T extends CardViewAggregateArgs> = {
    [P in keyof T & keyof AggregateCardView]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCardView[P]> : Prisma.GetScalarType<T[P], AggregateCardView[P]>;
};
export type CardViewGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CardViewWhereInput;
    orderBy?: Prisma.CardViewOrderByWithAggregationInput | Prisma.CardViewOrderByWithAggregationInput[];
    by: Prisma.CardViewScalarFieldEnum[] | Prisma.CardViewScalarFieldEnum;
    having?: Prisma.CardViewScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CardViewCountAggregateInputType | true;
    _min?: CardViewMinAggregateInputType;
    _max?: CardViewMaxAggregateInputType;
};
export type CardViewGroupByOutputType = {
    id: string;
    cardId: string;
    ipAddress: string | null;
    userAgent: string | null;
    referrer: string | null;
    viewedAt: Date;
    _count: CardViewCountAggregateOutputType | null;
    _min: CardViewMinAggregateOutputType | null;
    _max: CardViewMaxAggregateOutputType | null;
};
export type GetCardViewGroupByPayload<T extends CardViewGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CardViewGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CardViewGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CardViewGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CardViewGroupByOutputType[P]>;
}>>;
export type CardViewWhereInput = {
    AND?: Prisma.CardViewWhereInput | Prisma.CardViewWhereInput[];
    OR?: Prisma.CardViewWhereInput[];
    NOT?: Prisma.CardViewWhereInput | Prisma.CardViewWhereInput[];
    id?: Prisma.StringFilter<"CardView"> | string;
    cardId?: Prisma.StringFilter<"CardView"> | string;
    ipAddress?: Prisma.StringNullableFilter<"CardView"> | string | null;
    userAgent?: Prisma.StringNullableFilter<"CardView"> | string | null;
    referrer?: Prisma.StringNullableFilter<"CardView"> | string | null;
    viewedAt?: Prisma.DateTimeFilter<"CardView"> | Date | string;
    card?: Prisma.XOR<Prisma.BusinessCardScalarRelationFilter, Prisma.BusinessCardWhereInput>;
};
export type CardViewOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    ipAddress?: Prisma.SortOrderInput | Prisma.SortOrder;
    userAgent?: Prisma.SortOrderInput | Prisma.SortOrder;
    referrer?: Prisma.SortOrderInput | Prisma.SortOrder;
    viewedAt?: Prisma.SortOrder;
    card?: Prisma.BusinessCardOrderByWithRelationInput;
};
export type CardViewWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CardViewWhereInput | Prisma.CardViewWhereInput[];
    OR?: Prisma.CardViewWhereInput[];
    NOT?: Prisma.CardViewWhereInput | Prisma.CardViewWhereInput[];
    cardId?: Prisma.StringFilter<"CardView"> | string;
    ipAddress?: Prisma.StringNullableFilter<"CardView"> | string | null;
    userAgent?: Prisma.StringNullableFilter<"CardView"> | string | null;
    referrer?: Prisma.StringNullableFilter<"CardView"> | string | null;
    viewedAt?: Prisma.DateTimeFilter<"CardView"> | Date | string;
    card?: Prisma.XOR<Prisma.BusinessCardScalarRelationFilter, Prisma.BusinessCardWhereInput>;
}, "id">;
export type CardViewOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    ipAddress?: Prisma.SortOrderInput | Prisma.SortOrder;
    userAgent?: Prisma.SortOrderInput | Prisma.SortOrder;
    referrer?: Prisma.SortOrderInput | Prisma.SortOrder;
    viewedAt?: Prisma.SortOrder;
    _count?: Prisma.CardViewCountOrderByAggregateInput;
    _max?: Prisma.CardViewMaxOrderByAggregateInput;
    _min?: Prisma.CardViewMinOrderByAggregateInput;
};
export type CardViewScalarWhereWithAggregatesInput = {
    AND?: Prisma.CardViewScalarWhereWithAggregatesInput | Prisma.CardViewScalarWhereWithAggregatesInput[];
    OR?: Prisma.CardViewScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CardViewScalarWhereWithAggregatesInput | Prisma.CardViewScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"CardView"> | string;
    cardId?: Prisma.StringWithAggregatesFilter<"CardView"> | string;
    ipAddress?: Prisma.StringNullableWithAggregatesFilter<"CardView"> | string | null;
    userAgent?: Prisma.StringNullableWithAggregatesFilter<"CardView"> | string | null;
    referrer?: Prisma.StringNullableWithAggregatesFilter<"CardView"> | string | null;
    viewedAt?: Prisma.DateTimeWithAggregatesFilter<"CardView"> | Date | string;
};
export type CardViewCreateInput = {
    id?: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    referrer?: string | null;
    viewedAt?: Date | string;
    card: Prisma.BusinessCardCreateNestedOneWithoutCardViewsInput;
};
export type CardViewUncheckedCreateInput = {
    id?: string;
    cardId: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    referrer?: string | null;
    viewedAt?: Date | string;
};
export type CardViewUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referrer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    viewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    card?: Prisma.BusinessCardUpdateOneRequiredWithoutCardViewsNestedInput;
};
export type CardViewUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cardId?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referrer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    viewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CardViewCreateManyInput = {
    id?: string;
    cardId: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    referrer?: string | null;
    viewedAt?: Date | string;
};
export type CardViewUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referrer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    viewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CardViewUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cardId?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referrer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    viewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CardViewListRelationFilter = {
    every?: Prisma.CardViewWhereInput;
    some?: Prisma.CardViewWhereInput;
    none?: Prisma.CardViewWhereInput;
};
export type CardViewOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CardViewCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    ipAddress?: Prisma.SortOrder;
    userAgent?: Prisma.SortOrder;
    referrer?: Prisma.SortOrder;
    viewedAt?: Prisma.SortOrder;
};
export type CardViewMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    ipAddress?: Prisma.SortOrder;
    userAgent?: Prisma.SortOrder;
    referrer?: Prisma.SortOrder;
    viewedAt?: Prisma.SortOrder;
};
export type CardViewMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    ipAddress?: Prisma.SortOrder;
    userAgent?: Prisma.SortOrder;
    referrer?: Prisma.SortOrder;
    viewedAt?: Prisma.SortOrder;
};
export type CardViewCreateNestedManyWithoutCardInput = {
    create?: Prisma.XOR<Prisma.CardViewCreateWithoutCardInput, Prisma.CardViewUncheckedCreateWithoutCardInput> | Prisma.CardViewCreateWithoutCardInput[] | Prisma.CardViewUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.CardViewCreateOrConnectWithoutCardInput | Prisma.CardViewCreateOrConnectWithoutCardInput[];
    createMany?: Prisma.CardViewCreateManyCardInputEnvelope;
    connect?: Prisma.CardViewWhereUniqueInput | Prisma.CardViewWhereUniqueInput[];
};
export type CardViewUncheckedCreateNestedManyWithoutCardInput = {
    create?: Prisma.XOR<Prisma.CardViewCreateWithoutCardInput, Prisma.CardViewUncheckedCreateWithoutCardInput> | Prisma.CardViewCreateWithoutCardInput[] | Prisma.CardViewUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.CardViewCreateOrConnectWithoutCardInput | Prisma.CardViewCreateOrConnectWithoutCardInput[];
    createMany?: Prisma.CardViewCreateManyCardInputEnvelope;
    connect?: Prisma.CardViewWhereUniqueInput | Prisma.CardViewWhereUniqueInput[];
};
export type CardViewUpdateManyWithoutCardNestedInput = {
    create?: Prisma.XOR<Prisma.CardViewCreateWithoutCardInput, Prisma.CardViewUncheckedCreateWithoutCardInput> | Prisma.CardViewCreateWithoutCardInput[] | Prisma.CardViewUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.CardViewCreateOrConnectWithoutCardInput | Prisma.CardViewCreateOrConnectWithoutCardInput[];
    upsert?: Prisma.CardViewUpsertWithWhereUniqueWithoutCardInput | Prisma.CardViewUpsertWithWhereUniqueWithoutCardInput[];
    createMany?: Prisma.CardViewCreateManyCardInputEnvelope;
    set?: Prisma.CardViewWhereUniqueInput | Prisma.CardViewWhereUniqueInput[];
    disconnect?: Prisma.CardViewWhereUniqueInput | Prisma.CardViewWhereUniqueInput[];
    delete?: Prisma.CardViewWhereUniqueInput | Prisma.CardViewWhereUniqueInput[];
    connect?: Prisma.CardViewWhereUniqueInput | Prisma.CardViewWhereUniqueInput[];
    update?: Prisma.CardViewUpdateWithWhereUniqueWithoutCardInput | Prisma.CardViewUpdateWithWhereUniqueWithoutCardInput[];
    updateMany?: Prisma.CardViewUpdateManyWithWhereWithoutCardInput | Prisma.CardViewUpdateManyWithWhereWithoutCardInput[];
    deleteMany?: Prisma.CardViewScalarWhereInput | Prisma.CardViewScalarWhereInput[];
};
export type CardViewUncheckedUpdateManyWithoutCardNestedInput = {
    create?: Prisma.XOR<Prisma.CardViewCreateWithoutCardInput, Prisma.CardViewUncheckedCreateWithoutCardInput> | Prisma.CardViewCreateWithoutCardInput[] | Prisma.CardViewUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.CardViewCreateOrConnectWithoutCardInput | Prisma.CardViewCreateOrConnectWithoutCardInput[];
    upsert?: Prisma.CardViewUpsertWithWhereUniqueWithoutCardInput | Prisma.CardViewUpsertWithWhereUniqueWithoutCardInput[];
    createMany?: Prisma.CardViewCreateManyCardInputEnvelope;
    set?: Prisma.CardViewWhereUniqueInput | Prisma.CardViewWhereUniqueInput[];
    disconnect?: Prisma.CardViewWhereUniqueInput | Prisma.CardViewWhereUniqueInput[];
    delete?: Prisma.CardViewWhereUniqueInput | Prisma.CardViewWhereUniqueInput[];
    connect?: Prisma.CardViewWhereUniqueInput | Prisma.CardViewWhereUniqueInput[];
    update?: Prisma.CardViewUpdateWithWhereUniqueWithoutCardInput | Prisma.CardViewUpdateWithWhereUniqueWithoutCardInput[];
    updateMany?: Prisma.CardViewUpdateManyWithWhereWithoutCardInput | Prisma.CardViewUpdateManyWithWhereWithoutCardInput[];
    deleteMany?: Prisma.CardViewScalarWhereInput | Prisma.CardViewScalarWhereInput[];
};
export type CardViewCreateWithoutCardInput = {
    id?: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    referrer?: string | null;
    viewedAt?: Date | string;
};
export type CardViewUncheckedCreateWithoutCardInput = {
    id?: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    referrer?: string | null;
    viewedAt?: Date | string;
};
export type CardViewCreateOrConnectWithoutCardInput = {
    where: Prisma.CardViewWhereUniqueInput;
    create: Prisma.XOR<Prisma.CardViewCreateWithoutCardInput, Prisma.CardViewUncheckedCreateWithoutCardInput>;
};
export type CardViewCreateManyCardInputEnvelope = {
    data: Prisma.CardViewCreateManyCardInput | Prisma.CardViewCreateManyCardInput[];
    skipDuplicates?: boolean;
};
export type CardViewUpsertWithWhereUniqueWithoutCardInput = {
    where: Prisma.CardViewWhereUniqueInput;
    update: Prisma.XOR<Prisma.CardViewUpdateWithoutCardInput, Prisma.CardViewUncheckedUpdateWithoutCardInput>;
    create: Prisma.XOR<Prisma.CardViewCreateWithoutCardInput, Prisma.CardViewUncheckedCreateWithoutCardInput>;
};
export type CardViewUpdateWithWhereUniqueWithoutCardInput = {
    where: Prisma.CardViewWhereUniqueInput;
    data: Prisma.XOR<Prisma.CardViewUpdateWithoutCardInput, Prisma.CardViewUncheckedUpdateWithoutCardInput>;
};
export type CardViewUpdateManyWithWhereWithoutCardInput = {
    where: Prisma.CardViewScalarWhereInput;
    data: Prisma.XOR<Prisma.CardViewUpdateManyMutationInput, Prisma.CardViewUncheckedUpdateManyWithoutCardInput>;
};
export type CardViewScalarWhereInput = {
    AND?: Prisma.CardViewScalarWhereInput | Prisma.CardViewScalarWhereInput[];
    OR?: Prisma.CardViewScalarWhereInput[];
    NOT?: Prisma.CardViewScalarWhereInput | Prisma.CardViewScalarWhereInput[];
    id?: Prisma.StringFilter<"CardView"> | string;
    cardId?: Prisma.StringFilter<"CardView"> | string;
    ipAddress?: Prisma.StringNullableFilter<"CardView"> | string | null;
    userAgent?: Prisma.StringNullableFilter<"CardView"> | string | null;
    referrer?: Prisma.StringNullableFilter<"CardView"> | string | null;
    viewedAt?: Prisma.DateTimeFilter<"CardView"> | Date | string;
};
export type CardViewCreateManyCardInput = {
    id?: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    referrer?: string | null;
    viewedAt?: Date | string;
};
export type CardViewUpdateWithoutCardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referrer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    viewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CardViewUncheckedUpdateWithoutCardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referrer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    viewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CardViewUncheckedUpdateManyWithoutCardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referrer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    viewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CardViewSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    cardId?: boolean;
    ipAddress?: boolean;
    userAgent?: boolean;
    referrer?: boolean;
    viewedAt?: boolean;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cardView"]>;
export type CardViewSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    cardId?: boolean;
    ipAddress?: boolean;
    userAgent?: boolean;
    referrer?: boolean;
    viewedAt?: boolean;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cardView"]>;
export type CardViewSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    cardId?: boolean;
    ipAddress?: boolean;
    userAgent?: boolean;
    referrer?: boolean;
    viewedAt?: boolean;
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cardView"]>;
export type CardViewSelectScalar = {
    id?: boolean;
    cardId?: boolean;
    ipAddress?: boolean;
    userAgent?: boolean;
    referrer?: boolean;
    viewedAt?: boolean;
};
export type CardViewOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "cardId" | "ipAddress" | "userAgent" | "referrer" | "viewedAt", ExtArgs["result"]["cardView"]>;
export type CardViewInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
};
export type CardViewIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
};
export type CardViewIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    card?: boolean | Prisma.BusinessCardDefaultArgs<ExtArgs>;
};
export type $CardViewPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CardView";
    objects: {
        card: Prisma.$BusinessCardPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        cardId: string;
        ipAddress: string | null;
        userAgent: string | null;
        referrer: string | null;
        viewedAt: Date;
    }, ExtArgs["result"]["cardView"]>;
    composites: {};
};
export type CardViewGetPayload<S extends boolean | null | undefined | CardViewDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CardViewPayload, S>;
export type CardViewCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CardViewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CardViewCountAggregateInputType | true;
};
export interface CardViewDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CardView'];
        meta: {
            name: 'CardView';
        };
    };
    findUnique<T extends CardViewFindUniqueArgs>(args: Prisma.SelectSubset<T, CardViewFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CardViewClient<runtime.Types.Result.GetResult<Prisma.$CardViewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CardViewFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CardViewFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CardViewClient<runtime.Types.Result.GetResult<Prisma.$CardViewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CardViewFindFirstArgs>(args?: Prisma.SelectSubset<T, CardViewFindFirstArgs<ExtArgs>>): Prisma.Prisma__CardViewClient<runtime.Types.Result.GetResult<Prisma.$CardViewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CardViewFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CardViewFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CardViewClient<runtime.Types.Result.GetResult<Prisma.$CardViewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CardViewFindManyArgs>(args?: Prisma.SelectSubset<T, CardViewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CardViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CardViewCreateArgs>(args: Prisma.SelectSubset<T, CardViewCreateArgs<ExtArgs>>): Prisma.Prisma__CardViewClient<runtime.Types.Result.GetResult<Prisma.$CardViewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CardViewCreateManyArgs>(args?: Prisma.SelectSubset<T, CardViewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CardViewCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CardViewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CardViewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CardViewDeleteArgs>(args: Prisma.SelectSubset<T, CardViewDeleteArgs<ExtArgs>>): Prisma.Prisma__CardViewClient<runtime.Types.Result.GetResult<Prisma.$CardViewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CardViewUpdateArgs>(args: Prisma.SelectSubset<T, CardViewUpdateArgs<ExtArgs>>): Prisma.Prisma__CardViewClient<runtime.Types.Result.GetResult<Prisma.$CardViewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CardViewDeleteManyArgs>(args?: Prisma.SelectSubset<T, CardViewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CardViewUpdateManyArgs>(args: Prisma.SelectSubset<T, CardViewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CardViewUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CardViewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CardViewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CardViewUpsertArgs>(args: Prisma.SelectSubset<T, CardViewUpsertArgs<ExtArgs>>): Prisma.Prisma__CardViewClient<runtime.Types.Result.GetResult<Prisma.$CardViewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CardViewCountArgs>(args?: Prisma.Subset<T, CardViewCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CardViewCountAggregateOutputType> : number>;
    aggregate<T extends CardViewAggregateArgs>(args: Prisma.Subset<T, CardViewAggregateArgs>): Prisma.PrismaPromise<GetCardViewAggregateType<T>>;
    groupBy<T extends CardViewGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CardViewGroupByArgs['orderBy'];
    } : {
        orderBy?: CardViewGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CardViewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCardViewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CardViewFieldRefs;
}
export interface Prisma__CardViewClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    card<T extends Prisma.BusinessCardDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BusinessCardDefaultArgs<ExtArgs>>): Prisma.Prisma__BusinessCardClient<runtime.Types.Result.GetResult<Prisma.$BusinessCardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CardViewFieldRefs {
    readonly id: Prisma.FieldRef<"CardView", 'String'>;
    readonly cardId: Prisma.FieldRef<"CardView", 'String'>;
    readonly ipAddress: Prisma.FieldRef<"CardView", 'String'>;
    readonly userAgent: Prisma.FieldRef<"CardView", 'String'>;
    readonly referrer: Prisma.FieldRef<"CardView", 'String'>;
    readonly viewedAt: Prisma.FieldRef<"CardView", 'DateTime'>;
}
export type CardViewFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardViewSelect<ExtArgs> | null;
    omit?: Prisma.CardViewOmit<ExtArgs> | null;
    include?: Prisma.CardViewInclude<ExtArgs> | null;
    where: Prisma.CardViewWhereUniqueInput;
};
export type CardViewFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardViewSelect<ExtArgs> | null;
    omit?: Prisma.CardViewOmit<ExtArgs> | null;
    include?: Prisma.CardViewInclude<ExtArgs> | null;
    where: Prisma.CardViewWhereUniqueInput;
};
export type CardViewFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardViewSelect<ExtArgs> | null;
    omit?: Prisma.CardViewOmit<ExtArgs> | null;
    include?: Prisma.CardViewInclude<ExtArgs> | null;
    where?: Prisma.CardViewWhereInput;
    orderBy?: Prisma.CardViewOrderByWithRelationInput | Prisma.CardViewOrderByWithRelationInput[];
    cursor?: Prisma.CardViewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CardViewScalarFieldEnum | Prisma.CardViewScalarFieldEnum[];
};
export type CardViewFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardViewSelect<ExtArgs> | null;
    omit?: Prisma.CardViewOmit<ExtArgs> | null;
    include?: Prisma.CardViewInclude<ExtArgs> | null;
    where?: Prisma.CardViewWhereInput;
    orderBy?: Prisma.CardViewOrderByWithRelationInput | Prisma.CardViewOrderByWithRelationInput[];
    cursor?: Prisma.CardViewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CardViewScalarFieldEnum | Prisma.CardViewScalarFieldEnum[];
};
export type CardViewFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardViewSelect<ExtArgs> | null;
    omit?: Prisma.CardViewOmit<ExtArgs> | null;
    include?: Prisma.CardViewInclude<ExtArgs> | null;
    where?: Prisma.CardViewWhereInput;
    orderBy?: Prisma.CardViewOrderByWithRelationInput | Prisma.CardViewOrderByWithRelationInput[];
    cursor?: Prisma.CardViewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CardViewScalarFieldEnum | Prisma.CardViewScalarFieldEnum[];
};
export type CardViewCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardViewSelect<ExtArgs> | null;
    omit?: Prisma.CardViewOmit<ExtArgs> | null;
    include?: Prisma.CardViewInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CardViewCreateInput, Prisma.CardViewUncheckedCreateInput>;
};
export type CardViewCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CardViewCreateManyInput | Prisma.CardViewCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CardViewCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardViewSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CardViewOmit<ExtArgs> | null;
    data: Prisma.CardViewCreateManyInput | Prisma.CardViewCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CardViewIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CardViewUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardViewSelect<ExtArgs> | null;
    omit?: Prisma.CardViewOmit<ExtArgs> | null;
    include?: Prisma.CardViewInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CardViewUpdateInput, Prisma.CardViewUncheckedUpdateInput>;
    where: Prisma.CardViewWhereUniqueInput;
};
export type CardViewUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CardViewUpdateManyMutationInput, Prisma.CardViewUncheckedUpdateManyInput>;
    where?: Prisma.CardViewWhereInput;
    limit?: number;
};
export type CardViewUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardViewSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CardViewOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CardViewUpdateManyMutationInput, Prisma.CardViewUncheckedUpdateManyInput>;
    where?: Prisma.CardViewWhereInput;
    limit?: number;
    include?: Prisma.CardViewIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CardViewUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardViewSelect<ExtArgs> | null;
    omit?: Prisma.CardViewOmit<ExtArgs> | null;
    include?: Prisma.CardViewInclude<ExtArgs> | null;
    where: Prisma.CardViewWhereUniqueInput;
    create: Prisma.XOR<Prisma.CardViewCreateInput, Prisma.CardViewUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CardViewUpdateInput, Prisma.CardViewUncheckedUpdateInput>;
};
export type CardViewDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardViewSelect<ExtArgs> | null;
    omit?: Prisma.CardViewOmit<ExtArgs> | null;
    include?: Prisma.CardViewInclude<ExtArgs> | null;
    where: Prisma.CardViewWhereUniqueInput;
};
export type CardViewDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CardViewWhereInput;
    limit?: number;
};
export type CardViewDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardViewSelect<ExtArgs> | null;
    omit?: Prisma.CardViewOmit<ExtArgs> | null;
    include?: Prisma.CardViewInclude<ExtArgs> | null;
};
