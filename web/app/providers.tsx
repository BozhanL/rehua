'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createContext, useEffect, type JSX, type ReactNode } from 'react';
import { useLocalStorage, useIsClient } from 'usehooks-ts';

export const APIUrlContext = createContext<string>('');
export const queryClient = new QueryClient();

export default function Providers({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  const isClient = useIsClient();
  const [apiUrl, setApiUrl] = useLocalStorage<string>('apiUrl', '');

  useEffect(() => {
    if (apiUrl.trim() === '') {
      const url = new URL('/api', globalThis.location.href);
      setApiUrl(url.href.replace(/\/$/, ''));
    }

    if (apiUrl.trim() !== apiUrl) {
      setApiUrl((s) => s.trim());
    }

    if (apiUrl.endsWith('/')) {
      setApiUrl((s) => s.replace(/\/$/, ''));
    }
  }, [apiUrl, setApiUrl]);

  if (!isClient || apiUrl.trim() === '') {
    return <h1>Loading...</h1>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <APIUrlContext value={apiUrl}>{children}</APIUrlContext>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
