import Icon from '@/app/components/common/Icon';
import MiniLabel, {
  type MiniPresetLabel,
} from '@/app/components/common/MiniLabel';
import type { TableColumn, TableRow } from '@/app/components/common/Table';
import { useRouter } from 'next/navigation';
import type { JSX, ReactNode } from 'react';

// TODO: backend derive the available user groups from the db (?)
type UserGroup = 'Admin' | 'Nurse';
export const userGroups: UserGroup[] = ['Admin', 'Nurse'];

// interface for a user
export interface User {
  id: string; // unique identifier for the user
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  group: UserGroup;
  status: MiniPresetLabel;
}

// interface for a user row in the table
interface UserRow extends TableRow {
  id: number; // unique identifier for the row
  content: {
    username: string;
    fullName: string;
    email: string;
    group: string;
    status: ReactNode;
    view: ReactNode;
  };
}

// general width for columns
const columnWidth = 200;

// column definition for the user table
export const userColumns: TableColumn[] = [
  {
    rowKey: 'username',
    header: 'Username',
    width: 250,
    columnClassName: 'pl-15',
  },
  {
    rowKey: 'fullName',
    header: 'Full Name',
    width: columnWidth,
  },
  {
    rowKey: 'email',
    header: 'Email',
    width: columnWidth,
  },
  {
    rowKey: 'group',
    header: 'Group',
    contentAlignment: 'center',

    width: columnWidth,
  },
  {
    rowKey: 'status',
    header: 'Status',
    contentAlignment: 'center',

    width: columnWidth,
  },
  {
    rowKey: 'view',
    header: 'View',
    contentAlignment: 'center',
    width: columnWidth,
  },
];

// TODO: backend implement the UserViewButton below within the "View" column of the user table,
// the button already routes to /users/profile?id=<userId> page, userId has to be passed in
// -- for better clarity, feel free to rename this file from "rowsandcolumns.tsx" if it suits
function UserViewButton({ userId }: Readonly<{ userId: string }>): JSX.Element {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        router.push(`/users/profile?id=${userId}`);
      }}
      style={{ cursor: 'pointer' }}
    >
      <Icon
        name="access"
        width={30}
        className="translate-y-1 text-rehua-navy"
      />
    </button>
  );
}

// function to create a user row from a user object that will be rendered within the table
function createUserRow(user: User, rowIndex: number): UserRow {
  return {
    id: rowIndex,
    content: {
      username: user.username ? user.username : '-',
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email ? user.email : '-',
      group: user.group,
      status: <MiniLabel name={user.status} />,
      view: <UserViewButton userId={user.id} />,
    },
  };
}

// sample patient data, what is expected from backend - TODO: backend replace this with actual data
export const users: User[] = [
  {
    id: '1',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    group: 'Admin',
    status: 'active',
  },
  {
    id: '2',
    username: 'janedoe',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    group: 'Nurse',
    status: 'active',
  },
  {
    id: '3',
    username: 'bobsmith',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@example.com',
    group: 'Admin',
    status: 'disabled',
  },
];

// create user rows from the sample user data - TODO: backend to alter this if needed
export const userRows: UserRow[] = users.map((user, rowIndex) =>
  createUserRow(user, rowIndex),
);
