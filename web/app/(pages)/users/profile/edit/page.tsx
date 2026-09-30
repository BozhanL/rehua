'use client';
import PopUp from '@/app/components/common/PopUp';
import UserFormPage from '@/app/components/user/UserFormPage';
import useApiUrl from '@/app/hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import { findOne, update } from '@rehua/sdk/functional/user';
import {
  queryOptions,
  useMutation,
  useQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useState, type JSX } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useFindOne(id: string) {
  const host = useApiUrl();

  return queryOptions({
    queryKey: [findOne.path(id), host],
    queryFn: async ({ signal }: QueryFunctionContext) =>
      findOne(
        {
          host: host,
          simulate: isTesting,
          options: { signal, credentials: 'include' },
        },
        id,
      ),
  });
}

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

// React page to display the form for editing an existing user, using UserFormPage to render the page
export default function EditUserPage(): JSX.Element {
  const [showSaveErrorPopup, setShowSaveErrorPopup] = useState(false);

  const searchParams = useSearchParams();
  const userId = searchParams.get('id') ?? '';
  const options = useFindOne(userId);
  const doc = useQuery(options);
  const user = doc.data;

  const router = useRouter();
  const host = useApiUrl();
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
  });

  if (doc.error) {
    throw doc.error;
  } else if (!doc.isSuccess) {
    return <h1>Loading...</h1>;
  } else if (!user) {
    console.log(user);
    notFound();
  }

  // TODO: patch user api route

  return (
    <>
      {/* popup for unsuccessful save */}
      <PopUp
        isAlertPopup={true}
        text1={'Failed to save patient information.\nPlease try again.'}
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

      <UserFormPage
        title="Edit User Information"
        titleIcon="pencil-note"
        userInfo={user}
        onSave={(formData) => {
          const updatedValues: update.Body = {
            userName: formData.userName,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            homePhoneNumber: formData.homePhoneNumber,
            address: formData.address,
            group: formData.group,
            status: formData.status,
          };

          console.log(userId, user);
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
