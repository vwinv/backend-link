-- Demandes d’inscription (paiement masqué, ex. review App Store).
CREATE TYPE "SubscriptionSignupStatus" AS ENUM ('PENDING', 'CONTACTED', 'CONVERTED', 'CANCELLED');

CREATE TABLE "subscription_signup_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "offerSlug" TEXT NOT NULL,
    "offerTitle" TEXT NOT NULL,
    "billingType" "OfferBillingType" NOT NULL,
    "seats" INTEGER,
    "teamId" TEXT,
    "status" "SubscriptionSignupStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_signup_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "subscription_signup_requests_userId_createdAt_idx"
ON "subscription_signup_requests"("userId", "createdAt");

CREATE INDEX "subscription_signup_requests_status_createdAt_idx"
ON "subscription_signup_requests"("status", "createdAt");

ALTER TABLE "subscription_signup_requests"
ADD CONSTRAINT "subscription_signup_requests_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
