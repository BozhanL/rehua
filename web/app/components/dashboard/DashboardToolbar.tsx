import ContentButton from '../../components/common/ContentButton';
import DropdownBar from '../../components/common/DropdownBar';
import SingleLineInput from '../../components/common/SingleLineInput';
import type { ChangeEvent, JSX } from 'react';

// TODO: backend see if this should remain as is after auth is implemented
type UserGroup = 'nurse' | 'admin';

// options for dashboard dropdown; only for admin users
const dashboardOptions = [
  'Patients Dashboard',
  'Users Dashboard',
  'Templates Dashboard',
];

interface DashboardToolbarProps {
  title: string;
  group: UserGroup;

  selectedSearchFilter: string[];
  searchFilterOptions: string[];

  searchValue: string;
  searchPlaceholder: string;

  addButtonText: string;

  selectedDashboard?: string[];

  onSearchFilterChange: (value: string[]) => void;
  onSearchValueChange: (value: string) => void;
  onSearch: () => void;
  onAdd: () => void;
  onDashboardChange?: (value: string[]) => void;
}

// React component for toolbar at the top of dashboard pages; changes made depending on user group
function DashboardToolbar({
  title,
  group,
  selectedSearchFilter,
  searchFilterOptions,
  searchValue,
  searchPlaceholder,
  addButtonText,
  selectedDashboard = [],
  onSearchFilterChange,
  onSearchValueChange,
  onSearch,
  onAdd,
  onDashboardChange,
}: Readonly<DashboardToolbarProps>): JSX.Element {
  return (
    <div className="mx-5 mt-5 mb-4 overflow-x-auto">
      <div className="flex min-w-max items-center gap-6">
        {/* page title */}
        <span className="text-3xl font-bold">{title}</span>

        {/* search filter; 1 option may be selected at a time */}
        <div className="shrink-0">
          <DropdownBar
            selectedValues={selectedSearchFilter}
            options={searchFilterOptions}
            size={17}
            labelMode="prefix"
            defaultText="Search by: "
            width={300}
            onChange={onSearchFilterChange}
          />
        </div>

        {/* search input */}
        <SingleLineInput
          value={searchValue}
          placeholder={searchPlaceholder}
          style={{ width: 300 }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onSearchValueChange(event.currentTarget.value);
          }}
        />

        {/* search button */}
        <ContentButton
          text1="Search"
          iconProps={{ name: 'search' }}
          backgroundColor="bg-rehua-jordy"
          verticalPadding={0.2}
          onClick={onSearch}
        />

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
