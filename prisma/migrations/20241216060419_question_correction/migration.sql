-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE 'checkbox';

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "options" TEXT[];
