'use client';
import UserResetPasswordPage, {
  type UserPasswordInformation,
} from '@/app/components/user/UserResetPasswordPage';
import type { JSX } from 'react';

// import { useSearchParams } from 'next/navigation';
// TODO: backend - variables to get userId from the URL query parameters, may be used by backend (?)
// const searchParams = useSearchParams();
// const userId = searchParams.get('id');

// React page to display the form for resetting a user's password, using UserResetPasswordPage to render the page
export default function EditUserPage(): JSX.Element {
  const userPasswordInfo: UserPasswordInformation = {
    // TODO: backend uncomment the line below with the correct userId when the backend is ready
    // userId: userId,
    userId: '123',
    newUserPassword: '',
  };

  return (
    <UserResetPasswordPage
      userInfo={userPasswordInfo}
      onSave={(userPasswordInfo) => {
        // TODO: backend PATCH/PUT user here
        console.log(userPasswordInfo);
      }}
    />
  );
}
