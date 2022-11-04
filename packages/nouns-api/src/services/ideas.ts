import { Idea, TagType } from '@prisma/client';
import { prisma } from '../api';
import { DATE_FILTERS, getIsClosed } from '../graphql/utils/queryUtils';
import { VirtualTags } from '../virtual';
import { nounsTotalSupply } from '../utils/utils';

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

const calculateConsensus = (idea: Idea, voteCount: number) => {
  if (!idea.tokenSupplyOnCreate) {
    return undefined;
  }

  const consensus = (voteCount / idea.tokenSupplyOnCreate) * 100;
  return Math.min(Math.max(Math.floor(consensus), 0), 100);
};

class IdeasService {
  static async all({ sortBy }: { sortBy?: string }) {
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
          const closed = getIsClosed(idea);

          return { ...idea, votecount, closed };
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
    tags?: TagType[];
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
          tags: true,
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
          const consensus = calculateConsensus(idea, votecount);
          const closed = getIsClosed(idea);

          return { ...idea, votecount, consensus, closed };
        })
        .filter((idea: any) => {
          if (!tags || tags.length === 0) {
            return true;
          }
          return tags.some(tag => {
            const virtualTag = VirtualTags[tag];
            if (virtualTag) {
              return virtualTag.filterFn(idea);
            }
            return idea.tags.some((ideaTag: any) => ideaTag.type === tag);
          });
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
          tags: true,
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

      if (!idea) {
        throw new Error('Idea not found');
      }

      const votecount = calculateVotes(idea.votes);
      const consensus = calculateConsensus(idea, votecount);
      const closed = getIsClosed(idea);

      const ideaData = { ...idea, closed, consensus, votecount };

      return ideaData;
    } catch (e: any) {
      throw e;
    }
  }

  static async createIdea(
    data: { title: string; tldr: string; description: string; tags: TagType[] },
    user?: { wallet: string },
  ) {
    try {
      if (!user) {
        throw new Error('Failed to save idea: missing user details');
      }

      const totalSupply = await nounsTotalSupply();

      if (!totalSupply) {
        throw new Error("Failed to save idea: couldn't fetch token supply");
      }

      const idea = await prisma.idea.create({
        data: {
          title: data.title,
          tldr: data.tldr,
          description: data.description,
          creatorId: user.wallet,
          votecount: 0,
          tokenSupplyOnCreate: totalSupply,
          votes: {
            create: {
              direction: 1,
              voterId: user.wallet,
            },
          },
          tags: {
            connect: data.tags.map(tag => {
              return {
                type: tag,
              };
            }),
          },
        },
      });

      return { ...idea, closed: false };
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

      const isClosed = await this.isIdeaClosed(data.ideaId);

      if (isClosed) {
        throw new Error('Idea has been closed');
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

      const isClosed = await this.isIdeaClosed(data.ideaId);

      if (isClosed) {
        throw new Error('Idea has been closed');
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

  static async isIdeaClosed(id: number) {
    // Load idea first to check if it's been closed before allowing updates.
    const idea = await prisma.idea.findUnique({
      where: {
        id,
      },
    });

    if (!idea) {
      throw new Error('Idea not found for comment');
    }

    return getIsClosed(idea);
  }
}

export default IdeasService;
