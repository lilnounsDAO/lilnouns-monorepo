// node prisma/scripts/addTagTypes.ts
const { PrismaClient, TagType } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  for (const type of [
    TagType.REQUEST,
    TagType.OTHER,
    TagType.SUGGESTION,
    TagType.GOVERNANCE,
    TagType.COMMUNITY,
  ]) {
    const lowercaseType = type.toLowerCase();
    const label = lowercaseType[0].toUpperCase() + lowercaseType.slice(1);
    await prisma.tag.create({
      data: {
        type,
        label,
      },
    });
  }
}

seed();
