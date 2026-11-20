-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "timezone" TEXT NOT NULL DEFAULT 'Africa/Dakar';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastOpenedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE IF NOT EXISTS "push_program_deliveries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageNumber" INTEGER NOT NULL,
    "family" TEXT NOT NULL,
    "localDate" TEXT NOT NULL,
    "weekKey" TEXT NOT NULL,
    "monthKey" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_program_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "push_program_deliveries_userId_localDate_idx"
  ON "push_program_deliveries"("userId", "localDate");

CREATE INDEX IF NOT EXISTS "push_program_deliveries_userId_messageNumber_weekKey_idx"
  ON "push_program_deliveries"("userId", "messageNumber", "weekKey");

CREATE INDEX IF NOT EXISTS "push_program_deliveries_userId_messageNumber_monthKey_idx"
  ON "push_program_deliveries"("userId", "messageNumber", "monthKey");

CREATE INDEX IF NOT EXISTS "push_program_deliveries_userId_family_sentAt_idx"
  ON "push_program_deliveries"("userId", "family", "sentAt");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'push_program_deliveries_userId_fkey'
  ) THEN
    ALTER TABLE "push_program_deliveries"
      ADD CONSTRAINT "push_program_deliveries_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
