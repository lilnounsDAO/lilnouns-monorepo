import { prisma } from '../api';

const SORT_BY: { [key: string]: any } = {
  LATEST: [
    {
      createdAt: 'desc',
    },
    {
      id: 'asc',
    },
  ],
  VOTES_DESC: [
    {
      votecount: 'desc',
    },
    {
      id: 'asc',
    },
  ],
  VOTES_ASC: [
    {
      votecount: 'asc',
    },
    {
      id: 'asc',
    },
  ],
  OLDEST: [
    {
      createdAt: 'asc',
    },
    {
      id: 'asc',
    },
  ],
};

class IdeasService {
  static async all(sortBy?: string) {
    try {
      /* Custom SQL to calculate votecounts on the fly if we need this in the future
         the SQL below or using a database trigger that runs the calculation on vote inserts/updates.
          SQL to:
            - fetch idea data,
            - calculate the votecount for each idea using the users lil noun count and their vote direction
            - aggregate voter details
            - Sort by new votecount property

            This custom SQL allows us to calculate votes on the fly meaning we always have up to date votes with the users lilnouns. It also keeps
            sorting/filtering server side which will allow us to introduce pagination and other sorting mechanics.

          const ideaData: any = await prisma.$queryRaw`
          SELECT * FROM
            (SELECT v."ideaId",
            json_agg(json_build_object('voterId', v."voterId"::character varying, 'direction', v."direction", 'lilnounCount', u."lilnounCount")) AS votes,
            sum(v."direction"*u."lilnounCount") AS voteCount
            FROM "Vote" v INNER JOIN "User" u
            ON v."voterId" = u."wallet"
            GROUP BY v."ideaId", v."ideaId") counted_votes JOIN "Idea" idea ON counted_votes."ideaId" = idea.id
          ORDER BY voteCount DESC
          `;
      */

      const ideas = await prisma.idea.findMany({
        include: {
          votes: {
            include: {
              voter: true,
            },
          },
        },
        orderBy: SORT_BY[sortBy || 'VOTES_DESC'],
      });

      return ideas;
    } catch (e: any) {
      throw e;
    }
  }

  static async get(id: number) {
    try {
      /* Custom SQL to calculate votecounts on the fly if we need this in the future
        const ideaData: any = await prisma.$queryRaw`
          SELECT * FROM
            (SELECT v."ideaId",
            json_agg(json_build_object('voterId', v."voterId"::character varying, 'direction', v."direction", 'lilnounCount', u."lilnounCount")) AS votes,
            sum(v."direction"*u."lilnounCount") AS voteCount
            FROM "Vote" v INNER JOIN "User" u
            ON v."voterId" = u."wallet"
            GROUP BY v."ideaId", v."ideaId") counted_votes JOIN "Idea" idea ON counted_votes."ideaId" = idea.id
          WHERE idea."id" = ${id}
        `;

        if (!ideaData?.[0]) {
          throw new Error('Idea not found');
        }

        return ideaData[0];
      */

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

      return idea;
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
