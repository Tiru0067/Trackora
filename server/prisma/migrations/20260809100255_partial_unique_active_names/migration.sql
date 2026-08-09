-- DropIndex
DROP INDEX "Category_userId_name_key";

-- DropIndex
DROP INDEX "Wallet_userId_name_key";

CREATE UNIQUE INDEX wallet_user_name_active_unique
ON "Wallet" ("userId", "name")
WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX category_user_name_active_unique
ON "Category" ("userId", "name")
WHERE "deletedAt" IS NULL;
