/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ApiToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "apiTokenId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ApiToken_userId_key" ON "ApiToken"("userId");
