import { useEffect, useState } from 'react';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  getPropLot_propLot_tagFilter as TagFilter,
  getPropLot_propLot_tagFilter_options as TagFilterOptions,
  getPropLot_propLot_sortFilter as SortFilter,
  getPropLot_propLot_sortFilter_options as SortFilterOptions,
  getPropLot_propLot_dateFilter as DateFilter,
  getPropLot_propLot_dateFilter_options as DateFilterOptions,
} from '../../graphql/__generated__/getPropLot';

import { FilterType as FilterTyeEnum } from '../../graphql/__generated__/globalTypes';

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

const DropdownFilter = ({
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

    setSelectedFilters(newFilters);
    updateFilters(newFilters, filter.id);
  };

  return (
    <div className="dui-dropdown">
      <label
        tabIndex={0}
        className="dui-btn dui-btn m-1 bg-white text-[#8C8D92] border border-[#e2e3e8] font-semibold text-[16px] normal-case pt-[12px] pb-[12px] pl-[26px] pr-[26px]"
      >
        <span className="pr-2">{filter.label}</span>
        <FontAwesomeIcon icon={faCaretDown} />
      </label>
      <ul
        tabIndex={0}
        className="dui-dropdown-content dui-menu dui-menu-compact lg:dui-menu-normal p-2 shadow bg-[#F4F4F8] text-[#8C8D92] rounded-box w-52"
      >
        {filter.options.map(opt => {
          const isSelected = selectedFilters.some(selectedFilter => selectedFilter === opt.value);
          return (
            <li
              onClick={evt => {
                evt.preventDefault();
                handleUpdateFilters(opt, isSelected);
              }}
              key={opt.id}
              className="mb-[2px] mt-[2px]"
            >
              <label
                className={`${
                  isSelected ? 'dui-active bg-white border border-[#E2E3E8]' : ''
                } dui-label cursor-pointer active:bg-white rounded-md justify-start`}
              >
                {filter.type === FilterTyeEnum.MULTI_SELECT && (
                  <input
                    type="radio"
                    name={opt.value}
                    className={`${
                      isSelected ? 'border-[#231F20]' : 'border-[#8C8D92]'
                    } dui-radio dui-radio-sm checked:bg-[#231F20] border-solid border-2`}
                    checked={isSelected}
                  />
                )}
                <span
                  className={`${
                    isSelected ? 'text-[#231F20]' : 'text-[#8C8D92]'
                  } dui-label-text font-bold`}
                >
                  {opt.label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DropdownFilter;
