'use client';

import ContentButton from '../components/ContentButton';
import Icon from '../components/Icon';
import Logo from '../components/Logo';
import SingleLineInput from '../components/SingleLineInput';
import React, { useState, type JSX } from 'react';
import { functional } from 'typia';

function Home(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

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
          //TODO:
          // Auth logic
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
    </div>
  );
}

export default functional.assertFunction(Home);
