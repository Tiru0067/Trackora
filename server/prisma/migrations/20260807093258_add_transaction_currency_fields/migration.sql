/*
  Warnings:

  - Added the required column `exchangeRate` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalAmount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalCurrency` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "exchangeRate" DECIMAL(14,6) NOT NULL,
ADD COLUMN     "originalAmount" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "originalCurrency" TEXT NOT NULL;
