'use client';

import { APIUrlContext } from './providers';
import { isTesting } from '@/app/utils/env';
import { getHello } from '@rehua/sdk/functional';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { useContext, type JSX } from 'react';
import { functional } from 'typia';

function useHelloOptions(): ReturnType<
  typeof queryOptions<string, Error, string, string[]>
> {
  const host = useContext(APIUrlContext);

  return queryOptions({
    queryKey: ['hello', host],
    queryFn: () =>
      getHello({
        host: host,
        simulate: isTesting,
      }),
  });
}

function Home(): JSX.Element {
  const query = useQuery(useHelloOptions());

  if (query.isLoading) {
    return <h1>Loading...</h1>;
  }

  return <h1>Hello world -- {query.data}</h1>;
}

export default functional.assertFunction(Home);
