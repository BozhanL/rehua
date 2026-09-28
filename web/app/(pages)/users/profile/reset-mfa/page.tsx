'use client';
import PopUp from '@/app/components/common/PopUp';
import Surface from '@/app/components/common/Surface';
import MFASetUp, {
  isInvalidTotpCodeError,
} from '@/app/components/mfa/MFASetup';
import useApiUrl from '@/app/hooks/useApiUrl';
import { updateUser } from '@/app/utils/auth';
import { isTesting } from '@/app/utils/env';
import { findOne as findOneUser } from '@rehua/sdk/functional/user';
import {
  queryOptions,
  useMutation,
  useQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, type JSX } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useFindOneUserOptions(id: string) {
  const host = useApiUrl();

  return queryOptions({
    queryKey: [findOneUser.path(id), host],
    queryFn: async ({ signal }: QueryFunctionContext) =>
      findOneUser(
        {
          host: host,
          simulate: isTesting,
          options: { signal, credentials: 'include' },
        },
        id,
      ),
  });
}

// admin page to reset a user's MFA, the user is given by /users/profile/reset-mfa?id=<userId>

export default function ResetUserMFAPage(): JSX.Element {
  const router = useRouter();
  const host = useApiUrl();
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // null when there's no ?id=

  // without a user id there's nothing to reset, go back to the users dashboard
  useEffect(() => {
    if (!id) {
      router.replace('/users');
    }
  }, [id, router]);

  // only fetch the user once there is an id
  const user = useQuery({ ...useFindOneUserOptions(id ?? ''), enabled: !!id });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showSaveErrorPopup, setShowSaveErrorPopup] = useState(false);
  const updateMutation = useMutation({
    mutationFn: updateUser,

    onSuccess: () => {
      setShowSuccessPopup(true);
    },

    onError: (error) => {
      // a wrong code is shown by MFASetUp, anything else is shown here
      if (!isInvalidTotpCodeError(error)) {
        setShowSaveErrorPopup(true);
      }
    },
  });

  // if no id supplied in url query
  if (!id) {
    return <h1>Redirecting...</h1>;
  }

  // TODO: make sure the route is correct
  function goToProfile(): void {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    router.push(`/users/profile?id=${id}`);
  }

  if (user.isError) {
    throw user.error;
  } else if (!user.isSuccess) {
    return <h1>Loading...</h1>;
  } else if (!user.data) {
    return <h1>User not found.</h1>;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Surface width="100%" height="auto" style={{ flexGrow: 1 }}>
        <MFASetUp
          title="Reset User Multi-Factor Authentication"
          label={user.data.email}
          onBack={goToProfile}
          onSubmitCode={async (totpCode, totpSecret) =>
            updateMutation.mutateAsync({
              host,
              id,
              data: { totpSecret, totpCode },
            })
          }
        />

        {/* popup for unsuccessful save */}
        <PopUp
          isAlertPopup={true}
          text1={
            'Failed to reset the multi-factor\nauthentication. Please try again.'
          }
          button1Props={{
            text1: 'OK',
            iconProps: { name: 'circle-arrow' },
            backgroundColor: 'bg-rehua-green',
            onClick: () => {
              setShowSaveErrorPopup(false);
            },
          }}
          modalProps={{
            open: showSaveErrorPopup,
            surfaceProps: { style: { height: 550 } },
          }}
        />

        {/* popup for successful save */}
        <PopUp
          text1={
            'Set-up complete. Your multi-factor\nauthentication has been successfully activated.'
          }
          button1Props={{
            text1: 'OK',
            iconProps: { name: 'circle-arrow' },
            backgroundColor: 'bg-rehua-green',
            onClick: goToProfile,
          }}
          modalProps={{
            open: showSuccessPopup,
            surfaceProps: { style: { height: 550 } },
          }}
        />
      </Surface>
    </div>
  );
}
