'use client';

import useApiUrl from '@/app/hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import { login as loginSdk } from '@rehua/sdk/functional/auth';
import { useMutation } from '@tanstack/react-query';
import Form from 'next/form';
import type { JSX } from 'react';
import typia, { functional } from 'typia';

async function login({
  host,
  formData,
}: {
  host: string;
  formData: FormData;
}): Promise<loginSdk.Output> {
  return loginSdk(
    { host, simulate: isTesting, options: { credentials: 'include' } },
    {
      userName: typia.assert<string>(formData.get('userName')),
      password: typia.assert<string>(formData.get('password')),
      totpCode: typia.assert<string>(formData.get('totpCode')),
    },
  );
}

function Home(): JSX.Element {
  const host = useApiUrl();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      sessionStorage.setItem('firstName', JSON.stringify(data.firstName));
      sessionStorage.setItem('lastName', JSON.stringify(data.lastName));
      sessionStorage.setItem('userName', JSON.stringify(data.username));
      sessionStorage.setItem('group', JSON.stringify(data.group));
    },
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
