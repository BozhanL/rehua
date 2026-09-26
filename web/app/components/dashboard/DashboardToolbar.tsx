import ContentButton from '@/app/components/common/ContentButton';
import DropdownBar from '@/app/components/common/DropdownBar';
import PopUp from '@/app/components/common/PopUp';
import SingleLineInput from '@/app/components/common/SingleLineInput';
import dayjs from '@/app/utils/dayjs';
import type { ChangeEvent, JSX } from 'react';

// TODO: backend see if this should remain as is after auth is implemented
type UserGroup = 'nurse' | 'admin';

// different components are rendered depending on the type of filter selected
export type SearchInputType = 'none' | 'text' | 'date' | 'dropdown';

// interface for search filter options (mappings between what the user sees and what the backend expects)
export interface SearchFilterOption {
  webValue: string; // what the user sees
  apiValue: string; // what backend expects
  inputType: SearchInputType; // what type of input to render for this filter
}

// helper function to obtain the search value to send to the backend depending on the type of filter selected
export function getSearchValue(
  inputType: SearchInputType,
  searchValue: string,
  dropdownSearchValue: string[],
): string {
  switch (inputType) {
    case 'date': {
      if (!searchValue) {
        return '';
      }

      const date = dayjs.utc(searchValue);
      return date.isValid() ? date.startOf('day').toISOString() : '';
    }

    case 'dropdown':
      return dropdownSearchValue[0] ?? '';

    default:
      return searchValue;
  }
}

// options for dashboard dropdown; only for admin users
const dashboardOptions = [
  'Patients Dashboard',
  'Users Dashboard',
  'Templates Dashboard',
];

interface DashboardToolbarProps {
  title: string;
  group: UserGroup;

  searchFilters: SearchFilterOption[];
  selectedSearchFilter: SearchFilterOption;
  isSearchInvalid: boolean;

  searchValue: string;
  searchPlaceholder: string;
  searchInputType: SearchInputType;

  // only used when searchInputType === "dropdown"
  dropdownSearchOptions?: string[];
  dropdownSearchValue?: string[];

  addButtonText: string;

  selectedDashboard?: string[];

  onSearchFilterChange: (value: SearchFilterOption) => void;
  onSearchValueChange: (value: string) => void;
  onSearchInvalidClose: () => void;
  onDropdownSearchChange?: (value: string[]) => void;
  onSearch: () => void;
  onAdd: () => void;
  onDashboardChange?: (value: string[]) => void;
}

// React component for toolbar at the top of dashboard pages; changes made depending on user group
function DashboardToolbar({
  title,
  group,
  searchFilters,
  selectedSearchFilter,
  isSearchInvalid,
  searchValue,
  searchPlaceholder,
  searchInputType,
  dropdownSearchOptions,
  dropdownSearchValue,
  addButtonText,
  selectedDashboard = [],
  onSearchFilterChange,
  onSearchValueChange,
  onSearchInvalidClose,
  onDropdownSearchChange,
  onSearch,
  onAdd,
  onDashboardChange,
}: Readonly<DashboardToolbarProps>): JSX.Element {
  return (
    <div className="mx-5 mt-5 mb-4 overflow-x-auto">
      <div className="flex min-w-max items-center gap-6">
        {/* pop up for if no filter is selected/empty search value */}
        <PopUp
          text1={
            'Your search filter is empty/unselected.\nPlease select a filter or enter a search value to continue.'
          }
          button1Props={{
            text1: 'OK',
            iconProps: { name: 'circle-arrow' },
            backgroundColor: 'bg-rehua-green',
            horizontalPadding: 0.3,
            onClick: onSearchInvalidClose,
          }}
          modalProps={{ open: isSearchInvalid, surfaceProps: { height: 600 } }}
        />

        {/* page title */}
        <span className="text-3xl font-bold">{title}</span>

        {/* search filter; 1 option may be selected at a time */}
        <div className="shrink-0">
          <DropdownBar
            selectedValues={[selectedSearchFilter.webValue]}
            options={searchFilters.map((filter) => filter.webValue)}
            size={17}
            labelMode="prefix"
            defaultText="Search by: "
            width={300}
            onChange={(newSearchFilter) => {
              const selectedFilter = searchFilters.find(
                (filter) => filter.webValue === newSearchFilter[0],
              );

              if (selectedFilter) {
                onSearchFilterChange(selectedFilter);
              }
            }}
          />
        </div>

        {/* search input */}
        {searchInputType === 'text' && (
          <SingleLineInput
            value={searchValue}
            placeholder={searchPlaceholder}
            style={{ width: 300 }}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onSearchValueChange(event.currentTarget.value);
            }}
          />
        )}

        {searchInputType === 'date' && (
          <SingleLineInput
            type="date"
            value={searchValue}
            style={{ width: 300 }}
            onChange={(event) => {
              onSearchValueChange(event.target.value);
            }}
          />
        )}

        {searchInputType === 'dropdown' && (
          <DropdownBar
            selectedValues={dropdownSearchValue ?? []}
            options={dropdownSearchOptions ?? []}
            defaultText="Select Status"
            width={300}
            size={17}
            onChange={(value) => {
              onDropdownSearchChange?.(value);
            }}
          />
        )}

        {/* search button */}
        {searchInputType !== 'none' && (
          <ContentButton
            text1="Search"
            iconProps={{ name: 'search' }}
            backgroundColor="bg-rehua-jordy"
            verticalPadding={0.2}
            onClick={onSearch}
          />
        )}

        {/* add x button; will change for admin depending on selected dashboard */}
        <div className="ml-auto flex items-center gap-4">
          <ContentButton
            text1={addButtonText}
            iconProps={{ name: 'plus' }}
            backgroundColor="bg-rehua-green"
            verticalPadding={0.2}
            onClick={onAdd}
          />

          {/* admin only; navigate to the respective dashboards */}
          {group === 'admin' && (
            <DropdownBar
              selectedValues={selectedDashboard}
              options={dashboardOptions}
              size={17}
              width={250}
              onChange={(value: string[]) => {
                onDashboardChange?.(value);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardToolbar;
