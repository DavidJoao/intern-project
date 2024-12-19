/*
  Warnings:

  - A unique constraint covering the columns `[id,templateId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Question_id_templateId_key" ON "Question"("id", "templateId");
