import ContentButton from '../common/ContentButton';
import useApiUrl from '@/app/hooks/useApiUrl';
import { queryClient } from '@/app/providers';
import { logout } from '@/app/utils/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';

export function LogoutButton(): JSX.Element {
  const router = useRouter();
  const host = useApiUrl();

  const logoutMutation = useMutation({
    mutationFn: logout,

    onSuccess: () => {
      sessionStorage.clear();
      queryClient.clear();
      router.push('/auth/login');
    },
  });

  return (
    <ContentButton
      text1="Logout"
      iconProps={{ name: 'access', flip: 'horizontal' }}
      backgroundColor="bg-rehua-red"
      iconPosition="left"
      verticalPadding={0.3}
      horizontalPadding={0.4}
      lineHeight={1.1}
      textIconGap={0.3}
      className="text-lg"
      onClick={() => {
        logoutMutation.mutate({ host });
      }}
    />
  );
}
