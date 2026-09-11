export class LoginBody {
  constructor(
    public userName: string,
    public password: string,
    public totpCode: string,
  ) {}
}
