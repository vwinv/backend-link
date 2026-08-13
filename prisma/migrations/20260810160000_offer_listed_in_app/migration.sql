-- Visibilité catalogue app (offre gratuite hors vitrine)
ALTER TABLE "premium_offers"
ADD COLUMN "listedInApp" BOOLEAN NOT NULL DEFAULT true;
