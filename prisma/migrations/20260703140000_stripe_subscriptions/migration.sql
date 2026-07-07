-- AlterTable
ALTER TABLE "users" ADD COLUMN "stripeCustomerId" TEXT;

-- AlterTable
ALTER TABLE "premium_offer_prices" ADD COLUMN "stripePriceId" TEXT;

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN "stripeSubscriptionId" TEXT;
ALTER TABLE "subscriptions" ADD COLUMN "stripeCheckoutSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "users"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");
