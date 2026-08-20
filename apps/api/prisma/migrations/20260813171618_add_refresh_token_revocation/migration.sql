/*
  Warnings:

  - Made the column `familyId` on table `refresh_tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "replacedByToken" TEXT,
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ALTER COLUMN "familyId" SET NOT NULL;
