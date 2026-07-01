-- CreateEnum
CREATE TYPE "ContactSource" AS ENUM ('EXCHANGE', 'AI_SCAN');

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "source" "ContactSource" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "jobTitle" TEXT,
    "company" TEXT,
    "linkedCardId" TEXT,
    "scanEventId" TEXT,
    "avatarColor" INTEGER NOT NULL DEFAULT 4278190335,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contacts_scanEventId_key" ON "contacts"("scanEventId");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_userId_linkedCardId_key" ON "contacts"("userId", "linkedCardId");

-- CreateIndex
CREATE INDEX "contacts_userId_createdAt_idx" ON "contacts"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "contacts"
ADD CONSTRAINT "contacts_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts"
ADD CONSTRAINT "contacts_linkedCardId_fkey"
FOREIGN KEY ("linkedCardId") REFERENCES "business_cards"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts"
ADD CONSTRAINT "contacts_scanEventId_fkey"
FOREIGN KEY ("scanEventId") REFERENCES "ai_scan_events"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
