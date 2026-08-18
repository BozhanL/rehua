export class CreateUserDto {
  constructor(
    public username: string,
    public firstName: string,
    public lastName: string,
    public password: string,
    public totpSecret: string,
    public email: string,
    public status: 'active' | 'disabled',
    public homePhoneNumber: string,
    public address: string,
    public group: 'admin' | 'nurse',
  ) {}
}
