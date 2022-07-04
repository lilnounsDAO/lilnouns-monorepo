import { prisma } from '../api';

class IdeasService {
  static async all() {
    try {
      const allIdeas = await prisma.idea.findMany({
        include: {
          votes: {
            include: {
              voter: true,
            },
          },
        },
        orderBy: [
          {
            voteCount: 'desc',
          },
          {
            createdAt: 'asc',
          },
        ],
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
          votes: {
            include: {
              voter: true,
            },
          },
          comments: {
            where: {
              parentId: null,
            },
            include: {
              replies: {
                include: {
                  replies: {
                    include: {
                      replies: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!idea) {
        throw new Error('Idea not found');
      }

      return idea;
    } catch (e: any) {
      throw e;
    }
  }

  static async createIdea(data: any, user?: { wallet: string; lilnounCount: number }) {
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
          voteCount: user.lilnounCount,
          votes: {
            create: {
              direction: 1,
              voterId: user.wallet,
            },
          },
        },
        include: {
          votes: true,
        },
      });

      return idea;
    } catch (e) {
      throw e;
    }
  }

  static async voteOnIdea(data: any, user?: { wallet: string; lilnounCount: number }) {
    try {
      if (!user) {
        throw new Error('Failed to save vote: missing user details');
      }

      // Find if the user has placed a vote on this idea already.
      let vote = await prisma.vote.findUnique({
        where: {
          ideaId_voterId: {
            voterId: user.wallet,
            ideaId: data.ideaId,
          },
        },
      });

      if (!vote) {
        const [newVote, idea] = await prisma.$transaction([
          prisma.vote.create({
            data: {
              direction: data.direction,
              voterId: user.wallet,
              ideaId: data.ideaId,
            },
            include: {
              voter: true,
              idea: true,
            },
          }),
          prisma.idea.update({
            where: {
              id: data.ideaId,
            },
            data: {
              voteCount: {
                increment: data.direction * user.lilnounCount,
              },
            },
          }),
        ]);

        vote = { ...newVote, idea } as any;
      } else {
        vote = await prisma.vote.update({
          where: {
            ideaId_voterId: {
              voterId: user.wallet,
              ideaId: data.ideaId,
            },
          },
          data: {
            direction: data.direction,
            idea: {
              update: {
                voteCount: {
                  // If the user has placed a vote before we want to double the weight of their new vote to override their existing vote.
                  increment: data.direction * 2 * user.lilnounCount,
                },
              },
            },
          },
          include: {
            voter: true,
            idea: true,
          },
        });
      }

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
