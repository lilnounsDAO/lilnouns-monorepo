import React, { useEffect, useState } from 'react';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'react-bootstrap';
import {
  getPropLot_propLot_sections_UIPropLotFilterBar_filters as UIFilterType,
  getPropLot_propLot_sections_UIPropLotFilterBar_filters_options_target_param as TargetParamType,
  getPropLot_propLot_sections_UIPropLotFilterBar_filters_options as UIFilterOptionType,
} from '../../graphql/__generated__/getPropLot';

import { UIFilterType as UIFilterTyeEnum } from '../../graphql/__generated__/globalTypes';

type CustomToggleProps = {
  children?: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => any;
};

/*
  Find and return the preselected filter options from the GraphQL response.
*/
export const buildSelectedFilters = (filter: UIFilterType) => {
  const selectedParams: TargetParamType[] = [];
  filter.options.forEach(({ selected, target }) => {
    if (selected) {
      selectedParams.push(target.param);
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

/*
  Current designs have the filters as dropdowns. If we want to customise the design we can add a style
  type to the UIFilter schema to alter the design. E.g. style = UIFilterStylePills if we want a pill layout.
*/
const UIFilter = ({
  filter,
  updateFilters,
}: {
  filter: UIFilterType;
  updateFilters: (filters: TargetParamType[], filterId: string) => void;
}) => {
  const [selectedFilters, setSelectedFilters] = useState(buildSelectedFilters(filter));

  useEffect(() => {
    setSelectedFilters(buildSelectedFilters(filter));
  }, [filter]);

  const handleUpdateFilters = (opt: UIFilterOptionType, isSelected: boolean) => {
    let newFilters = [...selectedFilters];
    if (filter.type === UIFilterTyeEnum.SINGLE_SELECT) {
      if (isSelected) {
        newFilters = selectedFilters.filter(
          selectedFilter => selectedFilter.value !== opt.target.param.value,
        );
      } else {
        newFilters = [opt.target.param];
      }
    }

    if (filter.type === UIFilterTyeEnum.MULTI_SELECT) {
      if (isSelected) {
        newFilters = selectedFilters.filter(
          selectedFilter => selectedFilter.value !== opt.target.param.value,
        );
      } else {
        newFilters = [...selectedFilters, opt.target.param];
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
            selectedFilter => selectedFilter.value === opt.target.param.value,
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

export default UIFilter;
