-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "NotificationRecurrence" AS ENUM ('ONCE', 'DAILY', 'WEEKLY', 'MONTHLY');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterEnum NotificationCampaignStatus
DO $$ BEGIN
  ALTER TYPE "NotificationCampaignStatus" ADD VALUE IF NOT EXISTS 'SCHEDULED';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "NotificationCampaignStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "notification_campaigns"
  ADD COLUMN IF NOT EXISTS "scheduledAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "recurrence" "NotificationRecurrence" NOT NULL DEFAULT 'ONCE',
  ADD COLUMN IF NOT EXISTS "recurrenceEndsAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "maxOccurrences" INTEGER,
  ADD COLUMN IF NOT EXISTS "occurrenceCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notification_campaigns_status_scheduledAt_idx"
  ON "notification_campaigns"("status", "scheduledAt");
