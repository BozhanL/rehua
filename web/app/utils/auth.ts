import { isTesting } from '@/app/utils/env';
import { login as loginSdk } from '@rehua/sdk/functional/auth';
import typia from 'typia';

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
  const userInfo = {
    firsName: data.firstName,
    lastName: data.lastName,
    userName: data.userName,
    group: data.group,
  };

  sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
}
