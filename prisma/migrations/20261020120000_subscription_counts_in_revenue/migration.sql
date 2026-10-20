-- Abonnements de test : exclus du chiffre d'affaires, les accès restent actifs.
ALTER TABLE "subscriptions" ADD COLUMN "countsInRevenue" BOOLEAN NOT NULL DEFAULT true;
