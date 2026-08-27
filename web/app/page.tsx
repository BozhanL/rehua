'use client';

import Icon from './components/common/Icon';
import { APIUrlContext } from './providers';
import {
  ShowManualButton,
  UploadManualButton,
} from '@/app/components/navigation/ManualButtons';
import { isTesting } from '@/app/utils/env';
import { getHello } from '@rehua/sdk/functional';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { useContext, type JSX } from 'react';
import { functional } from 'typia';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useHelloOptions() {
  const host = useContext(APIUrlContext);

  return queryOptions({
    queryKey: ['hello', host],
    queryFn: async () =>
      getHello({
        host: host,
        simulate: isTesting,
      }),
  });
}

function Home(): JSX.Element {
  const query = useQuery(useHelloOptions());

  if (!query.isSuccess) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h1>Hello world -- {query.data}</h1>
      <Icon name={'eye'} />
      <UploadManualButton />
      <ShowManualButton />

      {/* dispaly logged in user's name from sessionStorage*/}
      <div style={{ marginTop: '1rem', color: 'green' }}>
        <h3>Stored login information</h3>
        <pre>
          full name:
          {sessionStorage.getItem('firstName')}
          {sessionStorage.getItem('lastName')}
        </pre>
      </div>
    </>
  );
}

export default functional.assertFunction(Home);
