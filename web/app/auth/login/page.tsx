'use client';

import ContentButton from '../../components/common/ContentButton';
import Icon from '../../components/common/Icon';
import Logo from '../../components/common/Logo';
import SingleLineInput from '../../components/common/SingleLineInput';
import MFAModal from '../../components/mfa/MFAModal';
import useApiUrl from '../../hooks/useApiUrl';
import { login, sessionStorageAddUserInfo } from '@/app/utils/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState, type JSX } from 'react';
import { functional } from 'typia';

interface PendingCredentials {
  userName: string;
  password: string;
}

function Home(): JSX.Element {
  const host = useApiUrl();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isMFAOpen, setIsMFAOpen] = useState(false);
  const [pendingCredentials, setPendingCredentials] =
    useState<PendingCredentials | null>(null);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [mfaResetKey, setMfaResetKey] = useState(0);

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      sessionStorageAddUserInfo(data);
      setIsMFAOpen(false);
      setPendingCredentials(null);
      setPassword('');
      setMfaError(null);
      router.push('/patients');
    },

    onError: () => {
      setMfaError('Login failed, please try again.');
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-7">
      <Logo />

      <span className="text-3xl font-medium">
        Welcome, please enter your credentials.
      </span>

      <form
        className="flex w-full max-w-md flex-col gap-6 text-xl"
        onSubmit={(e) => {
          e.preventDefault();

          // set credentials before displaying MFA view
          setPendingCredentials({
            userName,
            password,
          });

          // Clear any previous MFA error
          setMfaError(null);

          // Reset the modal so it starts with an empty OTP
          setMfaResetKey((prev) => prev + 1);

          setIsMFAOpen(true);
        }}
      >
        {/* Username */}
        <div className="flex items-center">
          <div className="mr-4 flex w-8 justify-center">
            <Icon name="users" className="text-rehua-maroon" width={32} />
          </div>

          <div className="flex-1">
            <SingleLineInput
              required={true}
              placeholder="Username"
              inputMode="numeric"
              value={userName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUserName(e.target.value);
              }}
            />
          </div>

          {/* Invisible div so the two inputs line up */}
          <div className="ml-2 w-6" />
        </div>

        {/* Password */}
        <div className="flex items-center">
          <div className="mr-4 flex w-8 justify-center">
            <Icon name="lock" className="text-rehua-maroon" width={28} />
          </div>

          <div className="flex-1">
            <SingleLineInput
              type={showPassword ? 'text' : 'password'}
              required={true}
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setShowPassword((prev) => !prev);
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="ml-2 w-6"
          >
            <Icon name={showPassword ? 'eye' : 'crossed-eye'} width={24} />
          </button>
        </div>

        {/* Submit / Next */}
        <div className="mt-4 flex justify-center">
          <ContentButton
            text1="Next"
            backgroundColor="bg-rehua-green"
            horizontalPadding={1}
            type="submit"
          />
        </div>
      </form>

      <MFAModal
        key={mfaResetKey}
        open={isMFAOpen}
        onBack={() => {
          setIsMFAOpen(false);
          setPendingCredentials(null);
          setMfaError(null);
          loginMutation.reset();
        }}
        onSubmitCode={(code) => {
          if (!pendingCredentials) {
            return;
          }

          setMfaError(null);

          const formData = new FormData();
          formData.append('userName', pendingCredentials.userName);
          formData.append('password', pendingCredentials.password);
          formData.append('totpCode', code);

          loginMutation.mutate({
            host,
            formData,
          });
        }}
        isSubmitting={loginMutation.isPending}
        mfaError={mfaError}
        onDismissError={() => {
          setMfaError(null);
        }}
      />
    </div>
  );
}

export default functional.assertFunction(Home);
