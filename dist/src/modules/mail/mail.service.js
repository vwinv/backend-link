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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const team_invite_email_template_1 = require("./team-invite-email.template");
let MailService = MailService_1 = class MailService {
    configService;
    logger = new common_1.Logger(MailService_1.name);
    transporter = null;
    constructor(configService) {
        this.configService = configService;
    }
    isConfigured() {
        const mail = this.configService.get('mail');
        return Boolean(mail?.enabled &&
            mail.host?.trim() &&
            mail.from?.trim() &&
            mail.user?.trim() &&
            mail.password?.trim());
    }
    async sendTeamInviteEmail(payload) {
        const { subject, text, html } = (0, team_invite_email_template_1.buildTeamInviteEmail)(payload);
        if (!this.isConfigured()) {
            if (this.configService.get('nodeEnv') === 'production') {
                throw new Error('SMTP non configuré');
            }
            this.logger.warn(`[dev] Email d'invitation non envoyé (SMTP absent) → ${payload.to}`);
            this.logger.debug(text);
            return;
        }
        const transporter = this.getTransporter();
        const from = this.configService.get('mail.from', 'DropOne <noreply@dropone.pro>');
        await transporter.sendMail({
            from,
            to: payload.to,
            subject,
            text,
            html,
        });
    }
    getTransporter() {
        if (this.transporter) {
            return this.transporter;
        }
        const host = this.configService.get('mail.host', '');
        const port = this.configService.get('mail.port', 587);
        const secure = this.configService.get('mail.secure', false);
        const user = this.configService.get('mail.user', '');
        const password = this.configService.get('mail.password', '');
        this.transporter = nodemailer_1.default.createTransport({
            host,
            port,
            secure,
            auth: { user, pass: password },
        });
        return this.transporter;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map