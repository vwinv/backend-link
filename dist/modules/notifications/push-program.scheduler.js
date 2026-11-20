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
var PushProgramScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushProgramScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const push_program_service_1 = require("./push-program.service");
let PushProgramScheduler = PushProgramScheduler_1 = class PushProgramScheduler {
    pushProgramService;
    logger = new common_1.Logger(PushProgramScheduler_1.name);
    constructor(pushProgramService) {
        this.pushProgramService = pushProgramService;
    }
    async tick() {
        try {
            await this.pushProgramService.runScheduledTick();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Push programme cron: ${message}`);
        }
    }
};
exports.PushProgramScheduler = PushProgramScheduler;
__decorate([
    (0, schedule_1.Cron)('*/15 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PushProgramScheduler.prototype, "tick", null);
exports.PushProgramScheduler = PushProgramScheduler = PushProgramScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [push_program_service_1.PushProgramService])
], PushProgramScheduler);
//# sourceMappingURL=push-program.scheduler.js.map