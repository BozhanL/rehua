'use client';

import useApiUrl from '@/app/hooks/useApiUrl';
import { login, sessionStorageAddUserInfo } from '@/app/utils/auth';
import { useMutation } from '@tanstack/react-query';
import Form from 'next/form';
import type { JSX } from 'react';
import { functional } from 'typia';

function Home(): JSX.Element {
  const host = useApiUrl();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: sessionStorageAddUserInfo,
  });

  return (
    <div>
      <Form
        action={(formData: FormData) => {
          loginMutation.mutate({ host, formData });
        }}
      >
        <input name="userName" required />
        <input name="password" required />
        <input name="totpCode" required />
        <button type="submit">Login</button>
      </Form>

      {/* dispaly logged in user's name from sessionStorage*/}
      <div style={{ marginTop: '1rem', color: 'green' }}>
        <h3>Stored login information</h3>
        <pre>
          full name:
          {sessionStorage.getItem('firstName')}
          {sessionStorage.getItem('lastName')}
        </pre>
      </div>

      {/* Display Error Message */}
      {loginMutation.isError && (
        <div style={{ marginTop: '1rem', color: 'red' }}>
          <h3>Login Failed</h3>
          <p>{loginMutation.error.message}</p>
        </div>
      )}
    </div>
  );
}

export default functional.assertFunction(Home);
