export type LoginResponseDto = {
  username: string;
  group: 'admin' | 'nurse';
  firstName: string;
  lastName: string;
};
