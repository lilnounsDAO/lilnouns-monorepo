/*
  Warnings:

  - Added the required column `voteCount` to the `Idea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "voteCount" INTEGER NOT NULL;
