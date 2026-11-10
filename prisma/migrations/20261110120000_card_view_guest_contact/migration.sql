-- Coordonnées laissées par un visiteur sans compte DropOne
ALTER TABLE "card_views" ADD COLUMN IF NOT EXISTS "guestFirstName" TEXT;
ALTER TABLE "card_views" ADD COLUMN IF NOT EXISTS "guestLastName" TEXT;
ALTER TABLE "card_views" ADD COLUMN IF NOT EXISTS "guestEmail" TEXT;
ALTER TABLE "card_views" ADD COLUMN IF NOT EXISTS "guestPhone" TEXT;
