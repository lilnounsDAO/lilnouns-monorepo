import React, { useEffect, useState } from 'react';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'react-bootstrap';
import {
  getPropLot_propLot_tagFilter as TagFilter,
  getPropLot_propLot_tagFilter_options as TagFilterOptions,
  getPropLot_propLot_sortFilter as SortFilter,
  getPropLot_propLot_sortFilter_options as SortFilterOptions,
  getPropLot_propLot_dateFilter as DateFilter,
  getPropLot_propLot_dateFilter_options as DateFilterOptions,
} from '../../graphql/__generated__/getPropLot';

import { FilterInput, FilterType as FilterTyeEnum } from '../../graphql/__generated__/globalTypes';

type CustomToggleProps = {
  children?: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => any;
};

type Filter = TagFilter | SortFilter | DateFilter;
type FilterOptions = TagFilterOptions | SortFilterOptions | DateFilterOptions;

/*
  Find and return the preselected filter options from the GraphQL response.
*/
export const buildSelectedFilters = (filter: Filter) => {
  const selectedParams: FilterInput[] = [];
  filter.options.forEach(({ selected, value }) => {
    if (selected) {
      selectedParams.push({ id: filter.id, value });
    }
  });
  return selectedParams;
};

const CustomToggle = React.forwardRef(
  ({ children, onClick }: CustomToggleProps, ref: React.Ref<HTMLSpanElement>) => (
    <span
      ref={ref}
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <FontAwesomeIcon icon={faArrowDown} />
    </span>
  ),
);

const DropdownFilter = ({
  filter,
  updateFilters,
}: {
  filter: Filter;
  updateFilters: (filters: FilterInput[], filterId: string) => void;
}) => {
  const [selectedFilters, setSelectedFilters] = useState(buildSelectedFilters(filter));

  useEffect(() => {
    setSelectedFilters(buildSelectedFilters(filter));
  }, [filter]);

  const handleUpdateFilters = (opt: FilterOptions, isSelected: boolean) => {
    let newFilters = [...selectedFilters];
    if (filter.type === FilterTyeEnum.SINGLE_SELECT) {
      if (isSelected) {
        newFilters = selectedFilters.filter(selectedFilter => selectedFilter.value !== opt.value);
      } else {
        newFilters = [{ id: filter.id, value: opt.value }];
      }
    }

    if (filter.type === FilterTyeEnum.MULTI_SELECT) {
      if (isSelected) {
        newFilters = selectedFilters.filter(selectedFilter => selectedFilter.value !== opt.value);
      } else {
        newFilters = [...selectedFilters, { id: filter.id, value: opt.value }];
      }
    }

    setSelectedFilters(newFilters);
    updateFilters(newFilters, filter.id);
  };

  return (
    <Dropdown className="mr-2 flex">
      <Dropdown.Toggle id="dropdown-custom-components">{filter.label}</Dropdown.Toggle>

      <Dropdown.Menu>
        {filter.options.map(opt => {
          const isSelected = selectedFilters.some(
            selectedFilter => selectedFilter.value === opt.value,
          );
          return (
            <Dropdown.Item
              onClick={evt => {
                evt.preventDefault();
                handleUpdateFilters(opt, isSelected);
              }}
              active={isSelected}
              key={opt.id}
            >
              {opt.label}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownFilter;
