-- Clics « Voir mon portfolio » pour les statistiques du portfolio.

CREATE TABLE "portfolio_click_events" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_click_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "portfolio_click_events_cardId_createdAt_idx" ON "portfolio_click_events"("cardId", "createdAt");

ALTER TABLE "portfolio_click_events" ADD CONSTRAINT "portfolio_click_events_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "business_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
