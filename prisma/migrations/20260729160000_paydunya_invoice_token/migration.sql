-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN "paydunyaInvoiceToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_paydunyaInvoiceToken_key" ON "subscriptions"("paydunyaInvoiceToken");
