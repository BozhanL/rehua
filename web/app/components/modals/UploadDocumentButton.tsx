import ContentButton from '../common/ContentButton';
import PopUp from '../common/PopUp';
import useApiUrl from '@/app/hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import type { HttpError } from '@rehua/sdk';
// TODO:
// backend document module to be created
import { create } from '@rehua/sdk/functional/document';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import type { JSX } from 'react/jsx-runtime';
import typia, { json } from 'typia';

async function uploadDocument({
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

export function UploadDocumentButton(): JSX.Element {
  const [showUploadSuccessPopup, setShowUploadSuccessPopup] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const router = useRouter();
  const apiUrl = useApiUrl();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadDocumentMutation = useMutation({
    mutationFn: uploadDocument,
  });

  return (
    <div>
      <PopUp
        text1="The new document has been successfully uploaded."
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
            router.push(`${apiUrl}${create.path()}`);
          },
          text1: 'Open',
          backgroundColor: 'bg-rehua-green',
          iconProps: { name: 'circle-arrow', rotation: 180 },
        }}
        modalProps={{ open: showUploadSuccessPopup }}
      />

      <PopUp
        isAlertPopup
        text1={'Unable to upload the new document.\nPlease try again.'}
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

          uploadDocumentMutation.mutate(
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
                  const message = json.assertParse<{
                    message: string;
                  }>(error.message);

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
        iconProps={{ name: 'file-upload', width: 0.4 }}
        iconPosition="right"
        backgroundColor="bg-rehua-jordy"
        height={90}
        textIconGap={0.3}
        onClick={() => {
          fileInputRef.current?.click();
        }}
      />
    </div>
  );
}
