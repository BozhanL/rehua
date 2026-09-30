'use client';
import { buildUserFormRows } from './UserForm';
import type { UserListInformation } from './UserProfileList';
import ContentButton from '@/app/components/common/ContentButton';
import Icon from '@/app/components/common/Icon';
import ListView from '@/app/components/common/ListView';
import PopUp from '@/app/components/common/PopUp';
import Surface from '@/app/components/common/Surface';
import { useRouter } from 'next/navigation';
import { useState, type JSX } from 'react';

// interface to define the props for the UserFormPage component
interface UserFormPageProps {
  title: string;
  titleIcon: 'user-profile' | 'pencil-note';
  backToUsers?: boolean; // if true, the back button will navigate to the users dashboard
  userInfo: UserListInformation;
  onSave: (user: UserListInformation) => void;
}

// React page to display the form for adding/editting a new user, using ListView to render the form fields
export default function UserFormPage({
  title,
  titleIcon,
  backToUsers = false,
  userInfo,
  onSave,
}: Readonly<UserFormPageProps>): JSX.Element {
  const router = useRouter(); // router for navigation

  // state to hold the new user data + the visibility of the validation and leave page popups
  const [user, setUser] = useState(userInfo);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [showLeavePagePopup, setShowLeavePagePopup] = useState(false);

  // rows for the ListView component
  const rows = buildUserFormRows(user, updateField);

  // function to update a specific field in the user state
  function updateField<K extends keyof UserListInformation>(
    field: K,
    value: UserListInformation[K],
  ): void {
    setUser((prev) => ({ ...prev, [field]: value }));
  }

  // helper functions to handle button clicks for saving the user
  function handleSaveUser(): void {
    const mandatoryFields = [
      user.firstName,
      user.lastName,
      user.email,
      user.homePhoneNumber,
      user.address,
      user.group,
      user.status,
    ];

    const hasMissingFields = mandatoryFields.some((field) => !field.trim());

    if (hasMissingFields) {
      setShowValidationPopup(true);
      return;
    }

    // call the onSave prop function to save the user data
    onSave(user);
  }

  return (
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        {/* page back button and title */}
        <div className="mx-6 mt-6 mb-5 overflow-x-auto">
          <div className="flex min-w-max items-center gap-6 bg-rehua-white">
            <button
              type="button"
              onClick={() => {
                setShowLeavePagePopup(true);
              }}
              style={{ cursor: 'pointer' }}
            >
              <Icon
                name="circle-arrow"
                width={50}
                className="text-rehua-navy"
              />
            </button>

            <div className="flex gap-3">
              <Icon
                name={titleIcon}
                width={titleIcon === 'pencil-note' ? 40 : 35}
              />
              <span className="translate-y-1 text-3xl font-bold">{title}</span>
            </div>

            {/* save user button */}
            <div className="flex justify-center gap-6">
              <ContentButton
                text1="Save"
                text2="User"
                textAlign="left"
                lineHeight={1.1}
                iconProps={{ name: 'save', width: 0.95 }}
                iconPosition="right"
                verticalPadding={0.2}
                horizontalPadding={0.6}
                textIconGap={0.4}
                backgroundColor="bg-rehua-green"
                className="text-xl"
                onClick={handleSaveUser}
              />
            </div>
          </div>
        </div>

        {/* user form */}
        <div className="pb-30">
          <ListView rows={rows} insidePadding="px-8" />
        </div>

        {/* mandatory fields validation popup */}
        <PopUp
          text1={'Please ensure all the mandatory\nfields have been filled in.'}
          button1Props={{
            text1: 'OK',
            iconProps: { name: 'circle-arrow' },
            backgroundColor: 'bg-rehua-green',
            onClick: () => {
              setShowValidationPopup(false);
            },
          }}
          modalProps={{
            open: showValidationPopup,
            surfaceProps: { style: { height: 550 } },
          }}
        />

        {/* go back confirmation popup */}
        <PopUp
          isAlertPopup={true}
          text1={'Are you sure you\nwant to leave this page?'}
          text2={<u>UNSAVED CHANGES WILL BE LOST</u>}
          text2ClassName={'text-rehua-ruby'}
          button1Props={{
            text1: 'STAY',
            iconProps: { name: 'circle-arrow', rotation: -90 },
            backgroundColor: 'bg-rehua-green',
            horizontalPadding: 0.5,
            onClick: () => {
              setShowLeavePagePopup(false);
            },
          }}
          button2Props={{
            text1: 'LEAVE',
            iconProps: { name: 'circle-arrow' },
            backgroundColor: 'bg-rehua-red',
            horizontalPadding: 0.4,
            onClick: () => {
              setShowLeavePagePopup(false);
              // navigate back to the users dashboard or previous page
              if (backToUsers) {
                router.push('/users');
              } else {
                router.back();
              }
            },
          }}
          defaultButtonHeight={65}
          modalProps={{ open: showLeavePagePopup }}
        />
      </Surface>
    </div>
  );
}
