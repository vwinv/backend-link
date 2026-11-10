-- CreateEnum
CREATE TYPE "PointsLedgerReason" AS ENUM ('REFERRAL_SUBSCRIBE', 'CARD_VISIT', 'PURCHASE', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "PointsProductType" AS ENUM ('SUBSCRIPTION', 'CARD_THEME');

-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "referralCode" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "referredByUserId" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "user_points_accounts" (
    "userId" TEXT NOT NULL,
    "balanceTenths" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_points_accounts_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "points_ledger_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amountTenths" INTEGER NOT NULL,
    "reason" "PointsLedgerReason" NOT NULL,
    "productType" "PointsProductType",
    "productRef" TEXT,
    "relatedUserId" TEXT,
    "cardViewId" TEXT,
    "subscriptionId" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "points_ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_referralCode_key" ON "users"("referralCode");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "users_referredByUserId_idx" ON "users"("referredByUserId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "points_ledger_entries_cardViewId_key" ON "points_ledger_entries"("cardViewId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "points_ledger_entries_subscriptionId_key" ON "points_ledger_entries"("subscriptionId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "points_ledger_entries_userId_createdAt_idx" ON "points_ledger_entries"("userId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "points_ledger_entries_reason_createdAt_idx" ON "points_ledger_entries"("reason", "createdAt");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "users" ADD CONSTRAINT "users_referredByUserId_fkey"
    FOREIGN KEY ("referredByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "user_points_accounts" ADD CONSTRAINT "user_points_accounts_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "points_ledger_entries" ADD CONSTRAINT "points_ledger_entries_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
