import IdeasService from '../../services/ideas';

import { IResolvers } from '@graphql-tools/utils';
import { QueryGetIdeasArgs, Idea } from '../generated';

const resolvers: IResolvers = {
  Query: {
    getIdeas: async (_parent: any, args: QueryGetIdeasArgs): Promise<Idea[]> => {
      const ideas: Idea[] = await IdeasService.all(args.options.sort as string);
      return ideas;
    },
  },
  Idea: {
    comments: async (root) => {
        const comments = await IdeasService.getIdeaComments(root.id);
        return comments;
    },
    ideaStats: (root) => root._count,
  }
};

export default resolvers;
