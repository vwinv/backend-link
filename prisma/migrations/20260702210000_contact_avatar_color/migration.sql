-- Les couleurs ARGB 32 bits dépassaient la limite INTEGER PostgreSQL (2^31-1).
ALTER TABLE "contacts" ALTER COLUMN "avatarColor" SET DEFAULT 683007;
