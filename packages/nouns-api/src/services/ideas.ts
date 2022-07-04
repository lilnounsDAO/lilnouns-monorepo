import { prisma } from '../api';

const countVotes = (idea: any) => {
  return idea.votes.reduce((sum: number, vote: any) => {
    return (sum + vote.direction) * vote.voter.lilnounCount;
  }, 0);
};

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
      });
      const ideas = allIdeas.map((idea: any) => {
        const voteCount = countVotes(idea);
        return { ...idea, voteCount };
      });
      return ideas;
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

      const voteCount = countVotes(idea);

      return { ...idea, voteCount };
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
        include: {
          voter: true,
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
