-- Visites du lien public du portfolio.

CREATE TABLE "portfolio_visit_events" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_visit_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "portfolio_visit_events_cardId_createdAt_idx" ON "portfolio_visit_events"("cardId", "createdAt");

ALTER TABLE "portfolio_visit_events" ADD CONSTRAINT "portfolio_visit_events_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "business_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
