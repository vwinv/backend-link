-- Identifiant Apple IAP (originalTransactionId) pour lier un abonnement à un achat StoreKit.
ALTER TABLE "subscriptions" ADD COLUMN "appleOriginalTransactionId" TEXT;

CREATE UNIQUE INDEX "subscriptions_appleOriginalTransactionId_key"
ON "subscriptions"("appleOriginalTransactionId");
