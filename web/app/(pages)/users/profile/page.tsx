'use client';
import ContentButton from '@/app/components/common/ContentButton';
import Icon from '@/app/components/common/Icon';
import ListView, { type ListRow } from '@/app/components/common/ListView';
import Surface from '@/app/components/common/Surface';
import { getUserListRows } from '@/app/components/user/UserProfileList';
import useApiUrl from '@/app/hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import { findOne } from '@rehua/sdk/functional/user';
import {
  queryOptions,
  useQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import type { JSX } from 'react';

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

export default function UserProfilePage(): JSX.Element {
  const router = useRouter();

  const searchParams = useSearchParams();
  const userId = searchParams.get('id') ?? '';
  const options = useFindOne(userId);
  const doc = useQuery(options);
  const user = doc.data;

  if (doc.isError) {
    throw doc.error;
  } else if (!doc.isSuccess) {
    return <h1>Loading...</h1>;
  } else if (!user) {
    console.log(user);
    notFound();
  }

  const UserListRows: ListRow[] = getUserListRows(user);

  return (
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        {/* page back button and title */}
        <div className="mx-6 mt-6 overflow-x-auto">
          <div className="flex min-w-max items-center gap-6 bg-rehua-white">
            <button
              type="button"
              onClick={() => {
                router.push('/users');
              }}
              style={{ cursor: 'pointer' }}
            >
              <Icon
                name="circle-arrow"
                width={50}
                className="text-rehua-navy"
              />
            </button>
            <div className="flex gap-3">
              <Icon name="user" width={35} />
              <span className="text-3xl font-bold">User Profile</span>
            </div>

            {/* buttons */}
            <div className="flex gap-7">
              <ContentButton
                text1="Edit Info"
                iconProps={{ name: 'pencil', width: 0.8 }}
                iconPosition="right"
                horizontalPadding={0.5}
                textIconGap={0.3}
                backgroundColor="bg-rehua-tangerine"
                className="text-xl"
                onClick={() => {
                  router.push(`/users/profile/edit?id=${userId}`);
                }}
              />

              <ContentButton
                text1="Reset"
                text2="Password"
                textAlign="left"
                lineHeight={1.2}
                iconProps={{ name: 'lock' }}
                iconPosition="right"
                textIconGap={0.3}
                verticalPadding={0.2}
                horizontalPadding={0.4}
                backgroundColor="bg-rehua-jordy"
                onClick={() => {
                  router.push(`/users/profile/reset-password?id=${userId}`);
                }}
              />

              <ContentButton
                text1="Reset"
                text2="MFA"
                textAlign="left"
                lineHeight={1.2}
                iconProps={{ name: 'lock-time', width: 0.85 }}
                iconPosition="right"
                textIconGap={0.3}
                verticalPadding={0.2}
                horizontalPadding={0.5}
                backgroundColor="bg-rehua-navy"
                onClick={() => {
                  router.push(`/users/profile/reset-mfa?id=${userId}`);
                }}
              />
            </div>
          </div>
        </div>

        {/* user information list */}
        <div className="pt-4">
          <ListView rows={UserListRows} insidePadding="px-8" />
        </div>
      </Surface>
    </div>
  );
}
