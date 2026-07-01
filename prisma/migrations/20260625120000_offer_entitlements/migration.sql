-- CreateEnum
CREATE TYPE "OfferAudience" AS ENUM ('PERSONAL', 'TEAM');

-- AlterTable premium_offers
ALTER TABLE "premium_offers"
ADD COLUMN "audience" "OfferAudience" NOT NULL DEFAULT 'PERSONAL',
ADD COLUMN "canCustomize" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "maxTeamMembers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "hasPortfolio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "maxAiScans" INTEGER NOT NULL DEFAULT 0;

-- AlterTable subscriptions
ALTER TABLE "subscriptions"
ADD COLUMN "offerId" TEXT;

ALTER TABLE "subscriptions"
ADD CONSTRAINT "subscriptions_offerId_fkey"
FOREIGN KEY ("offerId") REFERENCES "premium_offers"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
