import type { JSX, ReactNode } from 'react';

interface TableRow {
  id: number; // unique identifier for each row
  [key: string]: ReactNode; // row contents, e.g. "status: <MiniLabel ... >" where "status" = key, and MiniLabel = ReactNode value
}

interface TableColumn<T extends TableRow = TableRow> {
  key: keyof T | string; // which part of row to display in this column, | string allows custom columns that do not exist in row
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
        {/* table header */}
        <thead className="bg-rehua-white">
          {/* table header row */}
          <tr>
            {columns.map((column) => (
              <th
                key={
                  typeof column.key === 'string'
                    ? column.key
                    : String(column.key)
                }
                className="
                  border-b border-gray-200 px-4 py-3 text-sm font-bold
                  text-gray-900
                "
                style={{
                  width: columnWidths[columns.indexOf(column)],
                  textAlign: contentAlignments[columns.indexOf(column)],
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* table body */}
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={typeof row.id === 'string' ? row.id : String(row.id)}
                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                {columns.map((column) => (
                  <td
                    key={
                      typeof column.key === 'string'
                        ? column.key
                        : String(column.key)
                    }
                    className="
                      border-b border-gray-100 px-4 py-3 align-middle text-sm
                      text-gray-900
                    "
                    style={{
                      width: columnWidths[columns.indexOf(column)],
                      textAlign: contentAlignments[columns.indexOf(column)],
                    }}
                  >
                    {row[column.key as keyof T]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
