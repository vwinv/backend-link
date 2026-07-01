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
  maxAiScans: number;
  sortOrder: number;
  prices: PriceSeed[];
};

const offers: OfferSeed[] = [
  {
    id: 'offer_link_premium',
    title: 'Link Premium',
    slug: 'link-premium',
    subtitle: 'Carte personnelle enrichie',
    audience: OfferAudience.PERSONAL,
    canCustomize: true,
    maxTeamMembers: 0,
    hasPortfolio: true,
    maxAiScans: -1,
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
    id: 'offer_link_premium_team',
    title: 'Link Premium Équipe',
    slug: 'link-premium-equipe',
    subtitle: 'Espace équipe et cartes professionnelles',
    audience: OfferAudience.TEAM,
    canCustomize: true,
    maxTeamMembers: 5,
    hasPortfolio: true,
    maxAiScans: -1,
    sortOrder: 2,
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
        },
      });
    }
  }

  console.log(`✔ ${offers.length} offres Premium configurées`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
