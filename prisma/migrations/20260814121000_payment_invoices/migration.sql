-- Factures espace entreprise
CREATE TYPE "InvoiceStatus" AS ENUM ('PAID', 'PENDING', 'FAILED', 'REFUNDED');

CREATE TABLE "payment_invoices" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    "subscriptionId" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'FCFA',
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PAID',
    "description" TEXT,
    "offerSlug" TEXT,
    "billingType" TEXT,
    "seats" INTEGER,
    "provider" TEXT,
    "providerInvoiceId" TEXT,
    "lines" JSONB NOT NULL DEFAULT '[]',
    "dueAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_invoices_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payment_invoices_number_key" ON "payment_invoices"("number");
CREATE UNIQUE INDEX "payment_invoices_providerInvoiceId_key" ON "payment_invoices"("providerInvoiceId");
CREATE INDEX "payment_invoices_userId_createdAt_idx" ON "payment_invoices"("userId", "createdAt");
CREATE INDEX "payment_invoices_teamId_createdAt_idx" ON "payment_invoices"("teamId", "createdAt");
CREATE INDEX "payment_invoices_status_dueAt_idx" ON "payment_invoices"("status", "dueAt");

ALTER TABLE "payment_invoices"
ADD CONSTRAINT "payment_invoices_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "payment_invoices"
ADD CONSTRAINT "payment_invoices_teamId_fkey"
FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payment_invoices"
ADD CONSTRAINT "payment_invoices_subscriptionId_fkey"
FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
