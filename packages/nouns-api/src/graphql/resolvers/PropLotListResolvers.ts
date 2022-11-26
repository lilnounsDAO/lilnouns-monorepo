import { IResolvers } from '@graphql-tools/utils';
import { prisma } from '../../api';
import IdeasService from '../../services/ideas';
import {
  PropLotResponseMetadataResolvers,
  QueryGetPropLotArgs,
  Idea,
  PropLotFilter,
  FilterType,
} from '../generated';

import { FILTER_IDS, DATE_FILTERS } from '../utils/queryUtils';
import { VirtualTags } from '../../virtual';

import {
  buildFilterParam,
  parseFilterParam,
  getSortParam,
  getDateParam,
  getTagParams,
} from '../utils/queryUtils';

export const resolveSortFilters = (root: any, exclude?: string[]): PropLotFilter => {
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

  if (!!exclude) {
    const filteredOptions = sortFilter.options.filter(
      opt => !exclude.includes(opt.id.split('-')[1]),
    );
    sortFilter.options = filteredOptions;
  }

  return sortFilter;
};

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
        tags: root.tagParams.map((tag: string) => parseFilterParam(tag)?.value),
      });

      return ideas;
    },
    sortFilter: root => resolveSortFilters(root),
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
    tagFilter: async (root): Promise<PropLotFilter> => {
      const tags = await prisma.tag.findMany();
      // static tag filters are the tags that come from the database
      // contrast with virtual tags (hot, etc)
      const staticTagFilterOptions = tags.map(tag => {
        return {
          id: `${FILTER_IDS.TAG}-${tag.type}`,
          label: tag.label,
          value: buildFilterParam(FILTER_IDS.TAG, tag.type),
          selected: Boolean(root.tagParams?.includes(buildFilterParam(FILTER_IDS.TAG, tag.type))),
        };
      });

      const virtualTagFilterOptions = Object.keys(VirtualTags)
        .filter(key => key !== 'CONSENSUS') // We don't want a consensus tag appearing in the filter dropdown
        .map(key => {
          const vT = VirtualTags[key];
          return {
            id: `${FILTER_IDS.TAG}-${vT.type}`,
            label: vT.label,
            value: buildFilterParam(FILTER_IDS.TAG, vT.type),
            selected: Boolean(root.tagParams?.includes(buildFilterParam(FILTER_IDS.TAG, vT.type))),
          };
        });
      const tagFilter: PropLotFilter = {
        __typename: 'PropLotFilter',
        id: FILTER_IDS.TAG,
        type: FilterType.MultiSelect,
        label: 'Tags',
        options: [...staticTagFilterOptions, ...virtualTagFilterOptions],
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
