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
      userId: typia.assert<number>(Number(formData.get('userId'))),
      password: typia.assert<string>(formData.get('password')),
      totpCode: typia.assert<string>(formData.get('totpCode')),
    },
  );
}

function Home(): JSX.Element {
  const host = useApiUrl();

  const loginMutation = useMutation({
    mutationFn: login,
  });

  return (
    <div>
      <Form
        action={(formData: FormData) => {
          loginMutation.mutate({ host, formData });
        }}
      >
        <input name="userId" required />
        <input name="password" required />
        <input name="totpCode" required />
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}

export default functional.assertFunction(Home);
