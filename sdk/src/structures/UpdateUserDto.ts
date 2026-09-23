export type UpdateUserDto = {
  userName?: undefined | string;
  firstName?: undefined | string;
  lastName?: undefined | string;
  password?: undefined | string;
  totpSecret?: undefined | string;
  totpCode?: undefined | string;
  email?: undefined | string;
  status?: undefined | 'active' | 'disabled';
  homePhoneNumber?: undefined | string;
  address?: undefined | string;
  group?: undefined | 'admin' | 'nurse';
};
