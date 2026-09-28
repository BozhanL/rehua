'use client';
import ContentButton from '@/app/components/common/ContentButton';
import Icon from '@/app/components/common/Icon';
import ListView, { type ListRow } from '@/app/components/common/ListView';
import PopUp from '@/app/components/common/PopUp';
import SingleLineInput from '@/app/components/common/SingleLineInput';
import Surface from '@/app/components/common/Surface';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type JSX } from 'react';

// interface to define the user info needed to reset password
export interface UserPasswordInformation {
  userId: string;
  newUserPassword: string;
}

// interface to define the props for the UserResetPasswordPage component
export interface UserResetPasswordPageProps {
  userInfo: UserPasswordInformation;
  onSave: (userInfo: UserPasswordInformation) => void;
}

// React page to display the form for resetting a user's password
export default function UserResetPasswordPage({
  userInfo,
  onSave,
}: Readonly<UserResetPasswordPageProps>): JSX.Element {
  const router = useRouter(); // router for navigation

  // state to hold the new password data + the visibility of the validation and leave page popups
  const [user] = useState(userInfo);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [showPasswordMismatchPopup, setShowPasswordMismatchPopup] =
    useState(false);
  const [showLeavePagePopup, setShowLeavePagePopup] = useState(false);
  const [showSaveSuccessPopup, setShowSaveSuccessPopup] = useState(false);
  const [showSaveErrorPopup, setShowSaveErrorPopup] = useState(false);

  // define iconProps for required fields (asterisk icon in red)
  const iconProps = {
    name: 'asterisk',
    width: 10,
    className: 'text-rehua-ruby',
  } as const;

  // font size of all input fields
  const inputFontSize = 22;

  // show the green tick next to both password fields when they are filled in and match
  const passwordsMatch = password !== '' && password === confirmPassword;

  // helper function - renders a password input with a show/hide toggle and the matching tick
  function passwordContent(
    heading: string,
    value: string,
    setValue: (value: string) => void,
    showPassword: boolean,
    toggleShowPassword: () => void,
  ): JSX.Element {
    return (
      <div className="flex items-center">
        <SingleLineInput
          type={showPassword ? 'text' : 'password'}
          value={value}
          aria-label={heading}
          style={{ width: 500, fontSize: inputFontSize }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setValue(event.target.value);
          }}
        />

        <button
          type="button"
          onClick={toggleShowPassword}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="ml-2 w-6"
          style={{ cursor: 'pointer' }}
        >
          <Icon name={showPassword ? 'eye' : 'crossed-eye'} width={24} />
        </button>

        {passwordsMatch && (
          <Icon
            name="tick"
            width={30}
            className="ml-4 text-rehua-green"
            aria-label="Passwords match"
          />
        )}
      </div>
    );
  }

  // rows for the ListView component
  const rows: ListRow[] = [
    {
      heading: 'Password',
      content: passwordContent(
        'Password',
        password,
        setPassword,
        showPassword1,
        () => {
          setShowPassword1((prev) => !prev);
        },
      ),
      iconProps,
    },
    {
      heading: 'Confirm Password',
      content: passwordContent(
        'Confirm Password',
        confirmPassword,
        setConfirmPassword,
        showPassword2,
        () => {
          setShowPassword2((prev) => !prev);
        },
      ),
      iconProps,
    },
  ];

  // helper functions to handle button clicks for saving the new password
  function handleSaveUser(): void {
    const mandatoryFields = [password, confirmPassword];

    const hasMissingFields = mandatoryFields.some((field) => !field.trim());

    if (hasMissingFields) {
      setShowValidationPopup(true);
      return;
    }

    if (password !== confirmPassword) {
      setShowPasswordMismatchPopup(true);
      return;
    }

    // TODO: backend implement password reset logic here
    // setShowSaveErrorPopup(true) should be called if the save fails
    onSave(user);
    setShowSaveSuccessPopup(true);
  }

  return (
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        {/* page back button and title */}
        <div className="mx-6 mt-6 mb-5 overflow-x-auto overflow-y-hidden">
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

            <div className="flex gap-5">
              <Icon name="lock" width={40} />
              <span className="translate-y-3 text-3xl font-bold">
                Reset User Password
              </span>
            </div>

            {/* save password button */}
            <div className="flex justify-center gap-6">
              <ContentButton
                text1="Save"
                text2="Password"
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

        {/* password reset form */}
        <div className="pb-30">
          <ListView rows={rows} insidePadding="px-8" />
        </div>

        {/* mandatory fields validation popup */}
        <PopUp
          text1={'Please ensure both password\nfields have been filled in.'}
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

        {/* passwords do not match popup */}
        <PopUp
          text1={
            'The passwords you have entered\ndo not match, please try again.'
          }
          button1Props={{
            text1: 'OK',
            iconProps: { name: 'circle-arrow' },
            backgroundColor: 'bg-rehua-green',
            onClick: () => {
              setShowPasswordMismatchPopup(false);
            },
          }}
          modalProps={{
            open: showPasswordMismatchPopup,
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
              router.back();
            },
          }}
          defaultButtonHeight={65}
          modalProps={{ open: showLeavePagePopup }}
        />

        {/* popup for successful save */}
        <PopUp
          text1={'User password reset successfully.'}
          button1Props={{
            text1: 'OK',
            iconProps: { name: 'circle-arrow' },
            backgroundColor: 'bg-rehua-green',
            onClick: () => {
              setShowSaveSuccessPopup(false);
            },
          }}
          modalProps={{
            open: showSaveSuccessPopup,
            surfaceProps: { style: { height: 550 } },
          }}
        />

        {/* popup for unsuccessful save */}
        <PopUp
          isAlertPopup={true}
          text1={'Failed to reset user password.\nPlease try again.'}
          button1Props={{
            text1: 'OK',
            iconProps: { name: 'circle-arrow' },
            backgroundColor: 'bg-rehua-green',
            onClick: () => {
              setShowSaveErrorPopup(false);
            },
          }}
          modalProps={{
            open: showSaveErrorPopup,
            surfaceProps: { style: { height: 550 } },
          }}
        />
      </Surface>
    </div>
  );
}
