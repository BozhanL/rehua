/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// TODO: backend delete this lint rule once the group variable is actually coming from the backend
// ignore any errors for group === 'nurse' or group === 'admin' until above is completed

'use client';
import DropdownBar from '../../components/common/DropdownBar';
import Pagination from '../../components/common/Pagination';
import SingleLineInput from '../../components/common/SingleLineInput';
import Surface from '../../components/common/Surface';
import Table from '../../components/common/Table';
import { patientColumns, patientRows } from './rowsandcolumns';
import ContentButton from '@/app/components/common/ContentButton';
import { useState, type ChangeEvent, type JSX } from 'react';

// TODO: frontend - route to add patient page
function handleAddPatient(): void {
  console.log('add patient clicked');
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
        <div className="mx-5 mt-5 mb-4 overflow-x-auto">
          <div className="flex min-w-max items-center gap-6">
            {/* page title - TODO: frontend to change this depending on dashboard selected by admin */}
            <span className="text-3xl font-bold">Patients</span>

            {/* all users */}
            {/* search filter; 1 option may be selected at a time */}
            <div className="shrink-0">
              <DropdownBar
                selectedValues={searchFilter}
                options={[
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
                size={17}
                labelMode="prefix"
                defaultText="Search by: "
                width={300}
                onChange={(value: string[]) => {
                  setSearchFilter(value);
                }}
              />
            </div>

            {/* search input */}
            <SingleLineInput
              value={searchValue}
              placeholder="Search Patients"
              style={{ width: 300 }}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setSearchValue(event.currentTarget.value);
              }}
            />

            {/* search button */}
            <ContentButton
              text1="Search"
              iconProps={{ name: 'search' }}
              backgroundColor="bg-rehua-jordy"
              verticalPadding={0.2}
              onClick={handleSearch}
            />

            <div className="ml-auto flex items-center gap-4">
              {/* all users
              for admin only - will eventually make this change into following depending on the dashboard:
              patients = Add Patient
              templates = Add Template
              users = Add User */}
              <ContentButton
                text1="Add Patient"
                iconProps={{ name: 'plus' }}
                backgroundColor="bg-rehua-green"
                verticalPadding={0.2}
                onClick={handleAddPatient}
              />

              {/* admin only - TODO: frontend will make this eventually navigate to the respective dashboards */}
              {group === 'admin' && (
                <DropdownBar
                  selectedValues={['Patients Dashboard']}
                  options={[
                    'Patients Dashboard',
                    'Users Dashboard',
                    'Templates Dashboard',
                  ]}
                  size={17}
                  width={250}
                  onChange={() => {
                    console.log('dashboard changed!');
                  }}
                />
              )}
            </div>
          </div>
        </div>

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
