'use client';

import ContentButton from './ContentButton';
import SingleLineInput from './SingleLineInput';
import Surface from './Surface';
import { useMemo, useState, type ChangeEvent, type JSX } from 'react';

interface PaginationProps {
  totalRows: number;
  currentPage: number;
  rowsPerPage: number;

  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

function Pagination({
  totalRows,
  currentPage,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: Readonly<PaginationProps>): JSX.Element {
  const [isTypingPage, setIsTypingPage] = useState(false);
  const [pageInput, setPageInput] = useState('');

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalRows / rowsPerPage));
  }, [totalRows, rowsPerPage]);

  const visiblePages = useMemo(() => {
    return [1, 2, 3].filter((page) => page < totalPages);
  }, [totalPages]);

  function goToPage(page: number): void {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    onPageChange(clamped);
  }

  function handlePageInputSubmit(): void {
    const page = Number(pageInput);

    if (!Number.isNaN(page)) {
      goToPage(page);
    }

    setIsTypingPage(false);
    setPageInput('');
  }

  return (
    <div className="fixed bottom-0 left-0 w-full overflow-hidden">
      <div className="flex translate-y-1/2 justify-center">
        <Surface height={160}>
          <div className="flex h-20 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium">Number of rows:</span>

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

            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">Page:</span>

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
            </div>

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

            {totalPages > 3 && (
              <ContentButton
                text1={String(totalPages)}
                onClick={() => {
                  goToPage(totalPages);
                }}
              />
            )}

            <ContentButton
              text1=">"
              onClick={() => {
                goToPage(currentPage + 1);
              }}
            />
          </div>
        </Surface>
      </div>
    </div>
  );
}

export default Pagination;
