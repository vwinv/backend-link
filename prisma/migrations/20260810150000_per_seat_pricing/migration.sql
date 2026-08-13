-- Tarif au siège (offres pro) + sièges achetés
ALTER TABLE "premium_offers"
ADD COLUMN "minSeats" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "premium_offer_prices"
ADD COLUMN "pricePerSeat" DECIMAL(10,2);

ALTER TABLE "subscriptions"
ADD COLUMN "purchasedSeats" INTEGER;
