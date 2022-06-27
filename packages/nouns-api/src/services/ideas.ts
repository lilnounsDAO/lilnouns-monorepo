import { prisma } from '../api';
import { User } from '@prisma/client';

class IdeasService {
  static async all() {
    const allIdeas = await prisma.idea.findMany({
      include: {
        votes: true,
      },
    });
    return allIdeas;
  }

  static async get(id: number) {
    const idea = await prisma.idea.findUnique({
      where: { id: id },
      include: { votes: true },
    });

    return idea;
  }

  static async createIdea(data: any) {
    try {
      const idea = await prisma.idea.create({
        data: {
          title: data.title,
          tldr: data.tldr,
          description: data.description,
          creatorId: '0x65A3870F48B5237f27f674Ec42eA1E017E111D63',
        },
      });

      return idea;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  static async voteOnIdea(data: any) {
    try {
      const vote = prisma.vote.upsert({
        where: {
          ideaId_voterId: {
            voterId: data.voterAddress,
            ideaId: data.ideaId,
          },
        },
        update: {
          direction: data.direction,
        },
        create: {
          direction: data.direction,
          voterId: data.voterAddress,
          ideaId: data.ideaId,
        },
      });

      return vote;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  static async getVotesByIdea(id: number) {
    try {
      const votes = prisma.vote.findMany({
        where: {
          ideaId: id,
        },
      });

      return votes;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

export default IdeasService;
