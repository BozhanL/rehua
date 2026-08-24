'use client';

import { columns, rows } from './rowsandcolumns';
import Pagination from '@/app/components/common/Pagination';
import Table from '@/app/components/common/Table';
import { useState, type JSX } from 'react';

export default function PaginationTestPage(): JSX.Element {
  // FRONTEND:
  // states for current page and rows per page
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // BACKEND:
  // Instead of rows.length, the backend will return the total number
  // of rows that match the current filters/search criteria.
  //
  // For example, if there are 100 total records but the user filters
  // them down to 23 matching records, the backend should return:
  //
  // totalRows: 23
  //
  // This value is needed by Pagination to calculate the total number
  // of pages.
  //
  // derive total rows to be displayed
  const totalRows = rows.length;

  // BACKEND:
  // These calculations are only being done here because this test page
  // currently has all of the rows locally.
  //
  // When connected to the backend, these calculations will no longer
  // be needed on the frontend.
  //
  // Instead, the frontend will send currentPage and rowsPerPage to
  // the backend, which will then calculate which records belong to that page
  // and only return those records.
  //
  // calculate start and end index for slicing rows array
  const startIndex = (currentPage - 1) * rowsPerPage; // e.g. if currentPage is 1 and rowsPerPage is 5, startIndex will be 0
  const endIndex = startIndex + rowsPerPage; // e.g. if startIndex is 0 and rowsPerPage is 5, endIndex will be 5

  // BACKEND:
  // displayedRows is currently simulated by slicing the complete local
  // rows array.
  //
  // Once the backend is connected, the backend will already have
  // performed this pagination and returned only the rows needed for
  // the current page.
  //
  // Therefore, displayedRows will eventually just be the rows returned
  // by the backend.
  //
  // For example:
  //
  // User selects:
  // currentPage = 2
  // rowsPerPage = 5
  //
  // Frontend sends:
  // page=2&rowsperpage=5
  //
  // Backend finds rows 6-10 and returns them.
  //
  // The frontend then gives those returned rows directly to <Table />.
  //
  // slice rows array to get only rows for current page, startIndex is inclusive and endIndex is exclusive
  const displayedRows = rows.slice(startIndex, endIndex);

  return (
    <div className="pb-35">
      <Table columns={columns} rows={displayedRows} />

      <Pagination
        totalRows={totalRows}

        // FRONTEND + BACKEND:
        // This value will be sent to the backend when requesting data.
        currentPage={currentPage}

        // FRONTEND + BACKEND:
        // This value will also be sent to the backend.
        // The backend should then return no more than 5 rows for that
        // request, assuming there are at least 5 rows remaining.
        rowsPerPage={rowsPerPage}

        // FRONTEND + BACKEND:
        // When this changes, the page should make a new backend request
        // using the new currentPage value.
        //
        // changes current page when user clicks on a different page number
        onPageChange={setCurrentPage}

        // FRONTEND + BACKEND:
        // When this changes, the page should make a new backend request
        // using the new rowsPerPage value.
        //
        // called when user changes number of rows per page
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setCurrentPage(1); // reset to first page
        }}
      />
    </div>
  );
}
