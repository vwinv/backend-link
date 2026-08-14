"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const auth_constants_1 = require("./auth.constants");
const oauth_service_1 = require("./oauth/oauth.service");
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    configService;
    oauthService;
    mailService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService, configService, oauthService, mailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.oauthService = oauthService;
        this.mailService = mailService;
    }
    async register(dto) {
        const email = dto.email.trim().toLowerCase();
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('Cet email est déjà utilisé');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
                authProvider: client_1.AuthProvider.LOCAL,
                firstName: dto.firstName.trim(),
                lastName: dto.lastName.trim(),
            },
        });
        await this.linkPendingInvites(user.id, email);
        const full = await this.loadAdminUser(user.id);
        return this.buildAuthResponse(full);
    }
    async login(dto) {
        const user = await this.authenticateLocal(dto);
        const full = await this.loadAdminUser(user.id);
        return this.buildAuthResponse(full);
    }
    async loginAdmin(dto) {
        const user = await this.authenticateLocal(dto);
        const full = await this.loadAdminUser(user.id);
        if (!full || !this.canAccessBackoffice(full)) {
            throw new common_1.ForbiddenException('Accès réservé aux utilisateurs du backoffice DropOne');
        }
        return this.buildAuthResponse(full);
    }
    async loginWithGoogle(idToken) {
        const profile = await this.oauthService.verifyGoogleIdToken(idToken);
        return this.authenticateWithOAuth(profile);
    }
    async loginAdminWithGoogle(idToken) {
        const profile = await this.oauthService.verifyGoogleIdToken(idToken);
        let user = await this.prisma.user.findFirst({
            where: {
                authProvider: client_1.AuthProvider.GOOGLE,
                providerId: profile.providerId,
            },
        });
        if (!user) {
            user = await this.prisma.user.findUnique({
                where: { email: profile.email },
            });
            if (user) {
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        authProvider: client_1.AuthProvider.GOOGLE,
                        providerId: profile.providerId,
                        avatarUrl: user.avatarUrl ?? profile.avatarUrl,
                    },
                });
            }
        }
        else if (profile.avatarUrl && !user.avatarUrl) {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: { avatarUrl: profile.avatarUrl },
            });
        }
        if (!user) {
            throw new common_1.ForbiddenException('Aucun compte backoffice associé à cet email Google');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException(auth_constants_1.ACCOUNT_DELETED_ERROR);
        }
        const full = await this.loadAdminUser(user.id);
        if (!full || !this.canAccessBackoffice(full)) {
            throw new common_1.ForbiddenException('Accès réservé aux utilisateurs du backoffice DropOne');
        }
        return this.buildAuthResponse(full);
    }
    async loginWithApple(idToken, firstName, lastName) {
        const profile = await this.oauthService.verifyAppleIdToken(idToken, firstName, lastName);
        return this.authenticateWithOAuth(profile);
    }
    async getMe(userId) {
        const user = await this.loadAdminUser(userId);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException(user && !user.isActive ? auth_constants_1.ACCOUNT_DELETED_ERROR : 'Session invalide');
        }
        return this.toPublicUser(user);
    }
    async getAdminMe(userId) {
        const user = await this.loadAdminUser(userId);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException(user && !user.isActive ? auth_constants_1.ACCOUNT_DELETED_ERROR : 'Session invalide');
        }
        if (!this.canAccessBackoffice(user)) {
            throw new common_1.ForbiddenException('Accès réservé aux utilisateurs du backoffice DropOne');
        }
        return this.toPublicUser(user);
    }
    refresh() {
        return { message: 'refresh' };
    }
    logout() {
        return { message: 'logout' };
    }
    async forgotPassword(dto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) {
            throw new common_1.NotFoundException('Aucun compte DropOne n’est associé à cet e-mail');
        }
        if (!user.passwordHash) {
            throw new common_1.BadRequestException(this.oauthOnlyMessage(user.authProvider));
        }
        try {
            await this.prisma.passwordResetToken.deleteMany({
                where: { userId: user.id, usedAt: null },
            });
            const token = (0, crypto_1.randomBytes)(32).toString('hex');
            const tokenHash = this.hashResetToken(token);
            await this.prisma.passwordResetToken.create({
                data: {
                    userId: user.id,
                    tokenHash,
                    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
                },
            });
            await this.mailService.sendResetPasswordEmail({
                to: user.email,
                firstName: user.firstName,
                resetUrl: this.getResetPasswordUrl(token),
            });
        }
        catch (error) {
            this.logger.error('forgotPassword failed', error);
            throw new common_1.ServiceUnavailableException('Impossible d’envoyer l’e-mail pour le moment. Réessayez plus tard.');
        }
        return {
            message: 'Un e-mail de réinitialisation a été envoyé',
        };
    }
    async getValidResetToken(rawToken) {
        const token = rawToken.trim();
        if (!token)
            return null;
        try {
            const record = await this.prisma.passwordResetToken.findUnique({
                where: { tokenHash: this.hashResetToken(token) },
            });
            if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
                return null;
            }
            return record;
        }
        catch (error) {
            this.logger.error('getValidResetToken failed', error);
            return null;
        }
    }
    async resetPassword(dto) {
        const record = await this.getValidResetToken(dto.token);
        if (!record) {
            throw new common_1.BadRequestException('Ce lien de réinitialisation est invalide ou a expiré');
        }
        const password = dto.password.trim();
        if (password.length < 8) {
            throw new common_1.BadRequestException('Le mot de passe doit contenir au moins 8 caractères');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: record.userId },
                data: { passwordHash },
            }),
            this.prisma.passwordResetToken.update({
                where: { id: record.id },
                data: { usedAt: new Date() },
            }),
            this.prisma.passwordResetToken.deleteMany({
                where: {
                    userId: record.userId,
                    id: { not: record.id },
                    usedAt: null,
                },
            }),
        ]);
        return { message: 'Mot de passe mis à jour' };
    }
    getResetPasswordUrl(token) {
        const base = this.configService
            .get('wallet.appPublicUrl', 'https://api.dropone.pro')
            .replace(/\/$/, '');
        return `${base}/reset-password?token=${encodeURIComponent(token)}`;
    }
    hashResetToken(token) {
        return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    }
    async authenticateLocal(dto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException(auth_constants_1.ACCOUNT_DELETED_ERROR);
        }
        if (!user.passwordHash) {
            throw new common_1.UnauthorizedException(this.oauthOnlyMessage(user.authProvider));
        }
        const isValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        return user;
    }
    async authenticateWithOAuth(profile) {
        let user = await this.prisma.user.findFirst({
            where: {
                authProvider: profile.provider,
                providerId: profile.providerId,
            },
        });
        if (!user) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email: profile.email },
            });
            if (existingEmail) {
                throw new common_1.ConflictException('Un compte existe déjà avec cet email. Connectez-vous avec votre méthode habituelle.');
            }
            user = await this.prisma.user.create({
                data: {
                    email: profile.email,
                    authProvider: profile.provider,
                    providerId: profile.providerId,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    avatarUrl: profile.avatarUrl,
                },
            });
            await this.linkPendingInvites(user.id, profile.email);
        }
        else if (profile.avatarUrl && !user.avatarUrl) {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: { avatarUrl: profile.avatarUrl },
            });
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException(auth_constants_1.ACCOUNT_DELETED_ERROR);
        }
        const full = await this.loadAdminUser(user.id);
        return this.buildAuthResponse(full);
    }
    async linkPendingInvites(userId, email) {
        await this.prisma.teamInvite.updateMany({
            where: {
                email,
                status: client_1.TeamInviteStatus.PENDING,
                inviteeUserId: null,
            },
            data: { inviteeUserId: userId },
        });
    }
    async loadAdminUser(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                adminRole: {
                    include: {
                        permissions: {
                            include: { permission: true },
                        },
                    },
                },
            },
        });
    }
    canAccessBackoffice(user) {
        if (!user?.isActive)
            return false;
        return Boolean(user.adminRoleId) || user.role === client_1.UserRole.ADMIN;
    }
    oauthOnlyMessage(provider) {
        switch (provider) {
            case client_1.AuthProvider.GOOGLE:
                return 'Ce compte utilise Google. Connectez-vous avec Google.';
            case client_1.AuthProvider.APPLE:
                return 'Ce compte utilise Apple. Connectez-vous avec Apple.';
            default:
                return 'Email ou mot de passe incorrect';
        }
    }
    buildAuthResponse(user) {
        const accessToken = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }, {
            secret: this.configService.get('jwt.secret', 'change-me'),
            expiresIn: this.configService.get('jwt.expiresIn', '7d'),
        });
        return {
            accessToken,
            user: this.toPublicUser(user),
        };
    }
    toPublicUser(user) {
        const adminRole = 'adminRole' in user && user.adminRole
            ? { id: user.adminRole.id, name: user.adminRole.name }
            : null;
        let permissions = [];
        if ('adminRole' in user && user.adminRole) {
            permissions = user.adminRole.permissions.map((item) => item.permission.key);
        }
        if (user.role === client_1.UserRole.ADMIN && !('adminRoleId' in user ? user.adminRoleId : null)) {
            permissions = ['*'];
        }
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            role: user.role,
            adminRole,
            permissions,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        oauth_service_1.OAuthService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map