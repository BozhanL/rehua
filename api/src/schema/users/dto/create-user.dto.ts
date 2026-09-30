export class CreateUserDto {
  constructor(
    public userName: string,
    public firstName: string,
    public lastName: string,
    public password: string,
    public totpSecret: string,
    // Required to ensure user has setup TOTP correctly
    public totpCode: string,
    public email: string,
    public status:
      | 'disabled'
      | 'active'
      | 'longTerm'
      | 'palliative'
      | 'shortTerm'
      | 'daycare'
      | 'discharged'
      | 'deceased'
      | 'upload',
    public homePhoneNumber: string,
    public address: string,
    public group: 'admin' | 'nurse',
  ) {}
}
