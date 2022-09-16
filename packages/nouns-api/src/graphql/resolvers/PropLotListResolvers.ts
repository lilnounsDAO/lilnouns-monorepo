import IdeasService from '../../services/ideas';

import { IResolvers } from '@graphql-tools/utils';
import {UiPropLotSections, PropLotResponseMetadataResolvers, QueryGetPropLotArgs, UiListItemResolvers, Idea, FilterInput, UiIdeaRow, UiFilterPillGroup, UiFilterType, UiDropdownPill, TargetFilterParam, UiSortPillGroup, UiPropLotComponentList, UiPropLotFilterBar } from '../generated';

const FILTER_IDS = {
  DATE: "date",
  SORT: "sort",
  TAG: "tag",
};

const buildTargetParam = (key: string, value: string): TargetFilterParam => ({ param: { key, value } });
const getSortParam = (appliedFilters: FilterInput[]) => appliedFilters.find((aF: any) => aF.key === FILTER_IDS.SORT) || { key: FILTER_IDS.SORT, value: "LATEST" };
const getDateParam = (appliedFilters: FilterInput[]) => appliedFilters.find((aF: any) => aF.key === FILTER_IDS.DATE);

const resolvers: IResolvers = {
  Query: {
    getPropLot: async (_parent: any, args: QueryGetPropLotArgs) => {
      return { appliedFilters: args.options.filters || [], requestUUID: args.options.requestUUID }
    },
  },
  PropLotResponse: {
    sections: async (root): Promise<UiPropLotSections[]> => {
      const sortParam = getSortParam(root.appliedFilters);
      const ideas: Idea[] = await IdeasService.all(sortParam.value);
      const ideaRows: UiIdeaRow[] = ideas.map(idea => {
        const row: UiIdeaRow = {
          data: idea,
        }

        return row;
      })

      const dateParam = getDateParam(root.appliedFilters);

      const dropDownPill: UiDropdownPill = {
        __typename: 'UIDropdownPill',
        id: FILTER_IDS.DATE,
        selected: dateParam?.key === FILTER_IDS.DATE,
        label: "Top",
        options: [{
          id: "TODAY",
          selected: dateParam?.value === "TODAY",
          label: "Today",
          target: buildTargetParam(FILTER_IDS.DATE, "TODAY"),
        }],
      };

      const filterPills: UiFilterPillGroup = {
        __typename: "UIFilterPillGroup",
        id: "FILTER_PILLS",
        pills: [dropDownPill],
        type: UiFilterType.MultiSelect,
      };

      const sortPills: UiSortPillGroup = {
        __typename: "UISortPillGroup",
        id: FILTER_IDS.SORT,
        pills: [{
          __typename: 'UITogglePill',
          id: "sort_created",
          label: "Created",
          options: [
            {
              id: "LATEST",
              selected: sortParam?.value === "LATEST" || !sortParam,
              target: buildTargetParam(FILTER_IDS.SORT, "LATEST"),
            },
            {
              id: "OLDEST",
              selected: sortParam?.value === "OLDEST",
              target: buildTargetParam(FILTER_IDS.SORT, "OLDEST"),
            }
          ],
        },
        {
          __typename: 'UITogglePill',
          id: "sort_votes",
          label: "Votes",
          options: [
            {
              id: "VOTES_ASC",
              selected: sortParam?.value === "VOTES_ASC",
              target: buildTargetParam(FILTER_IDS.SORT, "VOTES_ASC"),
            },
            {
              id: "VOTES_DESC",
              selected: sortParam?.value === "VOTES_DESC",
              target: buildTargetParam(FILTER_IDS.SORT, "VOTES_DESC"),
            }
          ],
        },
      ],
      };

      const filterSection: UiPropLotFilterBar = {
        __typename: 'UIPropLotFilterBar',
        filterPills,
        sortPills,
      }

      const listSection: UiPropLotComponentList = {
        __typename: 'UIPropLotComponentList',
        list: ideaRows,
      }

      return [filterSection, listSection];
    },
    metadata: (root): PropLotResponseMetadataResolvers => ({
      requestUUID: root.requestUUID || "",
      appliedFilters: root.appliedFilters,
    })
  },
  UIListItem:<UiListItemResolvers> {
    __resolveType(item){
      if(item.data?.tldr){
        return 'UIIdeaRow';
      }
      return null;
    },
  },
};

export default resolvers;
