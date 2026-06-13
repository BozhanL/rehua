'use client';

import { getHello } from '@rehua/sdk/functional';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { env } from 'process';
import type { JSX } from 'react';
import { functional } from 'typia';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getHelloOptions() {
  return queryOptions({
    queryKey: ['hello'],
    queryFn: () =>
      getHello({
        host: 'http://localhost:3001',
        simulate: env.NODE_ENV === 'test',
      }),
  });
}

function Home(): JSX.Element {
  const query = useQuery(getHelloOptions());

  if (query.isLoading) {
    return <h1>Loading...</h1>;
  }

  return <h1>Hello world -- {query.data}</h1>;
}

export default functional.assertFunction(Home);
