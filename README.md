# Link Backend

API NestJS pour l'application **Link** — cartes de visite digitales personnalisables avec portfolio, partage et wallet.

## Stack

- **NestJS** — framework API
- **PostgreSQL** — base de données
- **Prisma** — ORM & migrations
- **Swagger** — documentation API (`/docs`)

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env

# 3. Lancer PostgreSQL
npm run db:up

# 4. Générer le client Prisma & appliquer les migrations
npm run prisma:generate
npm run prisma:migrate

# 5. Démarrer le serveur
npm run start:dev
```

- API : `http://localhost:3000/api/v1`
- Swagger : `http://localhost:3000/docs`

## Structure du projet

```
src/
├── config/              # Configuration (env vars)
├── prisma/              # Service Prisma (global)
├── health/              # Health check
└── modules/
    ├── auth/            # Inscription, connexion, JWT
    ├── users/           # Profil utilisateur
    ├── teams/           # Gestion d'équipes
    ├── cards/           # Cartes de visite
    ├── portfolios/      # Portfolio lié aux cartes
    ├── subscriptions/   # Forfaits & abonnements
    ├── sharing/         # Partage public, QR, liens
    └── wallet/          # Apple Wallet / Google Wallet
```

## Modules & endpoints

| Module | Préfixe | Description |
|--------|---------|-------------|
| Auth | `/auth` | register, login, refresh, logout |
| Users | `/users` | profil, mise à jour, suppression |
| Teams | `/teams` | CRUD équipe, membres, rôles |
| Cards | `/cards` | CRUD carte, thème, liens sociaux |
| Portfolios | `/portfolios` | portfolio & projets |
| Subscriptions | `/subscriptions` | forfaits, abonnement, webhook |
| Sharing | `/sharing` | carte publique, QR, partage |
| Wallet | `/wallet` | enregistrement wallet, pass |

## Scripts utiles

```bash
npm run start:dev       # Dev avec hot-reload
npm run build           # Build production
npm run prisma:studio   # Interface visuelle BDD
npm run db:up           # Démarrer PostgreSQL (Docker)
npm run db:down         # Arrêter PostgreSQL
```
