import useApiUrl from '../hooks/useApiUrl';
import { isTesting } from '../utils/env';
import ContentButton from './ContentButton';
import { create } from '@rehua/sdk/functional/manual';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRef, type JSX } from 'react';

async function uploadManual({
  host,
  body,
}: {
  host: string;
  body: create.Body;
}): Promise<create.Output> {
  return create(
    {
      host,
      simulate: isTesting,
      options: { credentials: 'include' },
    },
    body,
  );
}

export function UploadManualButton(): JSX.Element {
  const apiUrl = useApiUrl();
  const uploadManualMutation = useMutation({
    mutationFn: uploadManual,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            uploadManualMutation.mutate({
              host: apiUrl,
              body: { file },
            });
          }
        }}
      />

      <ContentButton
        text1="Upload"
        text2="Manual"
        iconProps={{ name: 'manual-tick' }}
        backgroundColor="bg-rehua-mustard"
        onClick={() => {
          fileInputRef.current?.click();
        }}
      />
    </div>
  );
}

export function ShowManualButton(): JSX.Element {
  const apiUrl = useApiUrl();

  return (
    <div>
      <Link href={`${apiUrl}${create.path()}`} target="_blank">
        <ContentButton
          text1="View"
          text2="Manual"
          iconProps={{ name: 'manual' }}
          backgroundColor="bg-rehua-blue"
        />
      </Link>
    </div>
  );
}
