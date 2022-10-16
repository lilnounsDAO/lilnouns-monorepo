import { prisma } from '../api';
import { DATE_FILTERS } from '../graphql/utils/queryUtils';

const sortFn: { [key: string]: any } = {
  LATEST: (a: any, b: any) => {
    const dateA: any = new Date(a.createdAt);
    const dateB: any = new Date(b.createdAt);
    return dateB - dateA;
  },
  VOTES_DESC: (a: any, b: any) => b.votecount - a.votecount,
  VOTES_ASC: (a: any, b: any) => a.votecount - b.votecount,
  OLDEST: (a: any, b: any) => {
    const dateA: any = new Date(a.createdAt);
    const dateB: any = new Date(b.createdAt);
    return dateA - dateB;
  },
};

const calculateVotes = (votes: any) => {
  let count = 0;
  votes.forEach((vote: any) => {
    count = count + vote.direction * vote.voter.lilnounCount;
  });

  return count;
};

class IdeasService {
  static async all(sortBy?: string) {
    try {
      // Investigate issue with votecount db triggers

      // const ideas = await prisma.idea.findMany({
      //   include: {
      //     votes: {
      //       include: {
      //         voter: true,
      //       },
      //     },
      //   },
      //   orderBy: SORT_BY[sortBy || 'VOTES_DESC'],
      // });

      const ideas = await prisma.idea.findMany({
        include: {
          votes: {
            include: {
              voter: true,
            },
          },
          _count: {
            select: { comments: true },
          },
        },
      });

      const ideaData = ideas
        .map((idea: any) => {
          const votecount = calculateVotes(idea.votes);
          return { ...idea, votecount };
        })
        .sort(sortFn[sortBy || 'LATEST']);

      return ideaData;
    } catch (e: any) {
      throw e;
    }
  }

  static async findWhere({
    sortBy,
    tags,
    date,
  }: {
    sortBy?: string;
    tags?: string[];
    date?: string;
  }) {
    try {
      const dateRange: any = DATE_FILTERS[date || 'ALL_TIME'].filterFn();
      const ideas = await prisma.idea.findMany({
        where: {
          createdAt: {
            gte: dateRange.gte,
            lte: dateRange.lte,
          },
        },
        include: {
          votes: {
            include: {
              voter: true,
            },
          },
          _count: {
            select: { comments: true },
          },
        },
      });

      const ideaData = ideas
        .map((idea: any) => {
          const votecount = calculateVotes(idea.votes);
          return { ...idea, votecount };
        })
        .sort(sortFn[sortBy || 'LATEST']);

      return ideaData;
    } catch (e: any) {
      throw e;
    }
  }

  static async get(id: number) {
    try {
      const idea = await prisma.idea.findUnique({
        where: {
          id,
        },
        include: {
          votes: {
            include: {
              voter: true,
            },
          },
        },
      });

      if (!idea) {
        throw new Error('Idea not found');
      }

      const ideaData = { ...idea, votecount: calculateVotes(idea.votes) };

      return ideaData;
    } catch (e: any) {
      throw e;
    }
  }

  static async createIdea(
    data: { title: string; tldr: string; description: string },
    user?: { wallet: string },
  ) {
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
          votecount: 0,
          votes: {
            create: {
              direction: 1,
              voterId: user.wallet,
            },
          },
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
      const direction = Math.min(Math.max(parseInt(data.direction), -1), 1);

      if (isNaN(direction) || direction === 0) {
        // votes can only be 1 or -1 right now as we only support up or down votes
        throw new Error('Failed to save vote: direction is not valid');
      }

      const vote = prisma.vote.upsert({
        where: {
          ideaId_voterId: {
            voterId: user.wallet,
            ideaId: data.ideaId,
          },
        },
        update: {
          direction,
        },
        create: {
          direction,
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

  static async getIdeaComments(id: number) {
    try {
      const comment = prisma.comment.findMany({
        where: {
          ideaId: id,
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
      });

      return comment;
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
