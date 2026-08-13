"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EspaceModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const subscriptions_module_1 = require("../subscriptions/subscriptions.module");
const teams_module_1 = require("../teams/teams.module");
const espace_controller_1 = require("./espace.controller");
const espace_service_1 = require("./espace.service");
let EspaceModule = class EspaceModule {
};
exports.EspaceModule = EspaceModule;
exports.EspaceModule = EspaceModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, teams_module_1.TeamsModule, subscriptions_module_1.SubscriptionsModule],
        controllers: [espace_controller_1.EspaceController],
        providers: [espace_service_1.EspaceService],
    })
], EspaceModule);
//# sourceMappingURL=espace.module.js.map