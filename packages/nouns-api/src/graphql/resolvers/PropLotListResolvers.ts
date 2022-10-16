import IdeasService from '../../services/ideas';

import { IResolvers } from '@graphql-tools/utils';
import {
  PropLotResponseMetadataResolvers,
  QueryGetPropLotArgs,
  Idea,
  PropLotFilter,
  FilterType,
} from '../generated';

import { FILTER_IDS, DATE_FILTERS } from '../utils/queryUtils';

import {
  buildFilterParam,
  parseFilterParam,
  getSortParam,
  getDateParam,
  getTagParams,
} from '../utils/queryUtils';

const resolvers: IResolvers = {
  Query: {
    getPropLot: async (_parent: any, args: QueryGetPropLotArgs, context) => {
      const appliedFilters = args.options.filters || [];
      const sortParam = getSortParam(appliedFilters);
      const dateParam = getDateParam(appliedFilters);
      const tagParams = getTagParams(appliedFilters);

      return {
        appliedFilters,
        sortParam,
        dateParam,
        tagParams,
        requestUUID: args.options.requestUUID,
        timeZone: context.timeZone,
      };
    },
  },
  PropLotResponse: {
    ideas: async (root): Promise<Idea[]> => {
      const ideas: Idea[] = await IdeasService.findWhere({
        sortBy: parseFilterParam(root.sortParam)?.value,
        date: parseFilterParam(root.dateParam)?.value,
        // Add tags here
      });

      return ideas;
    },
    sortFilter: (root): PropLotFilter => {
      const SORT_FILTER_VALUES = {
        LATEST: buildFilterParam(FILTER_IDS.SORT, 'LATEST'),
        OLDEST: buildFilterParam(FILTER_IDS.SORT, 'OLDEST'),
        VOTES_DESC: buildFilterParam(FILTER_IDS.SORT, 'VOTES_DESC'),
        VOTES_ASC: buildFilterParam(FILTER_IDS.SORT, 'VOTES_ASC'),
      };
      const sortFilter: PropLotFilter = {
        __typename: 'PropLotFilter',
        id: FILTER_IDS.SORT,
        type: FilterType.SingleSelect,
        label: 'Sort',
        options: [
          {
            id: `${FILTER_IDS.SORT}-LATEST`,
            selected: root.sortParam === SORT_FILTER_VALUES['LATEST'] || !root.sortParam,
            value: SORT_FILTER_VALUES['LATEST'],
            label: 'Created',
            icon: 'ARROW_UP',
          },
          {
            id: `${FILTER_IDS.SORT}-OLDEST`,
            selected: root.sortParam === SORT_FILTER_VALUES['OLDEST'],
            value: SORT_FILTER_VALUES['OLDEST'],
            label: 'Created',
            icon: 'ARROW_DOWN',
          },
          {
            id: `${FILTER_IDS.SORT}-VOTES_DESC`,
            selected: root.sortParam === SORT_FILTER_VALUES['VOTES_DESC'],
            value: SORT_FILTER_VALUES['VOTES_DESC'],
            label: 'Votes',
            icon: 'ARROW_UP',
          },
          {
            id: `${FILTER_IDS.SORT}-VOTES_ASC`,
            selected: root.sortParam === SORT_FILTER_VALUES['VOTES_ASC'],
            value: SORT_FILTER_VALUES['VOTES_ASC'],
            label: 'Votes',
            icon: 'ARROW_DOWN',
          },
        ],
      };

      return sortFilter;
    },
    dateFilter: (root): PropLotFilter => {
      const options = Object.keys(DATE_FILTERS).map((key: string) => {
        return {
          id: `${FILTER_IDS.DATE}-${key}`,
          selected: root.dateParam === DATE_FILTERS[key].value,
          label: DATE_FILTERS[key].displayName,
          value: DATE_FILTERS[key].value,
        };
      });
      const dateFilter: PropLotFilter = {
        __typename: 'PropLotFilter',
        id: FILTER_IDS.DATE,
        type: FilterType.SingleSelect,
        label: 'Date',
        options,
      };

      return dateFilter;
    },
    tagFilter: (root): PropLotFilter => {
      // Load tags from DB and build the filters here
      const tagFilter: PropLotFilter = {
        __typename: 'PropLotFilter',
        id: FILTER_IDS.TAG,
        type: FilterType.MultiSelect,
        label: 'Tags',
        options: [
          {
            id: `${FILTER_IDS.TAG}-HOT`,
            selected: Boolean(root.tagParams?.includes(buildFilterParam(FILTER_IDS.TAG, 'HOT'))),
            label: 'Hot',
            value: buildFilterParam(FILTER_IDS.TAG, 'HOT'),
          },
          {
            id: `${FILTER_IDS.TAG}-DISCUSSION`,
            selected: Boolean(
              root.tagParams?.includes(buildFilterParam(FILTER_IDS.TAG, 'DISCUSSION')),
            ),
            label: 'Discussion',
            value: buildFilterParam(FILTER_IDS.TAG, 'DISCUSSION'),
          },
        ],
      };

      return tagFilter;
    },
    metadata: (root): PropLotResponseMetadataResolvers => ({
      requestUUID: root.requestUUID || '',
      appliedFilters: root.appliedFilters,
    }),
  },
};

export default resolvers;
