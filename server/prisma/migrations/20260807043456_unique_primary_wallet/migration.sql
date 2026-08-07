CREATE UNIQUE INDEX "unique_primary_wallet" ON "Wallet"("userId") WHERE "isPrimary" = true;
