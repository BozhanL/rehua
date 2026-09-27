'use client';
import { patientColumns, patientRows } from './rowsandcolumns';
import Pagination from '@/app/components/common/Pagination';
import Surface from '@/app/components/common/Surface';
import Table from '@/app/components/common/Table';
import DashboardToolbar, {
  getFilterType,
  type SearchFilter,
} from '@/app/components/dashboard/DashboardToolbar';
import dayjs from '@/app/utils/dayjs';
import { useRouter } from 'next/navigation';
import { useState, type JSX } from 'react';

export default function PatientsPage(): JSX.Element {
  const router = useRouter();

  // TODO: backend replace this info with currently logged in user's group (nurse or admin)
  const group: 'nurse' | 'admin' = 'admin';

  // TODO: backend return available statuses for currently logged in user
  const patientStatusOptions = [
    'Long Term',
    'Short Term',
    'Palliative',
    'Daycare',
  ];

  const [searchFilter, setSearchFilter] = useState<SearchFilter[]>([
    'No Filter',
  ]); // by default no search filter is applied
  const [searchValue, setSearchValue] = useState('');
  const [dropdownSearchValue, setDropdownSearchValue] = useState<string[]>([]); // filter by status uses this

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // TODO: backend to provide total number of rows for pagination
  const totalRows = patientRows.length;

  // handle search filter change + reset search value when filter changes
  function handleNewSearchFilter(newSearchFilter: SearchFilter[]): void {
    setSearchValue(''); // reset search value when filter changes
    setSearchFilter(newSearchFilter);
    if (newSearchFilter[0] === 'No Filter') {
      // TODO: backend handle if filter is reset to "No Filter"
      console.log('searchFilter: No Filter');
    }
  }

  // TODO: backend to handle search/filter and pagination based on these values being passed to it
  function handleSearch(): void {
    const searchValueToSend =
      getFilterType(searchFilter) === 'date'
        ? dayjs.tz(searchValue).startOf('day').toISOString()
        : searchValue;
    console.log('searchFilter:', searchValueToSend);

    // send searchFilter, searchValue, rowsPerPage

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

  // route to add patient page
  function handleAddPatient(): void {
    router.push('/patients/add');
  }

  // route to selected dashboard page /templates or /users
  function handleDashboardChange(value: string[]): void {
    const selectedDashboard = value[0];

    if (selectedDashboard === 'Users Dashboard') {
      router.push('/users');
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
          title="Patients"
          group={group}
          selectedSearchFilter={searchFilter}
          searchValue={searchValue}
          searchPlaceholder="Search Patients"
          searchInputType={getFilterType(searchFilter)}
          dropdownSearchOptions={patientStatusOptions}
          dropdownSearchValue={dropdownSearchValue}
          addButtonText="Add Patient"
          selectedDashboard={['Patients Dashboard']}
          onSearchFilterChange={(newSearchFilter) => {
            handleNewSearchFilter(newSearchFilter);
          }}
          onSearchValueChange={setSearchValue}
          onDropdownSearchChange={setDropdownSearchValue}
          onSearch={handleSearch}
          onAdd={handleAddPatient}
          onDashboardChange={handleDashboardChange}
        />

        {/* table */}
        <Table columns={patientColumns} rows={patientRows} />

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
