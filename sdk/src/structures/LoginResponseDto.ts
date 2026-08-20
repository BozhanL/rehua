export type LoginResponseDto = {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  group: 'admin' | 'nurse';
};
