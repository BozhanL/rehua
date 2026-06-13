'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { JSX, ReactNode } from 'react';

export const queryClient = new QueryClient();

export default function Providers({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
