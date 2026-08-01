-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationEmailLastSentAt" TIMESTAMP(3),
ADD COLUMN     "verificationEmailResendBlockedUntil" TIMESTAMP(3),
ADD COLUMN     "verificationEmailResendCount" INTEGER NOT NULL DEFAULT 0;
