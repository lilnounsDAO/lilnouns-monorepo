import UserService from '../../services/user';

import { IResolvers } from '@graphql-tools/utils';
import { QueryGetUserArgs, User } from '../generated';

const resolvers: IResolvers = {
  Query: {
    getAllUsers: async (_parent: any): Promise<User[]> => {
      const users: User[] = await UserService.allUsers();
      return users;
    },
    getUser: async (_parent: any, args: QueryGetUserArgs): Promise<User> => {
      const users: User = await UserService.getUser(args.options.wallet as string);
      return users;
    },
  },
  User: {
    userStats: (root) => {
      return {
        totalVotes: root._count?.votes,
        totalComments: root._count?.comments,
        totalIdeas: root._count?.ideas,
      }
    },
  },
};

export default resolvers;
