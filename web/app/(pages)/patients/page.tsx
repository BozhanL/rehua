// TODO: backend delete this lint rule once the group variable is actually coming from the backend
// ignore any errors for group === 'nurse' or group === 'admin' until above is completed

'use client';
import Pagination from '../../components/common/Pagination';
import Surface from '../../components/common/Surface';
import Table from '../../components/common/Table';
import DashboardToolbar from '../../components/dashboard/DashboardToolbar';
import { patientColumns, patientRows } from './rowsandcolumns';
import { useState, type JSX } from 'react';

// TODO: frontend - route to add patient page
function handleAddPatient(): void {
  console.log('add patient clicked');
}

// TODO: frontend - route to selected dashboard page /templates or /users
function handleDashboardChange(value: string[]): void {
  console.log('Dashboard changed:', value);
}

export default function PatientsPage(): JSX.Element {
  // TODO: backend replace this info with currently logged in user's group (nurse or admin)
  const group: 'nurse' | 'admin' = 'admin';

  const [searchFilter, setSearchFilter] = useState<string[]>(['Name']); // default search filter is by name
  const [searchValue, setSearchValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // TODO: backend to provide total number of rows for pagination
  const totalRows = patientRows.length;

  // TODO: backend to handle search/filter and pagination based on these values being passed to it
  function handleSearch(): void {
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

  return (
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        {/* page toolbar */}
        <DashboardToolbar
          title="Patients"
          group={group}
          selectedSearchFilter={searchFilter}
          searchFilterOptions={[
            'Room #',
            'Name',
            'DOB',
            'Gender',
            'NHI',
            'Date Admitted',
            'Nurse',
            'Status',
            'Funding',
          ]}
          searchValue={searchValue}
          searchPlaceholder="Search Patients"
          addButtonText="Add Patient"
          selectedDashboard={['Patients Dashboard']}
          onSearchFilterChange={setSearchFilter}
          onSearchValueChange={setSearchValue}
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
