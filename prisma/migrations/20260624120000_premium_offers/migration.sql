-- CreateEnum
CREATE TYPE "OfferBillingType" AS ENUM ('MONTHLY', 'YEARLY', 'LIFETIME');

-- CreateTable
CREATE TABLE "premium_offers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subtitle" TEXT,
    "priceLabel" TEXT,
    "priceAmount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'FCFA',
    "billingType" "OfferBillingType" NOT NULL,
    "discountPercent" INTEGER,
    "badgeLabel" TEXT,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "premium_offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "premium_offers_slug_key" ON "premium_offers"("slug");
