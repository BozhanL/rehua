'use client';
import { userColumns, userGroups, userRows } from './rowsandcolumns';
import { presetLabels } from '@/app/components/common/MiniLabel';
import Pagination from '@/app/components/common/Pagination';
import Surface from '@/app/components/common/Surface';
import Table from '@/app/components/common/Table';
import type { SearchFilterOption } from '@/app/components/dashboard/DashboardToolbar';
import DashboardToolbar, {
  getSearchValue,
} from '@/app/components/dashboard/DashboardToolbar';
import { useRouter } from 'next/navigation';
import { useState, type JSX } from 'react';

export default function UsersPage(): JSX.Element {
  // TODO: backend replace this with currently logged in user's group
  const group: 'nurse' | 'admin' = 'admin';
  const router = useRouter();

  // define the list of user statuses for the status dropdown, using preset labels
  const userStatuses = [presetLabels.active, presetLabels.disabled];

  // search filters for the users dashboard
  const userSearchFilters: [SearchFilterOption, ...SearchFilterOption[]] = [
    { webValue: 'No Filter', apiValue: '', inputType: 'none' },
    { webValue: 'Username', apiValue: 'username', inputType: 'text' },
    { webValue: 'First Name', apiValue: 'firstName', inputType: 'text' },
    { webValue: 'Last Name', apiValue: 'lastName', inputType: 'text' },
    { webValue: 'Email', apiValue: 'email', inputType: 'text' },
    { webValue: 'Group', apiValue: 'group', inputType: 'dropdown' },
    { webValue: 'Status', apiValue: 'status', inputType: 'dropdown' },
  ];

  const [searchFilter, setSearchFilter] = useState<SearchFilterOption>(
    userSearchFilters[0],
  ); // by default no search filter is applied
  const [searchValue, setSearchValue] = useState('');
  const [dropdownSearchOptions, setDropdownSearchOptions] = useState<string[]>(
    [],
  ); // options for the dropdown search filter
  const [dropdownSearchValue, setDropdownSearchValue] = useState<string[]>([]); // filter by status uses this
  const [isSearchInvalid, setIsSearchInvalid] = useState(false); // state for showing pop up for no search value

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const totalRows = 5; // TODO: backend replace this

  // handle search filter change + reset search value when filter changes
  function handleNewSearchFilter(newSearchFilter: SearchFilterOption): void {
    setSearchValue(''); // reset search value when filter changes
    setDropdownSearchValue([]); // reset dropdown search value when filter changes
    setSearchFilter(newSearchFilter);

    // handle dropdown search option edge cases
    if (newSearchFilter.inputType === 'dropdown') {
      if (newSearchFilter.webValue === 'Group') {
        setDropdownSearchOptions(userGroups);
      }
      if (newSearchFilter.webValue === 'Status') {
        setDropdownSearchOptions(userStatuses.map((label) => label.text));
      }
    }

    if (newSearchFilter.webValue === 'No Filter') {
      // TODO: backend handle if filter is reset to "No Filter"
      console.log('searchFilter: No Filter');
    }
  }

  // TODO: backend to handle search/filter and pagination based on these values being passed to it
  function handleSearch(): void {
    const searchValueToSend = getSearchValue(
      searchFilter.inputType,
      searchValue,
      dropdownSearchValue,
    );
    console.log('searchFilter:', searchValueToSend);

    // dont search if there is no search value
    if (searchFilter.inputType === 'none' || !searchValueToSend) {
      setIsSearchInvalid(true);
      return;
    }

    // else, search is valid, reset pop up state
    setIsSearchInvalid(false);

    // send searchFilter.value, searchValueToSend, rowsPerPage, pageNumber

    // a new search/filter should start from page 1
    setCurrentPage(1);
  }

  // TODO: backend handle page change; request new page with current filter/search values
  function handlePageChange(newPage: number): void {
    // set current page to newPage
    setCurrentPage(newPage);
    // send searchFilter, searchValue, currentPage and rowsPerPage
  }

  // handle rows per page change; the current page is reset to 1
  function handleRowsPerPageChange(newRowsPerPage: number): void {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);

    // TODO: backend request page 1 using the new rowsPerPage value
    //
    // send:
    // {
    //   filter: searchFilter,
    //   search: searchValue,
    //   page: 1,
    //   rowsPerPage: newRowsPerPage
    // }
  }

  // route to add user page
  function handleAddUser(): void {
    router.push('/users/add');
  }

  // route to selected dashboard page /patients or /templates
  function handleDashboardChange(value: string[]): void {
    const selectedDashboard = value[0];

    if (selectedDashboard === 'Patients Dashboard') {
      router.push('/patients');
    }

    if (selectedDashboard === 'Templates Dashboard') {
      router.push('/templates');
    }

    // do nothing if already on patients dashboard
  }

  return (
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        {/* page toolbar */}
        <DashboardToolbar
          title="Users"
          group={group}
          searchFilters={userSearchFilters}
          selectedSearchFilter={searchFilter}
          isSearchInvalid={isSearchInvalid}
          searchValue={searchValue}
          searchPlaceholder="Search Users"
          searchInputType={searchFilter.inputType}
          dropdownSearchOptions={dropdownSearchOptions}
          dropdownSearchValue={dropdownSearchValue}
          addButtonText="Add User"
          selectedDashboard={['Users Dashboard']}
          onSearchFilterChange={(newSearchFilter) => {
            handleNewSearchFilter(newSearchFilter);
          }}
          onSearchValueChange={setSearchValue}
          onSearchInvalidClose={() => {
            setIsSearchInvalid(false);
          }}
          onDropdownSearchChange={setDropdownSearchValue}
          onSearch={handleSearch}
          onAdd={handleAddUser}
          onDashboardChange={handleDashboardChange}
        />

        {/* table */}
        <Table columns={userColumns} rows={userRows} />

        {/* pagination */}
        <div className="pb-35">
          <Pagination
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            totalRows={totalRows}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      </Surface>
    </div>
  );
}
