'use client';

import ContentButton from '@/app/components/ContentButton';
import { useEffect, type JSX } from 'react';

export default function ErrorPage({
  error,
  unstable_retry,
}: Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>): JSX.Element {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <ContentButton
        type="button"
        text1="Try again"
        iconProps={{ name: 'alert' }}
        foregroundColor="text-rehua-white"
        backgroundColor="bg-rehua-green"
        textAlign="right"
        onClick={unstable_retry}
      />
    </div>
  );
}
