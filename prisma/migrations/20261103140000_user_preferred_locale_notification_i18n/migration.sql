-- Langue préférée de l'utilisateur (notifications in-app + push).
ALTER TABLE "users" ADD COLUMN "preferredLocale" TEXT NOT NULL DEFAULT 'fr';

-- Variantes anglaises des campagnes admin.
ALTER TABLE "notification_campaigns" ADD COLUMN "titleEn" TEXT;
ALTER TABLE "notification_campaigns" ADD COLUMN "bodyEn" TEXT;
