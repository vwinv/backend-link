import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';
export type JwtPayload = {
    sub: string;
    email: string;
    role?: UserRole;
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        userId: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        adminRoleId: string | null;
        adminRoleName: string | null;
        permissions: string[];
    }>;
}
export {};
