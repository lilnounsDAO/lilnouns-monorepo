import { prisma } from '../api';
import { Comment } from '@prisma/client';
import { calculateConsensus, calculateVotes } from './ideas';
import { getIsClosed } from '../graphql/utils/queryUtils';

const calculateAllVotes = (votes: any) => {
  let count = 0;
  let upvotes = 0;
  let downvotes = 0;
  const calc = (acc: number, vote: any) => acc + vote.direction * vote.voter.lilnounCount;
  votes.forEach((vote: any) => {
    if (vote.direction === 1) {
      upvotes = calc(upvotes, vote);
    }
    if (vote.direction === -1) {
      downvotes = calc(downvotes, vote);
    }
    count = calc(count, vote);
  });

  return { count, upvotes, downvotes };
};

const calculateNetVotes = (ideas: any) => {
  let netVotes = 0;
  let netUpvotes = 0;
  let netDownvotes = 0;

  ideas.forEach((idea: any) => {
    const { count, upvotes, downvotes } = calculateAllVotes(idea.votes);

    netVotes += count;
    netUpvotes += upvotes;
    netDownvotes += downvotes;
  });

  return { netVotes, netUpvotes, netDownvotes };
};

class UserService {
  static async allUsers() {
    try {
      const users = await prisma.user.findMany({
        include: {
          _count: {
            select: { comments: true, votes: true, ideas: true },
          },
        },
      });

      return users;
    } catch (e: any) {
      throw e;
    }
  }

  static async getUserAggregations({ wallet }: { wallet: string }) {
    try {
      const userIdeas = await prisma.idea.findMany({
        where: {
          creatorId: wallet,
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

      const userAggregations = calculateNetVotes(userIdeas);

      return userAggregations;
    } catch (e: any) {
      throw e;
    }
  }

  static async getUser(wallet: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          wallet,
        },
        include: {
          votes: {
            include: {
              idea: true,
            },
          },
          _count: {
            select: { comments: true, ideas: true },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (e: any) {
      throw e;
    }
  }

  static async getUserComments({ sortBy, wallet }: { sortBy?: string; wallet: string }) {
    const SORT_FILTERS: { [key: string]: any } = {
      LATEST: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      OLDEST: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    };

    try {
      const comments = await prisma.comment.findMany({
        where: {
          authorId: wallet,
        },
        ...SORT_FILTERS[sortBy || 'LATEST'],
        include: {
          idea: {
            include: {
              tags: true,
            },
          },
          parent: true,
        },
      });

      const commentData = comments.map((comment: any) => {
        if (comment.idea) {
          const votecount = calculateVotes(comment.idea.votes || []);
          const consensus = calculateConsensus(comment.idea, votecount);
          const closed = getIsClosed(comment.idea);
          return { ...comment, idea: { ...comment.idea, votecount, consensus, closed } };
        }
        return comment;
      });

      return commentData;
    } catch (e) {
      throw e;
    }
  }
}

export default UserService;
