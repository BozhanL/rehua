import ContentButton from '../common/ContentButton';
import PopUp from '../common/PopUp';
import useApiUrl from '@/app/hooks/useApiUrl';
import { queryClient } from '@/app/providers';
import { logout } from '@/app/utils/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, type JSX } from 'react';

export function LogoutButton(): JSX.Element {
  const router = useRouter();
  const host = useApiUrl();

  const [showLogoutWarningPopup, setShowLogoutWarningPopup] = useState(false);
  const [showLogoutErrorPopup, setShowLogoutErrorPopup] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: logout,

    onSuccess: () => {
      sessionStorage.clear();
      queryClient.clear();
      router.push('/auth/login');
    },
    onError: () => {
      setShowLogoutErrorPopup(true);
    },
  });

  return (
    <div>
      <PopUp
        text1="Unexpected Error Logging Out"
        text2="Please try again."
        button1Props={{
          onClick: () => {
            setShowLogoutErrorPopup(false);
          },
          text1: 'OK',
          backgroundColor: 'bg-rehua-green',
          iconProps: { name: 'circle-arrow' },
        }}
        modalProps={{ open: showLogoutErrorPopup }}
      />

      <PopUp
        isAlertPopup={true}
        text1="Are you sure you want to logout?"
        button1Props={{
          onClick: () => {
            setShowLogoutWarningPopup(false);
          },
          text1: 'Stay',
          backgroundColor: 'bg-rehua-green',
          iconProps: { name: 'circle-arrow' },
        }}

        button2Props={{
          onClick: () => {
            setShowLogoutWarningPopup(false);
            logoutMutation.mutate({ host });
          },
          text1: 'Logout',
          backgroundColor: 'bg-rehua-red',
          iconProps: { name: 'lock', width: 0.5 },
        }}
        modalProps={{ open: showLogoutWarningPopup }}
      />

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
          setShowLogoutWarningPopup(true);
        }}
      />
    </div>
  );
}
