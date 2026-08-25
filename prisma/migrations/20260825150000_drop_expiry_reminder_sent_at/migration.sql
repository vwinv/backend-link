-- Le rappel J-5 a été retiré : plus besoin de ce marqueur.
ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "expiryReminderSentAt";
