'use client';
import UserResetPasswordPage from '@/app/components/user/UserResetPasswordPage';
import { useSearchParams } from 'next/navigation';
import type { JSX } from 'react';

// React page to display the form for resetting a user's password, using UserResetPasswordPage to render the page
export default function EditUserPage(): JSX.Element {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id') ?? '';

  return (
    <UserResetPasswordPage
      onSave={(newUserPassword) => {
        // TODO: backend PATCH/PUT user here
        console.log(userId, newUserPassword);
      }}
    />
  );
}
