'use client';
import {
  createTemplateRow,
  templateColumns,
  type Template,
  type TemplateRow,
} from './rowsandcolumns';
import {
  presetLabels,
  type MiniPresetLabel,
} from '@/app/components/common/MiniLabel';
import Pagination from '@/app/components/common/Pagination';
import Surface from '@/app/components/common/Surface';
import Table from '@/app/components/common/Table';
import type { SearchFilterOption } from '@/app/components/dashboard/DashboardToolbar';
import DashboardToolbar, {
  getSearchValue,
} from '@/app/components/dashboard/DashboardToolbar';
import { APIUrlContext } from '@/app/providers';
import { sessionStorageGetUserInfo } from '@/app/utils/auth';
import { isTesting } from '@/app/utils/env';
import { templateStatuses, templateStatusLabels } from '@/app/utils/types';
import { findPage } from '@rehua/sdk/functional/templates/page';
import {
  queryOptions,
  useQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useContext, useState, type JSX } from 'react';

export default function TemplatesPage(): JSX.Element {
  const group: 'nurse' | 'admin' = sessionStorageGetUserInfo().group;
  const host = useContext(APIUrlContext);
  const router = useRouter();

  // convert preset keys into frontend text for the type search filter dropdown
  const templateTypeOptions: MiniPresetLabel[] = [
    'longTerm',
    'shortTerm',
    'daycare',
    'palliative',
  ];

  // search filters for the users dashboard
  const userSearchFilters: [SearchFilterOption, ...SearchFilterOption[]] = [
    { webValue: 'No Filter', apiValue: '', inputType: 'none' },
    { webValue: 'Template ID', apiValue: 'templateId', inputType: 'text' },
    { webValue: 'Template Name', apiValue: 'name', inputType: 'text' },
    { webValue: 'Type', apiValue: 'type', inputType: 'dropdown' },
    { webValue: 'Status', apiValue: 'status', inputType: 'dropdown' },
  ];

  const [searchFilter, setSearchFilter] = useState<SearchFilterOption>(
    userSearchFilters[0],
  ); // by default no search filter is applied
  const [searchValue, setSearchValue] = useState('');
  const [dropdownSearchValue, setDropdownSearchValue] = useState<string[]>([]); // dropdown search filters use this
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
      queryKey: ['templates', host, rowsPerPage, currentPage, filter, search],
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

  const templateQuery = usePatientOptions(
    rowsPerPage,
    currentPage,
    activeSearchFilter,
    activeSearchValue,
  );
  const doc = useQuery(templateQuery);

  //check if docs has loaded, returns loading of not done
  if (doc.isError) {
    throw doc.error;
  } else if (!doc.isSuccess) {
    return <h1>Loading...</h1>;
  }

  const templates: Template[] = doc.data.data;
  const totalPages = doc.data.meta.totalPages;

  // create template rows from the sample template data
  const templateRows: TemplateRow[] = templates.map((template, rowIndex) =>
    createTemplateRow(template, rowIndex),
  );

  // frontend dropdown options for the currently selected search filter
  const dropdownSearchOptions =
    searchFilter.webValue === 'Type'
      ? templateTypeOptions.map(
          (apiTypeValue) => presetLabels[apiTypeValue].text,
        )
      : Object.values(templateStatusLabels);

  // frontend dropdown display values for the currently selected search filter
  const dropdownSearchValueDisplay =
    searchFilter.webValue === 'Type'
      ? templateTypeOptions
          .filter((apiTypeValue) => dropdownSearchValue.includes(apiTypeValue))
          .map((apiTypeValue) => presetLabels[apiTypeValue].text)
      : templateStatuses
          .filter((apiStatusValue) =>
            dropdownSearchValue.includes(apiStatusValue),
          )
          .map((apiStatusValue) => templateStatusLabels[apiStatusValue]);

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

  function handleSearch(): void {
    const searchValueToSend = getSearchValue(
      searchFilter.inputType,
      searchValue,
      dropdownSearchValue,
    );

    // dont search if there is no search value
    if (searchFilter.inputType !== 'none' && !searchValueToSend) {
      setIsSearchInvalid(true);
      return;
    }

    // else, search is valid, reset pop up state
    setIsSearchInvalid(false);

    // update searchFilter.apiValue and searchValueToSend for the query
    setActiveSearchFilter(searchFilter.apiValue);
    setActiveSearchValue(searchValueToSend);

    // a new search/filter should start from page 1
    setCurrentPage(1);
  }

  function handlePageChange(newPage: number): void {
    // set current page to newPage
    setCurrentPage(newPage);
  }

  // handle rows per page change; the current page is reset to 1
  function handleRowsPerPageChange(newRowsPerPage: number): void {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  }

  // route to create template page
  function handleCreateTemplate(): void {
    router.push('/templates/create');
  }

  // route to selected dashboard page /patients or /users
  function handleDashboardChange(value: string[]): void {
    const selectedDashboard = value[0];

    if (selectedDashboard === 'Patients Dashboard') {
      router.push('/patients');
    }

    if (selectedDashboard === 'Users Dashboard') {
      router.push('/users');
    }

    // do nothing if already on patients dashboard
  }

  return (
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        {/* page toolbar */}
        <DashboardToolbar
          title="Templates"
          group={group}
          searchFilters={userSearchFilters}
          selectedSearchFilter={searchFilter}
          isSearchInvalid={isSearchInvalid}
          searchValue={searchValue}
          searchPlaceholder="Search Templates"
          searchInputType={searchFilter.inputType}
          dropdownSearchOptions={dropdownSearchOptions}
          dropdownSearchValue={dropdownSearchValueDisplay}
          addButtonText="Add Template"
          selectedDashboard={['Templates Dashboard']}
          onSearchFilterChange={(newSearchFilter) => {
            handleNewSearchFilter(newSearchFilter);
          }}
          onSearchValueChange={setSearchValue}
          onSearchInvalidClose={() => {
            setIsSearchInvalid(false);
          }}
          onDropdownSearchChange={(webValue) => {
            if (searchFilter.webValue === 'Type') {
              const selectedTypes = templateTypeOptions.filter((apiTypeValue) =>
                webValue.includes(presetLabels[apiTypeValue].text),
              );
              setDropdownSearchValue(selectedTypes);
            } else if (searchFilter.webValue === 'Status') {
              const selectedStatuses = templateStatuses.filter(
                (apiStatusValue) =>
                  webValue.includes(templateStatusLabels[apiStatusValue]),
              );
              setDropdownSearchValue(selectedStatuses);
            }
          }}
          onSearch={handleSearch}
          onAdd={handleCreateTemplate}
          onDashboardChange={handleDashboardChange}
        />

        {/* table */}
        <Table columns={templateColumns} rows={templateRows} />

        {/* pagination */}
        <div className="pb-35">
          <Pagination
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      </Surface>
    </div>
  );
}
