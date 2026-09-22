import { isTesting } from '@/app/utils/env';
import {
  login as loginSdk,
  logout as logoutSdk,
} from '@rehua/sdk/functional/auth';
import { create as createSdk } from '@rehua/sdk/functional/user';
import { generateSecret, generate, generateURI } from 'otplib';
import typia from 'typia';

export interface UserInfo {
  firstName: string;
  lastName: string;
  userName: string;
  group: 'admin' | 'nurse';
}

export async function login({
  host,
  formData,
}: {
  host: string;
  formData: FormData;
}): Promise<loginSdk.Output> {
  return loginSdk(
    { host, simulate: isTesting, options: { credentials: 'include' } },
    {
      userName: typia.assert<string>(formData.get('userName')),
      password: typia.assert<string>(formData.get('password')),
      totpCode: typia.assert<string>(formData.get('totpCode')),
    },
  );
}

export async function logout({ host }: { host: string }): Promise<void> {
  await logoutSdk({
    host,
    simulate: isTesting,
    options: { credentials: 'include' },
  });
}

// Switch to `useSessionStorage` from `usehooks-ts` if value doesn't update on data change.
export function sessionStorageAddUserInfo(data: loginSdk.Output): void {
  sessionStorage.setItem('firstName', data.firstName);
  sessionStorage.setItem('lastName', data.lastName);
  sessionStorage.setItem('userName', data.userName);
  sessionStorage.setItem('group', data.group);
}

export function sessionStorageGetUserInfo(): UserInfo {
  if (typeof sessionStorage === 'undefined') {
    return {
      firstName: '',
      lastName: '',
      userName: '',
      group: 'nurse',
    };
  }

  const firstName = sessionStorage.getItem('firstName') ?? '';
  const lastName = sessionStorage.getItem('lastName') ?? '';
  const userName = sessionStorage.getItem('userName') ?? '';
  const group = sessionStorage.getItem('group');

  return {
    firstName,
    lastName,
    userName,
    group: group === 'admin' ? group : 'nurse',
  };
}

export interface TotpData {
  token: string;
  uri: string;
}

/**
 * @param label user's email
 * @returns TOTP token and uri
 */
export async function getTotpData(label: string): Promise<TotpData> {
  const secret = generateSecret();
  const token = await generate({ secret, strategy: 'totp' });
  const uri = generateURI({
    issuer: 'Rehua',
    label,
    secret,
  });
  return { token, uri };
}

export async function signup({
  host,
  data,
}: {
  host: string;
  data: createSdk.Body;
}): Promise<createSdk.Output> {
  return createSdk({ host, simulate: isTesting }, data);
}
