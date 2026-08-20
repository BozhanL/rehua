export type CreateUserDto = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  totpSecret: string;
  email: string;
  status: 'active' | 'disabled';
  homePhoneNumber: string;
  address: string;
  group: 'admin' | 'nurse';
};
