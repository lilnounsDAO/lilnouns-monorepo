/*
  Warnings:

  - Made the column `votecount` on table `Idea` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Idea" ALTER COLUMN "votecount" SET NOT NULL,
ALTER COLUMN "votecount" SET DEFAULT 0;
