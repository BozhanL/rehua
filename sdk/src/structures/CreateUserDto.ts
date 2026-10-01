export type CreateUserDto = {
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  totpSecret: string;
  totpCode: string;
  email: string;
  status:
    | 'disabled'
    | 'active'
    | 'longTerm'
    | 'palliative'
    | 'shortTerm'
    | 'daycare'
    | 'discharged'
    | 'deceased'
    | 'upload';
  homePhoneNumber: string;
  address: string;
  group: 'admin' | 'nurse';
};
