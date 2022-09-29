-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('HOT', 'REQUEST', 'DISCUSSION');

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "type" "TagType" NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IdeaToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_IdeaToTag_AB_unique" ON "_IdeaToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_IdeaToTag_B_index" ON "_IdeaToTag"("B");

-- AddForeignKey
ALTER TABLE "_IdeaToTag" ADD CONSTRAINT "_IdeaToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IdeaToTag" ADD CONSTRAINT "_IdeaToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
