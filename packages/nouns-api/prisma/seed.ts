import { PrismaClient } from '@prisma/client';
import Chance from 'chance';

const prisma = new PrismaClient();
const chance = new Chance();

async function seed() {
  const user = {
    id: 1,
    wallet: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
    ens: 'test.eth',
    lilnounCount: 3,
  };

  await prisma.user.create({ data: user });

  for (let i = 0; i < 5; i++) {
    await prisma.idea.create({
      data: {
        title: chance.word({ length: 5 }),
        tldr: chance.sentence({ words: 5 }),
        description: chance.sentence({ words: 10 }),
        creatorId: user.wallet,
      },
    });
  }
}

seed();
