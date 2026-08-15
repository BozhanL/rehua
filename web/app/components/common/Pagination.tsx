'use client';

import ContentButton from './ContentButton';
import SingleLineInput from './SingleLineInput';
import Surface from './Surface';
import { useMemo, useState, type ChangeEvent, type JSX } from 'react';

interface PaginationProps {
  totalRows: number;
  currentPage: number;
  rowsPerPage: number; // how many rows to display per page
  onPageChange: (page: number) => void; // handled by parent, updates currentPage state
  onRowsPerPageChange: (rows: number) => void; // handled by parent, updates rowsPerPage state, e.g. reset to page 1 and request 15 rows
}

// React component that renders pagination controls for a table
function Pagination({
  totalRows,
  currentPage,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: Readonly<PaginationProps>): JSX.Element {
  const [isTypingPage, setIsTypingPage] = useState(false); // whether user is currently typing a page number
  const [pageInput, setPageInput] = useState(''); // value of page input field when user types a page number

  // calculate how many pages there are based on totalRows and rowsPerPage
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalRows / rowsPerPage));
  }, [totalRows, rowsPerPage]);

  // calculate which page numbers to display in pagination controls TODO: come back to this logic
  const visiblePages = useMemo(() => {
    return [1, 2, 3].filter((page) => page < totalPages);
  }, [totalPages]);

  // go to a specific page, clamping page number to be within valid range
  function goToPage(page: number): void {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    onPageChange(clamped);
  }

  // handle when user submits page number in input field
  function handlePageInputSubmit(): void {
    // convert input string to number
    const page = Number(pageInput);

    // if page is a valid number, go to that page
    if (!Number.isNaN(page)) {
      goToPage(page);
    }

    // reset typing state
    setIsTypingPage(false);
  }

  return (
    <div className="fixed bottom-0 left-0 w-full overflow-hidden">
      {/* pagination positioning on bottom of viewport ^ */}
      <div className="flex translate-y-1/2 items-center">
        {/* show only top half of surface ^ */}

        <Surface height={175} width="100%">
          {/* alignment for all surface items */}
          <div className="flex h-20 items-center justify-center gap-10">
            {/* rows per page selector */}
            <div className="flex items-center gap-3">
              <span className="text-xl font-medium">Number of rows:</span>

              <ContentButton
                text1="5"
                onClick={() => {
                  onRowsPerPageChange(5);
                }}
              />

              <ContentButton
                text1="10"
                onClick={() => {
                  onRowsPerPageChange(10);
                }}
              />

              <ContentButton
                text1="15"
                onClick={() => {
                  onRowsPerPageChange(15);
                }}
              />
            </div>

            {/* page selector */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-medium">Page:</span>

              <ContentButton
                text1="<"
                onClick={() => {
                  goToPage(currentPage - 1);
                }}
              />

              {visiblePages.map((page) => (
                <ContentButton
                  key={page}
                  text1={String(page)}
                  onClick={() => {
                    goToPage(page);
                  }}
                />
              ))}

              {/* page input; renders if there are more than 4 pages */}
              {totalPages > 4 &&
                (isTypingPage ? (
                  <SingleLineInput
                    autoFocus
                    type="number"
                    min={1}
                    max={totalPages}
                    value={pageInput}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setPageInput(event.currentTarget.value);
                    }}
                    onBlur={handlePageInputSubmit}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handlePageInputSubmit();
                      }
                    }}
                  />
                ) : (
                  <ContentButton
                    text1="..."
                    onClick={() => {
                      setIsTypingPage(true);
                    }}
                  />
                ))}

              {/* last page button */}
              {totalPages > 3 && (
                <ContentButton
                  text1={String(totalPages)}
                  onClick={() => {
                    goToPage(totalPages);
                  }}
                />
              )}

              {/* next page button */}
              <ContentButton
                text1=">"
                onClick={() => {
                  goToPage(currentPage + 1);
                }}
              />
            </div>
          </div>
        </Surface>
      </div>
    </div>
  );
}

export default Pagination;
