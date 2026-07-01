"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
}
const prisma = new client_1.PrismaClient({
    adapter: new adapter_pg_1.PrismaPg({ connectionString }),
});
const offers = [
    {
        id: 'offer_link_premium',
        title: 'Link Premium',
        slug: 'link-premium',
        subtitle: 'Carte personnelle enrichie',
        audience: client_1.OfferAudience.PERSONAL,
        canCustomize: true,
        maxTeamMembers: 0,
        hasPortfolio: true,
        maxAiScans: -1,
        sortOrder: 1,
        prices: [
            {
                id: 'price_link_premium_monthly',
                billingType: client_1.OfferBillingType.MONTHLY,
                priceAmount: 4000,
                sortOrder: 1,
            },
            {
                id: 'price_link_premium_yearly',
                billingType: client_1.OfferBillingType.YEARLY,
                priceAmount: 36000,
                priceLabel: '36 000 FCFA / an',
                discountPercent: 40,
                badgeLabel: 'Populaire',
                isPopular: true,
                sortOrder: 2,
            },
            {
                id: 'price_link_premium_lifetime',
                billingType: client_1.OfferBillingType.LIFETIME,
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
        audience: client_1.OfferAudience.TEAM,
        canCustomize: true,
        maxTeamMembers: 5,
        hasPortfolio: true,
        maxAiScans: -1,
        sortOrder: 2,
        prices: [
            {
                id: 'price_link_premium_team_monthly',
                billingType: client_1.OfferBillingType.MONTHLY,
                priceAmount: 7000,
                sortOrder: 1,
            },
            {
                id: 'price_link_premium_team_yearly',
                billingType: client_1.OfferBillingType.YEARLY,
                priceAmount: 60000,
                priceLabel: '60 000 FCFA / an',
                discountPercent: 40,
                badgeLabel: 'Populaire',
                isPopular: true,
                sortOrder: 2,
            },
            {
                id: 'price_link_premium_team_lifetime',
                billingType: client_1.OfferBillingType.LIFETIME,
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
//# sourceMappingURL=seed.js.map