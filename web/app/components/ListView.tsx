'use client';
import Icon, { type IconProps } from './Icon';
import type { ReactNode, JSX, CSSProperties } from 'react';

export interface ListRow {
  heading: string;
  content: ReactNode; // Row content - React Node (Element or primitive type)
  internalRowSize?: number; // Size of the icon, content (if plain text) and heading
  contentStyle?: CSSProperties; // Lets parent set custom CSS of the content data
  redRow?: boolean; // Apply rehua-ruby colour to row
  iconProps?: Omit<IconProps, 'className'>; // Optional icon to display next to heading
  stacked?: boolean; // Render content below the heading instead of inline
}

export interface ListViewProps {
  rows: ListRow[];
}

// React component that renders a list of rows with headings and content, optionally with icons and custom styles
function ListView({ rows }: Readonly<ListViewProps>): JSX.Element {
  return (
    <ul className="overflow-hidden" style={{ maxWidth: '100%' }}>
      {rows.map((row, index) => {
        const redRowStyle = row.redRow ? 'text-rehua-ruby' : ''; // Apply rehua-ruby colour to row if redRow is true
        const internalRowSize = row.internalRowSize ?? 20; // Font size applied to headers and text-based content (fallback to 20 if not specified)
        return (
          <li
            key={row.heading}
            // Render content below heading if stacked is true, otherwise render inline
            // Alternate bg colour between white and light gray for each row
            className={`
              flex gap-x-2 px-4 py-2
              ${row.stacked ? 'flex-col items-start gap-y-1' : 'items-center'}
              ${index % 2 === 0 ? 'bg-rehua-white' : 'bg-rehua-light-gray'}
            `}
          >
            {/* Render the icon and heading */}
            <span
              className={`
                flex items-center gap-x-2 font-bold
                ${redRowStyle}
              `}
              style={{ fontSize: internalRowSize }}
            >
              {row.iconProps && (
                <Icon
                  {...row.iconProps}
                  width={internalRowSize}
                  className={redRowStyle}
                />
              )}
              {row.heading}:
            </span>
            {/* Render the row content */}
            <div
              className={`
                min-w-0 flex-1
                ${row.stacked ? 'w-full' : ''}
                ${redRowStyle}
              `}
              style={{ fontSize: internalRowSize, ...row.contentStyle }}
            >
              {row.content}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default ListView;
