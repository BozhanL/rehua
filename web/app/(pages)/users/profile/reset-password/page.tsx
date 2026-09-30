'use client';
import PopUp from '@/app/components/common/PopUp';
import UserResetPasswordPage from '@/app/components/user/UserResetPasswordPage';
import useApiUrl from '@/app/hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import { update } from '@rehua/sdk/functional/user';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type JSX } from 'react';

async function updateUser({
  host,
  userId,
  updatedValues,
}: {
  host: string;
  userId: string;
  updatedValues: update.Body;
}): Promise<update.Output> {
  return update(
    { host, simulate: isTesting, options: { credentials: 'include' } },
    userId,
    updatedValues,
  );
}

// React page to display the form for resetting a user's password, using UserResetPasswordPage to render the page
export default function EditUserPage(): JSX.Element {
  const [showSaveErrorPopup, setShowSaveErrorPopup] = useState(false);

  const searchParams = useSearchParams();
  const userId = searchParams.get('id') ?? '';

  const router = useRouter();
  const host = useApiUrl();
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
  });

  return (
    <>
      {/* popup for unsuccessful save */}
      <PopUp
        isAlertPopup={true}
        text1={'Failed to save user information.\nPlease try again.'}
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

      <UserResetPasswordPage
        onSave={(newUserPassword) => {
          const updatedValues: update.Body = {
            password: newUserPassword,
          };
          // TODO: backend PATCH/PUT user here
          console.log(userId, newUserPassword);
          updateUserMutation.mutate(
            { host, userId, updatedValues },
            {
              onError: () => {
                setShowSaveErrorPopup(true);
              },
              onSuccess: () => {
                router.back();
              },
            },
          );
        }}
      />
    </>
  );
}
