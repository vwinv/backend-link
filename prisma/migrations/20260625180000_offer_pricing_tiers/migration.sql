-- Détache les abonnements avant restructuration
UPDATE "subscriptions" SET "offerId" = NULL WHERE "offerId" IS NOT NULL;

-- Supprime les offres seedées (structure historique 1 ligne = 1 tarif)
DELETE FROM "premium_offers";

-- Table des tarifs par offre
CREATE TABLE "premium_offer_prices" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "billingType" "OfferBillingType" NOT NULL,
    "priceLabel" TEXT,
    "priceAmount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'FCFA',
    "discountPercent" INTEGER,
    "badgeLabel" TEXT,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "premium_offer_prices_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "premium_offer_prices_offerId_billingType_key"
ON "premium_offer_prices"("offerId", "billingType");

ALTER TABLE "premium_offer_prices"
ADD CONSTRAINT "premium_offer_prices_offerId_fkey"
FOREIGN KEY ("offerId") REFERENCES "premium_offers"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- L'offre porte les droits, les tarifs sont dans premium_offer_prices
ALTER TABLE "premium_offers" DROP COLUMN "priceLabel";
ALTER TABLE "premium_offers" DROP COLUMN "priceAmount";
ALTER TABLE "premium_offers" DROP COLUMN "currency";
ALTER TABLE "premium_offers" DROP COLUMN "billingType";
ALTER TABLE "premium_offers" DROP COLUMN "discountPercent";
ALTER TABLE "premium_offers" DROP COLUMN "badgeLabel";
ALTER TABLE "premium_offers" DROP COLUMN "isPopular";

ALTER TABLE "subscriptions" ADD COLUMN "offerPriceId" TEXT;

ALTER TABLE "subscriptions"
ADD CONSTRAINT "subscriptions_offerPriceId_fkey"
FOREIGN KEY ("offerPriceId") REFERENCES "premium_offer_prices"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
