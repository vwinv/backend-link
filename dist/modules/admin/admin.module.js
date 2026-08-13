"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const admin_access_guard_1 = require("../auth/guards/admin-access.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const notifications_module_1 = require("../notifications/notifications.module");
const admin_clients_service_1 = require("./admin-clients.service");
const admin_dashboard_service_1 = require("./admin-dashboard.service");
const admin_notifications_service_1 = require("./admin-notifications.service");
const admin_offers_service_1 = require("./admin-offers.service");
const admin_roles_service_1 = require("./admin-roles.service");
const admin_subscriptions_service_1 = require("./admin-subscriptions.service");
const admin_support_service_1 = require("./admin-support.service");
const admin_users_service_1 = require("./admin-users.service");
const admin_controller_1 = require("./admin.controller");
const support_module_1 = require("../support/support.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, support_module_1.SupportModule, notifications_module_1.NotificationsModule],
        controllers: [admin_controller_1.AdminController],
        providers: [
            admin_dashboard_service_1.AdminDashboardService,
            admin_users_service_1.AdminUsersService,
            admin_clients_service_1.AdminClientsService,
            admin_subscriptions_service_1.AdminSubscriptionsService,
            admin_offers_service_1.AdminOffersService,
            admin_notifications_service_1.AdminNotificationsService,
            admin_support_service_1.AdminSupportService,
            admin_roles_service_1.AdminRolesService,
            admin_access_guard_1.AdminAccessGuard,
            permissions_guard_1.PermissionsGuard,
        ],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map