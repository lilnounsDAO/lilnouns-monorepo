import { prisma } from '../api';

class IdeasService {
  static async all() {
    try {
      const allIdeas = await prisma.idea.findMany({
        include: {
          votes: true,
        },
      });
      return allIdeas;
    } catch (e: any) {
      throw e;
    }
  }

  static async get(id: number) {
    try {
      const idea = await prisma.idea.findUnique({
        where: { id: id },
        include: {
          votes: true,
          comments: {
            where: {
              parentId: null,
            },
            include: {
              replies: {
                include: {
                  replies: true,
                },
              },
            },
          },
        },
      });

      return idea;
    } catch (e: any) {
      throw e;
    }
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
      throw e;
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
      throw e;
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
      throw e;
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
          parentId: data.parentId,
        },
      });

      return comment;
    } catch (e) {
      throw e;
    }
  }
}

export default IdeasService;
