import { PrismaClient } from '@prisma/client';
import Chance from 'chance';

const prisma = new PrismaClient();
const chance = new Chance();

async function seed() {
  const user = {
    wallet: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
    ens: 'test.eth',
    lilnounCount: 3,
  };

  const prismaUser = await prisma.user.create({ data: user });

  for (let i = 0; i < 10; i++) {
    const idea = await prisma.idea.create({
      data: {
        title: chance.word({ length: 5 }),
        tldr: chance.sentence({ words: 5 }),
        description: chance.sentence({ words: 10 }),
        creatorId: user.wallet,
      },
    });
    await prisma.vote.create({
      data: {
        ideaId: idea.id,
        voterId: prismaUser.wallet,
        direction: 1,
      },
    });
  }
}

seed();
