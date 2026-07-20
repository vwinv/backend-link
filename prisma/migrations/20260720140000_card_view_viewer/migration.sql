-- AlterTable
ALTER TABLE "card_views" ADD COLUMN IF NOT EXISTS "viewerUserId" TEXT;
ALTER TABLE "card_views" ADD COLUMN IF NOT EXISTS "source" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "card_views_cardId_viewedAt_idx" ON "card_views"("cardId", "viewedAt");
CREATE INDEX IF NOT EXISTS "card_views_viewerUserId_idx" ON "card_views"("viewerUserId");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'card_views_viewerUserId_fkey'
  ) THEN
    ALTER TABLE "card_views"
      ADD CONSTRAINT "card_views_viewerUserId_fkey"
      FOREIGN KEY ("viewerUserId") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
