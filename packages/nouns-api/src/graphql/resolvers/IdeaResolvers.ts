import IdeasService from '../../services/ideas';

import { IResolvers } from '@graphql-tools/utils';
import {
  QueryGetIdeaArgs,
  QueryGetIdeasArgs,
  MutationSubmitIdeaVoteArgs,
  Idea,
  Vote,
} from '../generated';
import { VirtualTags } from '../../virtual';

const resolvers: IResolvers = {
  Query: {
    getIdea: async (_parent: any, args: QueryGetIdeaArgs) => {
      const idea = await IdeasService.get(args.options.ideaId as number);
      return idea;
    },
    getIdeas: async (_parent: any, args: QueryGetIdeasArgs): Promise<Idea[]> => {
      const ideas: Idea[] = await IdeasService.all({ sortBy: args.options.sort as string });
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
    tags: async root => {
      const tags = root.tags;
      const matchingVirtualTags = Object.keys(VirtualTags)
        .filter(key => {
          const vT = VirtualTags[key];
          return vT.filterFn(root);
        })
        .map(key => VirtualTags[key]);

      return [...matchingVirtualTags, ...tags];
    },
    comments: async root => {
      const comments = await IdeasService.getIdeaComments(root.id);
      return comments;
    },
    ideaStats: root => root._count,
  },
};

export default resolvers;
