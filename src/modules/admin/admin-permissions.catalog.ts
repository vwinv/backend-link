export const ADMIN_MODULES = [
  {
    key: 'dashboard',
    label: 'Tableau de bord',
  },
  {
    key: 'backoffice_users',
    label: 'Utilisateurs backoffice',
  },
  {
    key: 'roles',
    label: 'Rôles & permissions',
  },
  {
    key: 'clients',
    label: 'Clients',
  },
  {
    key: 'subscriptions',
    label: 'Abonnements & offres',
  },
  {
    key: 'notifications',
    label: 'Notifications',
  },
  {
    key: 'support',
    label: 'Support',
  },
] as const;

export type AdminModuleKey = (typeof ADMIN_MODULES)[number]['key'];

export const ADMIN_PERMISSION_CATALOG = [
  {
    key: 'dashboard.view',
    module: 'dashboard',
    action: 'view',
    label: 'Voir le tableau de bord',
  },
  {
    key: 'backoffice_users.view',
    module: 'backoffice_users',
    action: 'view',
    label: 'Voir les utilisateurs backoffice',
  },
  {
    key: 'backoffice_users.create',
    module: 'backoffice_users',
    action: 'create',
    label: 'Créer un utilisateur backoffice',
  },
  {
    key: 'backoffice_users.update',
    module: 'backoffice_users',
    action: 'update',
    label: 'Modifier un utilisateur backoffice',
  },
  {
    key: 'roles.view',
    module: 'roles',
    action: 'view',
    label: 'Voir les rôles',
  },
  {
    key: 'roles.create',
    module: 'roles',
    action: 'create',
    label: 'Créer un rôle',
  },
  {
    key: 'roles.update',
    module: 'roles',
    action: 'update',
    label: 'Modifier un rôle',
  },
  {
    key: 'roles.delete',
    module: 'roles',
    action: 'delete',
    label: 'Supprimer un rôle',
  },
  {
    key: 'clients.view',
    module: 'clients',
    action: 'view',
    label: 'Voir les clients app',
  },
  {
    key: 'clients.update',
    module: 'clients',
    action: 'update',
    label: 'Modifier un client app',
  },
  {
    key: 'clients.delete',
    module: 'clients',
    action: 'delete',
    label: 'Supprimer un client app',
  },
  {
    key: 'subscriptions.view',
    module: 'subscriptions',
    action: 'view',
    label: 'Voir les abonnements',
  },
  {
    key: 'subscriptions.create',
    module: 'subscriptions',
    action: 'create',
    label: 'Créer une offre, un tarif ou un abonnement',
  },
  {
    key: 'subscriptions.update',
    module: 'subscriptions',
    action: 'update',
    label: 'Modifier une offre, un tarif ou un abonnement',
  },
  {
    key: 'subscriptions.delete',
    module: 'subscriptions',
    action: 'delete',
    label: 'Supprimer une offre, un tarif ou un abonnement',
  },
  {
    key: 'notifications.view',
    module: 'notifications',
    action: 'view',
    label: 'Voir les campagnes de notifications',
  },
  {
    key: 'notifications.send',
    module: 'notifications',
    action: 'send',
    label: 'Envoyer des notifications ciblées',
  },
  {
    key: 'support.view',
    module: 'support',
    action: 'view',
    label: 'Voir les tickets support',
  },
  {
    key: 'support.reply',
    module: 'support',
    action: 'reply',
    label: 'Répondre aux tickets support',
  },
] as const;

export type AdminPermissionKey =
  (typeof ADMIN_PERMISSION_CATALOG)[number]['key'];

export const SUPER_ADMIN_ROLE_NAME = 'Super Admin';
