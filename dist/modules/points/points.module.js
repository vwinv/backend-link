"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointsModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const subscriptions_module_1 = require("../subscriptions/subscriptions.module");
const points_controller_1 = require("./points.controller");
const points_redeem_service_1 = require("./points-redeem.service");
const points_service_1 = require("./points.service");
let PointsModule = class PointsModule {
};
exports.PointsModule = PointsModule;
exports.PointsModule = PointsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, (0, common_1.forwardRef)(() => subscriptions_module_1.SubscriptionsModule)],
        controllers: [points_controller_1.PointsController],
        providers: [points_service_1.PointsService, points_redeem_service_1.PointsRedeemService],
        exports: [points_service_1.PointsService],
    })
], PointsModule);
//# sourceMappingURL=points.module.js.map