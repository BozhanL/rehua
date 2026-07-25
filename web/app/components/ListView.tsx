'use client';
import Icon, { type IconProps } from './Icon';
import type { ReactNode, JSX } from 'react';

//Different variants for row CSS
const variants = {
  normal: {
    heading: 'font-bold text-black',
    content: '', // inherit default css
  },
  emphasis: {
    heading: 'font-bold',
    content: 'font-bold',
  },
  warning: {
    heading: 'font-bold text-rehua-red',
    content: 'font-bold text-rehua-red',
  },
} as const;

export interface ListRow {
  heading: string;
  content: ReactNode | string[]; // either String[] (e.g. allergies) or React Node (Element or primitive type)
  variant?: keyof typeof variants; // more granular style control for rows
  iconName?: IconProps['name']; // type check to make sure input of iconName exists
}

//Parent component to build an array of Rows to pass as prop
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
        //If style variant specified for this row
        const variant: keyof typeof variants = row.variant ?? 'normal'; // Check style variant
        const style = variants[variant]; // Select style
        //Render row
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
