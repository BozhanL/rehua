'use client';
import Icon, { type IconProps } from './Icon';
import type { ReactNode, JSX, CSSProperties } from 'react';

export interface ListRow {
  heading: string;
  content: ReactNode; // Row content - React Node (Element or primitive type)
  emphasise?: boolean; // Emphasise the row with red and bold text
  iconName?: IconProps['name']; // Type check to make sure input of iconName exists
  contentStyle?: CSSProperties; // Lets parent set custom CSS of the content data
  stacked?: boolean; // Render content below the heading instead of inline
  fontSize?: number; // Set custom font size for heading
  verticalAlign?: 'top'; // If content long, use this to change position of heading. Undefined fall back to center
}

//Parent component to build an array of Rows to pass as prop
interface ListViewProps {
  rows: ListRow[];
  maxWidth?: CSSProperties['maxWidth'];
}

// Render Rows
function ListView({
  rows,
  maxWidth = '100%',
}: Readonly<ListViewProps>): JSX.Element {
  return (
    //Render List of Rows
    <ul className="overflow-hidden" style={{ maxWidth }}>
      {rows.map((row, index) => {
        //If style variant specified for this row
        const headingStyle = row.emphasise
          ? 'font-bold text-rehua-ruby'
          : 'font-bold text-rehua-black';
        const contentStyle = row.emphasise ? 'font-bold text-rehua-ruby' : '';
        const iconStyle =
          row.iconName === 'asterisk' ? 'size-2 text-rehua-ruby' : ''; // Override default style for icon to make asterisk smaller

        return (
          //Render individual row - option to stack heading and content, alternating between white and gray
          <li
            key={row.heading}
            className={`
              flex gap-x-2
              ${row.stacked ? 'flex-col items-start gap-y-1' : 'items-center'}
              ${index % 2 === 0 ? 'bg-rehua-white' : 'bg-rehua-light-gray'}
            `}
            style={{
              padding: '0.5em 1em',
              gap: '0.5em',
              fontSize: row.fontSize, // undefined falls back to inherited/default size
            }}
          >
            {/* Render the Icon (optional) and Heading */}
            <span
              className={`
                flex items-center gap-x-1
                ${headingStyle}
                ${row.verticalAlign === 'top' ? 'self-start' : ''}
              `}
            >
              {row.iconName && (
                <Icon name={row.iconName} className={iconStyle} />
              )}
              {row.heading}:
            </span>
            {/*   Render the row content */}
            <span
              className={`
                inline-flex items-center
                ${contentStyle}
              `}
              style={row.contentStyle}
            >
              {row.content}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default ListView;
