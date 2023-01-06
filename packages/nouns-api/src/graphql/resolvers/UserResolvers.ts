import UserService from '../../services/user';

import { IResolvers } from '@graphql-tools/utils';
import { QueryGetUserArgs, User, Vote } from '../generated';

type UserWithAggregations = User & { userAggregations?: any };

const resolvers: IResolvers = {
  Query: {
    getAllUsers: async (
      _parent: any,
      _args: any,
      _context: any,
      info,
    ): Promise<UserWithAggregations[]> => {
      const users: UserWithAggregations[] = await UserService.allUsers();

      const queryInfo = info.fieldNodes.find(node => node.name.value === 'getAllUsers');
      const userStatsField = queryInfo?.selectionSet?.selections.find(
        (selection: any) => selection.name.value === 'userStats',
      );
      // only fetch user aggregations if requested
      if (Boolean(userStatsField)) {
        for await (const user of users) {
          const aggregations = await UserService.getUserAggregations({ wallet: user.wallet });
          user.userAggregations = aggregations;
        }
      }

      return users;
    },
    getUser: async (
      _parent: any,
      args: QueryGetUserArgs,
      _context: any,
      info,
    ): Promise<UserWithAggregations> => {
      const user: UserWithAggregations = await UserService.getUser(args.options.wallet as string);

      const queryInfo = info.fieldNodes.find(node => node.name.value === 'getUser');
      const userStatsField = queryInfo?.selectionSet?.selections.find(
        (selection: any) => selection.name.value === 'userStats',
      );
      if (Boolean(userStatsField)) {
        const aggregations = await UserService.getUserAggregations({ wallet: args.options.wallet });
        user.userAggregations = aggregations;
      }

      return user;
    },
  },
  User: {
    userStats: root => {
      return {
        totalVotes: root.votes?.length || 0, // Number of votes in total applied
        totalUpvotes: root.votes?.filter((vote: Vote) => vote.direction === 1).length || 0, // Number of upvotes a user has applied
        totalDownvotes: root.votes?.filter((vote: Vote) => vote.direction === -1).length || 0, // Number of downvotes a user has applied
        totalComments: root._count?.comments || 0, // Number of comments left in total
        totalIdeas: root._count?.ideas || 0, // Number of idea submissions in total
        netVotesReceived: root.userAggregations?.netVotes || 0, // Net votes received on own users ideas
        upvotesReceived: root.userAggregations?.netUpvotes || 0, // Net upvotes received on own users ideas
        downvotesReceived: root.userAggregations?.netDownvotes || 0, // Net downvotes received on own users ideas
      };
    },
  },
};

export default resolvers;
