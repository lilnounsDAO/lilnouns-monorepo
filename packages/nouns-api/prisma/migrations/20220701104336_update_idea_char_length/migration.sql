/*
  Warnings:

  - You are about to alter the column `title` on the `Idea` table. The data in that column could be lost. The data in that column will be cast from `VarChar(130)` to `VarChar(50)`.
  - You are about to alter the column `tldr` on the `Idea` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(240)`.

*/
-- AlterTable
ALTER TABLE "Idea" ALTER COLUMN "title" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "tldr" SET DATA TYPE VARCHAR(240),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(1080);
