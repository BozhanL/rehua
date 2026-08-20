export type UpdateUserDto = {
  username?: undefined | string;
  firstName?: undefined | string;
  lastName?: undefined | string;
  password?: undefined | string;
  totpSecret?: undefined | string;
  email?: undefined | string;
  status?: undefined | 'active' | 'disabled';
  homePhoneNumber?: undefined | string;
  address?: undefined | string;
  group?: undefined | 'admin' | 'nurse';
};
