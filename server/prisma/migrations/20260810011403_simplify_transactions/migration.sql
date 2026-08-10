/*
  Warnings:

  - You are about to drop the column `exchangeRate` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `originalAmount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `originalCurrency` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "exchangeRate",
DROP COLUMN "originalAmount",
DROP COLUMN "originalCurrency";
