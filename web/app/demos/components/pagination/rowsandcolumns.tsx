import DropdownBar from '@/app/components/common/DropdownBar';
import Icon from '@/app/components/common/Icon';
import MiniLabel from '@/app/components/common/MiniLabel';
import type { TableColumn, TableRow } from '@/app/components/common/Table';
import type { ReactNode } from 'react';

interface ExampleRow extends TableRow {
  id: number;
  name: ReactNode;
  age: ReactNode;
  joined: ReactNode;
  status: ReactNode;
  priority: ReactNode;
  actions: ReactNode;
}

// comment the rows out to trigger the "No results found" message
export const rows: ExampleRow[] = [
  {
    id: 1,
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
    test3: 'insert more text here',
  },
  {
    id: 2,
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
  {
    id: 3,
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
  {
    id: 4,
    name: 'Bob Johnson',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 5,
    name: 'Bob Johnson',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 6,
    name: 'Bob Johnson',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 7,
    name: 'Bob Johnson',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 8,
    name: 'Bob Johnson',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 9,
    name: 'Bob Johnson',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 10,
    name: 'Bob Johnson',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 11,
    name: 'Bob Johnson',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 12,
    name: 'Bob Johnson',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 13,
    name: 'Bob Johnson',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 14,
    name: 'Bob Johnson',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 15,
    name: 'Bob Johnson',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 16,
    name: 'Bob Johnson',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 17,
    name: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 18,
    name: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 19,
    name: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 20,
    name: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 21,
    name: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 22,
    name: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 23,
    name: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 24,
    name: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 25,
    name: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
  {
    id: 26,
    name: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
    age: 28,
    joined: '05/11/2024',
    status: <MiniLabel name="longTerm" />,
    priority: <MiniLabel name="shortTerm" />,
    actions: (
      <button
        type="button"
        onClick={() => {
          console.log('Bob clicked');
        }}
      >
        <Icon name="access" />
      </button>
    ),
  },
];

const columnWidth = 230;

export const columns: TableColumn[] = [
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
