-- Distinguish MEMBER cards from PROFESSIONAL (owner) cards.
ALTER TYPE "CardKind" ADD VALUE IF NOT EXISTS 'MEMBER';

-- Drop one-card-per-kind constraint (MEMBER can be multiple, one per team).
DROP INDEX IF EXISTS "business_cards_ownerId_kind_key";

-- One PERSONAL card per user.
CREATE UNIQUE INDEX IF NOT EXISTS "business_cards_one_personal"
  ON "business_cards" ("ownerId")
  WHERE kind = 'PERSONAL';

-- One PROFESSIONAL (owner) card per user.
CREATE UNIQUE INDEX IF NOT EXISTS "business_cards_one_professional"
  ON "business_cards" ("ownerId")
  WHERE kind = 'PROFESSIONAL';

-- One MEMBER card per user+team.
CREATE UNIQUE INDEX IF NOT EXISTS "business_cards_one_member_per_team"
  ON "business_cards" ("ownerId", "teamId")
  WHERE kind = 'MEMBER' AND "teamId" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "business_cards_ownerId_kind_idx"
  ON "business_cards" ("ownerId", "kind");
