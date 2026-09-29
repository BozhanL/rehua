'use client';
import ContentButton from '@/app/components/common/ContentButton';
import DropdownBar from '@/app/components/common/DropdownBar';
import Icon from '@/app/components/common/Icon';
import ListView, { type ListRow } from '@/app/components/common/ListView';
import PopUp from '@/app/components/common/PopUp';
import SingleLineInput from '@/app/components/common/SingleLineInput';
import Surface from '@/app/components/common/Surface';
import MFASetUp, {
  isInvalidTotpCodeError,
} from '@/app/components/mfa/MFASetup';
import useApiUrl from '@/app/hooks/useApiUrl';
import { signup } from '@/app/utils/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type JSX } from 'react';
import typia from 'typia';

// user groups accepted by the API when creating a new user
type UserGroup = 'admin' | 'nurse';

// details entered on the form, sent to the API together with the TOTP code
interface NewUser {
  userName: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  homePhoneNumber: string;
  address: string;
  group: UserGroup | ''; // empty string when no group has been selected yet
}

const emptyNewUser: NewUser = {
  userName: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  email: '',
  homePhoneNumber: '',
  address: '',
  group: '',
};

// display text for each user group accepted by the API
const groupLabels: Record<UserGroup, string> = {
  admin: 'Admin',
  nurse: 'Nurse',
};

function labelToGroup(label: string): UserGroup | undefined {
  const groups = Object.keys(groupLabels) as UserGroup[];
  return groups.find((group) => groupLabels[group] === label);
}

// define iconProps for required fields (asterisk icon in red)
const iconProps = {
  name: 'asterisk',
  width: 10,
  className: 'text-rehua-ruby',
} as const;

// font size of all input fields
const inputFontSize = 22;

// create new user page: user details form, then MFA set-up on the same page
export default function CreateUserPage(): JSX.Element {
  const router = useRouter();
  const host = useApiUrl();

  // user details form state, kept while on the MFA step so going back keeps the form filled in
  const [user, setUser] = useState<NewUser>(emptyNewUser);
  const [step, setStep] = useState<'details' | 'mfa'>('details');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [showPasswordMismatchPopup, setShowPasswordMismatchPopup] =
    useState(false);
  const [showLeavePagePopup, setShowLeavePagePopup] = useState(false);
  const [showSaveErrorPopup, setShowSaveErrorPopup] = useState(false);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);

  // show the green tick next to both password fields when they are filled in and match
  const passwordsMatch =
    user.password !== '' && user.password === user.confirmPassword;

  const signupMutation = useMutation({
    mutationFn: signup,

    onSuccess: (createdUser) => {
      setUser(emptyNewUser); // don't keep the password in memory
      setCreatedUserId(createdUser._id);
    },

    onError: (error) => {
      // a wrong code is shown by MFASetUp, anything else is shown here
      if (!isInvalidTotpCodeError(error)) {
        setShowSaveErrorPopup(true);
      }
    },
  });

  // function to update a specific field in the user state
  function updateField<K extends keyof NewUser>(
    field: K,
    value: NewUser[K],
  ): void {
    setUser((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext(): void {
    const mandatoryFields = [
      user.userName,
      user.password,
      user.confirmPassword,
      user.firstName,
      user.lastName,
      user.email,
      user.homePhoneNumber,
      user.address,
      user.group,
    ];

    const hasMissingFields = mandatoryFields.some((field) => !field.trim());

    if (hasMissingFields) {
      setShowValidationPopup(true);
      return;
    }

    if (user.password !== user.confirmPassword) {
      setShowPasswordMismatchPopup(true);
      return;
    }

    setStep('mfa');
  }

  // helper function - renders a password input with a show/hide toggle and the matching tick
  function passwordContent(
    heading: string,
    field: 'password' | 'confirmPassword',
    showPassword: boolean,
    toggleShowPassword: () => void,
  ): JSX.Element {
    return (
      <div className="flex items-center">
        <SingleLineInput
          type={showPassword ? 'text' : 'password'}
          value={user[field]}
          aria-label={heading}
          style={{ width: 500, fontSize: inputFontSize }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField(field, event.target.value);
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

  // helper function - renders a plain text input bound to a field of the user state
  function textRow(
    heading: string,
    field: Exclude<keyof NewUser, 'password' | 'confirmPassword'>,
  ): ListRow {
    return {
      heading,
      content: (
        <SingleLineInput
          value={user[field]}
          aria-label={heading}
          style={{ fontSize: inputFontSize }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField(field, event.target.value);
          }}
        />
      ),
      iconProps,
    };
  }

  const rows: ListRow[] = [
    textRow('Username', 'userName'),
    {
      heading: 'Password',
      content: passwordContent('Password', 'password', showPassword1, () => {
        setShowPassword1((prev) => !prev);
      }),
      iconProps,
    },
    {
      heading: 'Re-Enter Password',
      content: passwordContent(
        'Re-Enter Password',
        'confirmPassword',
        showPassword2,
        () => {
          setShowPassword2((prev) => !prev);
        },
      ),
      iconProps,
    },
    textRow('First Name', 'firstName'),
    textRow('Last Name', 'lastName'),
    textRow('Email', 'email'),
    textRow('Home Phone Number', 'homePhoneNumber'),
    textRow('Address', 'address'),
    {
      heading: 'Group',
      content: (
        <DropdownBar
          options={Object.values(groupLabels)}
          selectedValues={user.group ? [groupLabels[user.group]] : []}
          size={19}
          width={350}
          defaultText="Select user group"
          onChange={(selectedGroup) => {
            updateField('group', labelToGroup(selectedGroup[0] ?? '') ?? '');
          }}
        />
      ),
      iconProps,
    },
  ];

  return (
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        {step === 'mfa' ? (
          <MFASetUp
            title="Multi-Factor Authentication Set-Up"
            label={user.email}
            onBack={() => {
              // the form state is still here, so the form stays filled in
              setStep('details');
              signupMutation.reset();
            }}
            onSubmitCode={async (totpCode, totpSecret) =>
              signupMutation.mutateAsync({
                host,
                data: {
                  userName: user.userName,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  password: user.password,
                  totpSecret,
                  totpCode,
                  email: user.email,
                  status: 'active',
                  homePhoneNumber: user.homePhoneNumber,
                  address: user.address,
                  // always set here, handleNext only moves to this step once a group is selected
                  group: typia.assert<UserGroup>(user.group),
                },
              })
            }
          />
        ) : (
          <>
            {/* page back button, title and next button */}
            <div
              className="
                mx-6 mt-6 mb-5 flex min-w-max items-center gap-6 bg-rehua-white
              "
            >
              <button
                type="button"
                aria-label="Go back"
                onClick={() => {
                  setShowLeavePagePopup(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                <Icon
                  name="circle-arrow"
                  width={40}
                  className="text-rehua-navy"
                />
              </button>

              <div className="flex gap-3">
                <Icon name="user-profile" width={30} />
                <span className="text-3xl font-bold">Add New User</span>
              </div>

              <ContentButton
                text1="Next"
                text2="(MFA Set-Up)"
                textAlign="left"
                lineHeight={1.1}
                iconProps={{ name: 'lock-time', width: 0.8 }}
                iconPosition="right"
                verticalPadding={0.2}
                horizontalPadding={0.4}
                textIconGap={0.4}
                backgroundColor="bg-rehua-navy"
                className="text-xl"
                onClick={handleNext}
              />
            </div>

            {/* new user form */}
            <div className="pt-4 pb-30">
              <ListView rows={rows} insidePadding="px-8" />
            </div>
          </>
        )}

        {/* mandatory fields validation popup */}
        <PopUp
          text1={'Please fill in all the mandatory\nfields before proceeding.'}
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
              router.push('/users');
            },
          }}
          defaultButtonHeight={65}
          modalProps={{ open: showLeavePagePopup }}
        />

        {/* popup for unsuccessful save */}
        <PopUp
          isAlertPopup={true}
          text1={'Failed to add the user.\nPlease try again.'}
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

        {/* popup for successful save */}
        <PopUp
          text1={'Done! The user has been\nsuccessfully added to the system.'}
          button1Props={{
            text1: 'OK',
            iconProps: { name: 'circle-arrow' },
            backgroundColor: 'bg-rehua-green',
            onClick: () => {
              router.push(`/users/profile?id=${createdUserId ?? ''}`);
            },
          }}
          modalProps={{
            open: createdUserId !== null,
            surfaceProps: { style: { height: 550 } },
          }}
        />
      </Surface>
    </div>
  );
}
