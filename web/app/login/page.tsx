'use client';

import ContentButton from '../components/common/ContentButton';
import Icon from '../components/common/Icon';
import Logo from '../components/common/Logo';
import SingleLineInput from '../components/common/SingleLineInput';
import MFAModal from '../components/mfa/MFAModal';
import useApiUrl from '../hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import { login as loginSdk } from '@rehua/sdk/functional/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState, type JSX } from 'react';
import { functional } from 'typia';

function Home(): JSX.Element {
  const host = useApiUrl();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isMFAOpen, setisMFAOpen] = useState(false);

  interface PendingCredentials {
    userName: string;
    password: string;
  }

  const [pendingCreds, setPendingCreds] = useState<PendingCredentials | null>(
    null,
  );
  const [mfaError, setMfaError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async ({
      creds,
      totpCode,
    }: {
      creds: PendingCredentials;
      totpCode: string;
    }) =>
      loginSdk(
        { host, simulate: isTesting, options: { credentials: 'include' } },
        { userName: creds.userName, password: creds.password, totpCode }, // error  with username because sdk not updated
      ),
    onError: () => {
      setMfaError('Login failed, try again');
    },
    onSuccess: () => {
      setisMFAOpen(false);
      setPendingCreds(null); // clear creds out of memory asap
      setPassword('');
      router.push('/landing'); // mock landing page for demo
      setMfaError(null);
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-7">
      <Logo />
      <span className="text-3xl font-medium">
        Welcome, please enter your credentials.
      </span>

      {/* form   */}
      <form
        className="flex w-full max-w-md flex-col gap-6 text-xl"
        onSubmit={(e) => {
          e.preventDefault();
          setPendingCreds({ userName: username, password: password }); // set pending credentials from state
          setisMFAOpen(true);
        }}
      >
        {/* username */}
        <div className="flex items-center">
          <div className="mr-4 flex w-8 justify-center">
            <Icon name="users" className="text-rehua-maroon" width={32} />
          </div>
          <div className="flex-1">
            <SingleLineInput
              required={true}
              placeholder="Username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          {/* invisble div so that the two singlelineinputs match up*/}
          <div className="ml-2 w-6" />{' '}
        </div>

        {/*  password */}
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

        {/* submit / next */}
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
        open={isMFAOpen}
        onBack={() => {
          setisMFAOpen(false);
          setPendingCreds(null);
          setMfaError(null);
          loginMutation.reset();
        }}
        onSubmitCode={(code) => {
          if (!pendingCreds) {
            return;
          }
          setMfaError(null);
          loginMutation.mutate({ creds: pendingCreds, totpCode: code });
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
