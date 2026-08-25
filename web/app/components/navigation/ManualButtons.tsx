import ContentButton from '../common/ContentButton';
import PopUp from '../common/PopUp';
import useApiUrl from '@/app/hooks/useApiUrl';
import { APIUrlContext } from '@/app/providers';
import { isTesting } from '@/app/utils/env';
import type { HttpError } from '@rehua/sdk';
import { create } from '@rehua/sdk/functional/manual';
import { hasManual } from '@rehua/sdk/functional/manual/exists';
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useContext, useRef, useState, type JSX } from 'react';
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

  const router = useRouter();
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useHasManualOptions() {
  const host = useContext(APIUrlContext);

  return queryOptions({
    queryKey: [hasManual.path(), host],
    queryFn: async () =>
      hasManual({
        host: host,
        simulate: isTesting,
        options: { credentials: 'include' },
      }),
    enabled: false,
  });
}

export function ShowManualButton(): JSX.Element {
  const [showNoManualFoundPopup, setShowNoManualFoundPopup] = useState(false);

  const router = useRouter();
  const apiUrl = useApiUrl();

  const options = useHasManualOptions();
  const hasManualQuery = useQuery(options);

  return (
    <div>
      <PopUp
        text1="No manual available."
        button1Props={{
          onClick: () => {
            setShowNoManualFoundPopup(false);
          },
          text1: 'OK',
          backgroundColor: 'bg-rehua-green',
          iconProps: { name: 'circle-arrow' },
        }}
        modalProps={{ open: showNoManualFoundPopup }}
      />

      <ContentButton
        text1="View"
        text2="Manual"
        iconProps={{ name: 'manual' }}
        backgroundColor="bg-rehua-blue"

        onClick={() =>
          void (async (): Promise<void> => {
            const result = await hasManualQuery.refetch();

            if (!result.data) {
              setShowNoManualFoundPopup(true);
              return;
            }

            router.push(`${apiUrl}${create.path()}`);
          })()
        }
      />
    </div>
  );
}
