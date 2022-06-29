/*
  Warnings:

  - A unique constraint covering the columns `[ideaId,voterId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vote_ideaId_voterId_key" ON "Vote"("ideaId", "voterId");
