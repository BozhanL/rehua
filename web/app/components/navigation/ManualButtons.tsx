import ContentButton from '../common/ContentButton';
import PopUp from '../common/PopUp';
import useApiUrl from '@/app/hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import type { HttpError } from '@rehua/sdk';
import { create } from '@rehua/sdk/functional/manual';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRef, useState, type JSX } from 'react';
import typia, { json } from 'typia';

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
  const [showUploadSuccessPopup, setShowUploadSuccessPopup] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const apiUrl = useApiUrl();
  const uploadManualMutation = useMutation({
    mutationFn: uploadManual,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <PopUp
        text1="The new manual has been successfully uploaded."
        button1Props={{
          onClick: () => {
            setShowUploadSuccessPopup(false);
          },
          text1: 'OK',
          backgroundColor: 'bg-rehua-green',
          iconProps: { name: 'circle-arrow' },
        }}

        button2Props={{
          onClick: () => {
            setShowUploadSuccessPopup(false);
            window.open(`${apiUrl}${create.path()}`, '_blank', 'noopener');
          },
          text1: 'Open',
          backgroundColor: 'bg-rehua-green',
          iconProps: { name: 'circle-arrow', rotation: 180 },
        }}
        modalProps={{ open: showUploadSuccessPopup }}
      />

      <PopUp
        isAlertPopup
        text1={'Unable to upload the new manual.\nPlease try again.'}
        text2={errorText}
        button1Props={{
          onClick: () => {
            setErrorText(null);
          },
          text1: 'OK',
          backgroundColor: 'bg-rehua-green',
          iconProps: { name: 'circle-arrow' },
        }}
        modalProps={{ open: errorText !== null }}
      />

      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="application/pdf"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }

          uploadManualMutation.mutate(
            {
              host: apiUrl,
              body: { file },
            },
            {
              onSuccess: () => {
                setShowUploadSuccessPopup(true);
              },
              onError: (error: unknown) => {
                typia.assertGuard<HttpError>(error);

                if (error.status === 400) {
                  const message = json.assertParse<{ message: string }>(
                    error.message,
                  );

                  setErrorText(message.message);
                  return;
                }

                setErrorText(error.message);
              },
            },
          );
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
