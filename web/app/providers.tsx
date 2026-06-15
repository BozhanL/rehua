'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createContext, useEffect, type JSX, type ReactNode } from 'react';
import { useLocalStorage, useIsClient } from 'usehooks-ts';

export const APIUrlContext = createContext<URL>(
  new URL('http://localhost:3001'),
);
export const queryClient = new QueryClient();

export default function Providers({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  const isClient = useIsClient();
  const [apiUrl, setApiUrl] = useLocalStorage<URL | null>('apiUrl', null, {
    serializer: (v) => v?.href ?? '',
    deserializer: (v) => URL.parse(v),
  });

  useEffect(() => {
    if (apiUrl === null) {
      setApiUrl(new URL('/api', window.location.href));
    }
  }, [apiUrl, setApiUrl]);

  if (!isClient || apiUrl === null) {
    return <h1>Loading...</h1>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <APIUrlContext value={apiUrl}>{children}</APIUrlContext>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
