'use client';
import Pagination from '../../components/common/Pagination';
import Surface from '../../components/common/Surface';
import Table from '../../components/common/Table';
import DashboardToolbar, {
  type SearchFilterOption,
  getSearchValue,
} from '../../components/dashboard/DashboardToolbar';
import {
  createPatientRow,
  patientColumns,
  type Patient,
  type PatientRow,
} from './rowsandcolumns';
import { APIUrlContext } from '@/app/providers';
import { sessionStorageGetUserInfo } from '@/app/utils/auth';
import { isTesting } from '@/app/utils/env';
import { findPage } from '@rehua/sdk/functional/patient/page';
import {
  queryOptions,
  useQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useContext, useState, type JSX } from 'react';

export default function PatientsPage(): JSX.Element {
  const router = useRouter();
  const host = useContext(APIUrlContext);

  const group: 'nurse' | 'admin' = sessionStorageGetUserInfo().group;

  // TODO: frontend come back to this and import from elsewhere
  const patientStatusOptions = [
    'Long Term',
    'Short Term',
    'Palliative',
    'Daycare',
    ...(group === 'admin' ? ['Deceased'] : []), // add Decesed option if user is admin
  ];

  // search filters for the patient dashboard
  const patientSearchFilters: [SearchFilterOption, ...SearchFilterOption[]] = [
    { webValue: 'No Filter', apiValue: '', inputType: 'none' },
    { webValue: 'Room #', apiValue: 'roomNumber', inputType: 'text' },
    { webValue: 'First Name', apiValue: 'firstName', inputType: 'text' },
    { webValue: 'Last Name', apiValue: 'lastName', inputType: 'text' },
    { webValue: 'DOB', apiValue: 'dateOfBirth', inputType: 'date' },
    { webValue: 'Gender', apiValue: 'gender', inputType: 'text' },
    { webValue: 'NHI', apiValue: 'nhi', inputType: 'text' },
    { webValue: 'Date Admitted', apiValue: 'dateAdmitted', inputType: 'date' },
    { webValue: 'Nurse', apiValue: 'nurse', inputType: 'text' },
    { webValue: 'Status', apiValue: 'status', inputType: 'dropdown' },
    { webValue: 'Funding', apiValue: 'funding', inputType: 'text' },
  ];

  const [searchFilter, setSearchFilter] = useState<SearchFilterOption>(
    patientSearchFilters[0],
  ); // by default no search filter is applied
  const [searchValue, setSearchValue] = useState('');
  const [dropdownSearchValue, setDropdownSearchValue] = useState<string[]>([]); // filter by status uses this
  const [isSearchInvalid, setIsSearchInvalid] = useState(false); // state for showing pop up for no search value

  const [activeSearchFilter, setActiveSearchFilter] = useState<string>('');
  const [activeSearchValue, setActiveSearchValue] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function usePatientOptions(
    rowsPerPage: number,
    currentPage: number,
    filter?: string,
    search?: string,
  ) {
    return queryOptions({
      queryKey: ['patients', host, rowsPerPage, currentPage, filter, search],
      queryFn: async ({ signal }: QueryFunctionContext) =>
        findPage(
          {
            host: host,
            simulate: isTesting,
            options: { signal, credentials: 'include' },
          },
          rowsPerPage,
          currentPage,
          {
            filter,
            search,
          },
        ),
    });
  }

  const patientQuery = usePatientOptions(
    rowsPerPage,
    currentPage,
    activeSearchFilter,
    activeSearchValue,
  );
  const doc = useQuery(patientQuery);

  //check if docs has loaded, returns loading of not done
  if (doc.isError) {
    throw doc.error;
  } else if (!doc.isSuccess) {
    return <h1>Loading...</h1>;
  }

  const patients: Patient[] = doc.data.data;
  const totalRows = doc.data.meta.totalPages;

  // handle search filter change + reset search value when filter changes
  function handleNewSearchFilter(newSearchFilter: SearchFilterOption): void {
    setSearchValue(''); // reset search value when filter changes
    setDropdownSearchValue([]); // reset dropdown search value when filter changes
    setSearchFilter(newSearchFilter);

    if (newSearchFilter.webValue === 'No Filter') {
      setActiveSearchFilter('');
      setActiveSearchValue('');
      setCurrentPage(1);
    }
  }

  const patientRows: PatientRow[] = patients.map((patient, rowIndex) =>
    createPatientRow(patient, rowIndex),
  );

  // TODO: backend to handle search/filter and pagination based on these values being passed to it
  function handleSearch(): void {
    const searchValueToSend = getSearchValue(
      searchFilter.inputType,
      searchValue,
      dropdownSearchValue,
    );
    console.log('searchFilter:', searchValue);

    // dont search if there is no search value
    if (searchFilter.inputType !== 'none' && !searchValueToSend) {
      setIsSearchInvalid(true);
      return;
    }

    // else, search is valid, reset pop up state
    setIsSearchInvalid(false);

    console.log('searchFilter apiValue:', searchFilter.apiValue);
    console.log('searchValueToSend:', searchValueToSend);

    // send searchFilter.value, searchValueToSend, rowsPerPage, pageNumber
    setActiveSearchFilter(searchFilter.apiValue);
    setActiveSearchValue(searchValueToSend);

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
          searchFilters={patientSearchFilters}
          selectedSearchFilter={searchFilter}
          isSearchInvalid={isSearchInvalid}
          searchValue={searchValue}
          searchPlaceholder="Search Patients"
          searchInputType={searchFilter.inputType}
          dropdownSearchOptions={patientStatusOptions}
          dropdownSearchValue={dropdownSearchValue}
          addButtonText="Add Patient"
          selectedDashboard={['Patients Dashboard']}
          onSearchFilterChange={(newSearchFilter) => {
            handleNewSearchFilter(newSearchFilter);
          }}
          onSearchValueChange={setSearchValue}
          onSearchInvalidClose={() => {
            setIsSearchInvalid(false);
          }}
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
