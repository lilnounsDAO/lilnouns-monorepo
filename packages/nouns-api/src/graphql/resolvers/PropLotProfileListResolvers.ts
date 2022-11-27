import { IResolvers } from '@graphql-tools/utils';
import { User, Vote, Idea as PrismaIdea, Comment as PrismaComment } from '@prisma/client';
import IdeasService from '../../services/ideas';
import UserService from '../../services/user';
import {
  PropLotResponseMetadataResolvers,
  QueryGetPropLotProfileArgs,
  Idea,
  PropLotListItems,
  PropLotListItemsResolvers,
  PropLotFilter,
  FilterType,
} from '../generated';

import { resolveSortFilters } from './PropLotListResolvers';

import { parseFilterParam, getSortParam, getProfileTabParams } from '../utils/queryUtils';

import { FILTER_IDS, buildFilterParam } from '../utils/queryUtils';

type UserCounts = {
  comments: number;
  ideas: number;
  votes: number;
};

type VoteWithIdea = Vote & { idea: PrismaIdea };
type Comment = PrismaComment & { idea?: Idea };

type PrismaUser = User & { _count: UserCounts; votes: VoteWithIdea[] };

const totalUpvotes = (user: PrismaUser, wallet: string) =>
  user?.votes?.filter(
    (vote: VoteWithIdea) => vote.direction === 1 && vote?.idea?.creatorId !== wallet,
  ).length;
const totalDownvotes = (user: PrismaUser, wallet: string) =>
  user?.votes?.filter(
    (vote: VoteWithIdea) => vote.direction === -1 && vote?.idea?.creatorId !== wallet,
  ).length;

export const PROFILE_TAB_FILTERS: { [key: string]: any } = {
  SUBMISSIONS: {
    value: buildFilterParam(FILTER_IDS.PROFILE_TAB, 'SUBMISSIONS'),
    displayName: (user: PrismaUser) => `Submitted ${user?._count?.ideas || 0}`,
    active: (_: any) => true,
  },
  UP_VOTES: {
    value: buildFilterParam(FILTER_IDS.PROFILE_TAB, 'UP_VOTES'),
    displayName: (user: PrismaUser, wallet: string) => `Upvoted ${totalUpvotes(user, wallet)}`,
    active: (_: any) => true,
  },
  DOWN_VOTES: {
    value: buildFilterParam(FILTER_IDS.PROFILE_TAB, 'DOWN_VOTES'),
    displayName: (user: PrismaUser, wallet: string) => `Downvoted ${totalDownvotes(user, wallet)}`,
    active: (_: any) => true,
  },
  COMMENTS: {
    value: buildFilterParam(FILTER_IDS.PROFILE_TAB, 'COMMENTS'),
    displayName: (user: PrismaUser) => `Comments ${user?._count?.comments || 0}`,
    active: (_: any) => true,
  },
};

const resolvers: IResolvers = {
  Query: {
    getPropLotProfile: async (_parent: any, args: QueryGetPropLotProfileArgs, context) => {
      const wallet = args.options.wallet;
      const appliedFilters = args.options.filters || [];
      const sortParam = getSortParam(appliedFilters);
      const tabParam = getProfileTabParams(appliedFilters);
      const user: User = await UserService.getUser(wallet as string);
      const userAggregations: any = await UserService.getUserAggregations({
        wallet: wallet as string,
      });

      return {
        appliedFilters,
        sortParam,
        tabParam,
        requestUUID: args.options.requestUUID,
        timeZone: context.timeZone,
        wallet,
        user,
        userAggregations,
      };
    },
  },
  PropLotProfileResponse: {
    list: async (root): Promise<PropLotListItems[]> => {
      const tab = parseFilterParam(root.tabParam)?.value;

      let listItems: PropLotListItems[] = [];

      if (tab === 'SUBMISSIONS') {
        const ideas: Idea[] = await IdeasService.findWhere({
          sortBy: parseFilterParam(root.sortParam)?.value,
          wallet: root.wallet,
          tab,
        });
        listItems = [...ideas];
      }

      if (tab === 'COMMENTS') {
        const comments: Comment[] = await UserService.getUserComments({
          sortBy: parseFilterParam(root.sortParam)?.value,
          wallet: root.wallet,
        });

        listItems = [...comments];
      }

      if (['UP_VOTES', 'DOWN_VOTES'].includes(tab || '')) {
        const ideas: Idea[] = await IdeasService.findWhere({
          sortBy: parseFilterParam(root.sortParam)?.value,
          wallet: root.wallet,
          tab,
        });
        listItems = [...ideas];
      }

      return listItems;
    },
    sortFilter: root => {
      const tab = parseFilterParam(root.tabParam)?.value;
      return resolveSortFilters(root, tab === 'COMMENTS' ? ['VOTES_DESC', 'VOTES_ASC'] : undefined);
    },
    tabFilter: (root): PropLotFilter => {
      const options = Object.keys(PROFILE_TAB_FILTERS)
        .filter((key: string) => PROFILE_TAB_FILTERS[key].active(root.user))
        .map((key: string) => {
          return {
            id: `${FILTER_IDS.PROFILE_TAB}-${key}`,
            selected: root.tabParam === PROFILE_TAB_FILTERS[key].value,
            label: PROFILE_TAB_FILTERS[key].displayName(root.user, root.wallet),
            value: PROFILE_TAB_FILTERS[key].value,
          };
        });
      const tabFilter: PropLotFilter = {
        __typename: 'PropLotFilter',
        id: FILTER_IDS.PROFILE_TAB,
        type: FilterType.SingleSelect,
        label: 'Tabs',
        options,
      };

      return tabFilter;
    },
    metadata: (root): PropLotResponseMetadataResolvers => ({
      requestUUID: root.requestUUID || '',
      appliedFilters: root.appliedFilters,
    }),
    profile: root => {
      return {
        user: { ...root.user, userAggregations: root.userAggregations },
      };
    },
  },
  PropLotListItems: <PropLotListItemsResolvers>{
    __resolveType(obj) {
      if ('authorId' in obj) {
        return 'Comment';
      }

      if ('tldr' in obj) {
        return 'Idea';
      }

      return null; // GraphQLError is thrown
    },
  },
};

export default resolvers;
