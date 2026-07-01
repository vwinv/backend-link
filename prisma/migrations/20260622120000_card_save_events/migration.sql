-- Enregistrements publics (vCard, page web) pour les statistiques « Enregistrées ».

CREATE TABLE "card_save_events" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "userId" TEXT,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_save_events_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "card_save_events" ADD CONSTRAINT "card_save_events_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "business_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "card_save_events" ADD CONSTRAINT "card_save_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
