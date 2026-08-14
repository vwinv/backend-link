import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  AuthProvider,
  OfferAudience,
  OfferBillingType,
  PrismaClient,
  UserRole,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

type PriceSeed = {
  id: string;
  billingType: OfferBillingType;
  priceAmount: number;
  /** Prix par utilisateur (offres TEAM). Si défini → montant = pricePerSeat × sièges. */
  pricePerSeat?: number;
  priceLabel?: string;
  discountPercent?: number;
  badgeLabel?: string;
  isPopular?: boolean;
  sortOrder: number;
  stripePriceId?: string;
};

const stripePriceIds: Record<string, string | undefined> = {
  price_link_premium_monthly: process.env.STRIPE_PRICE_LINK_PREMIUM_MONTHLY,
  price_link_premium_yearly: process.env.STRIPE_PRICE_LINK_PREMIUM_YEARLY,
  price_link_premium_lifetime: process.env.STRIPE_PRICE_LINK_PREMIUM_LIFETIME,
  price_link_premium_plus_monthly:
    process.env.STRIPE_PRICE_LINK_PREMIUM_PLUS_MONTHLY,
  price_link_premium_plus_yearly:
    process.env.STRIPE_PRICE_LINK_PREMIUM_PLUS_YEARLY,
  price_link_premium_plus_lifetime:
    process.env.STRIPE_PRICE_LINK_PREMIUM_PLUS_LIFETIME,
  price_link_premium_team_monthly:
    process.env.STRIPE_PRICE_LINK_PREMIUM_TEAM_MONTHLY,
  price_link_premium_team_yearly:
    process.env.STRIPE_PRICE_LINK_PREMIUM_TEAM_YEARLY,
  price_link_premium_team_lifetime:
    process.env.STRIPE_PRICE_LINK_PREMIUM_TEAM_LIFETIME,
  price_link_business_monthly: process.env.STRIPE_PRICE_LINK_BUSINESS_MONTHLY,
  price_link_business_yearly: process.env.STRIPE_PRICE_LINK_BUSINESS_YEARLY,
  price_link_business_lifetime:
    process.env.STRIPE_PRICE_LINK_BUSINESS_LIFETIME,
};

type OfferSeed = {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  audience: OfferAudience;
  canCustomize: boolean;
  maxTeamMembers: number;
  minSeats?: number;
  hasPortfolio: boolean;
  hasWallet: boolean;
  hasAnalytics: boolean;
  hasVisitorInsights: boolean;
  hasSocialLinks: boolean;
  maxAiScans: number;
  /** -1 = partages illimités */
  maxShares: number;
  listedInApp?: boolean;
  sortOrder: number;
  prices: PriceSeed[];
};

const personalPremiumFlags = {
  canCustomize: true,
  maxTeamMembers: 0,
  hasPortfolio: true,
  hasWallet: true,
  hasAnalytics: true,
  hasSocialLinks: true,
  maxShares: -1,
} as const;

const premiumPlusFlags = {
  ...personalPremiumFlags,
  hasVisitorInsights: true,
} as const;

const offers: OfferSeed[] = [
  {
    id: 'offer_link_free',
    title: 'DropOne Gratuit',
    slug: 'link-free',
    subtitle: 'Offre par défaut sans abonnement (hors catalogue app)',
    audience: OfferAudience.PERSONAL,
    canCustomize: false,
    maxTeamMembers: 0,
    minSeats: 1,
    hasPortfolio: false,
    hasWallet: false,
    hasAnalytics: false,
    hasVisitorInsights: false,
    hasSocialLinks: false,
    maxAiScans: 0,
    maxShares: Number(process.env.FREE_MAX_SHARES ?? 10),
    listedInApp: false,
    sortOrder: 0,
    prices: [],
  },
  {
    id: 'offer_link_premium',
    title: 'DropOne Premium',
    slug: 'link-premium',
    subtitle: 'Carte personnalisée, wallet, stats et réseaux',
    audience: OfferAudience.PERSONAL,
    ...personalPremiumFlags,
    hasVisitorInsights: false,
    maxAiScans: 5,
    listedInApp: true,
    sortOrder: 1,
    prices: [
      {
        id: 'price_link_premium_monthly',
        billingType: OfferBillingType.MONTHLY,
        priceAmount: 4000,
        sortOrder: 1,
      },
      {
        id: 'price_link_premium_yearly',
        billingType: OfferBillingType.YEARLY,
        priceAmount: 36000,
        priceLabel: '36 000 FCFA / an',
        discountPercent: 40,
        badgeLabel: 'Populaire',
        isPopular: true,
        sortOrder: 2,
      },
      {
        id: 'price_link_premium_lifetime',
        billingType: OfferBillingType.LIFETIME,
        priceAmount: 99000,
        sortOrder: 3,
      },
    ],
  },
  {
    id: 'offer_link_premium_plus',
    title: 'DropOne Premium Plus',
    slug: 'link-premium-plus',
    subtitle: 'Stats détaillées, visiteurs et scans IA illimités',
    audience: OfferAudience.PERSONAL,
    ...premiumPlusFlags,
    maxAiScans: -1,
    listedInApp: true,
    sortOrder: 2,
    prices: [
      {
        id: 'price_link_premium_plus_monthly',
        billingType: OfferBillingType.MONTHLY,
        priceAmount: 6000,
        sortOrder: 1,
      },
      {
        id: 'price_link_premium_plus_yearly',
        billingType: OfferBillingType.YEARLY,
        priceAmount: 54000,
        priceLabel: '54 000 FCFA / an',
        discountPercent: 40,
        badgeLabel: 'Populaire',
        isPopular: true,
        sortOrder: 2,
      },
      {
        id: 'price_link_premium_plus_lifetime',
        billingType: OfferBillingType.LIFETIME,
        priceAmount: 149000,
        sortOrder: 3,
      },
    ],
  },
  {
    id: 'offer_link_premium_team',
    title: 'DropOne Starter',
    slug: 'link-premium-equipe',
    subtitle: '10 membres inclus - + utilisateurs supplémentaires',
    audience: OfferAudience.TEAM,
    canCustomize: true,
    maxTeamMembers: -1,
    minSeats: 10,
    hasPortfolio: true,
    hasWallet: true,
    hasAnalytics: true,
    hasVisitorInsights: true,
    hasSocialLinks: true,
    maxAiScans: -1,
    maxShares: -1,
    listedInApp: true,
    sortOrder: 3,
    prices: [
      {
        id: 'price_link_premium_team_monthly',
        billingType: OfferBillingType.MONTHLY,
        priceAmount: 700,
        pricePerSeat: 700,
        priceLabel: '700 FCFA / utilisateur / mois',
        sortOrder: 1,
      },
      {
        id: 'price_link_premium_team_yearly',
        billingType: OfferBillingType.YEARLY,
        priceAmount: 6000,
        pricePerSeat: 6000,
        priceLabel: '6 000 FCFA / utilisateur / an',
        discountPercent: 40,
        badgeLabel: 'Populaire',
        isPopular: true,
        sortOrder: 2,
      },
      {
        id: 'price_link_premium_team_lifetime',
        billingType: OfferBillingType.LIFETIME,
        priceAmount: 14900,
        pricePerSeat: 14900,
        priceLabel: '14 900 FCFA / utilisateur (à vie)',
        sortOrder: 3,
      },
    ],
  },
  {
    id: 'offer_link_business',
    title: 'DropOne Business',
    slug: 'link-entreprise-business',
    subtitle: 'Sièges à la carte - espace web /espace_votre-equipe',
    audience: OfferAudience.TEAM,
    canCustomize: true,
    maxTeamMembers: -1,
    minSeats: 5,
    hasPortfolio: true,
    hasWallet: true,
    hasAnalytics: true,
    hasVisitorInsights: true,
    hasSocialLinks: true,
    maxAiScans: -1,
    maxShares: -1,
    listedInApp: true,
    sortOrder: 4,
    prices: [
      {
        id: 'price_link_business_monthly',
        billingType: OfferBillingType.MONTHLY,
        priceAmount: 1500,
        pricePerSeat: 1500,
        priceLabel: '1 500 FCFA / utilisateur / mois',
        sortOrder: 1,
      },
      {
        id: 'price_link_business_yearly',
        billingType: OfferBillingType.YEARLY,
        priceAmount: 12000,
        pricePerSeat: 12000,
        priceLabel: '12 000 FCFA / utilisateur / an',
        discountPercent: 40,
        badgeLabel: 'Populaire',
        isPopular: true,
        sortOrder: 2,
      },
      {
        id: 'price_link_business_lifetime',
        billingType: OfferBillingType.LIFETIME,
        priceAmount: 29900,
        pricePerSeat: 29900,
        priceLabel: '29 900 FCFA / utilisateur (à vie)',
        sortOrder: 3,
      },
    ],
  },
];

async function main() {
  for (const offer of offers) {
    await prisma.premiumOffer.upsert({
      where: { slug: offer.slug },
      update: {
        title: offer.title,
        subtitle: offer.subtitle ?? null,
        audience: offer.audience,
        canCustomize: offer.canCustomize,
        maxTeamMembers: offer.maxTeamMembers,
        minSeats: offer.minSeats ?? 1,
        hasPortfolio: offer.hasPortfolio,
        hasWallet: offer.hasWallet,
        hasAnalytics: offer.hasAnalytics,
        hasVisitorInsights: offer.hasVisitorInsights,
        hasSocialLinks: offer.hasSocialLinks,
        maxAiScans: offer.maxAiScans,
        maxShares: offer.maxShares,
        sortOrder: offer.sortOrder,
        isActive: true,
        listedInApp: offer.listedInApp ?? true,
      },
      create: {
        id: offer.id,
        title: offer.title,
        slug: offer.slug,
        subtitle: offer.subtitle ?? null,
        audience: offer.audience,
        canCustomize: offer.canCustomize,
        maxTeamMembers: offer.maxTeamMembers,
        minSeats: offer.minSeats ?? 1,
        hasPortfolio: offer.hasPortfolio,
        hasWallet: offer.hasWallet,
        hasAnalytics: offer.hasAnalytics,
        hasVisitorInsights: offer.hasVisitorInsights,
        hasSocialLinks: offer.hasSocialLinks,
        maxAiScans: offer.maxAiScans,
        maxShares: offer.maxShares,
        sortOrder: offer.sortOrder,
        isActive: true,
        listedInApp: offer.listedInApp ?? true,
      },
    });

    const savedOffer = await prisma.premiumOffer.findUniqueOrThrow({
      where: { slug: offer.slug },
    });

    for (const price of offer.prices) {
      await prisma.premiumOfferPrice.upsert({
        where: {
          offerId_billingType: {
            offerId: savedOffer.id,
            billingType: price.billingType,
          },
        },
        update: {
          priceAmount: price.priceAmount,
          pricePerSeat: price.pricePerSeat ?? null,
          priceLabel: price.priceLabel ?? null,
          discountPercent: price.discountPercent ?? null,
          badgeLabel: price.badgeLabel ?? null,
          isPopular: price.isPopular ?? false,
          sortOrder: price.sortOrder,
          isActive: true,
          stripePriceId:
            stripePriceIds[price.id]?.trim() ||
            price.stripePriceId?.trim() ||
            null,
        },
        create: {
          id: price.id,
          offerId: savedOffer.id,
          billingType: price.billingType,
          priceAmount: price.priceAmount,
          pricePerSeat: price.pricePerSeat ?? null,
          priceLabel: price.priceLabel ?? null,
          discountPercent: price.discountPercent ?? null,
          badgeLabel: price.badgeLabel ?? null,
          isPopular: price.isPopular ?? false,
          sortOrder: price.sortOrder,
          isActive: true,
          stripePriceId:
            stripePriceIds[price.id]?.trim() ||
            price.stripePriceId?.trim() ||
            null,
        },
      });
    }
  }

  console.log(
    `✔ ${offers.length} offres configurées (dont gratuite link-free hors catalogue)`,
  );

  await seedAdminRbac();
  await seedAdminUser();
}

async function seedAdminRbac() {
  const { ADMIN_PERMISSION_CATALOG, SUPER_ADMIN_ROLE_NAME } = await import(
    '../src/modules/admin/admin-permissions.catalog'
  );

  for (const permission of ADMIN_PERMISSION_CATALOG) {
    await prisma.adminPermission.upsert({
      where: { key: permission.key },
      update: {
        module: permission.module,
        action: permission.action,
        label: permission.label,
      },
      create: {
        key: permission.key,
        module: permission.module,
        action: permission.action,
        label: permission.label,
      },
    });
  }

  const allPermissions = await prisma.adminPermission.findMany();
  const superAdmin = await prisma.adminRole.upsert({
    where: { name: SUPER_ADMIN_ROLE_NAME },
    update: {
      description: 'Accès complet au backoffice',
      isSystem: true,
    },
    create: {
      name: SUPER_ADMIN_ROLE_NAME,
      description: 'Accès complet au backoffice',
      isSystem: true,
    },
  });

  await prisma.adminRolePermission.deleteMany({
    where: { roleId: superAdmin.id },
  });
  await prisma.adminRolePermission.createMany({
    data: allPermissions.map((permission) => ({
      roleId: superAdmin.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  console.log(
    `✔ RBAC backoffice : ${allPermissions.length} permissions, rôle ${SUPER_ADMIN_ROLE_NAME}`,
  );
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!email || !password) {
    console.log(
      'ℹ Admin non créé (définir ADMIN_EMAIL et ADMIN_PASSWORD pour le seed).',
    );
    return;
  }

  const { SUPER_ADMIN_ROLE_NAME } = await import(
    '../src/modules/admin/admin-permissions.catalog'
  );
  const superAdminRole = await prisma.adminRole.findUnique({
    where: { name: SUPER_ADMIN_ROLE_NAME },
  });

  const passwordHash = await bcrypt.hash(password, 10);
  const firstName = process.env.ADMIN_FIRST_NAME?.trim() || 'Admin';
  const lastName = process.env.ADMIN_LAST_NAME?.trim() || 'DropOne';

  await prisma.user.upsert({
    where: { email },
    update: {
      role: UserRole.ADMIN,
      passwordHash,
      authProvider: AuthProvider.LOCAL,
      isActive: true,
      adminRoleId: superAdminRole?.id ?? null,
    },
    create: {
      email,
      passwordHash,
      authProvider: AuthProvider.LOCAL,
      role: UserRole.ADMIN,
      firstName,
      lastName,
      adminRoleId: superAdminRole?.id ?? null,
    },
  });

  console.log(`✔ Compte admin prêt : ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
