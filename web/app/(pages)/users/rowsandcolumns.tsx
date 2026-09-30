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
  _id: string; // unique identifier for the user
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  group: UserGroup;
  status: MiniPresetLabel;
}

// interface for a user row in the table
export interface UserRow extends TableRow {
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
    rowKey: 'userName',
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
export function UserViewButton({
  userId,
}: Readonly<{ userId: string }>): JSX.Element {
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
export function createUserRow(user: User, rowIndex: number): UserRow {
  return {
    id: rowIndex,
    content: {
      userName: user.userName ? user.userName : '-',
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email ? user.email : '-',
      group: userGroupLabels[user.group],
      status: <MiniLabel name={user.status} />,
      view: <UserViewButton userId={user._id} />,
    },
  };
}
