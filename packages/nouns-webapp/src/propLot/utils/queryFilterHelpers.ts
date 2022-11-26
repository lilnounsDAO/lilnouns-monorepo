import {
  getPropLot_propLot_tagFilter as TagFilter,
  getPropLot_propLot_tagFilter_options as TagFilterOptions,
  getPropLot_propLot_sortFilter as SortFilter,
  getPropLot_propLot_sortFilter_options as SortFilterOptions,
  getPropLot_propLot_dateFilter as DateFilter,
  getPropLot_propLot_dateFilter_options as DateFilterOptions,
} from '../graphql/__generated__/getPropLot';

import { FilterType as FilterTyeEnum } from '../graphql/__generated__/globalTypes';

type Filter = TagFilter | SortFilter | DateFilter;
type FilterOptions = TagFilterOptions | SortFilterOptions | DateFilterOptions;

/*
  Find and return the preselected filter options from the GraphQL response.
*/
export const buildSelectedFilters = (filter: Filter) => {
  const selectedParams: string[] = [];
  filter.options.forEach(({ selected, value }) => {
    if (selected) {
      selectedParams.push(value);
    }
  });
  return selectedParams;
};

/*
  Use to keep track of single or multiselect filters for PropLot Home or Profile filters
*/
export const updateSelectedFilters = (
  filter: Filter,
  selectedFilters: string[],
  opt: FilterOptions,
  isSelected: boolean,
) => {
  let newFilters = [...selectedFilters];
  if (filter.type === FilterTyeEnum.SINGLE_SELECT) {
    if (isSelected) {
      newFilters = selectedFilters.filter(selectedFilter => selectedFilter !== opt.value);
    } else {
      newFilters = [opt.value];
    }
  }

  if (filter.type === FilterTyeEnum.MULTI_SELECT) {
    if (isSelected) {
      newFilters = selectedFilters.filter(selectedFilter => selectedFilter !== opt.value);
    } else {
      newFilters = [...selectedFilters, opt.value];
    }
  }

  return newFilters;
};
