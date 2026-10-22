-- Contenu saisi dans l'éditeur du portfolio.

ALTER TABLE "portfolios" ADD COLUMN "photoUrl" TEXT;
ALTER TABLE "portfolios" ADD COLUMN "displayFirstName" TEXT;
ALTER TABLE "portfolios" ADD COLUMN "displayLastName" TEXT;
ALTER TABLE "portfolios" ADD COLUMN "age" INTEGER;
ALTER TABLE "portfolios" ADD COLUMN "displayPhone" TEXT;
ALTER TABLE "portfolios" ADD COLUMN "displayAddress" TEXT;
ALTER TABLE "portfolios" ADD COLUMN "hidePersonalDetails" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "portfolios" ADD COLUMN "profileCustomized" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "portfolios" ADD COLUMN "content" JSONB NOT NULL DEFAULT '{}';
