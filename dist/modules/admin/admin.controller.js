"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const admin_access_guard_1 = require("../auth/guards/admin-access.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const admin_clients_service_1 = require("./admin-clients.service");
const admin_dashboard_service_1 = require("./admin-dashboard.service");
const admin_notifications_service_1 = require("./admin-notifications.service");
const admin_offers_service_1 = require("./admin-offers.service");
const admin_roles_service_1 = require("./admin-roles.service");
const admin_subscriptions_service_1 = require("./admin-subscriptions.service");
const admin_support_service_1 = require("./admin-support.service");
const admin_users_service_1 = require("./admin-users.service");
const admin_clients_query_dto_1 = require("./dto/admin-clients-query.dto");
const admin_notifications_query_dto_1 = require("./dto/admin-notifications-query.dto");
const admin_subscriptions_query_dto_1 = require("./dto/admin-subscriptions-query.dto");
const create_admin_subscription_dto_1 = require("./dto/create-admin-subscription.dto");
const update_admin_subscription_dto_1 = require("./dto/update-admin-subscription.dto");
const admin_support_tickets_query_dto_1 = require("./dto/admin-support-tickets-query.dto");
const admin_users_query_dto_1 = require("./dto/admin-users-query.dto");
const create_admin_offer_dto_1 = require("./dto/create-admin-offer.dto");
const create_admin_role_dto_1 = require("./dto/create-admin-role.dto");
const create_backoffice_user_dto_1 = require("./dto/create-backoffice-user.dto");
const create_notification_campaign_dto_1 = require("./dto/create-notification-campaign.dto");
const reply_support_ticket_dto_1 = require("./dto/reply-support-ticket.dto");
const update_admin_client_dto_1 = require("./dto/update-admin-client.dto");
const update_admin_offer_dto_1 = require("./dto/update-admin-offer.dto");
const update_admin_role_dto_1 = require("./dto/update-admin-role.dto");
const update_backoffice_user_dto_1 = require("./dto/update-backoffice-user.dto");
let AdminController = class AdminController {
    dashboardService;
    usersService;
    clientsService;
    subscriptionsService;
    offersService;
    notificationsService;
    supportService;
    rolesService;
    constructor(dashboardService, usersService, clientsService, subscriptionsService, offersService, notificationsService, supportService, rolesService) {
        this.dashboardService = dashboardService;
        this.usersService = usersService;
        this.clientsService = clientsService;
        this.subscriptionsService = subscriptionsService;
        this.offersService = offersService;
        this.notificationsService = notificationsService;
        this.supportService = supportService;
        this.rolesService = rolesService;
    }
    getDashboard() {
        return this.dashboardService.getStats();
    }
    listPermissions() {
        return this.rolesService.listPermissions();
    }
    listRoles() {
        return this.rolesService.listRoles();
    }
    getRole(id) {
        return this.rolesService.findOne(id);
    }
    createRole(dto) {
        return this.rolesService.create(dto);
    }
    updateRole(id, dto) {
        return this.rolesService.update(id, dto);
    }
    deleteRole(id) {
        return this.rolesService.remove(id);
    }
    listClients(query) {
        return this.clientsService.list(query);
    }
    getClient(id) {
        return this.clientsService.findOne(id);
    }
    updateClient(id, dto) {
        return this.clientsService.update(id, dto);
    }
    getSubscriptionsStats() {
        return this.subscriptionsService.getStats();
    }
    listSubscriptionOffers() {
        return this.subscriptionsService.listOffers();
    }
    listSubscriptions(query) {
        return this.subscriptionsService.list(query);
    }
    createSubscription(dto) {
        return this.subscriptionsService.create(dto);
    }
    getSubscription(id) {
        return this.subscriptionsService.findOne(id);
    }
    updateSubscription(id, dto) {
        return this.subscriptionsService.update(id, dto);
    }
    deleteSubscription(id) {
        return this.subscriptionsService.remove(id);
    }
    listOffersAdmin() {
        return this.offersService.list();
    }
    getOffer(id) {
        return this.offersService.findOne(id);
    }
    createOffer(dto) {
        return this.offersService.create(dto);
    }
    updateOffer(id, dto) {
        return this.offersService.update(id, dto);
    }
    deleteOffer(id) {
        return this.offersService.remove(id);
    }
    createOfferPrice(id, dto) {
        return this.offersService.createPrice(id, dto);
    }
    updateOfferPrice(offerId, priceId, dto) {
        return this.offersService.updatePrice(offerId, priceId, dto);
    }
    deleteOfferPrice(offerId, priceId) {
        return this.offersService.removePrice(offerId, priceId);
    }
    getSupportStats() {
        return this.supportService.getStats();
    }
    listSupportTickets(query) {
        return this.supportService.list(query);
    }
    getSupportTicket(id) {
        return this.supportService.findOne(id);
    }
    replySupportTicket(id, dto, actor) {
        return this.supportService.reply(id, dto, actor.userId);
    }
    getNotificationsStats() {
        return this.notificationsService.getStats();
    }
    listNotifications(query) {
        return this.notificationsService.list(query);
    }
    getNotification(id) {
        return this.notificationsService.findOne(id);
    }
    createNotification(dto, actor) {
        return this.notificationsService.createAndSend(dto, actor.userId);
    }
    listUsers(query) {
        return this.usersService.list(query);
    }
    getUser(id) {
        return this.usersService.findOne(id);
    }
    createUser(dto) {
        return this.usersService.create(dto);
    }
    updateUser(id, dto, actor) {
        return this.usersService.update(id, dto, actor.userId);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, permissions_decorator_1.RequirePermissions)('dashboard.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques plateforme (backoffice)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('permissions'),
    (0, permissions_decorator_1.RequirePermissions)('roles.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Catalogue des permissions / modules' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listPermissions", null);
__decorate([
    (0, common_1.Get)('roles'),
    (0, permissions_decorator_1.RequirePermissions)('roles.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des rôles backoffice' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listRoles", null);
__decorate([
    (0, common_1.Get)('roles/:id'),
    (0, permissions_decorator_1.RequirePermissions)('roles.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Détail d’un rôle backoffice' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRole", null);
__decorate([
    (0, common_1.Post)('roles'),
    (0, permissions_decorator_1.RequirePermissions)('roles.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un rôle backoffice' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_role_dto_1.CreateAdminRoleDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createRole", null);
__decorate([
    (0, common_1.Patch)('roles/:id'),
    (0, permissions_decorator_1.RequirePermissions)('roles.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un rôle backoffice' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admin_role_dto_1.UpdateAdminRoleDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)('roles/:id'),
    (0, permissions_decorator_1.RequirePermissions)('roles.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un rôle backoffice' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.Get)('clients'),
    (0, permissions_decorator_1.RequirePermissions)('clients.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des clients (utilisateurs app)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_clients_query_dto_1.AdminClientsQueryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listClients", null);
__decorate([
    (0, common_1.Get)('clients/:id'),
    (0, permissions_decorator_1.RequirePermissions)('clients.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Détail d’un client app' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getClient", null);
__decorate([
    (0, common_1.Patch)('clients/:id'),
    (0, permissions_decorator_1.RequirePermissions)('clients.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un client app' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admin_client_dto_1.UpdateAdminClientDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateClient", null);
__decorate([
    (0, common_1.Get)('subscriptions/stats'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques des abonnements' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSubscriptionsStats", null);
__decorate([
    (0, common_1.Get)('subscriptions/offers'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Offres premium (filtres)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listSubscriptionOffers", null);
__decorate([
    (0, common_1.Get)('subscriptions'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des abonnements' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_subscriptions_query_dto_1.AdminSubscriptionsQueryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listSubscriptions", null);
__decorate([
    (0, common_1.Post)('subscriptions'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer / attribuer un abonnement à un client' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_subscription_dto_1.CreateAdminSubscriptionDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createSubscription", null);
__decorate([
    (0, common_1.Get)('subscriptions/:id'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Détail d’un abonnement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSubscription", null);
__decorate([
    (0, common_1.Patch)('subscriptions/:id'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un abonnement' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admin_subscription_dto_1.UpdateAdminSubscriptionDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.Delete)('subscriptions/:id'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un abonnement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteSubscription", null);
__decorate([
    (0, common_1.Get)('offers'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des offres (catalogue + gratuite)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listOffersAdmin", null);
__decorate([
    (0, common_1.Get)('offers/:id'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Détail d’une offre' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getOffer", null);
__decorate([
    (0, common_1.Post)('offers'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une offre' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_offer_dto_1.CreateAdminOfferDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createOffer", null);
__decorate([
    (0, common_1.Patch)('offers/:id'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier une offre' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admin_offer_dto_1.UpdateAdminOfferDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateOffer", null);
__decorate([
    (0, common_1.Delete)('offers/:id'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer / désactiver une offre' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteOffer", null);
__decorate([
    (0, common_1.Post)('offers/:id/prices'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un tarif à une offre' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_admin_offer_dto_1.CreateAdminOfferPriceDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createOfferPrice", null);
__decorate([
    (0, common_1.Patch)('offers/:offerId/prices/:priceId'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un tarif' }),
    __param(0, (0, common_1.Param)('offerId')),
    __param(1, (0, common_1.Param)('priceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_admin_offer_dto_1.UpdateAdminOfferPriceDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateOfferPrice", null);
__decorate([
    (0, common_1.Delete)('offers/:offerId/prices/:priceId'),
    (0, permissions_decorator_1.RequirePermissions)('subscriptions.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer / désactiver un tarif' }),
    __param(0, (0, common_1.Param)('offerId')),
    __param(1, (0, common_1.Param)('priceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteOfferPrice", null);
__decorate([
    (0, common_1.Get)('support/stats'),
    (0, permissions_decorator_1.RequirePermissions)('support.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques des tickets support' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSupportStats", null);
__decorate([
    (0, common_1.Get)('support/tickets'),
    (0, permissions_decorator_1.RequirePermissions)('support.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des tickets support' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_support_tickets_query_dto_1.AdminSupportTicketsQueryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listSupportTickets", null);
__decorate([
    (0, common_1.Get)('support/tickets/:id'),
    (0, permissions_decorator_1.RequirePermissions)('support.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Détail d’un ticket support' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSupportTicket", null);
__decorate([
    (0, common_1.Post)('support/tickets/:id/reply'),
    (0, permissions_decorator_1.RequirePermissions)('support.reply'),
    (0, swagger_1.ApiOperation)({ summary: 'Répondre à un ticket (e-mail + lien de clôture)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reply_support_ticket_dto_1.ReplySupportTicketDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "replySupportTicket", null);
__decorate([
    (0, common_1.Get)('notifications/stats'),
    (0, permissions_decorator_1.RequirePermissions)('notifications.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques des notifications' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getNotificationsStats", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, permissions_decorator_1.RequirePermissions)('notifications.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Historique des campagnes de notifications' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_notifications_query_dto_1.AdminNotificationsQueryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listNotifications", null);
__decorate([
    (0, common_1.Get)('notifications/:id'),
    (0, permissions_decorator_1.RequirePermissions)('notifications.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Détail d’une campagne' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getNotification", null);
__decorate([
    (0, common_1.Post)('notifications'),
    (0, permissions_decorator_1.RequirePermissions)('notifications.send'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer et envoyer une notification ciblée' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_campaign_dto_1.CreateNotificationCampaignDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createNotification", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, permissions_decorator_1.RequirePermissions)('backoffice_users.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des utilisateurs backoffice' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_users_query_dto_1.AdminUsersQueryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, permissions_decorator_1.RequirePermissions)('backoffice_users.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Détail d’un utilisateur backoffice' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUser", null);
__decorate([
    (0, common_1.Post)('users'),
    (0, permissions_decorator_1.RequirePermissions)('backoffice_users.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un utilisateur backoffice' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_backoffice_user_dto_1.CreateBackofficeUserDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Patch)('users/:id'),
    (0, permissions_decorator_1.RequirePermissions)('backoffice_users.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un utilisateur backoffice' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_backoffice_user_dto_1.UpdateBackofficeUserDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUser", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_access_guard_1.AdminAccessGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_dashboard_service_1.AdminDashboardService,
        admin_users_service_1.AdminUsersService,
        admin_clients_service_1.AdminClientsService,
        admin_subscriptions_service_1.AdminSubscriptionsService,
        admin_offers_service_1.AdminOffersService,
        admin_notifications_service_1.AdminNotificationsService,
        admin_support_service_1.AdminSupportService,
        admin_roles_service_1.AdminRolesService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map