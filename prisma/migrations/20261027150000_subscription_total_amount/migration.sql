-- Montant facturé selon la durée choisie à la création (tarif × nombre de périodes).
ALTER TABLE "subscriptions" ADD COLUMN "totalAmount" DECIMAL(12,2);
