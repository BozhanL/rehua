'use client';
import UserFormPage from '@/app/components/user/UserFormPage';
import type { UserListInformation } from '@/app/components/user/UserProfileList';
import type { JSX } from 'react';

// import { useSearchParams } from 'next/navigation';
// TODO: backend - variables to get userId from the URL query parameters, may be used by backend (?)
// const searchParams = useSearchParams();
// const userId = searchParams.get('id');

// React page to display the form for editing an existing user, using UserFormPage to render the page
export default function EditUserPage(): JSX.Element {
  // TODO: backend GET user here
  const user: UserListInformation = {
    username: 'JohnDoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    homePhoneNumber: '0211234567',
    address: '123 Main Street, Some City 3320',
    group: 'admin',
    status: 'active',
  };

  return (
    <UserFormPage
      title="Edit User Information"
      titleIcon="pencil-note"
      userInfo={user}
      onSave={(user) => {
        // TODO: backend PATCH/PUT user here
        console.log(user);
      }}
    />
  );
}
