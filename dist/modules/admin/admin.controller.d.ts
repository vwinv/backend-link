import type { AuthUserPayload } from '../auth/decorators/current-user.decorator';
import { AdminClientsService } from './admin-clients.service';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminNotificationsService } from './admin-notifications.service';
import { AdminOffersService } from './admin-offers.service';
import { AdminRolesService } from './admin-roles.service';
import { AdminSubscriptionsService } from './admin-subscriptions.service';
import { AdminSupportService } from './admin-support.service';
import { AdminUsersService } from './admin-users.service';
import { AdminClientsQueryDto } from './dto/admin-clients-query.dto';
import { AdminNotificationsQueryDto } from './dto/admin-notifications-query.dto';
import { AdminSubscriptionsQueryDto } from './dto/admin-subscriptions-query.dto';
import { CreateAdminSubscriptionDto } from './dto/create-admin-subscription.dto';
import { AdminSupportTicketsQueryDto } from './dto/admin-support-tickets-query.dto';
import { AdminUsersQueryDto } from './dto/admin-users-query.dto';
import { CreateAdminOfferDto, CreateAdminOfferPriceDto } from './dto/create-admin-offer.dto';
import { CreateAdminRoleDto } from './dto/create-admin-role.dto';
import { CreateBackofficeUserDto } from './dto/create-backoffice-user.dto';
import { CreateNotificationCampaignDto } from './dto/create-notification-campaign.dto';
import { ReplySupportTicketDto } from './dto/reply-support-ticket.dto';
import { UpdateAdminClientDto } from './dto/update-admin-client.dto';
import { UpdateAdminOfferDto, UpdateAdminOfferPriceDto } from './dto/update-admin-offer.dto';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto';
import { UpdateBackofficeUserDto } from './dto/update-backoffice-user.dto';
export declare class AdminController {
    private readonly dashboardService;
    private readonly usersService;
    private readonly clientsService;
    private readonly subscriptionsService;
    private readonly offersService;
    private readonly notificationsService;
    private readonly supportService;
    private readonly rolesService;
    constructor(dashboardService: AdminDashboardService, usersService: AdminUsersService, clientsService: AdminClientsService, subscriptionsService: AdminSubscriptionsService, offersService: AdminOffersService, notificationsService: AdminNotificationsService, supportService: AdminSupportService, rolesService: AdminRolesService);
    getDashboard(): Promise<{
        generatedAt: string;
        users: {
            total: number;
            active: number;
            admins: number;
            newLast7Days: number;
            newLast30Days: number;
        };
        cards: {
            total: number;
            active: number;
            public: number;
            personal: number;
            professional: number;
            member: number;
        };
        teams: {
            total: number;
        };
        subscriptions: {
            active: number;
            trial: number;
            cancelled: number;
            expired: number;
            pastDue: number;
            paying: number;
        };
        revenue: {
            currency: string;
            total: number;
            active: number;
            byOffer: {
                offerId: string;
                title: string;
                slug: string;
                subscriptionsCount: number;
                revenue: number;
                activeRevenue: number;
            }[];
        };
        engagement: {
            cardViews: number;
            cardViewsLast7Days: number;
            shares: number;
            sharesLast7Days: number;
            contacts: number;
            walletSaves: number;
            cardSaves: number;
            aiScans: number;
            aiScansLast7Days: number;
        };
        charts: {
            cardsByKind: {
                labels: string[];
                values: number[];
            };
            subscriptionsByStatus: {
                labels: string[];
                values: number[];
            };
            revenueByOffer: {
                labels: string[];
                values: number[];
            };
            activity30d: {
                labels: string[];
                users: number[];
                cards: number[];
                views: number[];
                shares: number[];
            };
        };
    }>;
    listPermissions(): {
        modules: {
            key: "subscriptions" | "notifications" | "roles" | "dashboard" | "backoffice_users" | "clients" | "support";
            label: "Notifications" | "Tableau de bord" | "Utilisateurs backoffice" | "Rôles & permissions" | "Clients" | "Abonnements & offres" | "Support";
            permissions: ({
                readonly key: "dashboard.view";
                readonly module: "dashboard";
                readonly action: "view";
                readonly label: "Voir le tableau de bord";
            } | {
                readonly key: "backoffice_users.view";
                readonly module: "backoffice_users";
                readonly action: "view";
                readonly label: "Voir les utilisateurs backoffice";
            } | {
                readonly key: "backoffice_users.create";
                readonly module: "backoffice_users";
                readonly action: "create";
                readonly label: "Créer un utilisateur backoffice";
            } | {
                readonly key: "backoffice_users.update";
                readonly module: "backoffice_users";
                readonly action: "update";
                readonly label: "Modifier un utilisateur backoffice";
            } | {
                readonly key: "roles.view";
                readonly module: "roles";
                readonly action: "view";
                readonly label: "Voir les rôles";
            } | {
                readonly key: "roles.create";
                readonly module: "roles";
                readonly action: "create";
                readonly label: "Créer un rôle";
            } | {
                readonly key: "roles.update";
                readonly module: "roles";
                readonly action: "update";
                readonly label: "Modifier un rôle";
            } | {
                readonly key: "roles.delete";
                readonly module: "roles";
                readonly action: "delete";
                readonly label: "Supprimer un rôle";
            } | {
                readonly key: "clients.view";
                readonly module: "clients";
                readonly action: "view";
                readonly label: "Voir les clients app";
            } | {
                readonly key: "clients.update";
                readonly module: "clients";
                readonly action: "update";
                readonly label: "Modifier un client app";
            } | {
                readonly key: "subscriptions.view";
                readonly module: "subscriptions";
                readonly action: "view";
                readonly label: "Voir les abonnements";
            } | {
                readonly key: "subscriptions.create";
                readonly module: "subscriptions";
                readonly action: "create";
                readonly label: "Créer une offre, un tarif ou un abonnement";
            } | {
                readonly key: "subscriptions.update";
                readonly module: "subscriptions";
                readonly action: "update";
                readonly label: "Modifier les offres et tarifs";
            } | {
                readonly key: "subscriptions.delete";
                readonly module: "subscriptions";
                readonly action: "delete";
                readonly label: "Supprimer une offre / un tarif";
            } | {
                readonly key: "notifications.view";
                readonly module: "notifications";
                readonly action: "view";
                readonly label: "Voir les campagnes de notifications";
            } | {
                readonly key: "notifications.send";
                readonly module: "notifications";
                readonly action: "send";
                readonly label: "Envoyer des notifications ciblées";
            } | {
                readonly key: "support.view";
                readonly module: "support";
                readonly action: "view";
                readonly label: "Voir les tickets support";
            } | {
                readonly key: "support.reply";
                readonly module: "support";
                readonly action: "reply";
                readonly label: "Répondre aux tickets support";
            })[];
        }[];
    };
    listRoles(): Promise<{
        id: string;
        name: string;
        description: string | null;
        isSystem: boolean;
        usersCount: number;
        permissionKeys: string[];
        permissions: {
            key: string;
            module: string;
            action: string;
            label: string;
        }[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getRole(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isSystem: boolean;
        usersCount: number;
        permissionKeys: string[];
        permissions: {
            key: string;
            module: string;
            action: string;
            label: string;
        }[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    createRole(dto: CreateAdminRoleDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        isSystem: boolean;
        usersCount: number;
        permissionKeys: string[];
        permissions: {
            key: string;
            module: string;
            action: string;
            label: string;
        }[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateRole(id: string, dto: UpdateAdminRoleDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        isSystem: boolean;
        usersCount: number;
        permissionKeys: string[];
        permissions: {
            key: string;
            module: string;
            action: string;
            label: string;
        }[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteRole(id: string): Promise<{
        message: string;
    }>;
    listClients(query: AdminClientsQueryDto): Promise<{
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
    getClient(id: string): Promise<{
        stripeCustomerId: string | null;
        cards: {
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            createdAt: Date;
            jobTitle: string | null;
            slug: string;
            kind: import("@prisma/client").$Enums.CardKind;
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
                audience: import("@prisma/client").$Enums.OfferAudience;
                slug: string;
            } | null;
            plan: {
                id: string;
                name: string;
                slug: string;
            };
        }[];
        teams: {
            id: string;
            name: string;
            isActive: boolean;
            slug: string;
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
    updateClient(id: string, dto: UpdateAdminClientDto): Promise<{
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
    getSubscriptionsStats(): Promise<{
        generatedAt: string;
        totals: {
            total: number;
            active: number;
            trial: number;
            cancelled: number;
            expired: number;
            pastDue: number;
            paying: number;
            newLast30Days: number;
        };
        billing: {
            monthly: number;
            yearly: number;
        };
        revenue: {
            currency: string;
            total: number;
            active: number;
        };
        byOffer: {
            offerId: string;
            title: string;
            slug: string;
            subscriptionsCount: number;
            activeCount: number;
            revenue: number;
        }[];
        byStatus: {
            status: string;
            label: string;
            count: number;
        }[];
    }>;
    listSubscriptionOffers(): Promise<{
        prices: {
            id: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType;
            amount: number;
            pricePerSeat: number | null;
            currency: string;
            label: string | null;
        }[];
        id: string;
        title: string;
        audience: import("@prisma/client").$Enums.OfferAudience;
        slug: string;
        minSeats: number;
        listedInApp: boolean;
    }[]>;
    listSubscriptions(query: AdminSubscriptionsQueryDto): Promise<{
        data: {
            id: string;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            billingPeriod: import("@prisma/client").$Enums.BillingPeriod;
            currentPeriodEnd: Date | null;
            cancelledAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            paymentProvider: string | null;
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                fullName: string;
            } | null;
            team: {
                id: string;
                name: string;
                slug: string;
            } | null;
            offer: {
                id: string;
                title: string;
                slug: string;
                audience: import("@prisma/client").OfferAudience;
            } | null;
            plan: {
                id: string;
                name: string;
                slug: string;
            } | null;
            price: {
                id: string;
                billingType: import("@prisma/client").$Enums.OfferBillingType;
                amount: number;
                currency: string;
                label: string | null;
            } | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createSubscription(dto: CreateAdminSubscriptionDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        billingPeriod: import("@prisma/client").$Enums.BillingPeriod;
        currentPeriodEnd: Date | null;
        cancelledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        paymentProvider: string | null;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            fullName: string;
        } | null;
        team: {
            id: string;
            name: string;
            slug: string;
        } | null;
        offer: {
            id: string;
            title: string;
            slug: string;
            audience: import("@prisma/client").OfferAudience;
        } | null;
        plan: {
            id: string;
            name: string;
            slug: string;
        } | null;
        price: {
            id: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType;
            amount: number;
            currency: string;
            label: string | null;
        } | null;
    }>;
    listOffersAdmin(): Promise<{
        id: string;
        title: string;
        slug: string;
        subtitle: string | null;
        audience: import("@prisma/client").$Enums.OfferAudience;
        canCustomize: boolean;
        maxTeamMembers: number;
        minSeats: number;
        hasPortfolio: boolean;
        hasWallet: boolean;
        hasAnalytics: boolean;
        hasVisitorInsights: boolean;
        hasSocialLinks: boolean;
        maxAiScans: number;
        maxShares: number;
        sortOrder: number;
        isActive: boolean;
        listedInApp: boolean;
        isFreeOffer: boolean;
        subscriptionsCount: number;
        createdAt: string;
        updatedAt: string;
        prices: {
            id: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType;
            priceLabel: string | null;
            priceAmount: number;
            pricePerSeat: number | null;
            currency: string;
            discountPercent: number | null;
            badgeLabel: string | null;
            isPopular: boolean;
            sortOrder: number;
            isActive: boolean;
            stripePriceId: string | null;
        }[];
    }[]>;
    getOffer(id: string): Promise<{
        id: string;
        title: string;
        slug: string;
        subtitle: string | null;
        audience: import("@prisma/client").$Enums.OfferAudience;
        canCustomize: boolean;
        maxTeamMembers: number;
        minSeats: number;
        hasPortfolio: boolean;
        hasWallet: boolean;
        hasAnalytics: boolean;
        hasVisitorInsights: boolean;
        hasSocialLinks: boolean;
        maxAiScans: number;
        maxShares: number;
        sortOrder: number;
        isActive: boolean;
        listedInApp: boolean;
        isFreeOffer: boolean;
        subscriptionsCount: number;
        createdAt: string;
        updatedAt: string;
        prices: {
            id: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType;
            priceLabel: string | null;
            priceAmount: number;
            pricePerSeat: number | null;
            currency: string;
            discountPercent: number | null;
            badgeLabel: string | null;
            isPopular: boolean;
            sortOrder: number;
            isActive: boolean;
            stripePriceId: string | null;
        }[];
    }>;
    createOffer(dto: CreateAdminOfferDto): Promise<{
        id: string;
        title: string;
        slug: string;
        subtitle: string | null;
        audience: import("@prisma/client").$Enums.OfferAudience;
        canCustomize: boolean;
        maxTeamMembers: number;
        minSeats: number;
        hasPortfolio: boolean;
        hasWallet: boolean;
        hasAnalytics: boolean;
        hasVisitorInsights: boolean;
        hasSocialLinks: boolean;
        maxAiScans: number;
        maxShares: number;
        sortOrder: number;
        isActive: boolean;
        listedInApp: boolean;
        isFreeOffer: boolean;
        subscriptionsCount: number;
        createdAt: string;
        updatedAt: string;
        prices: {
            id: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType;
            priceLabel: string | null;
            priceAmount: number;
            pricePerSeat: number | null;
            currency: string;
            discountPercent: number | null;
            badgeLabel: string | null;
            isPopular: boolean;
            sortOrder: number;
            isActive: boolean;
            stripePriceId: string | null;
        }[];
    }>;
    updateOffer(id: string, dto: UpdateAdminOfferDto): Promise<{
        id: string;
        title: string;
        slug: string;
        subtitle: string | null;
        audience: import("@prisma/client").$Enums.OfferAudience;
        canCustomize: boolean;
        maxTeamMembers: number;
        minSeats: number;
        hasPortfolio: boolean;
        hasWallet: boolean;
        hasAnalytics: boolean;
        hasVisitorInsights: boolean;
        hasSocialLinks: boolean;
        maxAiScans: number;
        maxShares: number;
        sortOrder: number;
        isActive: boolean;
        listedInApp: boolean;
        isFreeOffer: boolean;
        subscriptionsCount: number;
        createdAt: string;
        updatedAt: string;
        prices: {
            id: string;
            billingType: import("@prisma/client").$Enums.OfferBillingType;
            priceLabel: string | null;
            priceAmount: number;
            pricePerSeat: number | null;
            currency: string;
            discountPercent: number | null;
            badgeLabel: string | null;
            isPopular: boolean;
            sortOrder: number;
            isActive: boolean;
            stripePriceId: string | null;
        }[];
    }>;
    deleteOffer(id: string): Promise<{
        id: string;
        softDeleted: boolean;
    }>;
    createOfferPrice(id: string, dto: CreateAdminOfferPriceDto): Promise<{
        id: string;
        billingType: import("@prisma/client").$Enums.OfferBillingType;
        priceLabel: string | null;
        priceAmount: number;
        pricePerSeat: number | null;
        currency: string;
        discountPercent: number | null;
        badgeLabel: string | null;
        isPopular: boolean;
        sortOrder: number;
        isActive: boolean;
        stripePriceId: string | null;
    }>;
    updateOfferPrice(offerId: string, priceId: string, dto: UpdateAdminOfferPriceDto): Promise<{
        id: string;
        billingType: import("@prisma/client").$Enums.OfferBillingType;
        priceLabel: string | null;
        priceAmount: number;
        pricePerSeat: number | null;
        currency: string;
        discountPercent: number | null;
        badgeLabel: string | null;
        isPopular: boolean;
        sortOrder: number;
        isActive: boolean;
        stripePriceId: string | null;
    }>;
    deleteOfferPrice(offerId: string, priceId: string): Promise<{
        id: string;
        deleted: boolean;
        detachedSubscriptions: number;
    }>;
    getSupportStats(): Promise<{
        open: number;
        replied: number;
        closed: number;
        total: number;
    }>;
    listSupportTickets(query: AdminSupportTicketsQueryDto): Promise<{
        data: {
            id: string;
            firstName: string;
            lastName: string;
            fullName: string;
            email: string;
            phone: string | null;
            messagePreview: string;
            status: import("@prisma/client").$Enums.SupportTicketStatus;
            repliesCount: number;
            closedAt: string | null;
            createdAt: string;
            updatedAt: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSupportTicket(id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        fullName: string;
        email: string;
        phone: string | null;
        message: string;
        status: import("@prisma/client").$Enums.SupportTicketStatus;
        closedAt: string | null;
        createdAt: string;
        updatedAt: string;
        replies: {
            id: string;
            body: string;
            createdAt: string;
            sentBy: {
                id: string;
                email: string;
                name: string;
            } | null;
        }[];
    }>;
    replySupportTicket(id: string, dto: ReplySupportTicketDto, actor: AuthUserPayload): Promise<{
        replyId: string;
        ticketId: string;
        status: "REPLIED";
        emailedTo: string;
    }>;
    getNotificationsStats(): Promise<{
        campaigns: number;
        sent: number;
        failed: number;
        delivered: number;
        unread: number;
        pushTokens: number;
    }>;
    listNotifications(query: AdminNotificationsQueryDto): Promise<{
        data: {
            id: string;
            title: string;
            body: string;
            audience: import("@prisma/client").$Enums.NotificationAudience;
            userIds: string[];
            status: import("@prisma/client").$Enums.NotificationCampaignStatus;
            targetCount: number;
            deliveredCount: number;
            readCount: number;
            pushAttempted: number;
            errorMessage: string | null;
            createdAt: Date;
            sentAt: Date | null;
            updatedAt: Date;
            createdBy: {
                id: string;
                email: string;
                name: string;
            } | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getNotification(id: string): Promise<{
        id: string;
        title: string;
        body: string;
        audience: import("@prisma/client").$Enums.NotificationAudience;
        userIds: string[];
        status: import("@prisma/client").$Enums.NotificationCampaignStatus;
        targetCount: number;
        deliveredCount: number;
        readCount: number;
        pushAttempted: number;
        errorMessage: string | null;
        createdAt: Date;
        sentAt: Date | null;
        updatedAt: Date;
        createdBy: {
            id: string;
            email: string;
            name: string;
        } | null;
    }>;
    createNotification(dto: CreateNotificationCampaignDto, actor: AuthUserPayload): Promise<{
        id: string;
        title: string;
        body: string;
        audience: import("@prisma/client").$Enums.NotificationAudience;
        userIds: string[];
        status: import("@prisma/client").$Enums.NotificationCampaignStatus;
        targetCount: number;
        deliveredCount: number;
        readCount: number;
        pushAttempted: number;
        errorMessage: string | null;
        createdAt: Date;
        sentAt: Date | null;
        updatedAt: Date;
        createdBy: {
            id: string;
            email: string;
            name: string;
        } | null;
    }>;
    listUsers(query: AdminUsersQueryDto): Promise<{
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
            authProvider: string;
            createdAt: Date;
            updatedAt: Date;
            adminRole: {
                id: string;
                name: string;
                isSystem: boolean;
            } | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUser(id: string): Promise<{
        permissions: string[];
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        authProvider: string;
        createdAt: Date;
        updatedAt: Date;
        adminRole: {
            id: string;
            name: string;
            isSystem: boolean;
        } | null;
    }>;
    createUser(dto: CreateBackofficeUserDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        authProvider: string;
        createdAt: Date;
        updatedAt: Date;
        adminRole: {
            id: string;
            name: string;
            isSystem: boolean;
        } | null;
    }>;
    updateUser(id: string, dto: UpdateBackofficeUserDto, actor: AuthUserPayload): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        authProvider: string;
        createdAt: Date;
        updatedAt: Date;
        adminRole: {
            id: string;
            name: string;
            isSystem: boolean;
        } | null;
    }>;
}
