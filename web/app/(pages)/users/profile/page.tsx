'use client';
import ContentButton from '@/app/components/common/ContentButton';
import Icon from '@/app/components/common/Icon';
import ListView from '@/app/components/common/ListView';
import Surface from '@/app/components/common/Surface';
import { UserListRows } from '@/app/components/user/UserProfileList';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';

// import { useSearchParams } from 'next/navigation';
// TODO: backend - variables to get userId from the URL query parameters, may be used by backend (?)
// const searchParams = useSearchParams();
// const userId = searchParams.get('id');

export default function UserProfilePage(): JSX.Element {
  const router = useRouter();

  return (
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        {/* page back button and title */}
        <div className="mx-5 mt-5 overflow-x-auto">
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
                  router.push(`/users/edit`); // TODO: backend update the URL if needed
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
                  router.push(`/users/reset-password`); // TODO: backend update the URL if needed
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
                  router.push(`/users/reset-mfa`); // TODO: backend update the URL if needed
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
