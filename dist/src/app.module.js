"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configuration_1 = __importDefault(require("./config/configuration"));
const health_controller_1 = require("./health/health.controller");
const auth_module_1 = require("./modules/auth/auth.module");
const cards_module_1 = require("./modules/cards/cards.module");
const portfolios_module_1 = require("./modules/portfolios/portfolios.module");
const sharing_module_1 = require("./modules/sharing/sharing.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const contacts_module_1 = require("./modules/contacts/contacts.module");
const scans_module_1 = require("./modules/scans/scans.module");
const teams_module_1 = require("./modules/teams/teams.module");
const users_module_1 = require("./modules/users/users.module");
const wallet_module_1 = require("./modules/wallet/wallet.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const mail_module_1 = require("./modules/mail/mail.module");
const prisma_module_1 = require("./prisma/prisma.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            prisma_module_1.PrismaModule,
            mail_module_1.MailModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            teams_module_1.TeamsModule,
            cards_module_1.CardsModule,
            portfolios_module_1.PortfoliosModule,
            subscriptions_module_1.SubscriptionsModule,
            scans_module_1.ScansModule,
            contacts_module_1.ContactsModule,
            sharing_module_1.SharingModule,
            wallet_module_1.WalletModule,
            uploads_module_1.UploadsModule,
        ],
        controllers: [health_controller_1.HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map