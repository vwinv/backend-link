import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TeamMemberModel = runtime.Types.Result.DefaultSelection<Prisma.$TeamMemberPayload>;
export type AggregateTeamMember = {
    _count: TeamMemberCountAggregateOutputType | null;
    _min: TeamMemberMinAggregateOutputType | null;
    _max: TeamMemberMaxAggregateOutputType | null;
};
export type TeamMemberMinAggregateOutputType = {
    id: string | null;
    teamId: string | null;
    userId: string | null;
    role: $Enums.TeamMemberRole | null;
    joinedAt: Date | null;
    updatedAt: Date | null;
};
export type TeamMemberMaxAggregateOutputType = {
    id: string | null;
    teamId: string | null;
    userId: string | null;
    role: $Enums.TeamMemberRole | null;
    joinedAt: Date | null;
    updatedAt: Date | null;
};
export type TeamMemberCountAggregateOutputType = {
    id: number;
    teamId: number;
    userId: number;
    role: number;
    joinedAt: number;
    updatedAt: number;
    _all: number;
};
export type TeamMemberMinAggregateInputType = {
    id?: true;
    teamId?: true;
    userId?: true;
    role?: true;
    joinedAt?: true;
    updatedAt?: true;
};
export type TeamMemberMaxAggregateInputType = {
    id?: true;
    teamId?: true;
    userId?: true;
    role?: true;
    joinedAt?: true;
    updatedAt?: true;
};
export type TeamMemberCountAggregateInputType = {
    id?: true;
    teamId?: true;
    userId?: true;
    role?: true;
    joinedAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type TeamMemberAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamMemberWhereInput;
    orderBy?: Prisma.TeamMemberOrderByWithRelationInput | Prisma.TeamMemberOrderByWithRelationInput[];
    cursor?: Prisma.TeamMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TeamMemberCountAggregateInputType;
    _min?: TeamMemberMinAggregateInputType;
    _max?: TeamMemberMaxAggregateInputType;
};
export type GetTeamMemberAggregateType<T extends TeamMemberAggregateArgs> = {
    [P in keyof T & keyof AggregateTeamMember]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTeamMember[P]> : Prisma.GetScalarType<T[P], AggregateTeamMember[P]>;
};
export type TeamMemberGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamMemberWhereInput;
    orderBy?: Prisma.TeamMemberOrderByWithAggregationInput | Prisma.TeamMemberOrderByWithAggregationInput[];
    by: Prisma.TeamMemberScalarFieldEnum[] | Prisma.TeamMemberScalarFieldEnum;
    having?: Prisma.TeamMemberScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TeamMemberCountAggregateInputType | true;
    _min?: TeamMemberMinAggregateInputType;
    _max?: TeamMemberMaxAggregateInputType;
};
export type TeamMemberGroupByOutputType = {
    id: string;
    teamId: string;
    userId: string;
    role: $Enums.TeamMemberRole;
    joinedAt: Date;
    updatedAt: Date;
    _count: TeamMemberCountAggregateOutputType | null;
    _min: TeamMemberMinAggregateOutputType | null;
    _max: TeamMemberMaxAggregateOutputType | null;
};
export type GetTeamMemberGroupByPayload<T extends TeamMemberGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TeamMemberGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TeamMemberGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TeamMemberGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TeamMemberGroupByOutputType[P]>;
}>>;
export type TeamMemberWhereInput = {
    AND?: Prisma.TeamMemberWhereInput | Prisma.TeamMemberWhereInput[];
    OR?: Prisma.TeamMemberWhereInput[];
    NOT?: Prisma.TeamMemberWhereInput | Prisma.TeamMemberWhereInput[];
    id?: Prisma.StringFilter<"TeamMember"> | string;
    teamId?: Prisma.StringFilter<"TeamMember"> | string;
    userId?: Prisma.StringFilter<"TeamMember"> | string;
    role?: Prisma.EnumTeamMemberRoleFilter<"TeamMember"> | $Enums.TeamMemberRole;
    joinedAt?: Prisma.DateTimeFilter<"TeamMember"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TeamMember"> | Date | string;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type TeamMemberOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    joinedAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    team?: Prisma.TeamOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type TeamMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    teamId_userId?: Prisma.TeamMemberTeamIdUserIdCompoundUniqueInput;
    AND?: Prisma.TeamMemberWhereInput | Prisma.TeamMemberWhereInput[];
    OR?: Prisma.TeamMemberWhereInput[];
    NOT?: Prisma.TeamMemberWhereInput | Prisma.TeamMemberWhereInput[];
    teamId?: Prisma.StringFilter<"TeamMember"> | string;
    userId?: Prisma.StringFilter<"TeamMember"> | string;
    role?: Prisma.EnumTeamMemberRoleFilter<"TeamMember"> | $Enums.TeamMemberRole;
    joinedAt?: Prisma.DateTimeFilter<"TeamMember"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TeamMember"> | Date | string;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "teamId_userId">;
export type TeamMemberOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    joinedAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.TeamMemberCountOrderByAggregateInput;
    _max?: Prisma.TeamMemberMaxOrderByAggregateInput;
    _min?: Prisma.TeamMemberMinOrderByAggregateInput;
};
export type TeamMemberScalarWhereWithAggregatesInput = {
    AND?: Prisma.TeamMemberScalarWhereWithAggregatesInput | Prisma.TeamMemberScalarWhereWithAggregatesInput[];
    OR?: Prisma.TeamMemberScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TeamMemberScalarWhereWithAggregatesInput | Prisma.TeamMemberScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"TeamMember"> | string;
    teamId?: Prisma.StringWithAggregatesFilter<"TeamMember"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"TeamMember"> | string;
    role?: Prisma.EnumTeamMemberRoleWithAggregatesFilter<"TeamMember"> | $Enums.TeamMemberRole;
    joinedAt?: Prisma.DateTimeWithAggregatesFilter<"TeamMember"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"TeamMember"> | Date | string;
};
export type TeamMemberCreateInput = {
    id?: string;
    role?: $Enums.TeamMemberRole;
    joinedAt?: Date | string;
    updatedAt?: Date | string;
    team: Prisma.TeamCreateNestedOneWithoutMembersInput;
    user: Prisma.UserCreateNestedOneWithoutTeamMembershipsInput;
};
export type TeamMemberUncheckedCreateInput = {
    id?: string;
    teamId: string;
    userId: string;
    role?: $Enums.TeamMemberRole;
    joinedAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeamMemberUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTeamMemberRoleFieldUpdateOperationsInput | $Enums.TeamMemberRole;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    team?: Prisma.TeamUpdateOneRequiredWithoutMembersNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutTeamMembershipsNestedInput;
};
export type TeamMemberUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    teamId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTeamMemberRoleFieldUpdateOperationsInput | $Enums.TeamMemberRole;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeamMemberCreateManyInput = {
    id?: string;
    teamId: string;
    userId: string;
    role?: $Enums.TeamMemberRole;
    joinedAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeamMemberUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTeamMemberRoleFieldUpdateOperationsInput | $Enums.TeamMemberRole;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeamMemberUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    teamId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTeamMemberRoleFieldUpdateOperationsInput | $Enums.TeamMemberRole;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeamMemberListRelationFilter = {
    every?: Prisma.TeamMemberWhereInput;
    some?: Prisma.TeamMemberWhereInput;
    none?: Prisma.TeamMemberWhereInput;
};
export type TeamMemberOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TeamMemberTeamIdUserIdCompoundUniqueInput = {
    teamId: string;
    userId: string;
};
export type TeamMemberCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    joinedAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TeamMemberMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    joinedAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TeamMemberMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    joinedAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TeamMemberCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TeamMemberCreateWithoutUserInput, Prisma.TeamMemberUncheckedCreateWithoutUserInput> | Prisma.TeamMemberCreateWithoutUserInput[] | Prisma.TeamMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamMemberCreateOrConnectWithoutUserInput | Prisma.TeamMemberCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TeamMemberCreateManyUserInputEnvelope;
    connect?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
};
export type TeamMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TeamMemberCreateWithoutUserInput, Prisma.TeamMemberUncheckedCreateWithoutUserInput> | Prisma.TeamMemberCreateWithoutUserInput[] | Prisma.TeamMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamMemberCreateOrConnectWithoutUserInput | Prisma.TeamMemberCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TeamMemberCreateManyUserInputEnvelope;
    connect?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
};
export type TeamMemberUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TeamMemberCreateWithoutUserInput, Prisma.TeamMemberUncheckedCreateWithoutUserInput> | Prisma.TeamMemberCreateWithoutUserInput[] | Prisma.TeamMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamMemberCreateOrConnectWithoutUserInput | Prisma.TeamMemberCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TeamMemberUpsertWithWhereUniqueWithoutUserInput | Prisma.TeamMemberUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TeamMemberCreateManyUserInputEnvelope;
    set?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    disconnect?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    delete?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    connect?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    update?: Prisma.TeamMemberUpdateWithWhereUniqueWithoutUserInput | Prisma.TeamMemberUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TeamMemberUpdateManyWithWhereWithoutUserInput | Prisma.TeamMemberUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TeamMemberScalarWhereInput | Prisma.TeamMemberScalarWhereInput[];
};
export type TeamMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TeamMemberCreateWithoutUserInput, Prisma.TeamMemberUncheckedCreateWithoutUserInput> | Prisma.TeamMemberCreateWithoutUserInput[] | Prisma.TeamMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamMemberCreateOrConnectWithoutUserInput | Prisma.TeamMemberCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TeamMemberUpsertWithWhereUniqueWithoutUserInput | Prisma.TeamMemberUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TeamMemberCreateManyUserInputEnvelope;
    set?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    disconnect?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    delete?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    connect?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    update?: Prisma.TeamMemberUpdateWithWhereUniqueWithoutUserInput | Prisma.TeamMemberUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TeamMemberUpdateManyWithWhereWithoutUserInput | Prisma.TeamMemberUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TeamMemberScalarWhereInput | Prisma.TeamMemberScalarWhereInput[];
};
export type TeamMemberCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.TeamMemberCreateWithoutTeamInput, Prisma.TeamMemberUncheckedCreateWithoutTeamInput> | Prisma.TeamMemberCreateWithoutTeamInput[] | Prisma.TeamMemberUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamMemberCreateOrConnectWithoutTeamInput | Prisma.TeamMemberCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.TeamMemberCreateManyTeamInputEnvelope;
    connect?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
};
export type TeamMemberUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.TeamMemberCreateWithoutTeamInput, Prisma.TeamMemberUncheckedCreateWithoutTeamInput> | Prisma.TeamMemberCreateWithoutTeamInput[] | Prisma.TeamMemberUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamMemberCreateOrConnectWithoutTeamInput | Prisma.TeamMemberCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.TeamMemberCreateManyTeamInputEnvelope;
    connect?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
};
export type TeamMemberUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.TeamMemberCreateWithoutTeamInput, Prisma.TeamMemberUncheckedCreateWithoutTeamInput> | Prisma.TeamMemberCreateWithoutTeamInput[] | Prisma.TeamMemberUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamMemberCreateOrConnectWithoutTeamInput | Prisma.TeamMemberCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.TeamMemberUpsertWithWhereUniqueWithoutTeamInput | Prisma.TeamMemberUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.TeamMemberCreateManyTeamInputEnvelope;
    set?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    disconnect?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    delete?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    connect?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    update?: Prisma.TeamMemberUpdateWithWhereUniqueWithoutTeamInput | Prisma.TeamMemberUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.TeamMemberUpdateManyWithWhereWithoutTeamInput | Prisma.TeamMemberUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.TeamMemberScalarWhereInput | Prisma.TeamMemberScalarWhereInput[];
};
export type TeamMemberUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.TeamMemberCreateWithoutTeamInput, Prisma.TeamMemberUncheckedCreateWithoutTeamInput> | Prisma.TeamMemberCreateWithoutTeamInput[] | Prisma.TeamMemberUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamMemberCreateOrConnectWithoutTeamInput | Prisma.TeamMemberCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.TeamMemberUpsertWithWhereUniqueWithoutTeamInput | Prisma.TeamMemberUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.TeamMemberCreateManyTeamInputEnvelope;
    set?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    disconnect?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    delete?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    connect?: Prisma.TeamMemberWhereUniqueInput | Prisma.TeamMemberWhereUniqueInput[];
    update?: Prisma.TeamMemberUpdateWithWhereUniqueWithoutTeamInput | Prisma.TeamMemberUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.TeamMemberUpdateManyWithWhereWithoutTeamInput | Prisma.TeamMemberUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.TeamMemberScalarWhereInput | Prisma.TeamMemberScalarWhereInput[];
};
export type EnumTeamMemberRoleFieldUpdateOperationsInput = {
    set?: $Enums.TeamMemberRole;
};
export type TeamMemberCreateWithoutUserInput = {
    id?: string;
    role?: $Enums.TeamMemberRole;
    joinedAt?: Date | string;
    updatedAt?: Date | string;
    team: Prisma.TeamCreateNestedOneWithoutMembersInput;
};
export type TeamMemberUncheckedCreateWithoutUserInput = {
    id?: string;
    teamId: string;
    role?: $Enums.TeamMemberRole;
    joinedAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeamMemberCreateOrConnectWithoutUserInput = {
    where: Prisma.TeamMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamMemberCreateWithoutUserInput, Prisma.TeamMemberUncheckedCreateWithoutUserInput>;
};
export type TeamMemberCreateManyUserInputEnvelope = {
    data: Prisma.TeamMemberCreateManyUserInput | Prisma.TeamMemberCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type TeamMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.TeamMemberWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamMemberUpdateWithoutUserInput, Prisma.TeamMemberUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.TeamMemberCreateWithoutUserInput, Prisma.TeamMemberUncheckedCreateWithoutUserInput>;
};
export type TeamMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.TeamMemberWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamMemberUpdateWithoutUserInput, Prisma.TeamMemberUncheckedUpdateWithoutUserInput>;
};
export type TeamMemberUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.TeamMemberScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamMemberUpdateManyMutationInput, Prisma.TeamMemberUncheckedUpdateManyWithoutUserInput>;
};
export type TeamMemberScalarWhereInput = {
    AND?: Prisma.TeamMemberScalarWhereInput | Prisma.TeamMemberScalarWhereInput[];
    OR?: Prisma.TeamMemberScalarWhereInput[];
    NOT?: Prisma.TeamMemberScalarWhereInput | Prisma.TeamMemberScalarWhereInput[];
    id?: Prisma.StringFilter<"TeamMember"> | string;
    teamId?: Prisma.StringFilter<"TeamMember"> | string;
    userId?: Prisma.StringFilter<"TeamMember"> | string;
    role?: Prisma.EnumTeamMemberRoleFilter<"TeamMember"> | $Enums.TeamMemberRole;
    joinedAt?: Prisma.DateTimeFilter<"TeamMember"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TeamMember"> | Date | string;
};
export type TeamMemberCreateWithoutTeamInput = {
    id?: string;
    role?: $Enums.TeamMemberRole;
    joinedAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutTeamMembershipsInput;
};
export type TeamMemberUncheckedCreateWithoutTeamInput = {
    id?: string;
    userId: string;
    role?: $Enums.TeamMemberRole;
    joinedAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeamMemberCreateOrConnectWithoutTeamInput = {
    where: Prisma.TeamMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamMemberCreateWithoutTeamInput, Prisma.TeamMemberUncheckedCreateWithoutTeamInput>;
};
export type TeamMemberCreateManyTeamInputEnvelope = {
    data: Prisma.TeamMemberCreateManyTeamInput | Prisma.TeamMemberCreateManyTeamInput[];
    skipDuplicates?: boolean;
};
export type TeamMemberUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.TeamMemberWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamMemberUpdateWithoutTeamInput, Prisma.TeamMemberUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.TeamMemberCreateWithoutTeamInput, Prisma.TeamMemberUncheckedCreateWithoutTeamInput>;
};
export type TeamMemberUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.TeamMemberWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamMemberUpdateWithoutTeamInput, Prisma.TeamMemberUncheckedUpdateWithoutTeamInput>;
};
export type TeamMemberUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.TeamMemberScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamMemberUpdateManyMutationInput, Prisma.TeamMemberUncheckedUpdateManyWithoutTeamInput>;
};
export type TeamMemberCreateManyUserInput = {
    id?: string;
    teamId: string;
    role?: $Enums.TeamMemberRole;
    joinedAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeamMemberUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTeamMemberRoleFieldUpdateOperationsInput | $Enums.TeamMemberRole;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    team?: Prisma.TeamUpdateOneRequiredWithoutMembersNestedInput;
};
export type TeamMemberUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    teamId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTeamMemberRoleFieldUpdateOperationsInput | $Enums.TeamMemberRole;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeamMemberUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    teamId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTeamMemberRoleFieldUpdateOperationsInput | $Enums.TeamMemberRole;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeamMemberCreateManyTeamInput = {
    id?: string;
    userId: string;
    role?: $Enums.TeamMemberRole;
    joinedAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeamMemberUpdateWithoutTeamInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTeamMemberRoleFieldUpdateOperationsInput | $Enums.TeamMemberRole;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutTeamMembershipsNestedInput;
};
export type TeamMemberUncheckedUpdateWithoutTeamInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTeamMemberRoleFieldUpdateOperationsInput | $Enums.TeamMemberRole;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeamMemberUncheckedUpdateManyWithoutTeamInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTeamMemberRoleFieldUpdateOperationsInput | $Enums.TeamMemberRole;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeamMemberSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    teamId?: boolean;
    userId?: boolean;
    role?: boolean;
    joinedAt?: boolean;
    updatedAt?: boolean;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teamMember"]>;
export type TeamMemberSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    teamId?: boolean;
    userId?: boolean;
    role?: boolean;
    joinedAt?: boolean;
    updatedAt?: boolean;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teamMember"]>;
export type TeamMemberSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    teamId?: boolean;
    userId?: boolean;
    role?: boolean;
    joinedAt?: boolean;
    updatedAt?: boolean;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teamMember"]>;
export type TeamMemberSelectScalar = {
    id?: boolean;
    teamId?: boolean;
    userId?: boolean;
    role?: boolean;
    joinedAt?: boolean;
    updatedAt?: boolean;
};
export type TeamMemberOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "teamId" | "userId" | "role" | "joinedAt" | "updatedAt", ExtArgs["result"]["teamMember"]>;
export type TeamMemberInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TeamMemberIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TeamMemberIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $TeamMemberPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TeamMember";
    objects: {
        team: Prisma.$TeamPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        teamId: string;
        userId: string;
        role: $Enums.TeamMemberRole;
        joinedAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["teamMember"]>;
    composites: {};
};
export type TeamMemberGetPayload<S extends boolean | null | undefined | TeamMemberDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload, S>;
export type TeamMemberCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TeamMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TeamMemberCountAggregateInputType | true;
};
export interface TeamMemberDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TeamMember'];
        meta: {
            name: 'TeamMember';
        };
    };
    findUnique<T extends TeamMemberFindUniqueArgs>(args: Prisma.SelectSubset<T, TeamMemberFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TeamMemberClient<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TeamMemberFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TeamMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamMemberClient<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TeamMemberFindFirstArgs>(args?: Prisma.SelectSubset<T, TeamMemberFindFirstArgs<ExtArgs>>): Prisma.Prisma__TeamMemberClient<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TeamMemberFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TeamMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamMemberClient<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TeamMemberFindManyArgs>(args?: Prisma.SelectSubset<T, TeamMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TeamMemberCreateArgs>(args: Prisma.SelectSubset<T, TeamMemberCreateArgs<ExtArgs>>): Prisma.Prisma__TeamMemberClient<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TeamMemberCreateManyArgs>(args?: Prisma.SelectSubset<T, TeamMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TeamMemberCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TeamMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TeamMemberDeleteArgs>(args: Prisma.SelectSubset<T, TeamMemberDeleteArgs<ExtArgs>>): Prisma.Prisma__TeamMemberClient<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TeamMemberUpdateArgs>(args: Prisma.SelectSubset<T, TeamMemberUpdateArgs<ExtArgs>>): Prisma.Prisma__TeamMemberClient<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TeamMemberDeleteManyArgs>(args?: Prisma.SelectSubset<T, TeamMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TeamMemberUpdateManyArgs>(args: Prisma.SelectSubset<T, TeamMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TeamMemberUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TeamMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TeamMemberUpsertArgs>(args: Prisma.SelectSubset<T, TeamMemberUpsertArgs<ExtArgs>>): Prisma.Prisma__TeamMemberClient<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TeamMemberCountArgs>(args?: Prisma.Subset<T, TeamMemberCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TeamMemberCountAggregateOutputType> : number>;
    aggregate<T extends TeamMemberAggregateArgs>(args: Prisma.Subset<T, TeamMemberAggregateArgs>): Prisma.PrismaPromise<GetTeamMemberAggregateType<T>>;
    groupBy<T extends TeamMemberGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TeamMemberGroupByArgs['orderBy'];
    } : {
        orderBy?: TeamMemberGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TeamMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TeamMemberFieldRefs;
}
export interface Prisma__TeamMemberClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    team<T extends Prisma.TeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TeamMemberFieldRefs {
    readonly id: Prisma.FieldRef<"TeamMember", 'String'>;
    readonly teamId: Prisma.FieldRef<"TeamMember", 'String'>;
    readonly userId: Prisma.FieldRef<"TeamMember", 'String'>;
    readonly role: Prisma.FieldRef<"TeamMember", 'TeamMemberRole'>;
    readonly joinedAt: Prisma.FieldRef<"TeamMember", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"TeamMember", 'DateTime'>;
}
export type TeamMemberFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamMemberSelect<ExtArgs> | null;
    omit?: Prisma.TeamMemberOmit<ExtArgs> | null;
    include?: Prisma.TeamMemberInclude<ExtArgs> | null;
    where: Prisma.TeamMemberWhereUniqueInput;
};
export type TeamMemberFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamMemberSelect<ExtArgs> | null;
    omit?: Prisma.TeamMemberOmit<ExtArgs> | null;
    include?: Prisma.TeamMemberInclude<ExtArgs> | null;
    where: Prisma.TeamMemberWhereUniqueInput;
};
export type TeamMemberFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TeamMemberFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TeamMemberFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TeamMemberCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamMemberSelect<ExtArgs> | null;
    omit?: Prisma.TeamMemberOmit<ExtArgs> | null;
    include?: Prisma.TeamMemberInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeamMemberCreateInput, Prisma.TeamMemberUncheckedCreateInput>;
};
export type TeamMemberCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TeamMemberCreateManyInput | Prisma.TeamMemberCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TeamMemberCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamMemberSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TeamMemberOmit<ExtArgs> | null;
    data: Prisma.TeamMemberCreateManyInput | Prisma.TeamMemberCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TeamMemberIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TeamMemberUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamMemberSelect<ExtArgs> | null;
    omit?: Prisma.TeamMemberOmit<ExtArgs> | null;
    include?: Prisma.TeamMemberInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeamMemberUpdateInput, Prisma.TeamMemberUncheckedUpdateInput>;
    where: Prisma.TeamMemberWhereUniqueInput;
};
export type TeamMemberUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TeamMemberUpdateManyMutationInput, Prisma.TeamMemberUncheckedUpdateManyInput>;
    where?: Prisma.TeamMemberWhereInput;
    limit?: number;
};
export type TeamMemberUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamMemberSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TeamMemberOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeamMemberUpdateManyMutationInput, Prisma.TeamMemberUncheckedUpdateManyInput>;
    where?: Prisma.TeamMemberWhereInput;
    limit?: number;
    include?: Prisma.TeamMemberIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TeamMemberUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamMemberSelect<ExtArgs> | null;
    omit?: Prisma.TeamMemberOmit<ExtArgs> | null;
    include?: Prisma.TeamMemberInclude<ExtArgs> | null;
    where: Prisma.TeamMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamMemberCreateInput, Prisma.TeamMemberUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TeamMemberUpdateInput, Prisma.TeamMemberUncheckedUpdateInput>;
};
export type TeamMemberDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamMemberSelect<ExtArgs> | null;
    omit?: Prisma.TeamMemberOmit<ExtArgs> | null;
    include?: Prisma.TeamMemberInclude<ExtArgs> | null;
    where: Prisma.TeamMemberWhereUniqueInput;
};
export type TeamMemberDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamMemberWhereInput;
    limit?: number;
};
export type TeamMemberDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamMemberSelect<ExtArgs> | null;
    omit?: Prisma.TeamMemberOmit<ExtArgs> | null;
    include?: Prisma.TeamMemberInclude<ExtArgs> | null;
};
