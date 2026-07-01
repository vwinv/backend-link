-- CreateEnum
CREATE TYPE "CardKind" AS ENUM ('PERSONAL', 'PROFESSIONAL');

-- AlterTable
ALTER TABLE "business_cards" ADD COLUMN "kind" "CardKind" NOT NULL DEFAULT 'PERSONAL';

-- CreateIndex
CREATE UNIQUE INDEX "business_cards_ownerId_kind_key" ON "business_cards"("ownerId", "kind");
