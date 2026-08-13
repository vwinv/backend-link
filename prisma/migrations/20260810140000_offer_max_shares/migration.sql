-- Quota de partages par offre (-1 = illimité)
ALTER TABLE "premium_offers"
ADD COLUMN "maxShares" INTEGER NOT NULL DEFAULT 10;
