import { useEffect, useState, forwardRef } from 'react';
import { buildSelectedFilters, updateSelectedFilters } from '../../utils/queryFilterHelpers';

import {
  getPropLot_propLot_tagFilter as TagFilter,
  getPropLot_propLot_tagFilter_options as TagFilterOptions,
  getPropLot_propLot_sortFilter as SortFilter,
  getPropLot_propLot_sortFilter_options as SortFilterOptions,
  getPropLot_propLot_dateFilter as DateFilter,
  getPropLot_propLot_dateFilter_options as DateFilterOptions,
} from '../../graphql/__generated__/getPropLot';

type Filter = TagFilter | SortFilter | DateFilter;
type FilterOptions = TagFilterOptions | SortFilterOptions | DateFilterOptions;

const ProfileTabFilters = ({
  filter,
  updateFilters,
}: {
  filter: Filter;
  updateFilters: (filters: string[], filterId: string) => void;
}) => {
  const [selectedFilters, setSelectedFilters] = useState(buildSelectedFilters(filter));

  useEffect(() => {
    setSelectedFilters(buildSelectedFilters(filter));
  }, [filter]);

  const handleUpdateFilters = (opt: FilterOptions, isSelected: boolean) => {
    const newFilters = updateSelectedFilters(filter, selectedFilters, opt, isSelected);

    setSelectedFilters(newFilters);
    updateFilters(newFilters, filter.id);
  };

  return (
    <div className="flex flex-1 flex-row items-center overflow-scroll pt-[8px] gap-[16px]">
      {filter.options.map(opt => {
        const isSelected = selectedFilters.some(selectedFilter => selectedFilter === opt.value);
        return (
          <div
            onClick={evt => {
              evt.preventDefault();
              handleUpdateFilters(opt, isSelected);
            }}
            key={opt.id}
            className={`${
              isSelected
                ? 'text-[#2B83F6] underline underline-offset-8 decoration-2'
                : 'hover:text-[#2B83F6] pb-[6px]'
            } whitespace-nowrap cursor-pointer text-[#8C8D92] flex-1 sm:flex-none font-semibold font-propLot pb-[2px]`}
          >
            {opt.label}
          </div>
        );
      })}
    </div>
  );
};

export default ProfileTabFilters;
