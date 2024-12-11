/*
  Warnings:

  - You are about to drop the `FormRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'blocked');

-- DropForeignKey
ALTER TABLE "FormRole" DROP CONSTRAINT "FormRole_formId_fkey";

-- DropForeignKey
ALTER TABLE "FormRole" DROP CONSTRAINT "FormRole_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user',
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';

-- DropTable
DROP TABLE "FormRole";
