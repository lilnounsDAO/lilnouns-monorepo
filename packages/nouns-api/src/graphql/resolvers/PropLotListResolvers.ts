import IdeasService from '../../services/ideas';

import { IResolvers } from '@graphql-tools/utils';
import {
  UiPropLotSections,
  PropLotResponseMetadataResolvers,
  QueryGetPropLotArgs,
  UiListItemResolvers,
  Idea,
  FilterInput,
  UiIdeaRow,
  UiFilterType,
  TargetFilterParam,
  UiPropLotComponentList,
  UiPropLotFilterBar,
  UiFilter,
} from '../generated';

const FILTER_IDS = {
  DATE: 'date',
  SORT: 'sort',
  TAG: 'tag',
};

const buildTargetParam = (key: string, value: string): TargetFilterParam => ({
  param: { key, value },
});
const getSortParam = (appliedFilters: FilterInput[]) =>
  appliedFilters.find((aF: any) => aF.key === FILTER_IDS.SORT) || {
    key: FILTER_IDS.SORT,
    value: 'LATEST',
  };
const getDateParam = (appliedFilters: FilterInput[]) =>
  appliedFilters.find((aF: any) => aF.key === FILTER_IDS.DATE);
const getTagParams = (appliedFilters: FilterInput[]) =>
  appliedFilters.filter((aF: any) => aF.key === FILTER_IDS.TAG);

const resolvers: IResolvers = {
  Query: {
    getPropLot: async (_parent: any, args: QueryGetPropLotArgs) => {
      return { appliedFilters: args.options.filters || [], requestUUID: args.options.requestUUID };
    },
  },
  PropLotResponse: {
    sections: async (root): Promise<UiPropLotSections[]> => {
      const sortParam = getSortParam(root.appliedFilters);
      const dateParam = getDateParam(root.appliedFilters);
      const tagParams = getTagParams(root.appliedFilters);
      const selectedTagValues = tagParams.map(tag => tag.value);

      /* Build Filters **START**
          TODO:
            - Extract some of this logic into util functions
            - Fetch Tags from DB and populate in the tags section
      */
      const filters: UiFilter[] = [
        {
          id: FILTER_IDS.SORT,
          type: UiFilterType.SingleSelect,
          label: 'Sort',
          options: [
            {
              id: 'LATEST',
              selected: sortParam?.value === 'LATEST' || !sortParam,
              target: buildTargetParam(FILTER_IDS.SORT, 'LATEST'),
              label: 'Latest',
            },
            {
              id: 'OLDEST',
              selected: sortParam?.value === 'OLDEST',
              target: buildTargetParam(FILTER_IDS.SORT, 'OLDEST'),
              label: 'Oldest',
            },
            {
              id: 'VOTES_ASC',
              selected: sortParam?.value === 'VOTES_ASC',
              target: buildTargetParam(FILTER_IDS.SORT, 'VOTES_ASC'),
              label: 'Most Votes',
            },
            {
              id: 'VOTES_DESC',
              selected: sortParam?.value === 'VOTES_DESC',
              target: buildTargetParam(FILTER_IDS.SORT, 'VOTES_DESC'),
              label: 'Least Votes',
            },
          ],
        },
        {
          id: FILTER_IDS.DATE,
          type: UiFilterType.SingleSelect,
          label: 'Date',
          options: [
            {
              id: 'TODAY',
              selected: dateParam?.value === 'TODAY',
              label: 'Today',
              target: buildTargetParam(FILTER_IDS.DATE, 'TODAY'),
            },
            {
              id: 'LAST_WEEK',
              selected: dateParam?.value === 'LAST_WEEK',
              label: 'Last week',
              target: buildTargetParam(FILTER_IDS.DATE, 'LAST_WEEK'),
            },
          ],
        },
        {
          id: FILTER_IDS.TAG,
          type: UiFilterType.MultiSelect,
          label: 'Tags',
          options: [
            {
              id: 'Hot',
              selected: selectedTagValues.includes('Hot'),
              label: 'Hot',
              target: buildTargetParam(FILTER_IDS.TAG, 'Hot'),
            },
            {
              id: 'Discussion',
              selected: selectedTagValues.includes('Discussion'),
              label: 'Discussion',
              target: buildTargetParam(FILTER_IDS.TAG, 'Discussion'),
            },
          ],
        },
      ];

      const filterSection: UiPropLotFilterBar = {
        __typename: 'UIPropLotFilterBar',
        filters,
      };

      /* Build Filters **END** */

      /* Build PropLot List **START**
        TODO:
          - Create new service method to pass in applied sort, dates and tag params
          - Filter results based on those inputs
      */

      const ideas: Idea[] = await IdeasService.all(sortParam.value);
      const ideaRows: UiIdeaRow[] = ideas.map(idea => {
        const row: UiIdeaRow = {
          data: idea,
        };

        return row;
      });

      const listSection: UiPropLotComponentList = {
        __typename: 'UIPropLotComponentList',
        list: ideaRows,
      };

      /* Build PropLot List **END** */

      return [filterSection, listSection];
    },
    metadata: (root): PropLotResponseMetadataResolvers => ({
      requestUUID: root.requestUUID || '',
      appliedFilters: root.appliedFilters,
    }),
  },
  UIListItem: <UiListItemResolvers>{
    __resolveType(item) {
      if (item.data?.tldr) {
        return 'UIIdeaRow';
      }
      return null;
    },
  },
};

export default resolvers;
