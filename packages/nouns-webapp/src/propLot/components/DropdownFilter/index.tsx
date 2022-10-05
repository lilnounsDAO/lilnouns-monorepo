import { useEffect, useState, forwardRef } from 'react';
import {
  faCaretDown,
  faArrowUp,
  faArrowDown,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
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
import { Dropdown, Form } from 'react-bootstrap';

type Filter = TagFilter | SortFilter | DateFilter;
type FilterOptions = TagFilterOptions | SortFilterOptions | DateFilterOptions;

interface IconMap {
  [key: string]: IconDefinition;
}

const SUPPORTED_ICONS: IconMap = {
  ARROW_UP: faArrowUp,
  ARROW_DOWN: faArrowDown,
};

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

type CustomToggleProps = {
  children?: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => any;
};

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = forwardRef(
  ({ children, onClick }: CustomToggleProps, ref: React.Ref<HTMLAnchorElement>) => (
    <a
      href=""
      ref={ref}
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }}
      className="flex flex-1 btn !rounded-[10px] bg-white border border-[#e2e3e8] p-0 focus:!bg-[#F4F4F8] focus:!text-[#231F20] !text-[#8C8D92]"
    >
      <span className="flex items-center justify-center font-semibold text-[16px] normal-case pt-[8px] pb-[8px] pl-[16px] pr-[16px]">
        {children}
      </span>
    </a>
  ),
);

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
    <Dropdown className="flex flex-1 sm:block sm:flex-none mr-[8px] last:mr-[0px]">
      <Dropdown.Toggle as={CustomToggle} id={`dropdown-${filter.id}`}>
        <span className="pr-2">{filter.label}</span>
        <FontAwesomeIcon icon={faCaretDown} />
      </Dropdown.Toggle>

      <Dropdown.Menu className="!min-w-[220px] !p-[8px] !mt-[8px] !bg-[#F4F4F8] !border !border-[#E2E3E8] !rounded-[10px]">
        {filter.options.map(opt => {
          const isSelected = selectedFilters.some(selectedFilter => selectedFilter === opt.value);
          return (
            <Dropdown.Item
              onClick={evt => {
                evt.preventDefault();
                handleUpdateFilters(opt, isSelected);
              }}
              key={opt.id}
              className={`${
                isSelected ? 'bg-white border border-[#E2E3E8]' : ''
              } min-width-[250px] cursor-pointer active:!bg-white !hover:bg-[#E2E3E8] rounded-[6px] justify-start mb-[2px] mt-[2px] !pt-[8px] !pb-[8px] pl-[16px] pr-[16px]`}
            >
              <div className="flex items-center">
                {filter.type === FilterTyeEnum.MULTI_SELECT && (
                  <Form.Check type="radio" name={opt.value} id={`${opt.id}`} checked={isSelected}>
                    <Form.Check.Input
                      type="radio"
                      name={opt.value}
                      checked={isSelected}
                      className={`${
                        isSelected
                          ? 'checked:!bg-[#231F20] checked:!border-[#E2E3E8] border-[#231F20]'
                          : 'border-[#8C8D92]'
                      } border-solid border-2 mr-2`}
                    />
                  </Form.Check>
                )}
                <span className="flex flex-1 items-center justify-between">
                  <span
                    className={`${
                      isSelected ? 'text-[#231F20]' : 'text-[#8C8D92]'
                    } font-semibold text-[14px]`}
                  >
                    {opt.label}
                  </span>
                  {SUPPORTED_ICONS[opt.icon || ''] && (
                    <FontAwesomeIcon
                      icon={SUPPORTED_ICONS[opt.icon as string]}
                      className={`${
                        isSelected ? 'text-[#231F20]' : 'text-[#8C8D92]'
                      } font-semibold text-[14px]`}
                    />
                  )}
                </span>
              </div>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownFilter;
