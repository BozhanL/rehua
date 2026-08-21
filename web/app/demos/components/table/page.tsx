'use client';

import DropdownBar from '@/app/components/common/DropdownBar';
import Icon from '@/app/components/common/Icon';
import MiniLabel from '@/app/components/common/MiniLabel';
import Table, {
  type TableColumn,
  type TableRow,
} from '@/app/components/common/Table';
import type { JSX, ReactNode } from 'react';

interface ExampleRow extends TableRow {
  id: number;
  content: {
    name: ReactNode;
    age: ReactNode;
    joined: ReactNode;
    status: ReactNode;
    priority: ReactNode;
    actions: ReactNode;
    test3?: ReactNode;
    test4?: ReactNode;
    test5?: ReactNode;
  };
}

export default function TableTestPage(): JSX.Element {
  // comment the rows out to trigger the "No results found" message
  const rows: ExampleRow[] = [
    {
      id: 1,
      content: {
        name: 'John Smith',
        age: 25,
        joined: '14/08/2026',
        status: <MiniLabel name="active" />,
        priority: (
          <DropdownBar
            options={['High', 'Medium', 'Low']}
            selectedValues={['Medium']}
            onChange={() => {
              console.log('John priority changed');
            }}
            multiple={false}
            defaultText="Select Priority"
            labelMode="replace"
            search={false}
            width={400}
          />
        ),
        actions: (
          <button
            type="button"
            onClick={() => {
              console.log('John clicked');
            }}
            style={{ cursor: 'pointer' }}
          >
            <Icon name="access" className="text-rehua-navy" width={35} />
          </button>
        ),
      },
    },
    {
      id: 2,
      content: {
        name: 'Jane Doe',
        age: 30,
        joined: '22/03/2025',
        status: <MiniLabel name="disabled" />,
        priority: <MiniLabel name="palliative" />,
        actions: (
          <button
            type="button"
            onClick={() => {
              console.log('Jane clicked');
            }}
            style={{ cursor: 'pointer' }}
          >
            <Icon name="trash" className="text-rehua-ruby" />
          </button>
        ),
      },
    },
    {
      id: 3,
      content: {
        name: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
        age: 28,
        joined: '05/11/2024',
        status: <MiniLabel name="longTerm" />,
        priority: <MiniLabel name="shortTerm" />,
        actions: (
          <button
            type="button"
            onClick={() => {
              console.log('Alice clicked');
            }}
          >
            <Icon name="access" />
          </button>
        ),
      },
    },
  ];

  // for messing with the column widths;
  // comment out the "width: columnWidth" below to see default look
  const columnWidth = 230;

  const columns: TableColumn<ExampleRow>[] = [
    {
      rowKey: 'name',
      header: 'Name',
      width: columnWidth,
      contentAlignment: 'right',
    },
    {
      rowKey: 'age',
      header: 'Age',
      width: columnWidth,
    },
    {
      rowKey: 'joined',
      header: 'Joined',
      width: columnWidth,
    },
    {
      rowKey: 'status',
      header: 'Status',
      width: columnWidth,
    },
    {
      rowKey: 'priority',
      header: 'Priority',
      width: 400,
    },
    {
      rowKey: 'actions',
      header: 'Actions',
      width: columnWidth,
      contentAlignment: 'center',
    },
    // additional columns testing, if too many are added horizontal scrolling is implemented
    {
      rowKey: 'test3',
      header: 'Actions',
      width: columnWidth,
    },
    {
      rowKey: 'test4',
      header: 'Actions',
      width: columnWidth,
    },
    {
      rowKey: 'test5',
      header: 'Actions',
      width: columnWidth,
    },
  ];

  return <Table columns={columns} rows={rows} />;
}
