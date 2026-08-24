export type CreateUserDto = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'disabled';
  homePhoneNumber: string;
  address: string;
  group: 'nurse' | 'admin';
};
