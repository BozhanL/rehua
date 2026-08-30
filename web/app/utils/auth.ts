import { isTesting } from '@/app/utils/env';
import { login as loginSdk } from '@rehua/sdk/functional/auth';
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

export function sessionStorageAddUserInfo(data: loginSdk.Output): void {
  sessionStorage.setItem('firstName', data.firstName);
  sessionStorage.setItem('lastName', data.lastName);
  sessionStorage.setItem('userName', data.userName);
  sessionStorage.setItem('group', data.group);
}

export function sessionStorageGetUserInfo(): UserInfo {
  const firstName = sessionStorage.getItem('firstName') ?? '';
  const lastName = sessionStorage.getItem('lastName') ?? '';
  const userName = sessionStorage.getItem('userName') ?? '';
  const group = sessionStorage.getItem('group');

  return {
    firstName,
    lastName,
    userName,
    group: group === 'admin' || group === 'nurse' ? group : 'nurse',
  };
}

export const userInfo = sessionStorageGetUserInfo();
