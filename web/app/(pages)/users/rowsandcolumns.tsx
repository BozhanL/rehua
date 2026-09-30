import Icon from '@/app/components/common/Icon';
import MiniLabel, {
  type MiniPresetLabel,
} from '@/app/components/common/MiniLabel';
import type { TableColumn, TableRow } from '@/app/components/common/Table';
import { userGroupLabels, type UserGroup } from '@/app/utils/types';
import { useRouter } from 'next/navigation';
import type { JSX, ReactNode } from 'react';

export const userGroups: UserGroup[] = ['admin', 'nurse'];

// interface for a user
export interface User {
  id: string; // unique identifier for the user
  userName: string;
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
    userName: string;
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

// React icon component for routing to user profiles
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
      userName: user.userName ? user.userName : '-',
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email ? user.email : '-',
      group: userGroupLabels[user.group],
      status: <MiniLabel name={user.status} />,
      view: <UserViewButton userId={user.id} />,
    },
  };
}

// sample patient data, what is expected from backend - TODO: backend replace this with actual data
export const users: User[] = [
  {
    id: '1',
    userName: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    group: 'admin',
    status: 'active',
  },
  {
    id: '2',
    userName: 'janedoe',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    group: 'nurse',
    status: 'active',
  },
  {
    id: '3',
    userName: 'bobsmith',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@example.com',
    group: 'admin',
    status: 'disabled',
  },
];

// create user rows from the sample user data
export const userRows: UserRow[] = users.map((user, rowIndex) =>
  createUserRow(user, rowIndex),
);
