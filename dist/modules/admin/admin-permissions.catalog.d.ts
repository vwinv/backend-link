export declare const ADMIN_MODULES: readonly [{
    readonly key: "dashboard";
    readonly label: "Tableau de bord";
}, {
    readonly key: "backoffice_users";
    readonly label: "Utilisateurs backoffice";
}, {
    readonly key: "roles";
    readonly label: "Rôles & permissions";
}, {
    readonly key: "clients";
    readonly label: "Clients";
}, {
    readonly key: "subscriptions";
    readonly label: "Abonnements & offres";
}, {
    readonly key: "notifications";
    readonly label: "Notifications";
}, {
    readonly key: "support";
    readonly label: "Support";
}];
export type AdminModuleKey = (typeof ADMIN_MODULES)[number]['key'];
export declare const ADMIN_PERMISSION_CATALOG: readonly [{
    readonly key: "dashboard.view";
    readonly module: "dashboard";
    readonly action: "view";
    readonly label: "Voir le tableau de bord";
}, {
    readonly key: "backoffice_users.view";
    readonly module: "backoffice_users";
    readonly action: "view";
    readonly label: "Voir les utilisateurs backoffice";
}, {
    readonly key: "backoffice_users.create";
    readonly module: "backoffice_users";
    readonly action: "create";
    readonly label: "Créer un utilisateur backoffice";
}, {
    readonly key: "backoffice_users.update";
    readonly module: "backoffice_users";
    readonly action: "update";
    readonly label: "Modifier un utilisateur backoffice";
}, {
    readonly key: "roles.view";
    readonly module: "roles";
    readonly action: "view";
    readonly label: "Voir les rôles";
}, {
    readonly key: "roles.create";
    readonly module: "roles";
    readonly action: "create";
    readonly label: "Créer un rôle";
}, {
    readonly key: "roles.update";
    readonly module: "roles";
    readonly action: "update";
    readonly label: "Modifier un rôle";
}, {
    readonly key: "roles.delete";
    readonly module: "roles";
    readonly action: "delete";
    readonly label: "Supprimer un rôle";
}, {
    readonly key: "clients.view";
    readonly module: "clients";
    readonly action: "view";
    readonly label: "Voir les clients app";
}, {
    readonly key: "clients.update";
    readonly module: "clients";
    readonly action: "update";
    readonly label: "Modifier un client app";
}, {
    readonly key: "subscriptions.view";
    readonly module: "subscriptions";
    readonly action: "view";
    readonly label: "Voir les abonnements";
}, {
    readonly key: "subscriptions.create";
    readonly module: "subscriptions";
    readonly action: "create";
    readonly label: "Créer une offre, un tarif ou un abonnement";
}, {
    readonly key: "subscriptions.update";
    readonly module: "subscriptions";
    readonly action: "update";
    readonly label: "Modifier les offres et tarifs";
}, {
    readonly key: "subscriptions.delete";
    readonly module: "subscriptions";
    readonly action: "delete";
    readonly label: "Supprimer une offre / un tarif";
}, {
    readonly key: "notifications.view";
    readonly module: "notifications";
    readonly action: "view";
    readonly label: "Voir les campagnes de notifications";
}, {
    readonly key: "notifications.send";
    readonly module: "notifications";
    readonly action: "send";
    readonly label: "Envoyer des notifications ciblées";
}, {
    readonly key: "support.view";
    readonly module: "support";
    readonly action: "view";
    readonly label: "Voir les tickets support";
}, {
    readonly key: "support.reply";
    readonly module: "support";
    readonly action: "reply";
    readonly label: "Répondre aux tickets support";
}];
export type AdminPermissionKey = (typeof ADMIN_PERMISSION_CATALOG)[number]['key'];
export declare const SUPER_ADMIN_ROLE_NAME = "Super Admin";
