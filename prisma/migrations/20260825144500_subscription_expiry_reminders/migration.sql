-- Rappels d’expiration d’abonnement (J-5), une fois par période.
ALTER TABLE "subscriptions" ADD COLUMN "expiryReminderSentAt" TIMESTAMP(3);
