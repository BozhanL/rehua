export type UpdateUserDto = {
  username?: undefined | string;
  firstName?: undefined | string;
  lastName?: undefined | string;
  email?: undefined | string;
  status?: undefined | 'active' | 'disabled';
  homePhoneNumber?: undefined | string;
  address?: undefined | string;
  group?: undefined | 'nurse' | 'admin';
};
