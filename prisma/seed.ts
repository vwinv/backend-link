import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  OfferAudience,
  OfferBillingType,
  PrismaClient,
} from '@prisma/client';

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
  hasPortfolio: boolean;
  hasWallet: boolean;
  hasAnalytics: boolean;
  hasVisitorInsights: boolean;
  hasSocialLinks: boolean;
  maxAiScans: number;
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
} as const;

const premiumPlusFlags = {
  ...personalPremiumFlags,
  hasVisitorInsights: true,
} as const;

const offers: OfferSeed[] = [
  {
    id: 'offer_link_premium',
    title: 'DropOne Premium',
    slug: 'link-premium',
    subtitle: 'Carte personnalisée, wallet, stats et réseaux',
    audience: OfferAudience.PERSONAL,
    ...personalPremiumFlags,
    hasVisitorInsights: false,
    maxAiScans: 5,
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
    subtitle: 'Jusqu’à 10 membres · Premium Plus pour l’équipe',
    audience: OfferAudience.TEAM,
    canCustomize: true,
    maxTeamMembers: 10,
    hasPortfolio: true,
    hasWallet: true,
    hasAnalytics: true,
    hasVisitorInsights: true,
    hasSocialLinks: true,
    maxAiScans: -1,
    sortOrder: 3,
    prices: [
      {
        id: 'price_link_premium_team_monthly',
        billingType: OfferBillingType.MONTHLY,
        priceAmount: 7000,
        sortOrder: 1,
      },
      {
        id: 'price_link_premium_team_yearly',
        billingType: OfferBillingType.YEARLY,
        priceAmount: 60000,
        priceLabel: '60 000 FCFA / an',
        discountPercent: 40,
        badgeLabel: 'Populaire',
        isPopular: true,
        sortOrder: 2,
      },
      {
        id: 'price_link_premium_team_lifetime',
        billingType: OfferBillingType.LIFETIME,
        priceAmount: 149000,
        sortOrder: 3,
      },
    ],
  },
  {
    id: 'offer_link_business',
    title: 'DropOne Business',
    slug: 'link-entreprise-business',
    subtitle: 'Membres illimités · tableau de bord web (bientôt)',
    audience: OfferAudience.TEAM,
    canCustomize: true,
    maxTeamMembers: -1,
    hasPortfolio: true,
    hasWallet: true,
    hasAnalytics: true,
    hasVisitorInsights: true,
    hasSocialLinks: true,
    maxAiScans: -1,
    sortOrder: 4,
    prices: [
      {
        id: 'price_link_business_monthly',
        billingType: OfferBillingType.MONTHLY,
        priceAmount: 15000,
        sortOrder: 1,
      },
      {
        id: 'price_link_business_yearly',
        billingType: OfferBillingType.YEARLY,
        priceAmount: 120000,
        priceLabel: '120 000 FCFA / an',
        discountPercent: 40,
        badgeLabel: 'Populaire',
        isPopular: true,
        sortOrder: 2,
      },
      {
        id: 'price_link_business_lifetime',
        billingType: OfferBillingType.LIFETIME,
        priceAmount: 299000,
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
        hasPortfolio: offer.hasPortfolio,
        hasWallet: offer.hasWallet,
        hasAnalytics: offer.hasAnalytics,
        hasVisitorInsights: offer.hasVisitorInsights,
        hasSocialLinks: offer.hasSocialLinks,
        maxAiScans: offer.maxAiScans,
        sortOrder: offer.sortOrder,
        isActive: true,
      },
      create: {
        id: offer.id,
        title: offer.title,
        slug: offer.slug,
        subtitle: offer.subtitle ?? null,
        audience: offer.audience,
        canCustomize: offer.canCustomize,
        maxTeamMembers: offer.maxTeamMembers,
        hasPortfolio: offer.hasPortfolio,
        hasWallet: offer.hasWallet,
        hasAnalytics: offer.hasAnalytics,
        hasVisitorInsights: offer.hasVisitorInsights,
        hasSocialLinks: offer.hasSocialLinks,
        maxAiScans: offer.maxAiScans,
        sortOrder: offer.sortOrder,
        isActive: true,
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

  console.log(`✔ ${offers.length} offres configurées (Free = sans abonnement)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
