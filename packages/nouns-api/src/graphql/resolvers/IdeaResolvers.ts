import IdeasService from '../../services/ideas';

import { IResolvers } from '@graphql-tools/utils';
import { QueryGetIdeasArgs, MutationSubmitIdeaVoteArgs, Idea, Vote } from '../generated';

const resolvers: IResolvers = {
  Query: {
    getIdeas: async (_parent: any, args: QueryGetIdeasArgs): Promise<Idea[]> => {
      const ideas: Idea[] = await IdeasService.all(args.options.sort as string);
      return ideas;
    },
  },
  Mutation: {
    submitIdeaVote: async (
      _parent: any,
      args: MutationSubmitIdeaVoteArgs,
      context,
    ): Promise<Vote> => {
      if (!context.authScope.isAuthorized) {
        throw new Error('Failed to save vote: unauthorized');
      }

      const vote: Vote = await IdeasService.voteOnIdea(
        {
          ideaId: args.options.ideaId,
          direction: args.options.direction,
        },
        context.authScope.user,
      );
      return vote;
    },
  },
  Idea: {
    comments: async root => {
      const comments = await IdeasService.getIdeaComments(root.id);
      return comments;
    },
    ideaStats: root => root._count,
  },
};

export default resolvers;
