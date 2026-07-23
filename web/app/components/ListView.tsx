'use client';
import Icon, { type IconProps } from './Icon';
import type { ReactNode } from 'react';
import type { JSX } from 'react/jsx-runtime';

const variants = {
  normal: {
    heading: 'font-bold text-black',
    content: 'font-normal text-black',
  },
  emphasis: {
    heading: 'font-bold',
    content: 'font-bold',
  },
  warning: {
    heading: 'font-bold text-red-600',
    content: 'font-bold text-red-600',
  },
} as const;

export interface ListRow {
  heading: string;
  content: ReactNode | string[]; // either String or React Element e.g. MiniLabel
  variant?: keyof typeof variants; // More granular style control for rows
  iconName?: IconProps['name']; // type check to make sure input of iconName exists
}

interface ListViewProps {
  rows: ListRow[];
  maxWidth?: string;
}

// Render Rows
function ListView({
  rows,
  maxWidth = '28rem',
}: Readonly<ListViewProps>): JSX.Element {
  return (
    <ul className="overflow-hidden" style={{ maxWidth }}>
      {rows.map((row, index) => {
        const style = variants[row.variant ?? 'normal'];

        return (
          <li
            key={row.heading}
            className={`
              flex gap-x-2 px-4 py-2
              ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            `}
          >
            <span
              className={`
                flex items-center gap-x-1
                ${style.heading}
              `}
            >
              {row.iconName && <Icon name={row.iconName} />}
              {row.heading}:
            </span>

            <span className={style.content}>
              {Array.isArray(row.content)
                ? row.content.join(', ')
                : row.content}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default ListView;
