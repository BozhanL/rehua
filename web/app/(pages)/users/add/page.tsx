'use client';
import ContentButton from '@/app/components/common/ContentButton';
import DropdownBar from '@/app/components/common/DropdownBar';
import Icon from '@/app/components/common/Icon';
import ListView from '@/app/components/common/ListView';
import SingleLineInput from '@/app/components/common/SingleLineInput';
import Surface from '@/app/components/common/Surface';
import { useRouter } from 'next/navigation';
import { useState, type JSX } from 'react';

// create new user page
// may need to change to a component depending on bozhan and williams decision around backend

export default function CreateUserPage(): JSX.Element {
  const [group, setGroup] = useState<string[]>([]);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPasswordCheckmark, setShowPasswordCheckmark] = useState(false);
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  function validateDetails(): void {}

  return (
    <Surface width="100%">
      <div className="flex gap-3 pt-5 pl-10">
        <Icon
          name="circle-arrow"
          style={{ color: 'bg-rehua-navy' }}
          onClick={() => {
            router.push('/users');
          }}
        />
        <Icon name="user-profile" />
        <h2>Add a New User</h2>
        <ContentButton
          text1="Next"
          text2="(MFA Set-Up)"
          backgroundColor="bg-rehua-navy"
          iconPosition="right"
          iconProps={{ name: 'lock-time' }}
          onClick={() => {
            // api call
            validateDetails();
            router.push('/');
          }}
        />
      </div>
      {}
      <form>
        <ListView
          rows={[
            {
              heading: 'Password',
              content: (
                <div className="flex">
                  <SingleLineInput
                    type={showPassword1 ? 'text' : 'password'}
                    style={{ width: '40%' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword1((prev) => !prev);
                    }}
                    aria-label={
                      showPassword1 ? 'Hide password' : 'Show password'
                    }
                    className="ml-2 w-6"
                  >
                    <Icon
                      name={showPassword1 ? 'eye' : 'crossed-eye'}
                      width={24}
                    />
                  </button>
                  <Icon name="tick" />
                </div>
              ),
              iconProps: { name: 'asterisk', color: 'red' },
            },
            {
              heading: 'Re-Enter Pasword',
              content: (
                <>
                  <SingleLineInput
                    type={showPassword2 ? 'text' : 'password'}
                    style={{ width: '40%' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword2((prev) => !prev);
                    }}
                    aria-label={
                      showPassword2 ? 'Hide password' : 'Show password'
                    }
                    className="ml-2 w-6"
                  >
                    <Icon
                      name={showPassword2 ? 'eye' : 'crossed-eye'}
                      width={24}
                    />
                  </button>
                </>
              ),
              iconProps: { name: 'asterisk', color: 'red', width: 12 },
            },
            {
              heading: 'First Name',
              content: <SingleLineInput />,
              iconProps: { name: 'asterisk', color: 'red' },
            },
            {
              heading: 'Last Name',
              content: <SingleLineInput />,
              iconProps: { name: 'asterisk', color: 'red' },
            },
            {
              heading: 'Email',
              content: <SingleLineInput />,
              iconProps: { name: 'asterisk', color: 'red' },
            },
            {
              heading: 'Home Phone Number',
              content: <SingleLineInput />,
              iconProps: { name: 'asterisk', color: 'red' },
            },
            {
              heading: 'Address',
              content: <SingleLineInput />,
              iconProps: { name: 'asterisk', color: 'red' },
            },
            {
              heading: 'Group',
              content: (
                <DropdownBar
                  options={['User', 'Admin']}
                  selectedValues={group}
                  onChange={(newValues: string[]) => {
                    setGroup(newValues);
                  }}
                />
              ),
              iconProps: { name: 'asterisk', color: 'red' },
            },
          ]}
        />
      </form>
    </Surface>
  );
}
