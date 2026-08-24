import type { JSX, ReactNode } from 'react';

interface TableRow {
  id: number; // unique identifier for each row
  content: Record<string, ReactNode>; // row contents, e.g. "status: <MiniLabel ... >" where "status" = key, and MiniLabel = ReactNode value
}

interface TableColumn<T extends TableRow = TableRow> {
  rowKey: keyof T['content']; // which part of row to display in this column
  header: ReactNode;
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
      <table className="w-full table-fixed border-collapse">
        {/* table headers */}
        <thead className="bg-rehua-gray">
          {/* table header row */}
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.rowKey)}
                className="px-4 py-3 text-lg font-bold"
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
                className="px-4 py-10 text-center text-xl"
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
                      className="px-4 py-3 align-middle text-lg"
                      style={{
                        width: columnWidths[columns.indexOf(column)],
                        textAlign: contentAlignments[columns.indexOf(column)],
                      }}
                    >
                      {
                        row.content[
                          column.rowKey
                        ] /* display content for this cell */
                      }
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
export type { TableRow, TableColumn, TableProps };
