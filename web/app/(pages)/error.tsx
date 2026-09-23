'use client';

import Surface from '../components/common/Surface';
import ContentButton from '@/app/components/common/ContentButton';
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
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        <div className="flex h-dvh flex-col items-center justify-center gap-4 p-4">
          <h2>Something went wrong!</h2>
          <p>{error.message}</p>
          <ContentButton
            type="button"
            height={45}
            text1="Try again"
            iconProps={{ name: 'alert' }}
            foregroundColor="text-rehua-white"
            backgroundColor="bg-rehua-red"
            textAlign="right"
            onClick={unstable_retry}
          />
        </div>
      </Surface>
    </div>
  );
}
