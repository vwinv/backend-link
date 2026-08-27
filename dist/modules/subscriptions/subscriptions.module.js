"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const auth_module_1 = require("../auth/auth.module");
const notifications_module_1 = require("../notifications/notifications.module");
const paydunya_module_1 = require("../paydunya/paydunya.module");
const paydunya_webhook_controller_1 = require("../paydunya/paydunya-webhook.controller");
const entitlements_service_1 = require("./entitlements.service");
const invoices_service_1 = require("./invoices.service");
const stripe_service_1 = require("./stripe.service");
const apple_iap_service_1 = require("./apple-iap.service");
const subscriptions_controller_1 = require("./subscriptions.controller");
const subscriptions_service_1 = require("./subscriptions.service");
let SubscriptionsModule = class SubscriptionsModule {
};
exports.SubscriptionsModule = SubscriptionsModule;
exports.SubscriptionsModule = SubscriptionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            notifications_module_1.NotificationsModule,
            paydunya_module_1.PaydunyaModule,
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [subscriptions_controller_1.SubscriptionsController, paydunya_webhook_controller_1.PaydunyaWebhookController],
        providers: [
            subscriptions_service_1.SubscriptionsService,
            entitlements_service_1.EntitlementsService,
            stripe_service_1.StripeService,
            invoices_service_1.InvoicesService,
            apple_iap_service_1.AppleIapService,
        ],
        exports: [
            subscriptions_service_1.SubscriptionsService,
            entitlements_service_1.EntitlementsService,
            stripe_service_1.StripeService,
            invoices_service_1.InvoicesService,
        ],
    })
], SubscriptionsModule);
//# sourceMappingURL=subscriptions.module.js.map