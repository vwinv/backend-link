import { PrismaService } from '../../prisma/prisma.service';
import { AdminClientsQueryDto } from './dto/admin-clients-query.dto';
import { UpdateAdminClientDto } from './dto/update-admin-client.dto';
export declare class AdminClientsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(query: AdminClientsQueryDto): Promise<{
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatarUrl: string | null;
            isActive: boolean;
            authProvider: string;
            createdAt: Date;
            updatedAt: Date;
            isPremium: boolean;
            subscription: {
                id: string;
                status: import("@prisma/client").$Enums.SubscriptionStatus;
                billingPeriod: string;
                currentPeriodEnd: Date | null;
                offerTitle: string | null;
                offerSlug: string | null;
                audience: string | null;
            } | null;
            cardsCount: number;
            teamsCount: number;
            ownedTeamsCount: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        stripeCustomerId: string | null;
        cards: {
            id: string;
            slug: string;
            isActive: boolean;
            createdAt: Date;
            kind: import("@prisma/client").$Enums.CardKind;
            firstName: string;
            lastName: string;
            jobTitle: string | null;
            company: string | null;
            isPublic: boolean;
        }[];
        subscriptions: {
            id: string;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            billingPeriod: import("@prisma/client").$Enums.BillingPeriod;
            currentPeriodEnd: Date | null;
            createdAt: Date;
            offer: {
                id: string;
                title: string;
                slug: string;
                audience: import("@prisma/client").$Enums.OfferAudience;
            } | null;
            plan: {
                id: string;
                slug: string;
                name: string;
            };
        }[];
        teams: {
            id: string;
            slug: string;
            isActive: boolean;
            name: string;
            role: import("@prisma/client").$Enums.TeamMemberRole;
        }[];
        ownedTeams: {
            id: string;
            name: string;
            slug: string;
            isActive: boolean;
            membersCount: number;
        }[];
        stats: {
            cardsCount: number;
            teamsCount: number;
            ownedTeamsCount: number;
            contactsCount: number;
            sharesCount: number;
            viewsCount: number;
        };
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        isActive: boolean;
        authProvider: string;
        createdAt: Date;
        updatedAt: Date;
        isPremium: boolean;
        subscription: {
            id: string;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            billingPeriod: string;
            currentPeriodEnd: Date | null;
            offerTitle: string | null;
            offerSlug: string | null;
            audience: string | null;
        } | null;
        cardsCount: number;
        teamsCount: number;
        ownedTeamsCount: number;
    }>;
    update(id: string, dto: UpdateAdminClientDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        isActive: boolean;
        authProvider: string;
        createdAt: Date;
        updatedAt: Date;
        isPremium: boolean;
        subscription: {
            id: string;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            billingPeriod: string;
            currentPeriodEnd: Date | null;
            offerTitle: string | null;
            offerSlug: string | null;
            audience: string | null;
        } | null;
        cardsCount: number;
        teamsCount: number;
        ownedTeamsCount: number;
    }>;
    private listSelect;
    private toListItem;
}
