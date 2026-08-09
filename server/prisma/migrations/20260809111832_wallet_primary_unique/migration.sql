-- Create a partial unique index ensuring only one primary wallet per user
CREATE UNIQUE INDEX wallet_one_primary_per_user
ON "Wallet" ("userId")
WHERE "isPrimary" = true;