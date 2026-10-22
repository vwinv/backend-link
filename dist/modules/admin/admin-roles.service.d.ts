import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthUserPayload } from '../auth/decorators/current-user.decorator';
import { CreateAdminRoleDto } from './dto/create-admin-role.dto';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto';
export declare class AdminRolesService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    syncPermissionsCatalog(): Promise<void>;
    listPermissions(): {
        modules: {
            key: "subscriptions" | "notifications" | "roles" | "dashboard" | "backoffice_users" | "clients" | "support" | "app_update";
            label: "Notifications" | "Tableau de bord" | "Utilisateurs backoffice" | "Rôles & permissions" | "Clients" | "Abonnements & offres" | "Support" | "Mise à jour app";
            label: "Tableau de bord" | "Utilisateurs backoffice" | "Rôles & permissions" | "Clients" | "Abonnements & offres" | "Notifications" | "Support" | "Mise à jour app";
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
                readonly key: "clients.delete";
                readonly module: "clients";
                readonly action: "delete";
                readonly label: "Supprimer un client app";
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
                readonly label: "Modifier une offre, un tarif ou un abonnement";
            } | {
                readonly key: "subscriptions.delete";
                readonly module: "subscriptions";
                readonly action: "delete";
                readonly label: "Supprimer une offre, un tarif ou un abonnement";
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
            } | {
                readonly key: "app_update.view";
                readonly module: "app_update";
                readonly action: "view";
                readonly label: "Voir la config de mise à jour app";
            } | {
                readonly key: "app_update.update";
                readonly module: "app_update";
                readonly action: "update";
                readonly label: "Modifier la config de mise à jour app";
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
    findOne(id: string): Promise<{
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
    create(dto: CreateAdminRoleDto, actor: AuthUserPayload): Promise<{
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
    update(id: string, dto: UpdateAdminRoleDto, actor: AuthUserPayload): Promise<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
    private assertCanAssignPermissions;
    private resolvePermissionIds;
    private toRoleDto;
}
