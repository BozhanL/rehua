import type { ListRow } from '@/app/components/common/ListView';
import MiniLabel, {
  type MiniPresetLabel,
} from '@/app/components/common/MiniLabel';
import { userGroupLabels, type UserGroup } from '@/app/utils/types';

// interface to enforce and define the structure of the user information
export interface UserListInformation {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  homePhoneNumber: string;
  address: string;
  group: UserGroup;
  status: MiniPresetLabel;
}

// function to return rows for the ListView component to display user information
export function getUserListRows(user: UserListInformation): ListRow[] {
  return [
    { heading: 'Username', content: user.userName },
    { heading: 'First Name', content: user.firstName },
    { heading: 'Last Name', content: user.lastName },
    { heading: 'Email', content: user.email },
    { heading: 'Home Phone Number', content: user.homePhoneNumber },
    { heading: 'Address', content: user.address },
    { heading: 'Group', content: userGroupLabels[user.group] },
    {
      heading: 'Status',
      content: <MiniLabel name={user.status} height={34} />,
    },
  ];
}

// TODO: backend delete the stuff below when done with integration
export const user: UserListInformation = {
  userName: 'DEF4567',
  firstName: 'Tama',
  lastName: 'Manaaki',
  email: 'tama.manaaki@example.com',
  homePhoneNumber: '0211234567',
  address: '247 Whitaker Street, Some City 3320',
  group: 'nurse',
  status: 'active',
};

// defined rows for the ListView component to display user information
export const UserListRows: ListRow[] = [
  { heading: 'Username', content: user.userName },
  { heading: 'First Name', content: user.firstName },
  { heading: 'Last Name', content: user.lastName },
  { heading: 'Email', content: user.email },
  { heading: 'Home Phone Number', content: user.homePhoneNumber },
  { heading: 'Address', content: user.address },
  { heading: 'Group', content: userGroupLabels[user.group] },
  { heading: 'Status', content: <MiniLabel name={user.status} height={34} /> },
];
