import { prisma } from '../api';

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
      include: { votes: true, comments: true },
    });

    return idea;
  }

  static async createIdea(data: any, user?: { wallet: string }) {
    try {
      if (!user) {
        throw new Error('Failed to save idea: missing user details');
      }
      const idea = await prisma.idea.create({
        data: {
          title: data.title,
          tldr: data.tldr,
          description: data.description,
          creatorId: user.wallet,
        },
      });

      return idea;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  static async voteOnIdea(data: any, user?: { wallet: string }) {
    try {
      if (!user) {
        throw new Error('Failed to save vote: missing user details');
      }
      const vote = prisma.vote.upsert({
        where: {
          ideaId_voterId: {
            voterId: user.wallet,
            ideaId: data.ideaId,
          },
        },
        update: {
          direction: data.direction,
        },
        create: {
          direction: data.direction,
          voterId: user.wallet,
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

  static async commentOnIdea(data: any, user?: { wallet: string }) {
    try {
      if (!user) {
        throw new Error('Failed to save comment: missing user details');
      }

      const comment = prisma.comment.create({
        data: {
          body: data.body,
          authorId: user.wallet,
          ideaId: data.ideaId,
        },
      });

      return comment;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

export default IdeasService;