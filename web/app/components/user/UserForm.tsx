import { statusToText, textToStatus } from '../patient/PatientForm';
import type { UserListInformation } from './UserProfileList';
import { userGroups } from '@/app/(pages)/users/rowsandcolumns';
import DropdownBar from '@/app/components/common/DropdownBar';
import type { ListRow } from '@/app/components/common/ListView';
import { presetLabels } from '@/app/components/common/MiniLabel';
import SingleLineInput from '@/app/components/common/SingleLineInput';
import { userGroupLabels } from '@/app/utils/types';
import type { ChangeEvent } from 'react';

// define the list of user statuses for the dropdown, using preset labels
export const userStatuses = [presetLabels.active, presetLabels.disabled];
const groupDropdownSearchOptions = userGroups.map(
  (apiGroupValue) => userGroupLabels[apiGroupValue],
);

// function to build the rows for the user form
export function buildUserFormRows(
  user: UserListInformation,
  updateField: <K extends keyof UserListInformation>(
    field: K,
    value: UserListInformation[K],
  ) => void,
): ListRow[] {
  // define iconProps for required fields (asterisk icon in red)
  const iconProps = {
    name: 'asterisk',
    width: 10,
    className: 'text-rehua-ruby',
  } as const;

  // font size of all input fields
  const inputFontSize = 22;

  return [
    {
      heading: 'First Name',
      content: (
        <SingleLineInput
          value={user.firstName}
          style={{ fontSize: inputFontSize }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('firstName', event.target.value);
          }}
          placeholder="Enter first name"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Last Name',
      content: (
        <SingleLineInput
          value={user.lastName}
          style={{ fontSize: inputFontSize }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('lastName', event.target.value);
          }}
          placeholder="Enter last name"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Email',
      content: (
        <SingleLineInput
          value={user.email}
          style={{ fontSize: inputFontSize }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('email', event.target.value);
          }}
          placeholder="Enter email address"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Home Phone Number',
      content: (
        <SingleLineInput
          value={user.homePhoneNumber}
          style={{ fontSize: inputFontSize }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('homePhoneNumber', event.target.value);
          }}
          placeholder="Enter home phone number"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Address',
      content: (
        <SingleLineInput
          value={user.address}
          style={{ fontSize: inputFontSize }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('address', event.target.value);
          }}
          placeholder="Enter address"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Group',
      content: (
        <DropdownBar
          options={groupDropdownSearchOptions}
          selectedValues={[userGroupLabels[user.group]]}
          size={19}
          width={550}
          defaultText="Select user group"
          onChange={(selectedGroup) => {
            const selectedApiGroup = userGroups.find(
              (apiGroupValue) =>
                userGroupLabels[apiGroupValue] === selectedGroup[0],
            );

            if (selectedApiGroup) {
              updateField('group', selectedApiGroup);
            }
          }}
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Status',
      content: (
        <DropdownBar
          options={userStatuses.map((label) => label.text)}
          selectedValues={[statusToText(user.status)]}
          size={19}
          width={550}
          defaultText="Select user status"
          onChange={(selectedStatus) => {
            if (selectedStatus[0]) {
              const status = textToStatus(selectedStatus[0]);
              if (status) {
                updateField('status', status);
              }
            }
          }}
        />
      ),
      iconProps: iconProps,
    },
  ];
}
