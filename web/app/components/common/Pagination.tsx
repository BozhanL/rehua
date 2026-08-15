'use client';

import ContentButton from './ContentButton';
import SingleLineInput from './SingleLineInput';
import Surface from './Surface';
import { useState, type ChangeEvent, type JSX } from 'react';

interface PaginationProps {
  totalRows: number;
  currentPage: number;
  rowsPerPage: number; // how many rows to display per page
  onPageChange: (page: number) => void; // handled by parent, updates currentPage state
  onRowsPerPageChange: (rows: number) => void; // handled by parent, updates rowsPerPage state, e.g. reset to page 1 and request 15 rows
}

// functions for determining buttons colours depending on whether they are clicked or not
function foregroundColorPicker(selectedCondition: boolean): string {
  return selectedCondition ? 'text-rehua-white' : 'text-rehua-black';
}

function backgroundColorPicker(selectedCondition: boolean): string {
  return selectedCondition ? 'bg-rehua-navy' : 'bg-rehua-gray';
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
  const [enteredPage, setEnteredPage] = useState<number | null>(null); // last page number entered by user

  // calculate how many pages there are based on totalRows and rowsPerPage
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));

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
      const clamped = Math.min(Math.max(page, 1), totalPages);
      setEnteredPage(clamped);
      goToPage(clamped);
    }

    // reset typing state and clear input field
    setIsTypingPage(false);
    setPageInput('');
  }

  // open page input field for user to type a page number
  function openPageInput(): void {
    setPageInput(enteredPage === null ? '' : String(enteredPage));
    setIsTypingPage(true);
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
              <span className="text-xl font-bold">Number of rows:</span>

              <ContentButton
                text1="5"
                horizontalPadding={0.4}
                foregroundColor={foregroundColorPicker(rowsPerPage === 5)}
                backgroundColor={backgroundColorPicker(rowsPerPage === 5)}
                onClick={() => {
                  onRowsPerPageChange(5);
                }}
              />

              <ContentButton
                text1="10"
                horizontalPadding={0.3}
                foregroundColor={foregroundColorPicker(rowsPerPage === 10)}
                backgroundColor={backgroundColorPicker(rowsPerPage === 10)}
                onClick={() => {
                  onRowsPerPageChange(10);
                }}
              />

              <ContentButton
                text1="15"
                horizontalPadding={0.3}
                foregroundColor={foregroundColorPicker(rowsPerPage === 15)}
                backgroundColor={backgroundColorPicker(rowsPerPage === 15)}
                onClick={() => {
                  onRowsPerPageChange(15);
                }}
              />
            </div>

            {/* currently selected page */}
            <span className="text-xl">
              <span className="font-bold">Selected page:</span>
              {` ${String(currentPage)}`}
            </span>

            {/* page selector */}
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold">Page:</span>

              {/* "<" button, rendered if there are at least 2 pages */}
              {totalPages > 1 && (
                <ContentButton
                  iconProps={{
                    name: 'simple-arrow',
                    width: 0.3,
                    flip: 'horizontal',
                  }}
                  horizontalPadding={0.4}
                  backgroundColor="bg-rehua-navy"
                  onClick={() => {
                    goToPage(currentPage - 1);
                  }}
                />
              )}

              {/* page numbers */}
              {totalPages <= 4 ? (
                // if there are 4 or fewer pages, render buttons for all pages
                Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <ContentButton
                      key={page}
                      text1={String(page)}
                      horizontalPadding={0.4}
                      foregroundColor={foregroundColorPicker(
                        currentPage === page,
                      )}
                      backgroundColor={backgroundColorPicker(
                        currentPage === page,
                      )}
                      onClick={() => {
                        goToPage(page);
                      }}
                    />
                  ),
                )
              ) : (
                <>
                  {/* else, if there are more than 4 pages, render first 3 pages and ... */}
                  {[1, 2, 3].map((page) => (
                    <ContentButton
                      key={page}
                      text1={String(page)}
                      horizontalPadding={0.4}
                      foregroundColor={foregroundColorPicker(
                        currentPage === page,
                      )}
                      backgroundColor={backgroundColorPicker(
                        currentPage === page,
                      )}
                      onClick={() => {
                        goToPage(page);
                      }}
                    />
                  ))}

                  {/* ... / user input page */}
                  {isTypingPage ? (
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
                      text1={enteredPage === null ? '...' : String(enteredPage)}
                      horizontalPadding={
                        enteredPage !== null && enteredPage > 9 ? 0.3 : 0.4
                      }
                      foregroundColor={foregroundColorPicker(
                        currentPage === enteredPage,
                      )}
                      backgroundColor={backgroundColorPicker(
                        currentPage === enteredPage,
                      )}
                      onClick={openPageInput}
                    />
                  )}

                  {/* last page; total pages number */}
                  <ContentButton
                    text1={String(totalPages)}
                    horizontalPadding={totalPages > 9 ? 0.3 : 0.4}
                    foregroundColor={foregroundColorPicker(
                      currentPage === totalPages,
                    )}
                    backgroundColor={backgroundColorPicker(
                      currentPage === totalPages,
                    )}

                    onClick={() => {
                      goToPage(totalPages);
                    }}
                  />
                </>
              )}

              {/* ">" button, rendered if there are at least 2 pages */}
              {totalPages > 1 && (
                <ContentButton
                  iconProps={{ name: 'simple-arrow', width: 0.3 }}
                  horizontalPadding={0.4}
                  backgroundColor="bg-rehua-navy"
                  onClick={() => {
                    goToPage(currentPage + 1);
                  }}
                />
              )}
            </div>
          </div>
        </Surface>
      </div>
    </div>
  );
}

export default Pagination;
