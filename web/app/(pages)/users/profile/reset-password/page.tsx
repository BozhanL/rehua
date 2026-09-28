'use client';
import UserResetPasswordPage from '@/app/components/user/UserResetPasswordPage';
import type { JSX } from 'react';

// import { useSearchParams } from 'next/navigation';
// TODO: backend - variables to get userId from the URL query parameters, may be used by backend (?)
// const searchParams = useSearchParams();
// const userId = searchParams.get('id');

// React page to display the form for resetting a user's password, using UserResetPasswordPage to render the page
export default function EditUserPage(): JSX.Element {
  return (
    <UserResetPasswordPage
      onSave={(newUserPassword) => {
        // TODO: backend PATCH/PUT user here
        console.log(newUserPassword);
      }}
    />
  );
}
