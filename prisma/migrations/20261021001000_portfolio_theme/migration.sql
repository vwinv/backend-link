-- Style choisi pour le portfolio (modèle + couleur).

ALTER TABLE "portfolios" ADD COLUMN "theme" JSONB NOT NULL DEFAULT '{}';
