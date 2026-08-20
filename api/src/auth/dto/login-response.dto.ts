export interface LoginResponseDto {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  group: 'admin' | 'nurse';
}
