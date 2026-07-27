-- Feature flags d'offres (wallet, analytics, visiteurs, réseaux)
ALTER TABLE "premium_offers"
ADD COLUMN "hasWallet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "hasAnalytics" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "hasVisitorInsights" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "hasSocialLinks" BOOLEAN NOT NULL DEFAULT false;

-- Offres déjà actives : activer les flags alignés sur l'ancien comportement « tout Premium »
UPDATE "premium_offers"
SET
  "hasWallet" = true,
  "hasAnalytics" = true,
  "hasVisitorInsights" = true,
  "hasSocialLinks" = true
WHERE "isActive" = true
  AND ("canCustomize" = true OR "hasPortfolio" = true OR "maxAiScans" <> 0);
