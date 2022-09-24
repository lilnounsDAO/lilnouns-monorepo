import IdeasService from '../../services/ideas';

import { IResolvers } from '@graphql-tools/utils';
import {
  PropLotResponseMetadataResolvers,
  QueryGetPropLotArgs,
  Idea,
  FilterInput,
  PropLotFilter,
  FilterType,
} from '../generated';

const FILTER_IDS = {
  DATE: 'date',
  SORT: 'sort',
  TAG: 'tag',
};

const getSortParam = (appliedFilters: FilterInput[]) =>
  appliedFilters.find((aF: any) => aF.id === FILTER_IDS.SORT) || {
    id: FILTER_IDS.SORT,
    value: 'LATEST',
  };
const getDateParam = (appliedFilters: FilterInput[]) =>
  appliedFilters.find((aF: any) => aF.id === FILTER_IDS.DATE);
const getTagParams = (appliedFilters: FilterInput[]) =>
  appliedFilters.filter((aF: any) => aF.id === FILTER_IDS.TAG);

const resolvers: IResolvers = {
  Query: {
    getPropLot: async (_parent: any, args: QueryGetPropLotArgs) => {
      const appliedFilters = args.options.filters || [];
      const sortParam = getSortParam(appliedFilters);
      const dateParam = getDateParam(appliedFilters);
      const tagParams = getTagParams(appliedFilters);
      const selectedTagValues = tagParams.map(tag => tag.value);

      return {
        appliedFilters,
        sortParam,
        dateParam,
        tagParams,
        selectedTagValues,
        requestUUID: args.options.requestUUID,
      };
    },
  },
  PropLotResponse: {
    ideas: async (root): Promise<Idea[]> => {
      const ideas: Idea[] = await IdeasService.all(root.sortParam.value);
      return ideas;
    },
    sortFilter: (root): PropLotFilter => {
      const sortFilter: PropLotFilter = {
        __typename: 'PropLotFilter',
        id: FILTER_IDS.SORT,
        type: FilterType.SingleSelect,
        label: 'Sort',
        options: [
          {
            id: `${FILTER_IDS.SORT}-LATEST`,
            selected: root.sortParam?.value === 'LATEST' || !root.sortParam,
            value: 'LATEST',
            label: 'Latest',
          },
          {
            id: `${FILTER_IDS.SORT}-OLDEST`,
            selected: root.sortParam?.value === 'OLDEST',
            value: 'OLDEST',
            label: 'Oldest',
          },
          {
            id: `${FILTER_IDS.SORT}-VOTES_DESC`,
            selected: root.sortParam?.value === 'VOTES_DESC',
            value: 'VOTES_DESC',
            label: 'Most Votes',
          },
          {
            id: `${FILTER_IDS.SORT}-VOTES_ASC`,
            selected: root.sortParam?.value === 'VOTES_ASC',
            value: 'VOTES_ASC',
            label: 'Least Votes',
          },
        ],
      };

      return sortFilter;
    },
    dateFilter: (root): PropLotFilter => {
      const dateFilter: PropLotFilter = {
        __typename: 'PropLotFilter',
        id: FILTER_IDS.DATE,
        type: FilterType.SingleSelect,
        label: 'Date',
        options: [
          {
            id: `${FILTER_IDS.DATE}-TODAY`,
            selected: root.dateParam?.value === 'TODAY',
            label: 'Today',
            value: 'TODAY',
          },
          {
            id: `${FILTER_IDS.DATE}-LAST_WEEK`,
            selected: root.dateParam?.value === 'LAST_WEEK',
            label: 'Last week',
            value: 'LAST_WEEK',
          },
        ],
      };

      return dateFilter;
    },
    tagFilter: (root): PropLotFilter => {
      const tagFilter: PropLotFilter = {
        __typename: 'PropLotFilter',
        id: FILTER_IDS.TAG,
        type: FilterType.MultiSelect,
        label: 'Tags',
        options: [
          {
            id: `${FILTER_IDS.TAG}-HOT`,
            selected: root.selectedTagValues.includes('HOT'),
            label: 'Hot',
            value: 'HOT',
          },
          {
            id: `${FILTER_IDS.TAG}-DISCUSSION`,
            selected: root.selectedTagValues.includes('DISCUSSION'),
            label: 'Discussion',
            value: 'DISCUSSION',
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
