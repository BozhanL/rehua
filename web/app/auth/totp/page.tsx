'use client';

import useApiUrl from '@/app/hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import { HttpError } from '@rehua/sdk';
import { getTotpSecret } from '@rehua/sdk/functional/auth/totp';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, type JSX } from 'react';
import { functional } from 'typia';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useGetTotpSecretOptions() {
  const host = useApiUrl();

  return queryOptions({
    queryKey: ['getTotpSecret', host],
    queryFn: async () =>
      getTotpSecret({
        host: host,
        simulate: isTesting,
        options: { credentials: 'include' },
      }),
  });
}

function Home(): JSX.Element {
  const router = useRouter();

  const options = useGetTotpSecretOptions();
  const { data, error, isSuccess } = useQuery(options);

  useEffect(() => {
    if (error instanceof HttpError && error.status === 401) {
      router.push('/auth/login');
    }
  }, [error, router]);

  if (!isSuccess || !data) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h1>Get TOTP Secret</h1>
      <QRCodeSVG value={data.totpUri} level="Q" />
      <p>Secret: {data.totpSecret}</p>
    </>
  );
}

export default functional.assertFunction(Home);
