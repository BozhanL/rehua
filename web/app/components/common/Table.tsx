import type { JSX, ReactNode } from 'react';

interface TableRow {
  id: number; // unique identifier for each row
  [key: string]: ReactNode; // row contents, e.g. "status: <MiniLabel ... >" where "status" = key, and MiniLabel = ReactNode value
}

interface TableColumn<T extends TableRow = TableRow> {
  rowKey: keyof T; // which part of row to display in this column
  header: string;
  width?: number; // optional width of column in pixels, fallback to 120px
  contentAlignment?: 'left' | 'center' | 'right'; // optional alignment of column content, fallback to 'left'
}

interface TableProps<T extends TableRow = TableRow> {
  columns: TableColumn<T>[]; // array of columns
  rows: T[]; // array of rows
  emptyMessage?: ReactNode; // optional message to display when there are no rows, fallback to 'No results found'
}

function Table<T extends TableRow>({
  columns,
  rows,
  emptyMessage = 'No results found',
}: Readonly<TableProps<T>>): JSX.Element {
  // widths of columns and alignments of content in columns
  const columnWidths = columns.map((column) => column.width ?? 120);
  const contentAlignments = columns.map(
    (column) => column.contentAlignment ?? 'left',
  );

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        {/* table headers */}
        <thead className="bg-rehua-dark-gray">
          {/* table header row */}
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.rowKey)}
                className="px-4 py-3 text-sm font-bold"
                style={{
                  width: columnWidths[columns.indexOf(column)],
                  textAlign: contentAlignments[columns.indexOf(column)],
                }}
              >
                {column.header /* display column header text */}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* if there are no rows to display */}
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length} // stretch a single cell across all columns
                className="px-4 py-10 text-center text-sm"
              >
                {emptyMessage /* display empty message across all columns */}
              </td>
            </tr>
          ) : (
            // otherwise display table body
            rows.map((row, rowIndex) => (
              // make row
              <tr
                key={String(row.id)}
                className={
                  rowIndex % 2 === 0 ? 'bg-rehua-white' : 'bg-rehua-light-gray'
                }
              >
                {
                  // make cells for each column in the row
                  columns.map((column) => (
                    <td
                      key={String(column.rowKey)}
                      className="px-4 py-3 align-middle text-sm"
                      style={{
                        width: columnWidths[columns.indexOf(column)],
                        textAlign: contentAlignments[columns.indexOf(column)],
                      }}
                    >
                      {row[column.rowKey]}
                    </td>
                  ))
                }
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
